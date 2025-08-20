import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email')
    .required('Email is required')
    .test('is-valid-email', 'Enter correct email', value => {
      if (!value) return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }),
  password: yup
    .string()
    .min(6, 'There is minimum 6 symbols')
    .required('Password is requires'),
});

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email('Input valid email')
    .required('Email is required')
    .test('is-valid-email', 'Enter correct email', value => {
      if (!value) return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }),
  password: yup
    .string()
    .min(8, 'There is minimum 8 symbols')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'The password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});
