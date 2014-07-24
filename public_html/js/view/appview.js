function AppView(feedsmodel) {
    this.feedsmodel = feedsmodel;
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
    this.feedsmodel.registerSubscriptionAddedListener(subscriptionAdded);

    function subscriptionAdded() {
    }
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
            that.feedsmodel.subscribeFeed("http://daniel-beck.org/feed/", function() {
                alert("saving done");
            });
        });
    }

    function registerRefreshFeedsHandler() {
        $("#refreshButton").click(function() {
//            that.applicationmodel.retrieveFeeds();
        });
    }

    function registerFeedlyButtonClickHandler() {
        $("a[data-ui=feedlyLoginButton]").click(function() {
            that.feedsmodel.setCloudService("feedly");
            var url = that.applicationmodel.ssoLoginURL();
            $.mobile.changePage(url, {showLoadMsg: true});
        });
    }


};


AppView.prototype.showInitialPage = function(hrefUrl) {
    var code = extractSSOAuthorizationFromURL(hrefUrl);

    if (code === undefined) {
        if (!this.feedsmodel.syncServiceConfigured()) {
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


    function extractSSOAuthorizationFromURL(url) {
        var regex = /http:\/\/.*?code=((\w|\-)*)/;
        if (regex.test(url)) {
            this.code = url.match(regex)[1];

            var indexOfNewParameter = this.code.indexOf("&");
            if (indexOfNewParameter !== -1) {
                this.code = this.code.substring(0, indexOfNewParameter);
            }

            return this.code;
        }
    }
};

AppView.prototype.start = function() {
    console.log("start GUI");
    this.feedsmodel.initAndloadFromDatabase(function() {
        console.log("feed were retrieved successfully");
    }, function() {
        console.log("error while retrieving feeds");
    }
    );
};
