/** libs/fb/api.js */
const request = require("request");
const qstring = require("querystring");

const imgur = require("../imgur.js");

var fb_url = endpt => "https://graph.facebook.com/v2.12"+endpt;
var fb_auth = "https://www.facebook.com/v2.12/dialog/oauth?";
var fb_auth2 = "https://graph.facebook.com/v2.12/oauth/access_token?";

class API {
    var opt = { 
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SC,
    };
    
    constructor(host){
        this.opt["redirect_uri"] = "https://"+host+"/fb";
    }

    // callback(authURL)
    getAuthURL(){
        // TODO: track state (which user, what client fingerprint)
        return Promise.resolve().then(() => fb_auth+qstring.stringify(this.opt));
    }
    
    // callback(accessTkn)
    getAccessToken(code){ 
        this.opt["code"] = code; 

        return new Promise((res, err) => { 
            request(fb_auth2+qstring.stringify(opt), 
            {json:true}, (error, result, body) => { 
                if(error){ return err(); }
                res(body.access_token);
            }); 
        });
    }
    
    callAPI(token, endpt){
        return new Promise((res, err) => {
            request.get(fb_url(endpt), 
            {auth:{bearer:token}, json:true}, (error, result, body) => {
                if(error){ return err(error); }
                res(body); 
            });
        });
    }

    // callback(userInfo)
    getUserInfo(token){
        return Promise.resolve()
            .then(() => callAPI(token, "/me"));
    }

    // callback(imgurURL)
    getUserPic(token){
        // TODO: check if dbase exist (how to update img)
        // TODO: imugur
        return Promise.resolve()
            .then(() => callAPI(token, "/me/picture?type=large&fields=cache_key,url"));
    }
};

module.exports = API;
