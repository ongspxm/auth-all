/** libs/fb/api.js */
const request = require("request");
const qstring = require("querystring");

const imgur = require("../imgur.js");
const users = require("./users.js");

var fb_url = endpt => "https://graph.facebook.com/v2.12"+endpt;
var fb_auth = "https://www.facebook.com/v2.12/dialog/oauth?";
var fb_auth2 = "https://graph.facebook.com/v2.12/oauth/access_token?";

var getOpt = () => {return { 
    client_id: process.env.FB_APP_ID,
    client_secret: process.env.FB_APP_SC
};};
 
function callAPI(token, endpt){
    return new Promise((res, err) => {
        request.get(fb_url(endpt), 
        {auth:{bearer:token}, json:true}, (error, result, body) => {
            if(body.error){ return err("fb/api "+body.error.message); }
            res(body); 
        });
    });
}

module.exports = {
    // callback(authURL)
    getAuthURL: function(callback){
        if(!callback){
            return Promise.reject("fb/api#getAuthURL callback url not provided");
        }
        if(!callback.startsWith("https://")){
            return Promise.reject("fb/api#getAuthURL only https callbacks allowed");
        }

        var opt = getOpt();
        opt["redirect_uri"] = callback;

        return Promise.resolve().then(() => fb_auth+qstring.stringify(this.opt));
    },
    
    // callback(accessTkn)
    getAccessToken: function(code){ 
        var opt = getOpt(); 
        opt["code"] = code; 

        return new Promise((res, err) => { 
            request(fb_auth2+qstring.stringify(opt), 
            {json:true}, (error, result, body) => { 
                if(body.error){ return err(body.error.message); }
                res(body.access_token);
            }); 
        });
    },

    // callback(userInfo)
    getUserInfo: function(accessTkn){
        return callAPI(accessTkn, "/me?fields?id,name");
    },

    // callback(imgurURL)
    getUserPic: function(token, fb_id){ 
        var g_img, g_usr, g_url;

        return Promise.resolve()
        .then(() => {
            if(!fb_id){
                return callAPI(token, "/me?fields=id").then((obj) => fb_id=obj.id);
            }
        })
        .then(() => users.getUser(fb_id).then(usr => g_usr=usr))
        .then(() => callAPI(token, "/me/picture?type=large&fields=cache_key,url"))
        .then((img) => g_img=img)
        .then(() => g_img.cache_key==g_usr.dpic_cache)
        .then((same) => {
            if(same){ return imgur.getURL(g_usr.imgur_id); }

            var g_img2;
            return imgur.upload(g_img.url)
            .then(img => g_img2=img)
            .then(() => users.updateUser({
                id: fb_id,
                imgur_id: g_img2.id, 
                dpic_cache: g_img2.cache_key 
            }))
            .then(() => g_img2.url);
        });
    }
};
