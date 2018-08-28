/** libs/service.js */
const crypto = require("crypto");
const jwt = require("jwt-simple");
const dbase = require("./dbase.js");

const fb = require("./fb");
const mail = require("./mail");
const accts = require("./accts.js");
const imgur = require("./imgur.js");

var genHash = txt => crypto.createHash("sha256")
  .update(txt+""+Math.random()).digest("hex");
var callbackURL = "https://"+process.env.HOST+"/fb";

// 3 days expiry
var expiry = 3*24*60*60*1000;
var getTkn = (secret, obj = {}) => {
  var d = (new Date()).getTime();
  obj.iat = d;
  obj.exp = d+expiry;
  obj.src = 'authall';

  return jwt.encode(obj, secret);
};

module.exports = {
  // callback(url) their own app
  mailLogin: function(clientId, cbUrl, email, pass){
    if(!cbUrl){
      return Promise.reject("libs/service#mailLogin callback url not provided");
    }
    if(!cbUrl.startsWith("http")){
      return Promise.reject("libs/service#mailLogin only https allowed");
    }

    let g_site;
    return accts.getSite(clientId)
      .then(site => g_site=site)
      .then(() => mail.verifyPass(email, pass))
      .then(usr => getTkn(g_site.secret, {
        iss: g_site.domain,
        sub: `mail_${usr.email}`,
        pic: imgur.getUrl(usr.imgur_id),
      }))
      .then(tkn => `${cbUrl}#access_token=${tkn}`);
  },

  // callback(url)
  fbIntiate: function(clientId, cbUrl){
    if(!cbUrl){
      return Promise.reject("libs/service#fbInitiate callback url not provided");
    }
    if(!cbUrl.startsWith("http")){
      return Promise.reject("libs/service#fbInitiate only https allowed");
    }

    var g_site, g_hash=genHash(clientId);

    return accts.getSite(clientId)
      .then(site => g_site=site)
      .then(() => {
        // TODO check url is valid callback
        return dbase.insert("signins", {
          hash: g_hash,
          site_id: clientId,
          callback: cbUrl
        });
      })
      .then(() => fb.getURL(callbackURL, g_hash));
  },

  // callback(url) their own app
  fbComplete: function(reqCode, state){
    var g_signin, g_usr, g_site;

    return dbase.select("signins", "hash=?", [state])
      .then(signins => {
        if(signins.length!=1){
          return Promise.reject("libs/service#fbComplete no sign in found");
        }

        g_signin = signins[0];
      })
      .then(() => fb.getInfo(reqCode, callbackURL))
      .then(usr => g_usr=usr)
      .then(() => accts.getSite(g_signin.site_id))
      .then(site => getTkn(site.secret, {
        iss: site.domain,
        sub: 'fb_'+g_usr.id,
        pic: g_usr.pic
      }))
      .then(tkn => g_signin.callback+"#access_token="+tkn);
  }
};
