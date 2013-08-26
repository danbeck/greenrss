function Gui() {
    this.UI = new UbuntuUI();
    this.UI.init();

    // Set up the app by pushing the main view
    this.UI.pagestack.push("main-page");

}

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