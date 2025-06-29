import { CreateUserDTO } from "../dtos/create-user.dto";
import { LoginDTO } from "../dtos/user-login.dto";
import { UserResponseDTO } from "../dtos/user-response.dto";

export interface IUserService {
    /**
     * Registra um novo usuário no sistema.
     * @param userData - Dados do usuário a serem cadastrados.
     */
    
    registerUser(userData: CreateUserDTO): Promise<UserResponseDTO>;

    /**
     * Autentica um usuário e retorna um token de acesso.
     * @param email - Email do usuário.
     * @param password - Senha do usuário.
     * @returns Retorna um token JWT ou uma string representando a autenticação bem-sucedida.
     */
    login(userData: LoginDTO): Promise<string>;

    /**
     * Atualiza o perfil do usuário.
     * @param userId - ID do usuário.
     * @param userData - Dados atualizados do perfil.
     */
    updateProfile(userId: string, userData: Partial<CreateUserDTO>): Promise<void>;

    /**
     * Exclui um usuário do sistema.
     * @param userId - ID do usuário a ser removido.
     */
    deleteUser(userId: string): Promise<boolean>;
}
