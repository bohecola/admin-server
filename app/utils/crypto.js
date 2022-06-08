const CryptoJS = require('crypto-js');
const { passwordSecret } = require('../conf/secret');

exports.passwordEncryption = (val) => {
  return CryptoJS.HmacSHA256(val, passwordSecret).toString();
};