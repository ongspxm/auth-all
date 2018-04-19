/** libs/fb/api.js */
const request = require("request");
const qstring = require("querystring");

const imgur = require("../imgur.js");
const users = require("./users.js");

var fb_url = endpt => "https://graph.facebook.com/v2.12"+endpt;
var fb_auth = "https://www.facebook.com/v2.12/dialog/oauth?";
var fb_auth2 = "https://graph.facebook.com/v2.12/oauth/access_token?";

var opt = { 
    client_id: process.env.FB_APP_ID,
    client_secret: process.env.FB_APP_SC,
    redirect_uri: "https://"+process.env.HOST+"/fb";
};
 
function callAPI(token, endpt){
    return new Promise((res, err) => {
        request.get(fb_url(endpt), 
        {auth:{bearer:token}, json:true}, (error, result, body) => {
            if(error){ return err(error); }
            res(body); 
        });
    });
}

module.exports = {
    // callback(authURL)
    getAuthURL: function(){
        // TODO: track state (which user, what client fingerprint)
        return Promise.resolve().then(() => fb_auth+qstring.stringify(this.opt));
    }
    
    // callback(accessTkn)
    getAccessToken: function(code){ 
        this.opt["code"] = code; 

        return new Promise((res, err) => { 
            request(fb_auth2+qstring.stringify(opt), 
            {json:true}, (error, result, body) => { 
                if(error){ return err(); }
                res(body.access_token);
            }); 
        });
    }

    // callback(userInfo)
    getUserInfo: function(token){
        return Promise.resolve()
            .then(() => callAPI(token, "/me"));
    }

    // callback(imgurURL)
    getUserPic: function(token, g_id){ 
        var g_img, g_usr, g_url;

        return Promise.resolve()
        .then(() => {
            if(!g_id){
                callAPI(token, "/me?fields=id").then((obj) => g_id=obj.id);
            }
        })
        .then(() => users.getUser(g_id).then(usr => g_usr=usr))
        .then(() => callAPI(token, "/me/picture?type=large&fields=cache_key,url"))
        .then((img) => g_img=img)
        .then(() => g_img.cache_key==g_usr.dpic_cache)
        .then((same) => {
            if(same){ return imgur.getUrl(g_usr.imgur_id); }

            var g_img2;
            return imgur.upload(g_img.url)
            .then(img => g_img2=img)
            .then(() => users.updateUser({
                id: g_id,
                imgur_id: g_img2.id, 
                dpic_cache: g_img2.cache_key 
            }))
            .then(() => g_img2.url);
        });
    }
};
