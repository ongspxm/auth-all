/** libs/mail/users.js */
const crypto = require("crypto");

const dbase = require("../dbase.js");

fns = {
    // callback(usr)
    getUser: function(email){
        var g_usr = null;

        return dbase.select("mail_users", "email=?", [email])
        .then((usrs) => {
            if(usrs.length==1){ g_usr=usrs[0]; }
        })
        .then(() => g_usr);
    },

    // callback(ok)
    updateUser: function(usr){
        if(!usr.email){
            return Promise.reject("libs/mail/users#updateUser no idx found");
        }

        // create if not exist
        return fns.getUser(usr.email)
        .then(dbase.update("mail_users", usr, "email=?", [usr.email]))
        .then(() => true);
    },

    // callback(ok)
    changePass: function(email, pass){
        var load = pass + process.env.APP_SC;
        var hash = crypto.createHash('sha256').update(load).digest("hex");

        return fns.getUser(email)
        .then(function(usr){
            if(!usr){ return Promise.reject("libs/mail/users#changePass no such user"); }

            usr.phash = hash;
            return db.updateUser(usr);
        });
    }
};

module.exports = fns;
