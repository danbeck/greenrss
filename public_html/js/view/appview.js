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

    function subscriptionAdded(subscription) {
        var newSubscription$ = $("<li><a><span class='feedTitle'>" + subscription.title + "</span></a></li>");
        $("#subscriptionList").append(newSubscription$).listview('refresh');
        newSubscription$.click(function() {

            $("#leftPanel").panel("toggle");
            $("#listViewHandy").html("");
            subscription.getItems().forEach(function(item) {
                var newItem$ = $("<li><a href='#'><span class='feedTitle'>" + item.title + "</span>" +
                        " - <span class='feedDescription'>" + item.summary + "</span></a></li>");
                $("#listViewHandy").append(newItem$).listview('refresh');
                newItem$.click(function() {
//
                    $.mobile.changePage("#entryView");
                    $("#entryContent").html("").append(item.content);
//
                });

            });
        });
    }
};


AppView.prototype.registerGuiEventListeners = function() {
    var that = this;

    addFeedsButtonHandler();
    registerFeedlyButtonClickHandler();
    registerRefreshFeedsHandler();
    registerOpenLeftPanelHandler();
    registerTheOldReaderLoginHandler();
    registerNoCloudLoginHandler();
    registerFeedSearchInput();
    //  $("#textIndexedDB").click(function () {
    //     that.presentationModel.saveSSOAuthorizationCode();
    // });

    function registerFeedSearchInput() {
        $("#feedSearchInput").keyup(function() {
            var input = $("#feedSearchInput").val();

            var foundSearches$ = $("#foundFeeds");

            if (shouldSearchForFeeds(input)) {
                FeedsSearch.searchSubscriptions(input, function(foundFeeds) {
                    foundSearches$.html("");
                    if (!foundFeeds.entries)
                        return;

                    var feeds = foundFeeds.entries.slice(0, 4);
                    for (var i = 0; i < feeds.length; i++) {
                        createdAndAppendEntry(feeds[i], i);
                    }
                    foundSearches$.controlgroup();
                });
            }

            function shouldSearchForFeeds(input) {
                return input && input.length > 2 && input !== "htt"
                        && input !== "http" && input.substring(0, 5) !== "http:";

            }
            function createdAndAppendEntry(feed, i) {
                var checkbox$ = $("<input>").attr("type", "checkbox").attr("name", "checkbox-" + i).attr("data-url", feed.url).attr("data-title", feed.title).attr("id", "checkbox-" + i); //.attr("class", "custom");

                var label$ = $("<label>").attr("for", "checkbox-" + i).attr("data-iconpos", "right").html("<p>" + feed.title + "</p>");
                foundSearches$.prepend(label$).prepend(checkbox$);
                checkbox$.checkboxradio();

            }
            ;

        });
    }

    function registerNoCloudLoginHandler() {
        $("#noCloudLoginButton").click(function() {
            that.feedsmodel.setCloudService("local");
        });
    }

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
        $("#chooseFeedlySynchronizationButton").click(function() {
            that.feedsmodel.setCloudService("feedly");
            var url = that.feedsmodel.ssoLoginURL();

            $("#feedlyLoginButton").attr("href", url);
        });
    }

    function registerTheOldReaderLoginHandler() {
        $("#theOldReaderLoginButton").click(function() {
            that.feedsmodel.setCloudService("theoldreader");
            var email = $("theOldReaderLoginDialog[type='email']").val();
            var password = $("theOldReaderLoginDialog[type='password']").val();
        });
    }

    function registerOpenLeftPanelHandler() {
        $("#openLeftPanel").click(function() {
            console.log("toggling panel");
            $("#leftPanel").panel("toggle");
        });
    }

    function addFeedsButtonHandler() {
        $("#addFeedsButton").click(function() {
            $("#foundFeeds input[type=checkbox]:checked").each(function(i, el) {
                var newSubscription = that.feedsmodel.createAndPersistSubscription($(this).attr("data-url"), $(this).attr("data-title"), null, function() {
                    console.log("done");
                });
                that.feedsmodel.synchronizeFeeds();
            });
        });
    }


};


AppView.prototype.showInitialPage = function(hrefUrl) {
    var that = this;
    var code = extractSSOAuthorizationFromURL(hrefUrl);

    if (code === undefined) {
        if (!this.feedsmodel.syncServiceConfigured()) {
            $.mobile.changePage("#firstStepPage");
        } else {
            $("#leftPanel").panel("toggle");
            startSynchronization();
            return;
        }
    }
    else
        this.feedsmodel.retrieveAccessToken(code, function() {
            console.log("access token retrieved");
            localStorage.setItem("cloudService", "feedly");
        });

    function startSynchronization() {
        that.feedsmodel.initAndloadFromDatabase(function() {
            console.log("feed were retrieved successfully");
        }, function() {
            console.log("error while retrieving feeds");
        });
    }

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
}; 