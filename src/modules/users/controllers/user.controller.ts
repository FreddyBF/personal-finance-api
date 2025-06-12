import { NextFunction, Request, Response } from "express";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { LoginDTO } from "../dtos/user-login.dto";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export class UserController {
    // O serviço de usuário é injetado no construtor para seguir boas práticas de modularidade
    constructor(private readonly userService: IUserService = userService) {}

    /**
     * Método responsável por registrar um novo usuário.
     * - Recebe os dados do corpo da requisição (`req.body`).
     * - Valida os dados utilizando `Zod` (`UserResponseSchema`).
     * - Se houver erro de validação, responde com `400 Bad Request`.
     * - Caso os dados sejam válidos, chama o serviço `userService.registerUser()`.
     * - Retorna `201 Created` com os detalhes do usuário registrado.
     * - Em caso de erro interno, responde com `500 Internal Server Error`.
     */
    async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData: CreateUserDTO = req.body;
            await userService.registerUser(userData);
        } catch (error) {
            next(error)
        }
    }

    async userLogin(req:Request, res: Response, next: NextFunction):Promise<string> {
        const userData:LoginDTO = req.body;
        return await userService.login(userData);
    }
}

