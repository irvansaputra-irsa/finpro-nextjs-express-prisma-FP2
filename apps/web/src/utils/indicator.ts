import { IUser } from '@/context/Auth';

const displayStatusIndicator = (
  type: 'PROCESSED' | 'COMPLETED' | 'REJECTED' | 'CANCELED',
) => {
  if (type === 'PROCESSED') {
    return 'gray.600';
  }
  if (type === 'COMPLETED') {
    return 'green';
  }
  if (type === 'REJECTED') {
    return 'red';
  }
  return '#FFC94A';
};

const checkSuperAdmin = (user: IUser | null) => {
  if (user) {
    return user?.role.toLowerCase() === 'super admin';
  }
  return false;
};

export { displayStatusIndicator, checkSuperAdmin };
