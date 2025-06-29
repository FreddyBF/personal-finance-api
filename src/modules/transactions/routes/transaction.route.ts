import { Router } from "express";
import { TransactionService } from "../../transactions/services/transation.service";
import { TransactionRepository } from "../../transactions/repositories/transation.repository";
import { TransactionController } from "../../transactions/controllers/transaction.controller";
import { validate } from "../../../middlewares/validation.middlewere";
import { CreateTransactionSchema } from "../dtos/create-transaction.dto";
import { IdParamSchema } from "../../../shared/validators/objectId.validator";
import { UpdateTransactionSchema } from "../dtos/update-transaction.dto";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const repository = new TransactionRepository();
const service = new TransactionService(repository);
const controller = new TransactionController(service);
const router = Router();

router.use(authMiddleware); 
router.post('/api/v1/transactions',
    validate(CreateTransactionSchema), 
    controller.createTransaction
);

router.get('/api/v1/transactions',
    controller.getAllTransaction
);

router.get('/api/v1/transactions/:id', 
    validate(IdParamSchema, 'params'), 
    controller.getTransaction
);

router.patch('/api/v1/transactions/:id',
    validate(IdParamSchema,'params'), 
    validate(UpdateTransactionSchema),
    controller.updateTransaction
);

/*
router.put('/api/v1/transactions/:id', 
    validate(IdParamSchema,'params'), 
    validate(UpdateTransactionSchema),
    controller.
);
*/

router.delete('/api/v1/transactions/:id', 
    validate(IdParamSchema, 'params'), 
    controller.deleteTransaction
);

export default router;