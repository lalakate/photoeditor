export const getUsernameFromEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const username = email.split('@')[0];

  return username;
};
