export const getInitials = (
  displayName: string | null,
  email: string | null
) => {
  if (displayName) {
    return displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return 'U';
};
