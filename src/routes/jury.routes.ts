import { Router } from 'express';
import juryController from '../controllers/jury.controller.js';
import { validate } from '../middlewares/validate.js';
import { CreateJurySchema } from '../types/schemas/create-jury.schema.js';

const juryRouter = Router();

juryRouter.post('/', validate(CreateJurySchema), juryController.create);
juryRouter.get('/', juryController.findAll);

export default juryRouter;
