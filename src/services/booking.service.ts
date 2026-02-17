import bookingModel from '../models/booking.model.js';
import AppError from '../helpers/AppError.js';

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

  return bookingId;
};

const bookingService = { create };

export default bookingService;
