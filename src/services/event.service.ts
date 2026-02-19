import eventModel from '../models/event.model.js';
import type { CreateEventRequest } from '../types/schemas/create-event-request.schema.js';
import type { UpdateEventRequest } from '../types/schemas/update-event-request.schema.js';
import type { Event } from '../types/interfaces/event.interface.js';
import AppError from '../helpers/AppError.js';

const create = async (body: CreateEventRequest): Promise<void> => {
  await eventModel.create(body);
};

const findAll = async (): Promise<Event[]> => {
  return await eventModel.findAll();
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

const eventService = { create, findAll, update, remove };

export default eventService;
