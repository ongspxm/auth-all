/** libs/mail/index.js */
const users = require("./users.js");

module.exports = {
  // callback(), (email, pword)
  verifyPass: (email, pword) => (user.verifyPass(email, pword)
    .then(usr => usr ? usr : Promise.reject("lib/mail/index#verifyPass wrong combo"))
  ),
};
