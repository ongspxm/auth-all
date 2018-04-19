/** libs/fb/index.js */
const jwt = require("jwt-simple");

const api = require("./api.js");
const users = require("./users.js");

// 1 day in ms
var expiry = 24*60*60*1000;

module.exports = {
    getURL: function(){
        // TODO fingerprinting devices
        return api.getAuthURL();
    },

    getTkn: function(reqTkn){
        var g_tkn, g_usr;
        api.getAccessToken(reqTkn)
        .then(tkn => {
            g_tkn=tkn; return api.getUserInfo(g_tkn);
        })
        .then(usr => {
            g_usr=usr; return api.getUserPic(g_tkn); 
        }) 
        .then(url => {
            g_usr.dpic = url;
            return g_usr; 
        })
        .then(usr => { 
            // TODO set aud to acc's domain
            var d = (new Date());

            return {
                aud: "",
                sub: "fb_"+usr.id,
                iat: d.getTime(),
                exp: d.getTime()+expiry 
            };
        })
        .then(payload => {});
    }
};
