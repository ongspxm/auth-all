/** libs/fb/users.js */
const dbase = require("../dbase.js");

module.exports = {
    // callback(usr)
    getUser: id => {
        // if usr doesn't exist, create it
        var g_usr;

        return dbase.select("fb_users", "id=?", [id]) 
        .then((usrs) => {
            if(usrs.length==1){ g_usr=usr[0]; return true; }
            return false;
        })
        .then((exist) => {
            if(!exist){ 
                g_usr = { id: g_id };
                return dbase.insert("fb_users", g_usr); 
            }
        })
        .then(() => g_usr);
    }
};
