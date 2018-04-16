/** fb/user.js */
var fb_url = endpt => "https://graph.facebook.com/v2.12"+endpt;
var fb_auth = "https://www.facebook.com/v2.12/dialog/oauth?";
var fb_auth2 = "https://graph.facebook.com/v2.12/oauth/access_token?";

function getAuthURL(opt){
    // redirect to fb
    // TODO: track state
    return Promise.resolve().then(() => fb_auth+qstring.stringify(opt));
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
            body.picture = fb_url("/"+body.id+"/picture?type=large");
            res(body); 
        });
    });
}
