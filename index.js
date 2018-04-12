/** index.js */

const express = require("express");
const request = require("request");
const qstring = require("querystring");

var app = express();

var fb_url = endpt => "https://graph.facebook.com/v2.12"+endpt;
var fb_auth = "https://www.facebook.com/v2.12/dialog/oauth?";
var fb_auth2 = "https://graph.facebook.com/v2.12/oauth/access_token?";

function getAuthURL(){
    // redirect to fb
    // TODO: track state
    return new Promise.resolve().then(() => fb_auth+qstring.stringify(opt));
}

function getAccessToken(code, opt){ 
    opt["code"] = code; 

    return new Promise((res, err) => { 
        request(fb_auth2+qstring.stringify(opt), 
        {json:true}, (error, result, body) => { 
            if(error){ return err(); }
            res(body.access_token);
        }); 
    });
}

function getUserInfo(token){
    return new Promise((res, err) => {
        request.get(fb_url("/me"), 
        {auth:{bearer:token}, json:true}, (error, result, body) => {
            if(error){ return err(); }
            res(body); 
        });
    });
}

app.get("/fba", function(req, res){
    var query = req.query;
    var opt = {
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SC,
        redirect_uri: "https://"+req.headers.host+"/fb"
    };

    if (!query.code){ 
        return getAuthUrl().then((url) => res.redirect(307, url));
    }
    
    getAccessToken(query.code, opt)
    .then(tkn => getUserInfo(tkn))
    .then(info => res.send(info));
});

var listener = app.listen(3000, function(){
    console.log("running on port "+listener.address().port);
});
