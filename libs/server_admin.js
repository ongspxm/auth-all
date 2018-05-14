/* libs/server_admin.js */
const jwt = require("jwt-simple");

const accts = require("./accts.js");
const service = require("./service.js"); 

function getAcct(reqTkn){
    return Promise.resolve()
    .then(() => jwt.decode(reqTkn, process.env.APP_SC))
    .then(tkn => accts.getFbAcct(tkn.sub));
}

function formatSite(site){
    return {
        id: site.id,
        secret: site.secret,
        domain: site.domain
    };
}

module.exports = {
    // callback(fbUrl)
    signin: function(url){
        return service.fbIntiate(process.env.APP_ID, url);
    },
    
    // callback(site{id, sct, domain}) 
    addSite: function(reqTkn, domain){
        return Promise.resolve()
        .then(() => getAcct(reqTkn))
        .then(acct => accts.addSite(acct.id, domain))
        .then(site => formatSite(site)); 
    },

    // callback(site[])
    getSites: function(reqTkn){
        return Promise.resolve()
        .then(() => getAcct(reqTkn))
        .then(acct => accts.getSites(acct.id))
        .then(sites => sites.map(formatSite)) 
    }
};
