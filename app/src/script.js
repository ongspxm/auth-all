/** model funcs **/
var TKN;

function loadJSON(url, fn){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function(){
        fn(JSON.parse(xhr.responseText));
    };

    xhr.setRequestHeader("Authorization", "Bearer "+TKN);
    xhr.send(null);
}

function getSites(){
    var results = document.getElementById("results"); 
    results.innerHTML = "loading... please wait...";

    loadJSON("/getSites", obj => {
        console.log(obj); 
    });
}

function addSite(domain){
    loadJSON("/addSite?domain="+domain, obj => {
        console.log(obj);     
    });
} 

/** view funcs **/
function $(id){
    return document.getElementById(id);
}

function $$(id){
    var div = document.createElement("div");
    div.id = id;
    return div; 
}

function $$$(className){
    var div = document.createElement("div");
    div.id = id;
}

/** controller funcs **/
function onload(){
    var loc = window.location;
    if(!loc.hash.startsWith("#access_token=")){
        return loc.assign("http://" + loc.host + "/signin");
    }

    TKN = loc.hash.split("access_token=")[1];
    getSites();
}

onload();
