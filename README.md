🧠 Como funciona a aplicação de Finanças Pessoais
Imagine que ela é como um assistente financeiro digital. A lógica central se baseia em registrar, organizar, analisar e prever as finanças do usuário.

1. 🧍‍♂️ Cadastro e Autenticação do Usuário
O usuário se cadastra (/auth/register) e faz login (/auth/login).

A API gera um token de autenticação (JWT) que o cliente usa nas próximas requisições.

Cada dado registrado ficará vinculado ao userId, garantindo separação dos dados entre usuários.

2. 💸 Registro de Transações (Gastos e Ganhos)
O usuário informa cada vez que gasta ou ganha dinheiro:

POST /transactions com dados como:

amount: valor

type: expense ou income

category: Ex: Transporte, Alimentação, Salário

date: data da transação

notes: descrição opcional

➡️ A API armazena isso no banco de dados, associando à categoria e ao usuário.

3. 🧾 Categorias de Gastos e Receitas
O sistema já vem com categorias padrão (Ex: Moradia, Transporte, Lazer).

O usuário pode criar ou editar suas próprias categorias.

Isso permite organizar e agrupar os dados para facilitar a análise.

4. 📊 Orçamento (Budget)
O usuário define limites mensais por categoria. Exemplo:

"Quero gastar no máximo R$ 600,00 em Alimentação este mês"

Ele faz um POST /budgets com:

category: Alimentação

limit: 600.00

month: Junho de 2025

🧠 A API calcula automaticamente quanto já foi gasto naquela categoria e avisa se o limite for ultrapassado.

5. 🎯 Metas Financeiras
O usuário pode criar metas pessoais, como:

"Economizar R$ 3.000 até dezembro"

"Juntar R$ 500 por mês para viagem"

Exemplo de dados enviados:

json
Copiar
Editar
{
  "title": "Viagem para Benguela",
  "goalAmount": 3000,
  "currentAmount": 750,
  "deadline": "2025-12-01"
}
A API monitora o progresso e informa:

quanto ainda falta

se o usuário está no ritmo certo para bater a meta

6. 📈 Relatórios e Análises
A API gera relatórios para ajudar o usuário a visualizar suas finanças:

/reports/monthly: Mostra saldo, receitas e despesas do mês

/reports/category: Mostra quanto foi gasto por categoria

/reports/balance: Histórico de saldo mensal acumulado

Esses dados ajudam o usuário a tomar decisões mais conscientes sobre seus hábitos de consumo.

7. 🚨 Alertas (Opcional)
Quando os gastos ultrapassam o orçamento, ou metas estão atrasadas, o sistema pode:

Enviar notificações push

Enviar e-mails

Integrar com apps como Telegram, Slack

🔄 Fluxo Geral
text
Copiar
Editar
Usuário → Adiciona Ganhos/Despesas → API Salva e Classifica
            ↓
        Orçamento Limite → API Monitora se foi ultrapassado
            ↓
         Metas → API acompanha progresso e projeta previsões
            ↓
        Relatórios → API gera visão detalhada das finanças
📌 Conclusão
A gestão das finanças é feita com base em 4 pilares:

Registro de dados financeiros

Organização via categorias e orçamentos

Análise via relatórios e gráficos

Planejamento por metas e previsões

Se quiser, posso criar um exemplo visual de dashboard que usaria esses dados, ou simular a interação completa entre front-end e back-end com chamadas à API.

Você gostaria de seguir por qual caminho agora?

👨‍💻 Ver código de exemplo

📊 Ver um mockup do sistema

🔄 Simular requisições reais da API

🧠 Entender como isso vira um app mobile/web










Perfeito! Vamos enxugar a ideia para que a API faça somente a gestão das finanças pessoais — ou seja, registrar ganhos e despesas, organizar por categoria e mostrar relatórios simples, sem metas nem orçamentos (opcional).

✅ Objetivo da API
Uma API mínima e funcional para gerenciar apenas as finanças pessoais de um usuário:

Cadastrar usuário

Adicionar, editar e excluir transações (ganhos/gastos)

Classificar por categoria

Consultar relatórios básicos (saldo, histórico, total por categoria)

🧩 Entidades simplificadas
1. Usuário (User)
Campo	Tipo	Descrição
id	UUID	ID único
name	String	Nome do usuário
email	String	E-mail (único)
password	String	Senha hash
createdAt	DateTime	Registro da conta

2. Transação (Transaction)
Campo	Tipo	Descrição
id	UUID	ID único da transação
userId	UUID	Ref. ao usuário
title	String	Título da transação
amount	Float	Valor (positivo)
type	Enum	income ou expense
category	String	Categoria simples (ex: "Alimentação")
date	Date	Data da transação

🧭 Rotas da API
🔐 Autenticação
POST /auth/register – Criar usuário

POST /auth/login – Autenticar e gerar token JWT

📥 Transações
GET /transactions – Listar todas as transações do usuário

POST /transactions – Criar nova transação

GET /transactions/:id – Ver uma transação

PUT /transactions/:id – Editar transação

DELETE /transactions/:id – Remover transação

📊 Relatórios
GET /reports/summary – Retorna:

json
Copiar
Editar
{
  "totalIncome": 4500,
  "totalExpense": 2300,
  "balance": 2200
}
GET /reports/by-category – Retorna gastos/ganhos por categoria:

json
Copiar
Editar
{
  "Alimentação": 500,
  "Transporte": 300,
  "Salário": 4500
}
📁 Banco de Dados (ex: PostgreSQL ou MongoDB)
Tabelas/coleções: users, transactions

Simples, segura e escalável

Exemplo de JSON de Transação
json
Copiar
Editar
{
  "title": "Pagamento de internet",
  "amount": 750.00,
  "type": "expense",
  "category": "Serviços",
  "date": "2025-06-03"
}
Vantagens da API focada só em finanças:
✅ Simples de usar
✅ Foco total no essencial
✅ Pode crescer depois (ex: metas, alertas)
✅ Ideal para mobile ou dashboard pessoal

Se quiser, posso montar agora:

🛠 Estrutura inicial com Node.js + Express

🗃 Models com Sequelize (PostgreSQL) ou Mongoose (MongoDB)

📄 Documentação básica no padrão REST


Portfolio Projects for Job Openings
By the time you apply for mid-level positions, your portfolio should include:

Finance Management System (Current Project):
Fully implemented with tests, documentation, and deployment.
E-Commerce Backend:
Showcasing relational database skills and payment integration.
Real-Time Chat Application:
Demonstrating WebSocket and Redis usage.
Microservices Project:
Highlighting your understanding of distributed systems and containerization.
Large-Scale Project:
A complex project that showcases your ability to handle advanced requirements.











































1. Estrutura de Pastas
src/
├── config/
│   └── index.ts               # Variáveis de ambiente
├── common/
│   └── errors/
│       ├── unknown-error.ts   # Erro genérico
│       └── invalid-argument-error.ts # Erro de validação de entrada
│   └── utils/
│       └── email-service.ts   # Serviço de envio de email (simulado)
├── auth/
│   ├── interfaces/
│   │   ├── auth.interface.ts  # Interfaces para DTOs e modelos
│   ├── services/
│   │   └── auth.service.ts    # Lógica de negócio de autenticação
│   ├── controllers/
│   │   └── auth.controller.ts # Lida com requisições HTTP
│   ├── routes/
│   │   └── auth.routes.ts     # Define as rotas de autenticação
│   └── middleware/
│       └── auth.middleware.ts # Middleware de proteção de rotas
├── user/
│   ├── interfaces/
│   │   └── user.interface.ts  # Interfaces de usuário
│   └── repository/
│       └── user.repository.ts # Simula interação com DB para usuários
├── app.ts                     # Configuração do Express
├── server.ts                  # Inicializa o servidor
└── index.d.ts                 # Declarações de tipos globais (JWT custom payload)
2. Instalação de Dependências
Crie um novo projeto e instale as dependências:

Bash

mkdir financial-api-auth
cd financial-api-auth
npm init -y
npm install express bcryptjs jsonwebtoken dotenv ts-node typescript @types/node @types/express @types/bcryptjs @types/jsonwebtoken @types/dotenv
npm install --save-dev nodemon # Para desenvolvimento
Crie o arquivo tsconfig.json:

JSON

// tsconfig.json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "lib": ["es2018", "dom"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
3. Implementação dos Componentes
3.1. src/config/index.ts (Variáveis de Ambiente)
TypeScript

// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m', // Access token expiration
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // Refresh token expiration
    emailServiceUser: process.env.EMAIL_SERVICE_USER || 'your_email@example.com',
    emailServicePass: process.env.EMAIL_SERVICE_PASS || 'your_email_password',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200' // URL do frontend para links de reset
};

// Validar se o JWT_SECRET foi definido (mínimo de segurança)
if (!config.jwtSecret || config.jwtSecret === 'your_jwt_secret_key_change_me') {
    console.warn("ATENÇÃO: JWT_SECRET não definido ou usando valor padrão. ISSO NÃO É SEGURO PARA PRODUÇÃO!");
}
Crie um arquivo .env na raiz do projeto:

# .env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_please_change_this_for_production_123!
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_SERVICE_USER=noreply@yourdomain.com
EMAIL_SERVICE_PASS=your_email_service_password
FRONTEND_URL=http://localhost:4200
3.2. src/common/errors/ (Exceções Personalizadas)
TypeScript

// src/common/errors/unknown-error.ts
export class UnknownError extends Error {
    public readonly originalError?: Error;
    constructor(message: string = "Ocorreu um erro inesperado.", originalError?: Error) {
        super(message);
        this.name = 'UnknownError';
        if (Error.captureStackTrace) Error.captureStackTrace(this, UnknownError);
        this.originalError = originalError;
    }
}

// src/common/errors/invalid-argument-error.ts
export class InvalidArgumentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidArgumentError';
        if (Error.captureStackTrace) Error.captureStackTrace(this, InvalidArgumentError);
    }
}

// src/auth/interfaces/auth.interface.ts (Adicionar exceções específicas de autenticação aqui)
// src/auth/errors/auth.error.ts (Melhor local para elas)
// src/auth/errors/user-not-found-error.ts
export class UserNotFoundError extends Error {
    constructor(message: string = "Usuário não encontrado.") {
        super(message);
        this.name = 'UserNotFoundError';
        if (Error.captureStackTrace) Error.captureStackTrace(this, UserNotFoundError);
    }
}

// src/auth/errors/invalid-credentials-error.ts
export class InvalidCredentialsError extends Error {
    constructor(message: string = "Credenciais inválidas (email ou senha).") {
        super(message);
        this.name = 'InvalidCredentialsError';
        if (Error.captureStackTrace) Error.captureStackTrace(this, InvalidCredentialsError);
    }
}

// src/auth/errors/email-already-exists-error.ts
export class EmailAlreadyExistsError extends Error {
    constructor(message: string = "O email fornecido já está em uso.") {
        super(message);
        this.name = 'EmailAlreadyExistsError';
        if (Error.captureStackTrace) Error.captureStackTrace(this, EmailAlreadyExistsError);
    }
}

// src/auth/errors/token-invalid-error.ts
export class TokenInvalidError extends Error {
    constructor(message: string = "Token inválido ou expirado.") {
        super(message);
        this.name = 'TokenInvalidError';
        if (Error.captureStackTrace) Error.captureStackTrace(this, TokenInvalidError);
    }
}
3.3. src/user/interfaces/user.interface.ts (Interface do Usuário)
TypeScript

// src/user/interfaces/user.interface.ts
export interface IUser {
    id: string;
    email: string;
    passwordHash: string; // Senha já hashed
    name?: string;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    refreshToken?: string; // Para refresh token rotation/invalidation
}

export interface IRegisterUserDTO {
    email: string;
    password: string;
    name?: string;
}

export interface ILoginUserDTO {
    email: string;
    password: string;
}

export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // Tempo de expiração do access token em segundos
}

export interface IPasswordResetRequestDTO {
    email: string;
}

export interface IPasswordResetDTO {
    token: string;
    newPassword: string;
}

// Para o payload do JWT
export interface IJwtPayload {
    id: string;
    email: string;
    iat: number; // Issued At
    exp: number; // Expiration Time
}
3.4. src/index.d.ts (Declaração de Tipos para Express Request)
TypeScript

// src/index.d.ts
import { IJwtPayload } from './user/interfaces/user.interface';

declare global {
    namespace Express {
        interface Request {
            user?: IJwtPayload; // Adiciona a propriedade 'user' ao objeto Request
        }
    }
}
3.5. src/user/repository/user.repository.ts (Repositório de Usuário Simulado)
TypeScript

// src/user/repository/user.repository.ts
import { IUser } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos

// Simulação de banco de dados em memória
const users: IUser[] = [];

class UserRepository {
    async findByEmail(email: string): Promise<IUser | undefined> {
        return users.find(user => user.email === email);
    }

    async findById(id: string): Promise<IUser | undefined> {
        return users.find(user => user.id === id);
    }

    async findByPasswordResetToken(token: string): Promise<IUser | undefined> {
        return users.find(user => user.passwordResetToken === token && user.passwordResetExpires && user.passwordResetExpires > new Date());
    }

    async save(user: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
        const newUser: IUser = {
            id: uuidv4(),
            ...user,
            isActive: true, // Auto-ativação para simplificar o exemplo
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        users.push(newUser);
        return newUser;
    }

    async update(user: IUser): Promise<IUser> {
        const index = users.findIndex(u => u.id === user.id);
        if (index > -1) {
            users[index] = { ...user, updatedAt: new Date() };
            return users[index];
        }
        throw new Error('User not found for update'); // Idealmente uma exceção mais específica
    }

    // Método para simular a limpeza do token de reset (chamado após o reset)
    async clearPasswordResetToken(userId: string): Promise<void> {
        const user = users.find(u => u.id === userId);
        if (user) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
        }
    }

    // Método para simular a atualização do refresh token
    async updateRefreshToken(userId: string, refreshToken: string | undefined): Promise<void> {
        const user = users.find(u => u.id === userId);
        if (user) {
            user.refreshToken = refreshToken;
        }
    }
}

export default new UserRepository();
3.6. src/common/utils/email-service.ts (Serviço de Email Simulado)
TypeScript

// src/common/utils/email-service.ts
import { config } from '../../config';

class EmailService {
    async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
        console.log(`
        ------------------------------------------
        SIMULANDO ENVIO DE EMAIL DE RESET DE SENHA
        Para: ${email}
        De: ${config.emailServiceUser}
        Assunto: Redefinição de Senha para sua conta de Finanças Pessoais

        Olá,

        Você solicitou a redefinição de sua senha.
        Por favor, clique no link abaixo para redefinir sua senha:
        ${resetLink}

        Este link expirará em 15 minutos.
        Se você não solicitou isso, ignore este email.

        Atenciosamente,
        Equipe de Finanças Pessoais
        ------------------------------------------
        `);
        // Em uma implementação real, você usaria uma biblioteca como Nodemailer aqui
        // await nodemailer.createTransport(...).sendMail(...)
    }

    async sendRegistrationConfirmationEmail(email: string, confirmationLink: string): Promise<void> {
        console.log(`
        ------------------------------------------
        SIMULANDO ENVIO DE EMAIL DE CONFIRMAÇÃO DE REGISTRO
        Para: ${email}
        De: ${config.emailServiceUser}
        Assunto: Confirme seu Registro de Conta

        Olá,

        Obrigado por se registrar!
        Por favor, clique no link abaixo para ativar sua conta:
        ${confirmationLink}

        Se você não se registrou, ignore este email.

        Atenciosamente,
        Equipe de Finanças Pessoais
        ------------------------------------------
        `);
        // Em uma implementação real, você usaria uma biblioteca como Nodemailer aqui
    }
}

export default new EmailService();
3.7. src/auth/services/auth.service.ts (Lógica de Negócio de Autenticação)
TypeScript

// src/auth/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
    IRegisterUserDTO,
    ILoginUserDTO,
    IAuthTokens,
    IJwtPayload,
    IPasswordResetRequestDTO,
    IPasswordResetDTO,
    IUser
} from '../../user/interfaces/user.interface';
import userRepository from '../../user/repository/user.repository';
import { config } from '../../config';
import {
    InvalidArgumentError,
    UnknownError
} from '../../common/errors/unknown-error'; // Path adjustment for InvalidArgumentError
import {
    UserNotFoundError,
    InvalidCredentialsError,
    EmailAlreadyExistsError,
    TokenInvalidError
} from '../errors/auth.error'; // Path adjustment for auth-specific errors
import emailService from '../../common/utils/email-service';

const SALT_ROUNDS = 10;

class AuthService {

    private generateTokens(user: IUser): IAuthTokens {
        const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            iat: Math.floor(Date.now() / 1000), // Issued At
            exp: Math.floor(Date.now() / 1000) + (parseInt(config.jwtExpiresIn.slice(0, -1)) * 60) // Expiração em minutos
        };

        const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
        const refreshToken = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: config.jwtRefreshExpiresIn });

        // Em um sistema real, você salvaria/atualizaria o refreshToken no DB para invalidação
        userRepository.updateRefreshToken(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
            expiresIn: parseInt(config.jwtExpiresIn.slice(0, -1)) * 60 // Tempo de expiração em segundos
        };
    }

    async register(userData: IRegisterUserDTO): Promise<Omit<IUser, 'passwordHash'>> {
        // Validação de entrada
        if (!userData.email || !userData.password) {
            throw new InvalidArgumentError("Email e senha são obrigatórios para o registro.");
        }
        if (userData.password.length < 8) {
            throw new InvalidArgumentError("A senha deve ter pelo menos 8 caracteres.");
        }
        // Poderíamos adicionar validação de regex para email e complexidade de senha aqui

        try {
            const existingUser = await userRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new EmailAlreadyExistsError();
            }

            const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);

            const newUser = await userRepository.save({
                email: userData.email,
                passwordHash: passwordHash,
                name: userData.name,
                isActive: true // Para simplificar, ativado automaticamente
            });

            // Opcional: enviar email de confirmação (descomente em um cenário real)
            // const confirmationToken = jwt.sign({ id: newUser.id }, config.jwtSecret, { expiresIn: '1d' });
            // const confirmationLink = `${config.frontendUrl}/confirm-email?token=${confirmationToken}`;
            // await emailService.sendRegistrationConfirmationEmail(newUser.email, confirmationLink);

            const { passwordHash: _, ...userWithoutHash } = newUser; // Remove o hash antes de retornar
            return userWithoutHash;

        } catch (error) {
            console.error('[AuthService] Erro no registro:', error);
            if (error instanceof InvalidArgumentError || error instanceof EmailAlreadyExistsError) {
                throw error;
            }
            throw new UnknownError("Falha no registro do usuário.", error instanceof Error ? error : new Error(String(error)));
        }
    }

    async login(credentials: ILoginUserDTO): Promise<IAuthTokens> {
        if (!credentials.email || !credentials.password) {
            throw new InvalidArgumentError("Email e senha são obrigatórios para o login.");
        }

        try {
            const user = await userRepository.findByEmail(credentials.email);
            if (!user) {
                throw new InvalidCredentialsError();
            }

            const isMatch = await bcrypt.compare(credentials.password, user.passwordHash);
            if (!isMatch) {
                throw new InvalidCredentialsError();
            }

            // Opcional: verificar se a conta está ativa
            // if (!user.isActive) {
            //     throw new UserNotActiveError("Sua conta não está ativa. Verifique seu email.");
            // }

            return this.generateTokens(user);

        } catch (error) {
            console.error('[AuthService] Erro no login:', error);
            if (error instanceof InvalidArgumentError || error instanceof InvalidCredentialsError) {
                throw error;
            }
            throw new UnknownError("Falha no login do usuário.", error instanceof Error ? error : new Error(String(error)));
        }
    }

    async refreshToken(currentRefreshToken: string): Promise<IAuthTokens> {
        if (!currentRefreshToken) {
            throw new InvalidArgumentError("Refresh token é obrigatório.");
        }

        try {
            const decoded = jwt.verify(currentRefreshToken, config.jwtSecret) as { id: string };
            const user = await userRepository.findById(decoded.id);

            if (!user || user.refreshToken !== currentRefreshToken) {
                // Se o refresh token não corresponder, pode ser um ataque de reuso
                // Invalide todos os tokens do usuário ou force o relogin
                if (user) await userRepository.updateRefreshToken(user.id, undefined); // Invalida o token existente
                throw new TokenInvalidError("Refresh token inválido ou expirado.");
            }

            // Geração de novos tokens (access e refresh)
            return this.generateTokens(user);

        } catch (error) {
            console.error('[AuthService] Erro ao renovar token:', error);
            if (error instanceof InvalidArgumentError || error instanceof TokenInvalidError) {
                throw error;
            }
            if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
                throw new TokenInvalidError("Refresh token inválido ou expirado.");
            }
            throw new UnknownError("Falha ao renovar token.", error instanceof Error ? error : new Error(String(error)));
        }
    }

    async requestPasswordReset(data: IPasswordResetRequestDTO): Promise<void> {
        if (!data.email) {
            throw new InvalidArgumentError("Email é obrigatório para solicitar o reset de senha.");
        }

        try {
            const user = await userRepository.findByEmail(data.email);

            // Não informa se o usuário existe para evitar enumeração
            if (!user) {
                console.warn(`[AuthService] Tentativa de reset de senha para email não existente: ${data.email}`);
                return; // Retorna silenciosamente para não vazar informações
            }

            const resetToken = uuidv4(); // Token único para o link de reset
            const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

            user.passwordResetToken = resetToken;
            user.passwordResetExpires = resetExpires;
            await userRepository.update(user); // Atualiza o usuário com o token

            const resetLink = `${config.frontendUrl}/reset-password?token=${resetToken}`;
            await emailService.sendPasswordResetEmail(user.email, resetLink);

        } catch (error) {
            console.error('[AuthService] Erro ao solicitar reset de senha:', error);
            if (error instanceof InvalidArgumentError) {
                throw error;
            }
            throw new UnknownError("Falha ao solicitar reset de senha.", error instanceof Error ? error : new Error(String(error)));
        }
    }

    async resetPassword(data: IPasswordResetDTO): Promise<void> {
        if (!data.token || !data.newPassword) {
            throw new InvalidArgumentError("Token e nova senha são obrigatórios para resetar a senha.");
        }
        if (data.newPassword.length < 8) {
            throw new InvalidArgumentError("A nova senha deve ter pelo menos 8 caracteres.");
        }

        try {
            const user = await userRepository.findByPasswordResetToken(data.token);

            if (!user) {
                throw new TokenInvalidError("Token de reset inválido ou expirado.");
            }

            const newPasswordHash = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
            user.passwordHash = newPasswordHash;
            user.passwordResetToken = undefined; // Invalida o token após uso
            user.passwordResetExpires = undefined;
            await userRepository.update(user);

        } catch (error) {
            console.error('[AuthService] Erro ao resetar senha:', error);
            if (error instanceof InvalidArgumentError || error instanceof TokenInvalidError) {
                throw error;
            }
            throw new UnknownError("Falha ao resetar senha.", error instanceof Error ? error : new Error(String(error)));
        }
    }

    async logout(userId: string): Promise<void> {
        try {
            // Em um sistema real, aqui você invalidaria o refresh token do usuário no DB
            await userRepository.updateRefreshToken(userId, undefined);
            // Para JWTs de acesso (stateless), o logout é basicamente a exclusão do token no cliente
            // e a invalidação do refresh token no servidor.
        } catch (error) {
            console.error(`[AuthService] Erro ao fazer logout para userId: ${userId}`, error);
            throw new UnknownError("Falha ao fazer logout.", error instanceof Error ? error : new Error(String(error)));
        }
    }
}

export default new AuthService();
3.8. src/auth/controllers/auth.controller.ts (Controladores)
TypeScript

// src/auth/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import {
    InvalidArgumentError,
    UnknownError
} from '../../common/errors/unknown-error';
import {
    UserNotFoundError,
    InvalidCredentialsError,
    EmailAlreadyExistsError,
    TokenInvalidError
} from '../errors/auth.error'; // Ajuste o caminho se necessário

class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            // Aqui você idealmente usaria uma biblioteca de validação como Zod ou Joi
            // para validar req.body antes de passar para o serviço.
            // Ex: Zod.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body);

            const user = await authService.register(req.body);
            res.status(201).json({ message: "Usuário registrado com sucesso. Por favor, verifique seu email para ativar a conta (se ativacao por email for implementada).", user: { id: user.id, email: user.email } });
        } catch (error) {
            if (error instanceof InvalidArgumentError) {
                return res.status(400).json({ message: error.message });
            }
            if (error instanceof EmailAlreadyExistsError) {
                return res.status(409).json({ message: error.message });
            }
            console.error('[AuthController] Erro no registro:', error);
            next(new UnknownError("Erro interno ao registrar usuário.", error instanceof Error ? error : new Error(String(error))));
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            // Validação Zod/Joi aqui para req.body
            const tokens = await authService.login(req.body);
            res.status(200).json(tokens);
        } catch (error) {
            if (error instanceof InvalidArgumentError) {
                return res.status(400).json({ message: error.message });
            }
            if (error instanceof InvalidCredentialsError) {
                return res.status(401).json({ message: error.message });
            }
            console.error('[AuthController] Erro no login:', error);
            next(new UnknownError("Erro interno ao fazer login.", error instanceof Error ? error : new Error(String(error))));
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            // Validação Zod/Joi para refreshToken aqui
            const newTokens = await authService.refreshToken(refreshToken);
            res.status(200).json(newTokens);
        } catch (error) {
            if (error instanceof InvalidArgumentError) {
                return res.status(400).json({ message: error.message });
            }
            if (error instanceof TokenInvalidError) {
                // 401 para indicar que o token não é mais válido e o usuário precisa logar novamente
                return res.status(401).json({ message: error.message });
            }
            console.error('[AuthController] Erro ao renovar token:', error);
            next(new UnknownError("Erro interno ao renovar token.", error instanceof Error ? error : new Error(String(error))));
        }
    }

    async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            // Validação Zod/Joi para email aqui
            await authService.requestPasswordReset({ email });
            // Resposta genérica para evitar enumeração de usuários
            res.status(200).json({ message: "Se um usuário com este email existir, um link de redefinição de senha foi enviado." });
        } catch (error) {
            if (error instanceof InvalidArgumentError) {
                return res.status(400).json({ message: error.message });
            }
            console.error('[AuthController] Erro ao solicitar reset de senha:', error);
            next(new UnknownError("Erro interno ao solicitar reset de senha.", error instanceof Error ? error : new Error(String(error))));
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body;
            // Validação Zod/Joi para token e newPassword aqui
            await authService.resetPassword({ token, newPassword });
            res.status(200).json({ message: "Senha redefinida com sucesso." });
        } catch (error) {
            if (error instanceof InvalidArgumentError) {
                return res.status(400).json({ message: error.message });
            }
            if (error instanceof TokenInvalidError) {
                return res.status(400).json({ message: error.message }); // 400 Bad Request para token inválido/expirado
            }
            console.error('[AuthController] Erro ao resetar senha:', error);
            next(new UnknownError("Erro interno ao redefinir senha.", error instanceof Error ? error : new Error(String(error))));
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // req.user é populado pelo middleware de autenticação
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Não autorizado." });
            }
            await authService.logout(req.user.id);
            res.status(200).json({ message: "Sessão encerrada com sucesso." });
        } catch (error) {
            console.error('[AuthController] Erro no logout:', error);
            next(new UnknownError("Erro interno ao fazer logout.", error instanceof Error ? error : new Error(String(error))));
        }
    }
}

export default new AuthController();
3.9. src/auth/middleware/auth.middleware.ts (Middleware de Autenticação)
TypeScript

// src/auth/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { IJwtPayload } from '../../user/interfaces/user.interface';
import { TokenInvalidError } from '../errors/auth.error';

// Middleware para proteger rotas
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: "Token de autenticação não fornecido." }); // Unauthorized
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as IJwtPayload;
        req.user = decoded; // Adiciona o payload decodificado ao objeto request
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token de autenticação expirado." });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Token de autenticação inválido." });
        }
        console.error('[AuthMiddleware] Erro na verificação do token:', error);
        return res.status(401).json({ message: "Falha na autenticação." });
    }
};

// Middleware para verificar autorização baseada em roles (exemplo)
// export const authorizeRoles = (...roles: string[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user || !req.user.roles || !roles.includes(req.user.roles)) {
//             return res.status(403).json({ message: "Acesso negado. Você não tem permissão para realizar esta ação." }); // Forbidden
//         }
//         next();
//     };
// };
3.10. src/auth/routes/auth.routes.ts (Rotas de Autenticação)
TypeScript

// src/auth/routes/auth.routes.ts
import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const authRoutes = Router();

// Rotas públicas (não exigem autenticação)
authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.post('/refresh-token', authController.refreshToken);
authRoutes.post('/forgot-password', authController.requestPasswordReset);
authRoutes.post('/reset-password', authController.resetPassword);

// Rota protegida (exige token de acesso)
authRoutes.post('/logout', authenticateToken, authController.logout); // Logout exige que o usuário esteja autenticado

export default authRoutes;
3.11. src/app.ts (Configuração do Express)
TypeScript

// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import authRoutes from './auth/routes/auth.routes';
import { UnknownError } from './common/errors/unknown-error';

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.errorHandling(); // Middleware de tratamento de erros deve ser o último
    }

    private config(): void {
        this.app.use(express.json()); // Para parsear o corpo da requisição em JSON
        this.app.use(express.urlencoded({ extended: true })); // Para dados de formulário URL-encoded
        // Adicione outros middlewares como CORS, helmet (segurança) aqui
    }

    private routes(): void {
        this.app.use('/api/auth', authRoutes);

        // Exemplo de rota protegida que usa o middleware de autenticação
        // import { authenticateToken } from './auth/middleware/auth.middleware';
        // this.app.get('/api/protected', authenticateToken, (req: Request, res: Response) => {
        //     res.status(200).json({ message: `Bem-vindo, ${req.user?.email}! Você está autenticado.` });
        // });

        // Rota de fallback para 404 (rota não encontrada)
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).json({ message: 'Rota não encontrada.' });
        });
    }

    private errorHandling(): void {
        // Middleware de tratamento de erros centralizado
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error('Unhandled Error:', err); // Loga o erro completo para depuração

            if (err instanceof UnknownError) {
                // Erros desconhecidos controlados, passamos a mensagem amigável
                return res.status(500).json({ message: err.message || "Ocorreu um erro interno inesperado." });
            }

            // Para qualquer outro erro não tratado (pode ser de terceiros, bugs, etc.)
            // Evite vazar detalhes sensíveis do erro para o cliente em produção
            const errorMessage = process.env.NODE_ENV === 'production' ?
                                 "Ocorreu um erro interno do servidor." :
                                 err.message;
            res.status(500).json({ message: errorMessage });
        });
    }
}

export default new App().app;
3.12. src/server.ts (Inicialização do Servidor)
TypeScript

// src/server.ts
import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Pressione CTRL+C para parar.`);
});
4. Como Rodar o Projeto
Crie os arquivos e pastas conforme a estrutura acima.
Cole o código em cada arquivo correspondente.
Execute:
Bash

npm run dev # Para desenvolvimento com nodemon
# ou
npm run start # Para produção (após build)
Adicione os scripts no seu package.json:

JSON

// package.json (adicione/modifique a seção "scripts")
{
  "name": "financial-api-auth",
  "version": "1.0.0",
  "description": "",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "nodemon --exec ts-node src/server.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/uuid": "^9.0.8",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.2",
    "nodemon": "^3.1.3",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5"
  }
}
Testando a API (usando ferramentas como Postman, Insomnia ou curl)
Registro (POST /api/auth/register)
Corpo:
JSON

{
    "email": "test@example.com",
    "password": "StrongPassword123!"
}
Resposta (201 Created): {"message": "Usuário registrado com sucesso...", "user": {"id": "...", "email": "test@example.com"}}
Teste de Email Existente (409 Conflict): Tente registrar com o mesmo email.
Login (POST /api/auth/login)
Corpo:
JSON

{
    "email": "test@example.com",
    "password": "StrongPassword123!"
}
Resposta (200 OK): {"accessToken": "...", "refreshToken": "...", "expiresIn": 900}
Teste de Credenciais Inválidas (401 Unauthorized): Use senha errada.
Logout (POST /api/auth/logout)
Cabeçalho: Authorization: Bearer <seu_access_token_do_login>
Corpo: Vazio
Resposta (200 OK): {"message": "Sessão encerrada com sucesso."}
Refresh Token (POST /api/auth/refresh-token)
Corpo:
JSON

{
    "refreshToken": "<seu_refresh_token_do_login>"
}
Resposta (200 OK): Novos accessToken e refreshToken.
Solicitar Reset de Senha (POST /api/auth/forgot-password)
Corpo:
JSON

{
    "email": "test@example.com"
}
Resposta (200 OK): {"message": "Se um usuário com este email existir, um link de redefinição de senha foi enviado."} (Verifique o console para o link de email simulado).
Resetar Senha (POST /api/auth/reset-password)
Corpo:
JSON

{
    "token": "<token_do_link_de_email>",
    "newPassword": "NewStrongPassword123!"
}
Resposta (200 OK): {"message": "Senha redefinida com sucesso."}
Esta implementação cobre os principais aspectos de um módulo de autenticação robusto. Lembre-se que em um ambiente de produção real, o serviço de email seria um provedor SMTP (SendGrid, Mailgun, etc.), o repositório se conectaria a um banco de dados real (Mongoose, Prisma, TypeORM), e a validação de entrada nos controladores seria mais rigorosa (com Zod/Joi).