export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Manager' | 'Customer' | 'Auditor';
  token?: string;
}
