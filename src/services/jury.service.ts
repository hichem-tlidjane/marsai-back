import AppError from '../helpers/AppError.js';
import { isMysqlError } from '../helpers/is-mysql-error.js';
import { generateRandomString } from '../helpers/string-utils.js';
import juryModel from '../models/jury.model.js';
import type Jury from '../types/interfaces/jury.interface.js';
import type { CreateJury } from '../types/schemas/create-jury.schema.js';
import authService from './auth.service.js';

const addJuries = async (juryRequest: CreateJury): Promise<number> => {
  try {
    const juries = juryRequest.juries;
    const juriesWithPass = await Promise.all(
      juries.map(async (jury) => {
        const password = generateRandomString(20);
        const hash = await authService.hashPassword(password);

        return [jury.email, jury.firstname, jury.lastname, hash];
      }),
    );
    return await juryModel.create(juriesWithPass);
  } catch (err) {
    if (isMysqlError(err) && err.errno === 1062) {
      const regex = /'([^']+)'/;
      const match = err.sqlMessage.match(regex);
      let email = '';
      if (match) {
        email = match[1] ?? '';
      }
      throw new AppError(409, 'Email already used', {
        field: 'email',
        value: email,
      });
    }
    throw err;
  }
};

const findAll = async (): Promise<Jury[]> => {
  return await juryModel.findAll();
};

const juryService = { addJuries, findAll };
export default juryService;
