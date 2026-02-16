import express from 'express';
import authRouter from './routes/auth.routes.js';
import movieRouter from './routes/movie.routes.js';
import { errorHandler } from './middlewares/error-handler.js';
import cors from 'cors';
import eventRouter from './routes/event.route.js';
import newsletterRouter from './routes/newsletter.routes.js';
import emailService from './services/emailService.js';
import subscriberRouter from './routes/subscriber.route.js';
import bookingRouter from './routes/booking.routes.js';

const app = express();
const IP = process.env.IP;
const PORT = process.env.PORT;

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONT_IP,
  }),
);

app.use('/auth', authRouter);
app.use('/movies', movieRouter);
app.use('/event', eventRouter);
app.use('/newsletter', newsletterRouter);
app.use('/subscriber', subscriberRouter);
app.use('/bookings', bookingRouter);

app.use(errorHandler);

emailService.mailerJob();

app.listen(PORT, () => {
  console.info(`Server is running on ${IP}:${PORT}`);
});
