export interface Address {
  id?: number;
  userId: number;
  fullName: string;
  phoneNumber: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
  addressType: 'Home' | 'Work';
  default?: boolean;
}
