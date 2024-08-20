/* eslint-disable @typescript-eslint/no-unused-vars */
export function validateEmail(email) {
  if (!email) return 'Email is required';

  const isValidEmail = /^\S+@\S+$/g;
  if (!isValidEmail.test(email)) {
    return 'Please enter a valid email';
  }

  return '';
}

export function validateEmailOrUsername(str) {
  if (!str) return 'Email or username is required';
  return '';
}

export function validatePassword(password, minlength) {
  if (!password) return 'Password is required';

  if (password.length < minlength) {
    return `Please enter a password that's at least ${minlength} characters long`;
  }

  //   const hasCapitalLetter = /[A-Z]/g;
  //   if (!hasCapitalLetter.test(password)) {
  //     return 'Please use at least one capital letter.';
  //   }

  //   const hasNumber = /\d/g;
  //   if (!hasNumber.test(password)) {
  //     return 'Please use at least one number.';
  //   }

  return '';
}

export function validateUsername(username) {
  if (!username) {
    return 'Username is required';
  }

  const isValidEmail = /^\S+@\S+$/g;
  if (isValidEmail.test(username)) {
    return 'Username cannot be in the form of an email address';
  }

  return '';
}

export function validateFirstName(firstname) {
  if (!firstname) {
    return 'First name is required';
  }
  return '';
}

export function validateLastName(lastname) {
  if (!lastname) {
    return 'Last name is required';
  }
  return '';
}
