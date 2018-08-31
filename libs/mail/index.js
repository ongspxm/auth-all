/** libs/mail/index.js */
const users = require("./users.js");

module.exports = {
  // callback()
  verifyPass: (email, pword) => (user.verifyPass(email, pword)
    .then(usr => usr ? usr : Promise.reject(
      new Error("lib/mail/index#verifyPass wrong combo")
    ))
  ),

  // callback(tempPword)
  createAcct: (email) => {
    const pword = Math.random().toString().slice(2,);

    return mail.createAcct(email)
      .then(() => mail.changePass(email, pword))
      .then(() => pword);
  },
};
