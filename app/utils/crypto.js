const CryptoJS = require('crypto-js');

exports.passwordEncryption = (val) => {
  return CryptoJS.SHA256(val).toString();
};