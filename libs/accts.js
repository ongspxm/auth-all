/** libs/accts.js */
const crypto = require("crypto");
const dbase = require("./dbase.js");

function genHash(){
    return crypto.createHash("sha256")
    .update((new Date()).getTime()+""+Math.random()).digest("hex");
}

module.exports = {
    // callback(acct)
    getFbAcct: function(fb_id){
        var g_acct;

        return dbase.select("accts", "fb_id=?", [fb_id])
        .then(accts => {
            if(accts.length==1){ g_acct=accts[0]; return true; }
            return false; 
        })
        .then(exist => {
            if(!exist){ 
                return dbase.insert("accts", {fb_id: fb_id})
                .then(() => dbase.select("accts", "fb_id=?", [fb_id]))
                .then(accts => g_acct=accts[0]);
            }
        })
        .then(() => g_acct);
    },

    // callback(sites)
    getSites: function(acct_id){
        return db.select("sites", "acct_id=?", [acct_id]);
    },

    // callback(site)
    getSite: function(acct_id, site_id){
        db.select("sites", "site_id=?", [site_id])
        .then(sites => 
        return  
    },

    // callback(domainExist)
    validDomain: function(domain){ 
        return db.select("sites", "name=?", [domain])
        .then(sites => sites.length==0); 
    }
};
