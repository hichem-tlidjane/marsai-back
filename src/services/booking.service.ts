import bookingModel from '../models/booking.model.js';
import AppError from '../helpers/AppError.js';
import emailService from './emailService.js';
import eventModel from '../models/event.model.js';
import participantModel from '../models/participant.model.js';
import jwtService from './jwt.service.js';

const create = async (
  eventId: number,
  participantId: number,
): Promise<number> => {
  const existingBooking = await bookingModel.findByParticipantAndEvent(
    participantId,
    eventId,
  );

  if (existingBooking) {
    throw new AppError(409, 'Participant is already registered for this event');
  }

  const bookingId = await bookingModel.create(eventId, participantId);

  const event = await eventModel.findById(eventId);
  const participant = await participantModel.findById(participantId);

  if (event && participant) {
    const token = jwtService.signSubscribeEventToken({ id: bookingId });
    await emailService.sendMailSubscribeEvent(
      participant.email,
      event.title,
      event.description,
      token,
    );
  }

  return bookingId;
};

const unsubscribe = async (token: string): Promise<number> => {
  const payload = jwtService.verify(token);
  return await bookingModel.remove(payload.id);
};

const bookingService = { create, unsubscribe };

export default bookingService;
