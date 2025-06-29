
import dotenv from 'dotenv';
dotenv.config();
import app from './app'; 
import { connectDB } from './config/database'; // Função para conectar ao banco de dados

const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';

async function bootstrap() {
    try {
        console.log(`[Server] Iniciando o servidor em ambiente: ${environment}`);
        await connectDB();
        console.log('[Server] Conexão com o banco de dados estabelecida com sucesso.');
        // 3. Iniciar o servidor HTTP
        const server = app.listen(port, () => {
            console.log(`[Server] Servidor rodando em: http://localhost:${port}`);
        });

    } catch (error) {
        // Logar o erro de inicialização de forma mais detalhada
        console.error('[Server Error] Falha na inicialização do servidor:', error);
        // Exemplo de como acessar a mensagem se for uma instância de Error
        if (error instanceof Error) {
            console.error(`[Server Error] Mensagem: ${error.message}`);
            if (error.stack) {
                console.error(`[Server Error] Stack: ${error.stack}`);
            }
        }
        // Sair do processo com código de erro (1)
        process.exit(1);
    }
}

// Iniciar a aplicação
bootstrap();