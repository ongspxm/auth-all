/** libs/mailgun.js */
const request = require('request');

const API_URL = `https://api.mailgun.net/v3/mg.${process.env.MG_DOMAIN}`;
const API_KEY = process.env.MG_API_KEY;

module.exports = function sendMail(msg) {
  if (!API_KEY) {
    return Promise.reject('libs/mailgun#sendMail API key not found');
  }

  if (!msg.from || !msg.to || !msg.subject || !msg.text) {
    return Promise.reject('libs/mailgun#sendMail message invalid format');
  }

  return new Promise((resolve) => {
    request.post({
      form: msg,
      method: 'POST',
      baseUrl: API_URL,
      uri: '/messages',
      auth: {
        user: 'api',
        pass: API_KEY,
      },
    }, (err, res, body) => {
      resolve(body);
    });
  });
};
