import type MySQLError from '../types/interfaces/mysql-error.interface.js';

export const isMysqlError = (err: unknown): err is MySQLError => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'errno' in err &&
    'code' in err &&
    'sqlMessage' in err &&
    'sqlState' in err
  );
};
