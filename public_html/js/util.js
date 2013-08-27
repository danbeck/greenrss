if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable
            // function
            throw new TypeError(
                    "Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
        }, fBound = function() {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

function getHttpRequest(url, success, failure) {
    var request = makeHttpObject();
    request.open("GET", url, true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200)
                success(request.responseText);
            else if (failure)
                failure(request.status, request.statusText);
        }
    };
}

function postUrlEncodedHttpRequest(url, postDataUrl, success, failure) {
    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;');
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200)
                success(request.responseText);
            else if (failure)
                failure(request.status, request.statusText);
        }
    };
    request.send(postDataUrl);
}

function $(id) {
    return document.getElementById(id);
}

function isDisplayed(element) {
    if (!element.style)
        return true;
    if (element.style.display !== 'none')
        return true;

    return false;
}

function show(element) {
    element.style.display = 'block';
}

function hide(element) {
    element.style.display = 'none';
}

function toggle_visibility(e) {
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

function createLi(element) {
    var li = document.createElement("li");
    li.appendChild(element);
    return li;
}

function createP(innnerHTML) {
    var p = document.createElement("p");
    p.innerHTML = innnerHTML;
    return p;
}