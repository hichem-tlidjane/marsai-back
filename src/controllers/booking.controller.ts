import type { RequestHandler } from 'express';
import bookingService from '../services/booking.service.js';
import participantService from '../services/participant.service.js';
import { type BookingRequest } from '../types/schemas/booking-request.schema.js';

const create: RequestHandler = async (req, res, next) => {
  try {
    const { eventId, firstname, lastname, email } = req.body as BookingRequest;

    const participant = await participantService.findOrCreate(
      firstname,
      lastname,
      email,
    );

    const bookingId = await bookingService.create(eventId, participant.id);
    res.status(201).json({ id: bookingId });
  } catch (error) {
    next(error);
  }
};

const bookingController = { create };
export default bookingController;
