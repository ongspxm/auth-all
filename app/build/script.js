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

function delSite(domain, siteid, secret){
    if(window.confirm("confirm delete site " + domain + "?")){
        loadJSON("/delSite?site=" + siteid + "&secret=" + secret, 
            () => getSites(), 
            () => alert("doesn't seem to work")
        );
    }
}

function genSecret(domain, siteid, secret){
    if(window.confirm("generate new secret for " + domain + "?")){
        loadJSON("/genSecret?site=" + siteid + "&secret=" + secret, 
            () => getSites(), 
            () => alert("doesn't seem to work")
        );
    }
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
        table.appendChild(row);

        var fields = "domain id secret".split(" ");
        for(var j in fields){
            var div = $$$(fields[j]+" cell");
            div.innerText = site[fields[j]];
            row.appendChild(div);
        }

        var row2 = $$$("btns");
        row.appendChild(row2);

        var btn = document.createElement("button");
        var cmd = "genSecret('"+site.domain+"','"+site.id+"','"+site.secret+"');";
        btn.className = "btn--regen";
        btn.innerHTML = "regenerate secret";
        btn.setAttribute("onclick", cmd);
        row2.appendChild(btn);

        var btn2 = document.createElement("button");
        var cmd2 = "delSite('"+site.domain+"','"+site.id+"','"+site.secret+"');";
        btn2.className = "btn--delete";
        btn2.innerHTML = "delete site";
        btn2.setAttribute("onclick", cmd2);
        row2.appendChild(btn2);
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
