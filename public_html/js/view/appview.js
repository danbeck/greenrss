function AppView(applicationmodel, hrefUrl) {
    this.applicationmodel = applicationmodel;
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
    registerRefreshFeedsHandler();
    //  $("#textIndexedDB").click(function () {
    //     that.presentationModel.saveSSOAuthorizationCode();
    // });

    function registerAddFeedHandler() {
        $("#addFeedButton").click(function() {
            that.applicationmodel.subscribeFeed("http://daniel-beck.org/feed/", function() {
                alert("saving done");
            });
        });
    }

    function registerRefreshFeedsHandler() {
        $("#refreshButton").click(function() {
            that.applicationmodel.retrieveFeeds();
        });
    }

    function registerFeedlyButtonClickHandler() {
        $("a[data-ui=feedlyLoginButton]").click(function() {
            that.applicationmodel.setCloudService("feedly");
            var url = that.applicationmodel.ssoLoginURL();
            $.mobile.changePage(url, {showLoadMsg: true});
        });
    }


};


AppView.prototype.showInitialPage = function() {
    var code = this.applicationmodel.extractSSOAuthorizationFromURL(this.hrefUrl);

    if (code === undefined) {
        if (!this.applicationmodel.syncServiceConfigured()) {
            $.mobile.changePage("#firstStepPage");
        } else
            // show the standard page
            return;
    }
    else
        this.applicationmodel.retrieveAccessToken(code, function() {
            console.log("access token retrieved");
            localStorage.setItem("cloudService", "feedly");
        });
};



AppView.prototype.start = function() {
    console.log("start GUI");
    this.applicationmodel.retrieveFeeds(function() {
        console.log("feed were retrieved successfully");
    }, function() {
        console.log("error while retrieving feeds");
    }
    );
};
