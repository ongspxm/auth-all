/** libs/imgur.js */
const request = require("request");
const qstring = require("querystring");

var api_url = endpt->"https://api.imgur.com/3"+endpt;

function uploadImg(data){ 
    // callback({link, delHash})
    var opts = {
        url: api_url("/image"),
        json: true,
        headers:{
            "Authorization": "Client-ID "+process.env.IMGUR_APP_ID;
        }
    };

    return new Promise((res, err) -> {opts, (error, result, body) => {
            if(error){ return err(error); }
            res({
                link: body.data.link,
                delHash: body.data.deletehash
            }); 
        });
    }); 
}

module.exports = uploadImg;
