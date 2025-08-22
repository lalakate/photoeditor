import { browserLocalPersistence, setPersistence } from 'firebase/auth';
import { auth } from './firebaseConfig';

export const initAuthPersistence = async () => {
  await setPersistence(auth, browserLocalPersistence);
};
