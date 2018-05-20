/* libs/accts.js */
const crypto = require("crypto");
const dbase = require("./dbase.js");

function genHash(text){
    return crypto.createHash("sha256")
    .update((new Date()).getTime()+""+Math.random()+""+text).digest("hex");
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

        return this.validDomain(domain)
        .then(valid => {
            if(!valid) return Promise.reject("libs/accts#addSite domain taken");
        })
        .then(() => this.getAcct(acct_id))
        .then(acct => g_site={ 
            acct_id: acct.id,
            id: genHash(domain),
            secret: genHash(), 
            domain: domain
        })
        .then(() => dbase.insert("sites", g_site))
        .then(() => g_site);
    },

    // callback(true)
    delSite: function(acct_id, site_id, site_secret){
        var qry = "id=? AND acct_id=? AND secret=?"; 
        var opt = [site_id, acct_id, site_secret];
        return dbase.select("sites", qry, opt) 
        .then(sites => {
            if(sites.length!=1){ 
                return Promise.reject("libs/accts#delSite domain doesnt exist");
            }
        })
        .then(() => dbase.delete("sites", qry, opt));
    },

    // callback(site)
    getSite: function(id){
        return dbase.select("sites", "id=?", [id]) 
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
        if(!domain){ return Promise.resolve().then(() => false); }

        return dbase.select("sites", "domain=?", [domain])
        .then(sites => sites.length==0); 
    }
};

module.exports = fns;
