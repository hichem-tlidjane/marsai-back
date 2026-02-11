import express from 'express';
import authRouter from './routes/auth.routes.js';
import movieRouter from './routes/movie.routes.js';
import { errorHandler } from './middlewares/error-handler.js';
import cors from 'cors';
import eventRouter from './routes/event.route.js';
import newsletterRouter from './routes/newsletter.routes.js';
import newsletterService from './services/newsletter.service.js';
import newsletterModel from './models/newsletter.model.js';
import emailService from './services/emailService.js';

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

app.use(errorHandler);

emailService.mailerJob();

// await newsletterModel.findAllToSend();

app.listen(PORT, () => {
  console.info(`Server is running on ${IP}:${PORT}`);
});
