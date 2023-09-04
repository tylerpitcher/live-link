function hasPasswordLength(str) {
  return str.length >= 8;
}

function hasUppercase(str) {
  return /[A-Z]/.test(str);
}

function hasLowercase(str) {
  return /[a-z]/.test(str);
}

function hasNum(str) {
  return /[0-9]/.test(str);
}

function hasSpecialChar(str) {
  return /[@$!%*?&]/.test(str);
}

module.exports = {
  hasPasswordLength,
  hasUppercase,
  hasLowercase,
  hasNum,
  hasSpecialChar,
};