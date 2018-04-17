/** libs/imgur.js */
const request = require("request");
const qstring = require("querystring");

const dbase = require("../libs/dbase.js");
var api_url = endpt=>"https://api.imgur.com/3"+endpt;

function uploadImg(data){ 
    // callback({link, delHash})
    var opts = {
        url: api_url("/image"),
        json: true,
        headers:{
            "Authorization": "Client-ID "+process.env.IMGUR_APP_ID
        },
        json:{
            image: data
        }
    };

    return (new Promise((res, err) => {
        request.post(opts, (error, result, body) => {
            if(error){ return err(error); }
            
            var img = {
                id: body.data.id,
                link: body.data.link,
                delHash: body.data.deletehash
            };

            dbase.insert("imgurs", img)
            .then(() => res(img));
        });
    }));
}

module.exports = uploadImg;
