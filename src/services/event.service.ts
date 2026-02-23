import eventModel from '../models/event.model.js';
import type { CreateEventRequest } from '../types/schemas/create-event-request.schema.js';
import type { UpdateEventRequest } from '../types/schemas/update-event-request.schema.js';
import type { Event } from '../types/interfaces/event.interface.js';
import AppError from '../helpers/AppError.js';
import bookingModel from '../models/booking.model.js';

const create = async (body: CreateEventRequest): Promise<void> => {
  await eventModel.create(body);
};

const findAll = async (lang?: string): Promise<Event[]> => {
  return await eventModel.findAll(lang);
};

const findById = async (id: number): Promise<Event> => {
  const event = await eventModel.findById(id);
  if (!event) {
    throw new AppError(404, 'Event not found');
  }
  return event;
};

const getRemainingSeats = async (id: number): Promise<number> => {
  const event = await eventModel.findById(id);
  if (!event) {
    throw new AppError(404, 'Event not found');
  }
  const bookedSeats = await bookingModel.countByEventId(id);
  return event.capacity - bookedSeats;
};

const remove = async (id: number): Promise<void> => {
  const affectedRows = await eventModel.remove(id);
  if (affectedRows === 0) {
    throw new AppError(404, 'Event not found');
  }
};

const update = async (id: number, event: UpdateEventRequest): Promise<void> => {
  const affectedRows = await eventModel.update(id, event);
  if (affectedRows === 0) {
    throw new AppError(404, `Event not found`);
  }
};

const eventService = {
  create,
  findAll,
  update,
  remove,
  findById,
  getRemainingSeats,
};

export default eventService;
