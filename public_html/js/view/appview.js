function AppView(presentationModel, hrefUrl) {
    this.presentationModel = presentationModel;
    this.hrefUrl = hrefUrl;
    makeDialogBackgroundTransparent();

    function makeDialogBackgroundTransparent() {
        $('div[data-role="dialog"]').on('pagebeforeshow', function (e, ui) {
            ui.prevPage.addClass("ui-dialog-background ");
        });

        $('div[data-role="dialog"]').on('pagehide', function () {
            $(".ui-dialog-background ").removeClass("ui-dialog-background ");
        });
    }
}


AppView.prototype.registerListeners = function () {
    this.registerModelChangeListeners();
    this.registerGuiEventListeners();
};

AppView.prototype.registerModelChangeListeners = function () {
    this.presentationModel.registerLoggedInListener(function () {
        console.log("loggedIn");
    });
};


AppView.prototype.registerGuiEventListeners = function () {
    var that = this;

    registerAddFeedHandler();
    registerFeedlyButtonClickHandler();
  //  $("#textIndexedDB").click(function () {
   //     that.presentationModel.saveSSOAuthorizationCode();
   // });

    function registerAddFeedHandler() {
        $("#addButton").click(function () {
            that.presentationModel.saveTestFeed(function () {
                alert("saving done");
            });
        });
    }

    function registerFeedlyButtonClickHandler() {
        $("a[data-ui=feedlyLoginButton]").click(function () {
            var url = that.presentationModel.ssoLoginURL();
            $.mobile.changePage(url, {showLoadMsg: true});
        });
    }
};


AppView.prototype.showInitialPage = function () {
    var code = this.presentationModel.extractSSOAuthorizationFromURL(this.hrefUrl);
    this.presentationModel.synchronizeFeeds();

    if (code)
        return;

    var url = undefined;

    if (this.presentationModel.firstStepsPageMustBeShown()) {
        url = "#firstStepPage";
    }

    if (url)
        $.mobile.changePage(url);

};

