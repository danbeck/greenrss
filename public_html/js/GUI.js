function Gui() {
    this.UI = new UbuntuUI();
    this.UI.init();

    // Set up the app by pushing the main view
    this.UI.pagestack.push("main-page");
    var backButton = document.querySelector("li a[data-role=\"back\"]");

    var that = this;
    this.UI.button('configureButton').click(function() {
        that.openConfigurePage(this, that.onConfigurationChanged);
    });
    
       // On clicking the scan button, show the scan page
    this.UI.button('addFeedButton').click(function() {
        toggle_visibility("addfeeddialog");
    });


//    backButton.addEventListener("click", ope);


//        UI.popover(this, "configurePopover").toggle();
//        var li = document.getElementById('extendConfigurationMenuItem');


}

Gui.prototype.onConfigurationChanged = function() {
};

Gui.prototype.reload = function() {
};
Gui.prototype.openConfigurePage = function(openConfigButton) {

    var returnValue = {useTheOldReader: false, useNightMode: false};

    var backButtonEventListener = function() {

    };

    var theoldreader_username;
    var theoldreader_password;

//this.UI.too

    this.UI.popover(openConfigButton, "configurePopover").toggle();

    var configurePopover = $("configurePopover");
    var leftFloat = parseFloat(configurePopover.style.left);
    leftFloat = leftFloat - 130;
    configurePopover.style.left = leftFloat + "px";

    var li = $('extendConfigurationMenuItem');

    var that = this;
    li.onclick = function() {
        that.UI.popover(this, "configurePopover").toggle();



        that.UI.pagestack.push('extendedConfigurationPage',
                {subtitle: 'Configuration'});
        var useTheOldReader = $("theoldreader_use_sync");

        var theoldreaderUsername = $("theoldreader_username");

        theoldreaderUsername.addEventListener("onkeyup", function() {
            theoldreader_username = theoldreaderUsername.value;
        });
        var theoldreaderPassword = $("theoldreader_password");
        theoldreaderUsername.addEventListener("keyup", function() {
            theoldreader_password = theoldreaderPassword.value;
        });
    };

    return that.onConfigurationChanged(returnValue);
};
