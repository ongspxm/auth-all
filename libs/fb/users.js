/** libs/fb/users.js */
const dbase = require("../dbase.js");

fns = {
    // callback(usr)
    getUser: function(id){
        // if usr doesn't exist, create it
        var g_usr;

        return dbase.select("fb_users", "id=?", [id]) 
        .then((usrs) => {
            if(usrs.length==1){ g_usr=usrs[0]; return true; }
            return false;
        })
        .then((exist) => {
            if(!exist){ 
                g_usr = { id: id };
                return dbase.insert("fb_users", g_usr); 
            }
        })
        .then(() => g_usr);
    },

    // callback(ok)
    updateUser: function(usr){
        if(!usr.id){ 
            return Promise.reject("libs/fb/users#updateUser no idx found"); 
        }

        // create is not exist 
        return fns.getUser(usr.id)
        .then(dbase.update("fb_users", usr, "id=?", [usr.id]))
        .then(() => true);
    }
};

module.exports = fns;
