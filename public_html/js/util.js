function $(id) {
    return document.getElementById(id);
}



function show(id) {
    $(id).style.display = 'block';
}

function hide(id) {
    $(id).style.display = 'none';
}

function toggle_visibility(id) {
    var e = $(id);
    if (e.style.display === 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
}


function linkOpenInNewWindow(href, innerHTML) {
    var a = link(href, innerHTML);
    a["target"] = "_blank";
    return a;
}

function link(href, innerHTML) {
    var a = document.createElement("a");
    a["href"] = href;
    a.innerHTML = innerHTML;
    return a;
}

function script(innerHtml) {
    var script = document.createElement('script');
    script.innerHTML = innerHtml;
    return script;
}
