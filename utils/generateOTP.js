const otpGenerator = require("otp-generator");

const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    // default is true: so we need to set 'false' to all unnecessary options
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

module.exports = generateOTP;
