function AppView(feedsmodel, hrefUrl) {
    this.feedsmodel = feedsmodel;
    this.hrefUrl = hrefUrl;
    makeDialogBackgroundTransparent();

    function makeDialogBackgroundTransparent() {
        $('div[data-role="dialog"]').on('pagebeforeshow', function(e, ui) {
            ui.prevPage.addClass("ui-dialog-background ");
        });

        $('div[data-role="dialog"]').on('pagehide', function() {
            $(".ui-dialog-background ").removeClass("ui-dialog-background ");
        });
    }
}


AppView.prototype.registerListeners = function() {
    this.registerModelChangeListeners();
    this.registerGuiEventListeners();
};

AppView.prototype.registerModelChangeListeners = function() {
    console.log("registermodelchangelisteners");
};


AppView.prototype.registerGuiEventListeners = function() {
    var that = this;

    registerAddFeedHandler();
    registerFeedlyButtonClickHandler();
    //  $("#textIndexedDB").click(function () {
    //     that.presentationModel.saveSSOAuthorizationCode();
    // });

    function registerAddFeedHandler() {
        $("#addButton").click(function() {
            that.feedsmodel.subscribeFeed("http://daniel-beck.org/feed/", function() {
                alert("saving done");
            });
        });
    }

    function registerFeedlyButtonClickHandler() {
        $("a[data-ui=feedlyLoginButton]").click(function() {
            var url = that.feedsmodel.ssoLoginURL();
            $.mobile.changePage(url, {showLoadMsg: true});
        });
    }
};


AppView.prototype.showInitialPage = function() {
    var code = this.feedsmodel.extractSSOAuthorizationFromURL(this.hrefUrl);

    if (code === undefined) {
        if (!this.feedsmodel.syncServiceConfigured()) {
            $.mobile.changePage("#firstStepPage");
        } else
            // show the standard page
            return;
    }
    else
        this.feedsmodel.retrieveAccessToken(code, function() {
            console.log("access token retrieved");
        });
};



AppView.prototype.start = function() {
    console.log("start GUI");
    this.feedsmodel.synchronizeFeeds();
};
