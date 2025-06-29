import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import transactionRoute from './modules/transactions/routes/transaction.route'
import { authMiddleware } from './middlewares/auth.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req:Request, res:Response) => {
    res.json(
        { 
            message: ['Ola', 'Bom dia', 'Boa tarde']
        }
    );
});

app.use(transactionRoute);

export default app;
