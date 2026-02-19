export default interface MySQLError extends Error {
  code: string;
  errno: number;
  sqlMessage: string;
  sqlState: string;
}
