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
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200)
                success(request.responseText);
            else if (failure)
                failure(request.status, request.statusText);
        }
    };
    request.send(null);
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

function stripHTMLWithRegex(htmlText) {
    var result = htmlText.replace(/<img.*>/g, "");
    result = result.replace(/<p>/g, "");
    result = result.replace(/<\/p>/g, "");
    result = result.replace(/<ul>/g, "");
    result = result.replace(/<\/ul>/g, "");
    result = result.replace(/<\li>/g, "");
    result = result.replace(/<\/li>/g, "");
    result = result.replace(/<div>/g, "");
    result = result.replace(/<\/div>/g, "");
    result = result.replace(/<strong>/g, "");
    result = result.replace(/<\/strong>/g, "");
    result = result.replace(/<em>/g, "");
    result = result.replace(/<\/em>/g, "");
    result = result.replace(/<br>/g, "");
    result = result.replace(/<b>/g, "");
    result = result.replace(/<\/b>/g, "");
    result = result.replace(/<i>/g, "");
    result = result.replace(/<\/i>/g, "");
    result = result.replace(/<button>/g, "");
    result = result.replace(/<\/button>/g, "");
//    var result = result.replace(/<a.*<\/a>/g, "");
//    var result = result.replace(/<a.*>/g, "");
    return result;
}

function stripHTML(htmlText) {
    var div = document.createElement("div");
    div.innerHTML = htmlText;
    var text = div.textContent || div.innerText || "";
    text = stripHTMLWithRegex(text);
    return text;
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

function isEmpty(map) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function show(element) {
    element.style.display = 'block';
}

function hide(element) {
    element.style.display = 'none';
}

function removeNode(element) {
	 element.parentNode.removeChild(element);
}

function toggle_visibility(e) {
    if (e.style.display === 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function setNodeAttribute(node, attribute, value) {
    if (attribute === "class")
        node.className = value;
    else if (attribute === "checked")
        node.defaultChecked = value;
    else if (attribute === "for")
        node.htmlFor = value;
    else if (attribute === "style")
        node.style.cssText = value;
    else
        node.setAttribute(attribute, value);
}


function dom(name, attributes) {
    var node = document.createElement(name);

    if (attributes) {
        for (var property in attributes) {
            setNodeAttribute(node, property, attributes[property]);
        }
    }

    for (var i = 2; i < arguments.length; i++) {
        var child = arguments[i];
        if (typeof child === "string")
            child = document.createTextNode(child);
        node.appendChild(child);
    }
    return node;
}