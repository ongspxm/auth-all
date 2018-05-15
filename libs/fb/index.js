/** libs/fb/index.js */
const fbapi = require("./api.js");
const users = require("./users.js");

module.exports = {
    // callback(URL), (callback_url, state)
    getURL: fbapi.getAuthURL,

    // callback({id, name, pic})
    getInfo: function(reqCode, callbackURL){
        var g_tkn, g_usr;

        return fbapi.getAccessToken(reqCode, callbackURL)
        .then(tkn => {
            g_tkn=tkn; return fbapi.getUserInfo(g_tkn);
        })
        .then(usr => {
            g_usr=usr; return fbapi.getUserPic(g_tkn); 
        }) 
        .then(pic => {
            g_usr.pic = pic;
            return g_usr; 
        })
        .then(() => g_usr);
    }
};
