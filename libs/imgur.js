/** libs/imgur.js */
const request = require("request");
const qstring = require("querystring");

const dbase = require("./dbase.js");
var api_url = endpt=>"https://api.imgur.com/3"+endpt;

module.exports = {
    getURL: function(id){
        return dbase.select("imgurs", "id=?", [id])
        .then((imgs) => {
            if(imgs.length==1){ return imgs[0].url; }
            throw "libs/imgur#getUrl() unable to find image";
        });
    },

    upload: function(data){ 
        // callback({id, url, delHash})
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
                if(!body.success){ return err(body.data.error); }

                var img = {
                    id: body.data.id,
                    url: body.data.link,
                    delHash: body.data.deletehash
                };
                
                dbase.insert("imgurs", img)
                .then(() => res(img));
            });
        }));
    },

    delete: function(id){ 
        // callback()
        return dbase.select("imgurs", "id=?", [id])
        .then((imgs) => {
            if(imgs.length<1){
                return Promise.resolve();
            }

            var opts = {
                url: api_url("/image/"+imgs[0].delHash),
                json: true,
                headers:{
                    "Authorization": "Client-ID "+process.env.IMGUR_APP_ID
                }
            };

            return (new Promise((res, err) => {
                request.delete(opts, (error, result, body) => { 
                    if(error){ return err(error); }
                    if(!body.success){ return err(body.data.error); }

                    dbase.delete("imgurs", "id=?", [id]).then(() => res());
                });
            }));
        });
    }
};
