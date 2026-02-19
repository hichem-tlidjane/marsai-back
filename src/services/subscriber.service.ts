import AppError from '../helpers/AppError.js';
import { isMysqlError } from '../helpers/is-mysql-error.js';
import subscriberModel from '../models/subscriber.model.js';
import type { SubscriberRequest } from '../types/schemas/subscriber.schema.js';

const subscribe = async (sub: SubscriberRequest): Promise<number> => {
  try {
    return await subscriberModel.create(sub);
  } catch (err) {
    if (isMysqlError(err) && err.errno === 1062) {
      throw new AppError(409, 'Email already used');
    }
    throw err;
  }
};

const unsubscribe = async (sub: SubscriberRequest): Promise<number> => {
  return await subscriberModel.remove(sub);
};

const subscriberService = { subscribe, unsubscribe };

export default subscriberService;
