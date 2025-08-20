import { getPasswordStrength } from '../../utils/authUtils';

type PasswordStengthProps = {
  password: string;
};

export const PasswordStrengthIndicator: React.FC<PasswordStengthProps> = ({
  password,
}) => {
  const { strength, label } = getPasswordStrength(password);

  if (!password) {
    return null;
  }

  let strengthClass = '';
  if (strength <= 2) {
    strengthClass = 'password-weak';
  } else if (strength <= 4) {
    strengthClass = 'password-medium';
  } else {
    strengthClass = 'password-strong';
  }

  return (
    <span className={`password-strength ${strengthClass}`}>
      Password strength: {label}
    </span>
  );
};
