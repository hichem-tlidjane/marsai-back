import newsletterModel from '../models/newsletter.model.js';
import type { NewsletterRequest } from '../types/schemas/newsletter.schema.js';
import emailService from './email.service.js';
import subscriberModel from '../models/subscriber.model.js';
import type Newsletter from '../types/interfaces/newsletter.interface.js';

const create = async (newsletter: NewsletterRequest): Promise<number> => {
  const id = await newsletterModel.create(newsletter);
  if (newsletter.sendAt === null) {
    const subscribers = await subscriberModel.findAll();
    await emailService.sendMail(
      { ...newsletter, id, sent: false },
      subscribers,
    );
  }

  return id;
};

const findAll = async (): Promise<Newsletter[]> => {
  return await newsletterModel.findAll();
};

const newsletterService = {
  create,
  findAll,
};

export default newsletterService;
