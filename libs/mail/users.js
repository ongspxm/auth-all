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
    changePass: function(email, pass){
        var load = pass + process.env.APP_SC;
        var hash = crypto.createHash('sha256').update(load).digest("hex");

        return fns.getUser(email)
        .then(function(usr){
            if(!usr){ return Promise.reject("libs/mail/users#changePass no such user"); }

            usr.phash = hash;
            return dbase.update("mail_users", usr, "email=?", [usr.email]);
        });
    },

    // callback(ok)
    changeName: function(email, name){
        return dbase.update("mail_users", {name: name}, "email=?", [email]);
    },

    // callback(usr)
    verifyPass: function(email, pass){
        var load = pass + process.env.APP_SC;
        var hash = crypto.createHash('sha256').update(load).digest("hex");

        return fns.getUser(email)
        .then((usr) => usr.phash===hash ? usr : undefined);
    },

    // callback(ok)
    createAcct: function(email){
        var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        if(!email || !re.test(email)){
            return Promise.reject("libs/mail/users#createAcct email invalid format");
        }

        return fns.getUser(email)
        .then(function(usr){
            if(usr){ return Promise.reject("libs/mail/users#createAcct user already exist"); }

            return dbase.insert("mail_users", {
                email: email
            });
        });
    }
};

module.exports = fns;
