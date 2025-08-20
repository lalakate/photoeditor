export const getUsernameFromEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const username = email.split('@')[0];

  return username;
};

export const getPasswordStrength = (
  password: string
): { strength: number; label: string } => {
  if (!password) return { strength: 0, label: '' };

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  let label = '';
  if (strength <= 2) {
    label = 'weak';
  } else if (strength <= 4) {
    label = 'medium';
  } else {
    label = 'hard';
  }

  return { strength, label };
};
