import type { RequestHandler } from 'express';
import eventService from '../services/event.service.js';

const create: RequestHandler = async (req, res, next) => {
  try {
    await eventService.create(req.body);
    return res.status(201).send();
  } catch (err) {
    next(err);
  }
};

const findAll: RequestHandler = async (_, res, next) => {
  try {
    const events = await eventService.findAll();
    return res.json(events);
  } catch (err) {
    next(err);
  }
};

const findById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventService.findById(parseInt(id as string));
    return res.json(event);
  } catch (err) {
    next(err);
  }
};

const remove: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await eventService.remove(parseInt(id as string));
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await eventService.update(parseInt(id as string), req.body);
    return res.status(200).send();
  } catch (err) {
    next(err);
  }
};

const eventController = { create, findAll, remove, update, findById };

export default eventController;
