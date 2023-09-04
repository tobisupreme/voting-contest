export const passwordPattern = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])',
);

export const passwordMessage =
  'Password must be atleast 6 characters long, contain at least 1 number, 1 uppercase character, 1 lowercase character, 1 special character';
