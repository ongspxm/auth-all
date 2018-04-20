/** libs/accts.js */
const crypto = require("crypto");
const dbase = require("./dbase.js");

function genHash(){
    return crypto.createHash("sha256")
    .update((new Date()).getTime()+""+Math.random()).digest("hex");
}

fns = {
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

    // callback(acct)
    getAcct: function(acct_id){
        return dbase.select("accts", "id=?", [acct_id])
        .then(accts => {
            if(accts.length==1){ return accts[0]; }
            else{ return Promise.reject(); }
        })
        .catch(() => Promise.reject("libs/accts#getAcct id doesnt exist"));
    },

    // callback(site)
    addSite: function(acct_id, domain){
        var g_site;

        return fns.validDomain(domain)
        .then(valid => {
            if(!valid) return Promise.reject("libs/accts#addSite domain taken");
        })
        .then(() => fns.getAcct(acct_id))
        .then(acct => g_site={ 
            acct_id: acct_id,
            hash: genHash(), 
            domain: domain
        })
        .then(() => dbase.insert("sites", g_site))
        .then(() => g_site);
    },

    // callback(site)
    getSite: function(domain){
        return dbase.select("sites", "domain=?", [domain]) 
        .then(sites => {
            if(sites.length!=1){ 
                return Promise.reject("libs/accts#getSite domain doesnt exist");
            }
            return sites[0];
        });
    },

    // callback(sites)
    getSites: function(acct_id){
        return dbase.select("sites", "acct_id=?", [acct_id]);
    },

    // callback(domainExist)
    validDomain: function(domain){ 
        return dbase.select("sites", "domain=?", [domain])
        .then(sites => sites.length==0); 
    }
};

module.exports = fns;
