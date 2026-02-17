import bookingModel from '../models/booking.model.js';
import AppError from '../helpers/AppError.js';
import emailService from './emailService.js';
import eventModel from '../models/event.model.js';
import participantModel from '../models/participant.model.js';

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
    await emailService.sendMailSubscribeEvent(
      participant.email,
      event.title,
      event.description,
    );
  }

  return bookingId;
};

const bookingService = { create };

export default bookingService;
