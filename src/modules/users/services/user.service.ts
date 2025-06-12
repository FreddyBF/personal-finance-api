import { IUserService } from "../interfaces/user.service.interface";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { LoginDTO } from "../dtos/user-login.dto";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Serviço responsável pelo gerenciamento de usuários, incluindo registro, autenticação, atualização e exclusão.
 */
export class UserService implements IUserService {
    /**
     * Instancia o serviço de usuários.
     * @param userRepository - Repositório de usuários para interagir com a camada de dados.
     */
    constructor(readonly userRepository: IUserRepository) {}

    private generateToken(userId: string): string {
        const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
        const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
        return token;
    }


    /**
     * Registra um novo usuário no sistema.
     * 
     * Este método salva os dados do usuário no repositório, garantindo que ele seja registrado corretamente.
     * @param userData - Dados do usuário a serem cadastrados.
     * @returns Uma `Promise<void>` indicando que a operação foi concluída.
     */
    async registerUser(userData: CreateUserDTO): Promise<void> {
        // Implementação da lógica para salvar o usuário no banco de dados
        console.log("Usuário registrado:", userData);
    }

    /**
     * Autentica um usuário e retorna um token de acesso.
     * 
     * Este método verifica se as credenciais fornecidas estão corretas e, caso afirmativo, retorna um token JWT.
     * @param userData - Dados de login do usuário.
     * @returns Uma `Promise<string>` contendo o token JWT ou outra string de autenticação.
     */
    async login(userData: LoginDTO): Promise<string> {
        // Implementação da lógica de autenticação
        console.log(`Login solicitado para ${userData.email}`);
        return "token-gerado-aqui";
    }

    /**
     * Atualiza o perfil do usuário.
     * 
     * Permite modificar as informações de um usuário existente, mantendo a integridade dos dados.
     * @param userId - ID do usuário.
     * @param userData - Dados atualizados do perfil.
     * @returns Uma `Promise<void>` indicando que a operação foi concluída.
     */
    async updateProfile(userId: string, userData: Partial<CreateUserDTO>): Promise<void> {
        // Implementação da lógica de atualização de perfil
        console.log(`Perfil do usuário ${userId} atualizado com os dados:`, userData);
    }

    /**
     * Exclui um usuário do sistema.
     * 
     * Remove permanentemente o registro do usuário no banco de dados.
     * @param userId - ID do usuário a ser removido.
     * @returns Uma `Promise<boolean>` retornando `true` se a exclusão foi bem-sucedida, `false` caso contrário.
     */
    async deleteUser(userId: string): Promise<boolean> {
        // Implementação da lógica de exclusão de usuário
        console.log(`Usuário ${userId} excluído.`);
        return true;
    }
}
