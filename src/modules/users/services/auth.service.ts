import { IUserRepository } from "../interfaces/user.repository.interface";
import { LoginDTO } from "../dtos/user-login.dto";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials.exception";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken"; // Importar erros específicos do JWT
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config(); // Garante que as variáveis de ambiente sejam carregadas

/**
 * Serviço responsável por lidar com autenticação de usuários,
 * como login, verificação e renovação de tokens JWT.
 *
 * Segue os princípios de Single Responsibility (SRP) e Dependency Inversion (DIP).
 */
export class AuthService {
    private readonly ACCESS_TOKEN_SECRET: string;
    private readonly REFRESH_TOKEN_SECRET: string;
    private readonly ACCESS_TOKEN_EXPIRATION: string;
    private readonly REFRESH_TOKEN_EXPIRATION: string;
    private readonly BCRYPT_SALT_ROUNDS: number; // Para hashing de senhas, se a classe fosse responsável por isso

    constructor(private readonly repository: IUserRepository) {
        // Inicialização das variáveis de ambiente de forma segura
        this.ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "superSecretAccessTokenKeyForDevelopmentOnlyPleaseChangeMe!";
        this.REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "anotherSuperSecretRefreshTokenKeyForDevelopmentOnlyChangeMeToo!";
        this.ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || "15m"; // Default para 15 minutos
        this.REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "7d"; // Default para 7 dias
        this.BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10); // Default para 10 rounds
    }

    // A função generateToken original foi removida, pois a lógica de geração de token
    // já está encapsulada nos métodos `login` e `refreshAccessToken`,
    // usando as chaves e expirações corretas. Manter uma função `generateToken` genérica
    // com uma chave "defaultSecretKey" poderia levar a erros de segurança.

    /**
     * Autentica um usuário e retorna tokens de acesso e refresh.
     *
     * Verifica o email e a senha informados, e caso estejam corretos,
     * gera e retorna um par de tokens JWT. Lança exceções específicas para
     * cenários de falha.
     *
     * @param {LoginDTO} { email, password } - DTO contendo e-mail e senha do usuário.
     * @returns {Promise<{ accessToken: string; refreshToken: string }>} Um par de tokens (accessToken e refreshToken).
     * @throws {InvalidCredentialsException} Se o usuário não for encontrado ou a senha estiver incorreta.
     * @throws {Error} Para outros erros inesperados durante o processo.
     */
    public async login({ email, password }: LoginDTO): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const user = await this.repository.findByEmail(email);

            // Se o usuário não existir ou a senha estiver incorreta, lança uma exceção específica.
            // É importante lançar a mesma exceção para ambos os casos para evitar "enumeração de usuários".
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new InvalidCredentialsException("Credenciais inválidas fornecidas.");
            }

            // Geração do token de acesso com expiração curta.
            const accessToken = jwt.sign({ id: user.id }, this.ACCESS_TOKEN_SECRET, {
                expiresIn: this.ACCESS_TOKEN_EXPIRATION,
            });

            // Geração do refresh token com expiração mais longa.
            const refreshToken = jwt.sign({ id: user.id }, this.REFRESH_TOKEN_SECRET, {
                expiresIn: this.REFRESH_TOKEN_EXPIRATION,
            });

            return { accessToken, refreshToken };
        } catch (error) {
            // Re-lança exceções específicas para tratamento de erro no nível superior.
            // Isso evita que o "catch (error) { throw error; }" sem lógica adicione complexidade.
            if (error instanceof InvalidCredentialsException) {
                throw error;
            }
            // Para outros erros inesperados (e.g., problema com o banco de dados), lançamos um erro genérico
            // ou um erro mais específico, dependendo da necessidade de depuração.
            console.error("Erro inesperado durante o login:", error);
            throw new Error("Não foi possível autenticar o usuário devido a um erro interno.");
        }
    }

    /**
     * Verifica e decodifica um token de acesso.
     *
     * Utiliza a chave JWT do tipo "access" para validar o token recebido.
     * Retorna o payload decodificado se o token for válido.
     *
     * @param {string} token - Token de acesso JWT.
     * @returns {object} O payload decodificado do token (tipicamente `{ id: string }`).
     * @throws {TokenExpiredError} Se o token estiver expirado.
     * @throws {JsonWebTokenError} Para outros erros de validação do token (ex: token malformado).
     */
    public verifyAccessToken(token: string): object {
        try {
            // O tipo de retorno de jwt.verify pode variar, usamos 'object' para ser genérico.
            // Em uma aplicação real, poderíamos definir uma interface para o payload do JWT.
            return jwt.verify(token, this.ACCESS_TOKEN_SECRET) as object;
        } catch (error) {
            // Captura erros específicos do JWT para tratamento mais granular.
            if (error instanceof TokenExpiredError) {
                throw new TokenExpiredError("Token de acesso expirado.", new Date(error.expiredAt));
            } else if (error instanceof JsonWebTokenError) {
                throw new JsonWebTokenError("Token de acesso inválido.");
            }
            console.error("Erro inesperado ao verificar o token de acesso:", error);
            throw new Error("Erro interno ao verificar o token.");
        }
    }

    /**
     * Gera um novo token de acesso com base em um refresh token válido.
     *
     * Verifica o refresh token e, se estiver válido, emite um novo access token.
     *
     * @param {string} refreshToken - Token de atualização JWT.
     * @returns {string} Um novo token de acesso válido.
     * @throws {TokenExpiredError} Se o refresh token estiver expirado.
     * @throws {JsonWebTokenError} Para outros erros de validação do refresh token.
     */
    public refreshAccessToken(refreshToken: string): string {
        try {
            // O 'as any' é usado aqui para simplificar, mas idealmente você definiria uma interface para o payload.
            const payload = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET) as { id: string };

            // Garante que o payload contém o 'id' necessário.
            if (!payload || !payload.id) {
                throw new JsonWebTokenError("Payload do refresh token inválido.");
            }

            // Gera um novo token de acesso com o ID do usuário do refresh token.
            return jwt.sign({ id: payload.id }, this.ACCESS_TOKEN_SECRET, {
                expiresIn: this.ACCESS_TOKEN_EXPIRATION,
            });
        } catch (error) {
            // Captura erros específicos do JWT para tratamento mais granular.
            if (error instanceof TokenExpiredError) {
                throw new TokenExpiredError("Refresh token expirado. Por favor, faça login novamente.", new Date(error.expiredAt));
            } else if (error instanceof JsonWebTokenError) {
                throw new JsonWebTokenError("Refresh token inválido ou malformado.");
            }
            console.error("Erro inesperado ao gerar novo token de acesso:", error);
            throw new Error("Erro interno ao renovar o token.");
        }
    }

    // Métodos utilitários para hashing e comparação de senhas, se a responsabilidade de hashing fosse da AuthService
    // Note: Geralmente, hashing de senha é feito no serviço de usuário ou diretamente no repositório/modelo.
    // Incluí-los aqui como exemplo, caso a arquitetura exija.

    /**
     * Gera um hash para uma senha fornecida.
     * @param {string} password - A senha em texto plano.
     * @returns {Promise<string>} O hash da senha.
     */
    public async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.BCRYPT_SALT_ROUNDS);
    }

    /**
     * Compara uma senha em texto plano com um hash.
     * @param {string} password - A senha em texto plano.
     * @param {string} hash - O hash da senha.
     * @returns {Promise<boolean>} True se a senha corresponder ao hash, false caso contrário.
     */
    public async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}