export default interface Newsletter {
  id: number;
  object: string;
  content: string;
  sendAt: Date | null;
  sent: boolean;
}
