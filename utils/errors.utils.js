const errors = {
  invalidEmail: {
    errorMessage: "Invalid email address. Please enter a valid email address."
  },
  duplicateUsername: {
    errorMessage: "Username already exists. Please provide a different username.",
  },
  duplicateEmail: {
    errorMessage: "Email already exists. Please provide a different email.",
  },
  termsNotAccepted: {
    errorMessage: "You must accept the terms and conditions to sign up.",
  },
  weakPassword: {
    errorMessage: "Password needs to have at least 6 characters, one number, one lowercase, and one uppercase letter.",
  },
  mandatorySignupFieldsMissing: {
    errorMessage: "All fields are mandatory. Please provide your username, email, and password.",
  },
  mandatorySigninieldsMissing: {
    errorMessage: "All fields are mandatory. Please provide your email and password.",
  },
  userNotFound: {
    errorMessage: "Username not found. Either provide a valid username or sign up for an account.",
  },
  wrongPassword: {
    errorMessage: "Incorrect password. Please try again.",
  },
  error500: {
    errorMessage: "Internal Server Error"
  }
};

module.exports = errors