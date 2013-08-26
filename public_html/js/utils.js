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




Gui.prototype.reload = function() {
};
Gui.prototype.openConfigurePage = function() {

    var returnValue = {useTheOldReader: false, useNightMode: false};
    var backButton = document.querySelector("li a[data-role=\"back\"]");

    var backButtonEventListener = function() {

    };
    backButton.addEventListener("click", backButtonEventListener);

    var theoldreader_username;
    var theoldreader_password;

//this.UI.too
    UI.button('configureButton').click(function() {

        UI.popover(this, "configurePopover").toggle();
        var li = document.getElementById('extendConfigurationMenuItem');

        li.onclick = function() {
            UI.popover(this, "configurePopover").toggle();
            var configurePopover = document.getElementById("configurePopover");

            var leftFloat = parseFloat(configurePopover.style.left);
            leftFloat = leftFloat - 130;
            configurePopover.style.left = leftFloat + "px";


            UI.pagestack.push('extendedConfigurationPage',
                    {subtitle: 'Configuration'});
            var useTheOldReader = document.getElementById("theoldreader_use_sync");

            var theoldreaderUsername = document.getElementById("theoldreader_username");

            theoldreaderUsername.addEventListener("onkeyup", function() {
                theoldreader_username = theoldreaderUsername.value;
            });
            var theoldreaderPassword = document.getElementById("theoldreader_password");
            theoldreaderUsername.addEventListener("keyup", function() {
                theoldreader_password = theoldreaderPassword.value;
            });
        };

        backButton.removeEventListener(backButton, backButtonEventListener);

        function verifyAndReturnConfiguration() {
        }
    });

    return returnValue;
};