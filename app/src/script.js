/** model funcs **/
var TKN;

function loadJSON(url, fn, fn2){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function(){
        if(xhr.status==200){
            fn(JSON.parse(xhr.responseText));
        }else if(fn2){
            fn2(xhr.responseText);
        }
    };

    xhr.setRequestHeader("Authorization", "Bearer "+TKN);
    xhr.send(null);
}

function getSites(){
    var results = document.getElementById("results"); 
    results.innerHTML = "loading... please wait...";

    loadJSON("/getSites", obj => showSites(obj));
}

function addSite(){
    loadJSON("/addSite?domain="+$("domain").value,
        () => getSites(),
        () => alert("woah, domain exist") 
    );
    $("domain").value = "";
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
    div.className = className;
    return div;
}

function showSites(sites){
    var table = $$("table");

    for(var i in sites){
        var site = sites[i];
        var row = $$$("row");
        
        var fields = "domain id secret".split(" ");
        for(var j in fields){
            var div = $$$(fields[j]+" cell");
            div.innerText = site[fields[j]];
            row.appendChild(div);
        }

        var btn = document.createElement("button");
        btn.innerHTML = "regenerate secret";
        row.appendChild(btn);
        table.appendChild(row);
    }

    if(sites.length==0){
        var row = $$$("full");
        row.innerHTML = "no site yet";
        table.appendChild(row);
    }

    $("results").innerHTML = "";
    $("results").appendChild(table);
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
