import participantModel from '../models/participant.model.js';
import AppError from '../helpers/AppError.js';
import type Participant from '../types/interfaces/participant.interface.js';

const findOrCreate = async (
  firstname: string,
  lastname: string,
  email: string,
): Promise<Participant> => {
  let participant = await participantModel.findByEmail(email);

  if (!participant) {
    const participantId = await participantModel.create({
      firstname,
      lastname,
      email,
    });
    participant = {
      id: participantId,
      firstname,
      lastname,
      email,
    } as Participant;
  }

  if (!participant) {
    throw new AppError(500, 'Failed to create or find participant');
  }

  return participant;
};

const participantService = { findOrCreate };

export default participantService;
