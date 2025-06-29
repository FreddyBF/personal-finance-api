
import { IUserRepository } from "../interfaces/user.repository.interface";
import { IUserBase, IUserModel } from "../interfaces/user.model.interface";
import { UserModel } from "../models/user.model";
import { DatabaseException } from "../../../shared/exceptions/database.exception"; // Exceção para erros gerais de DB
import { UnknownError } from "../../transactions/services/exceptions/unknown-error";

export class UserRepository implements IUserRepository {

    /**
     * Encontra um usuário pelo seu ID.
     * @param id O ID do usuário a ser encontrado.
     * @returns Uma Promise que resolve para o documento do usuário ou null se não for encontrado.
     * @throws UserNotFoundException se o ID não for um ObjectId válido do MongoDB.
     * @throws DatabaseException se ocorrer um erro geral no banco de dados.
     */
    async findById(id: string): Promise<IUserModel | null> {
        try {
            // Retorna o documento do Mongoose. O .exec() garante uma Promise nativa.
            return await UserModel.findById(id).exec();
        } catch (error: any) {
            throw new DatabaseException(`Falha ao buscar usuário pelo ID ${id}.`, error);
        }
    }

    /**
     * Cria um novo usuário no banco de dados.
     * NÃO realiza validações de regra de negócio (e.g., "email já existe" - isso é responsabilidade do Serviço).
     * No entanto, erros de validação do SCHEMA do Mongoose (e.g., campo requerido, `unique`)
     * ou erros de banco de dados serão tratados.
     * @param userData Os dados básicos do usuário a serem criados.
     * @returns Uma Promise que resolve para o documento do usuário recém-criado.
     * @throws ValidationException se houver um erro de validação do SCHEMA do Mongoose (e.g., email duplicado).
     * @throws DatabaseException se ocorrer um erro geral de persistência.
     */
    async create(userData: IUserBase): Promise<IUserModel> {
        try {
            const newUser = new UserModel(userData);
            // O .save() irá acionar as validações do Mongoose Schema (required, unique, etc.)
            return await newUser.save();
        } catch (error: any) {
            console.error("Erro ao criar usuário no banco de dados:", error);
            throw new DatabaseException("Falha ao persistir o novo usuário.", error);
        }
    }

    /**
     * Atualiza um usuário existente pelo seu ID.
     * NÃO realiza validações de regra de negócio. As validações do SCHEMA do Mongoose
     * (e.g., runValidators: true) ainda se aplicam.
     * @param id O ID do usuário a ser atualizado.
     * @param user Os dados parciais do usuário a serem atualizados.
     * @returns Uma Promise que resolve para o documento do usuário atualizado ou null se não for encontrado.
     * @throws UserNotFoundException se o ID não for um ObjectId válido do MongoDB.
     * @throws ValidationException se houver um erro de validação do SCHEMA do Mongoose (e.g., email duplicado).
     * @throws DatabaseException se ocorrer um erro geral de persistência.
     */
    async update(id: string, user: Partial<IUserBase>): Promise<IUserModel | null> {
        try {
            // { new: true } retorna o documento atualizado.
            // { runValidators: true } garante que as validações do Mongoose Schema sejam executadas na atualização.
            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                user, { new: true, runValidators: true }
            ).exec();
            return updatedUser;
        } catch (error: unknown) {
            if(error instanceof Error) {
                console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
                throw new DatabaseException(`Falha ao atualizar usuário com ID ${id}.`, error);
            }

            throw new UnknownError();
        }
    }

    /**
     * Deleta um usuário pelo seu ID.
     * @param id O ID do usuário a ser deletado.
     * @returns Uma Promise que resolve para true se o usuário foi deletado, false caso contrário.
     * @throws DatabaseException se ocorrer um erro geral de persistência.
     */
    async delete(id: string): Promise<boolean> {
        try {
            const result = await UserModel.findByIdAndDelete(id).exec();
            return result !== null; // Retorna true se um documento foi encontrado e deletado
        } catch (error: any) {
            console.error(`Erro ao deletar usuário com ID ${id}:`, error);
            throw new DatabaseException(`Falha ao deletar usuário com ID ${id}.`, error);
        }
    }

    /**
     * Encontra um usuário pelo seu endereço de e-mail.
     * @param email O endereço de e-mail do usuário a ser encontrado.
     * @returns Uma Promise que resolve para o documento do usuário ou null se não for encontrado.
     * @throws DatabaseException se ocorrer um erro geral de persistência.
     */
    async findByEmail(email: string): Promise<IUserModel | null> {
        try {
            return await UserModel.findOne({ email }).exec();
        } catch (error: any) {
            console.error(`Erro ao buscar usuário pelo email ${email}:`, error);
            throw new DatabaseException(`Falha ao buscar usuário pelo email ${email}.`, error);
        }
    }
}