import { Router } from 'express';
import bookingController from '../controllers/booking.controller.js';
import { validate } from '../middlewares/validate.js';
import { BookingRequestSchema } from '../types/schemas/booking-request.schema.js';

const router = Router();

router.post('/', validate(BookingRequestSchema), bookingController.create);

export default router;
