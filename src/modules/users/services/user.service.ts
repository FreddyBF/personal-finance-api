import { IUserService } from "../interfaces/user.service.interface";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { IUserRepository } from "../interfaces/user.repository.interface";
// LoginDTO e dotenv não são usados diretamente nesta classe após refatoração, podem ser removidos
// import { LoginDTO } from "../dtos/user-login.dto";
// import dotenv from 'dotenv';
import { IUserBase } from "../interfaces/user.model.interface";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists.exception"; // Caminho corrigido
import { UserResponseDTO } from "../dtos/user-response.dto";
import bcrypt from 'bcrypt';
import { NotFoundException } from "../exceptions/not-found.exception"; // Nova exceção para usuário não encontrado
import { ConflictException } from "../exceptions/conflict.exception"; // Exceção mais genérica para conflitos
import { InternalServerErrorException } from "../exceptions/internal-server-error.exception"; // Exceção para erros internos

// dotenv.config(); // Geralmente configurado uma vez na entrada da aplicação (ex: server.ts)

/**
 * Serviço responsável pelo gerenciamento de usuários, incluindo registro,
 * atualização, exclusão e outras operações relacionadas a dados do usuário.
 *
 * Segue os princípios de Single Responsibility (SRP) e Dependency Inversion (DIP).
 */
export class UserService implements IUserService {
    // Definindo o número de rounds para o bcrypt como uma propriedade da classe
    // para que possa ser configurado via variáveis de ambiente.
    private readonly BCRYPT_SALT_ROUNDS: number;

    /**
     * Construtor da classe UserService.
     * Injeta o repositório de usuários para interagir com a camada de dados.
     * Carrega as configurações de segurança do ambiente.
     *
     * @param repository - Implementação do IUserRepository.
     */
    constructor(private readonly repository: IUserRepository) {
        // Garantir que a variável de ambiente seja um número válido, com um fallback robusto.
        this.BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
        if (isNaN(this.BCRYPT_SALT_ROUNDS) || this.BCRYPT_SALT_ROUNDS < 10) {
            console.warn("BCRYPT_SALT_ROUNDS inválido ou muito baixo. Usando valor padrão de 10.");
            this.BCRYPT_SALT_ROUNDS = 10;
        }
    }

    /**
     * Gera um hash para uma senha fornecida.
     * Encapsula a lógica de hashing de senhas.
     *
     * @param {string} password - A senha em texto plano.
     * @returns {Promise<string>} O hash da senha.
     */
    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.BCRYPT_SALT_ROUNDS);
    }

    /**
     * Registra um novo usuário no sistema.
     *
     * Este método verifica a existência de um usuário com o mesmo e-mail,
     * gera o hash da senha e salva os dados do usuário no repositório.
     *
     * @param {CreateUserDTO} userData - Dados do usuário a serem cadastrados (nome, email, senha).
     * @returns {Promise<UserResponseDTO>} Um DTO contendo o nome e email do novo usuário.
     * @throws {ConflictException} Se um usuário com o mesmo e-mail já existir.
     * @throws {InternalServerErrorException} Para outros erros inesperados durante o registro.
     */
    public async registerUser(userData: CreateUserDTO): Promise<UserResponseDTO> {
        try {
            // Verifica se o usuário já existe pelo email para evitar duplicidade.
            const existingUser = await this.repository.findByEmail(userData.email);
            if (existingUser) {
                // Lança uma exceção específica para conflitos de recursos.
                throw new ConflictException("Este e-mail já está em uso.");
            }

            // Gera o hash da senha antes de armazenar.
            const hashedPassword = await this.hashPassword(userData.password);

            // Cria um objeto IUserBase para o repositório, garantindo que a senha seja hashed.
            const userToCreate: IUserBase = {
                name: userData.name,
                email: userData.email,
                password: hashedPassword, // Armazenar a senha hashed
            };

            // Salva o novo usuário no repositório.
            const newUser = await this.repository.create(userToCreate);

            // Retorna um DTO de resposta com os dados públicos do usuário.
            return {
                name: newUser.name,
                email: newUser.email,
            };
        } catch (error) {
            // Re-lança exceções de negócio para tratamento na camada superior.
            if (error instanceof ConflictException) {
                throw error;
            }
            // Para erros inesperados (ex: problema no banco de dados), lança um erro interno.
            console.error(`Erro ao registrar usuário (${userData.email}):`, error);
            throw new InternalServerErrorException("Não foi possível registrar o usuário devido a um erro interno.");
        }
    }

    /**
     * Atualiza o perfil de um usuário existente.
     *
     * Permite a atualização de dados como nome e, opcionalmente, senha.
     * A senha será hashed se fornecida.
     *
     * @param {string} userId - O ID do usuário a ser atualizado.
     * @param {Partial<CreateUserDTO>} userData - Dados a serem atualizados (pode ser um subconjunto de CreateUserDTO).
     * @returns {Promise<UserResponseDTO>} Um DTO com os dados atualizados do usuário.
     * @throws {NotFoundException} Se o usuário não for encontrado.
     * @throws {ConflictException} Se o e-mail fornecido já estiver em uso por outro usuário.
     * @throws {InternalServerErrorException} Para outros erros inesperados.
     */
    public async updateProfile(userId: string, userData: Partial<CreateUserDTO>): Promise<UserResponseDTO> {
        try {
            // Primeiro, verifique se o usuário existe
            const userToUpdate = await this.repository.findById(userId);
            if (!userToUpdate) {
                throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
            }

            // Se um novo e-mail for fornecido, verifique se já está em uso por outro usuário
            if (userData.email && userData.email !== userToUpdate.email) {
                const existingUserWithNewEmail = await this.repository.findByEmail(userData.email);
                if (existingUserWithNewEmail && existingUserWithNewEmail.id !== userId) {
                    throw new ConflictException("Este e-mail já está em uso por outro usuário.");
                }
            }

            // Prepara os dados para atualização, fazendo hash da senha se ela for fornecida
            const updatedFields: Partial<IUserBase> = { ...userData };
            if (userData.password) {
                updatedFields.password = await this.hashPassword(userData.password);
            }

            // Atualiza o usuário no repositório e obtém o usuário atualizado
            const updatedUser = await this.repository.update(userId, updatedFields);

            // Garante que o usuário foi realmente atualizado e retornado
            if (!updatedUser) {
                // Isso pode acontecer se o update no repo não retornar o objeto atualizado
                // ou se o usuário foi deletado entre a busca e a atualização (corrida)
                throw new InternalServerErrorException("Não foi possível obter os dados do usuário atualizado.");
            }

            // Retorna um DTO de resposta com os dados públicos do usuário atualizado
            return {
                name: updatedUser.name,
                email: updatedUser.email,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            console.error(`Erro ao atualizar perfil do usuário ${userId}:`, error);
            throw new InternalServerErrorException("Não foi possível atualizar o perfil devido a um erro interno.");
        }
    }

    /**
     * Exclui um usuário do sistema.
     *
     * @param {string} userId - O ID do usuário a ser excluído.
     * @returns {Promise<boolean>} Retorna `true` se o usuário foi excluído com sucesso, `false` caso contrário.
     * @throws {NotFoundException} Se o usuário não for encontrado.
     * @throws {InternalServerErrorException} Para outros erros inesperados.
     */
    public async deleteUser(userId: string): Promise<boolean> {
        try {
            // Opcional: Você pode querer verificar se o usuário existe antes de tentar deletar,
            // para retornar uma NotFoundException mais específica.
            const userToDelete = await this.repository.findById(userId);
            if (!userToDelete) {
                throw new NotFoundException(`Usuário com ID ${userId} não encontrado para exclusão.`);
            }

            const wasDeleted = await this.repository.delete(userId);

            if (!wasDeleted) {
                // Se o repositório retornar false, significa que não conseguiu deletar (ex: usuário não encontrado)
                // Embora já tenhamos a verificação acima, é um fallback.
                throw new NotFoundException(`Não foi possível excluir o usuário ${userId}.`);
            }
            return wasDeleted;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error(`Erro ao excluir usuário ${userId}:`, error);
            throw new InternalServerErrorException("Não foi possível excluir o usuário devido a um erro interno.");
        }
    }

    /**
     * Busca um usuário pelo seu ID e retorna um DTO de resposta.
     * Este método pode ser útil para exibir dados públicos do usuário.
     *
     * @param {string} userId - O ID do usuário.
     * @returns {Promise<UserResponseDTO>} O DTO de resposta do usuário.
     * @throws {NotFoundException} Se o usuário não for encontrado.
     * @throws {InternalServerErrorException} Para outros erros inesperados.
     */
    public async getUserById(userId: string): Promise<UserResponseDTO> {
        try {
            const user = await this.repository.findById(userId);
            if (!user) {
                throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
            }
            return {
                name: user.name,
                email: user.email,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error(`Erro ao buscar usuário por ID ${userId}:`, error);
            throw new InternalServerErrorException("Não foi possível buscar o usuário devido a um erro interno.");
        }
    }

    /**
     * Busca um usuário pelo seu email e retorna um DTO de resposta.
     * Útil para operações que requerem a validação de um e-mail.
     *
     * @param {string} email - O email do usuário.
     * @returns {Promise<UserResponseDTO>} O DTO de resposta do usuário.
     * @throws {NotFoundException} Se o usuário não for encontrado.
     * @throws {InternalServerErrorException} Para outros erros inesperados.
     */
    public async getUserByEmail(email: string): Promise<UserResponseDTO> {
        try {
            const user = await this.repository.findByEmail(email);
            if (!user) {
                throw new NotFoundException(`Usuário com email ${email} não encontrado.`);
            }
            return {
                name: user.name,
                email: user.email,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error(`Erro ao buscar usuário por email ${email}:`, error);
            throw new InternalServerErrorException("Não foi possível buscar o usuário devido a um erro interno.");
        }
    }
}
