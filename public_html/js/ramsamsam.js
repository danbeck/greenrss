//google.load("feeds", "1");

if (cordovaUsed()) {
// This is the event that fires when Cordova is fully loaded
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
// This is the event that then the browser window is loaded
    window.onload = onDeviceReady;
}

var gui;

var theOldReader = new TheOldReader();
var googleFeed = new GoogleFeed();
var feedRecordsShownInGUI = {};
var feedRecordsSavedInDB = {};

var DEFAULT_CONFIGURATION = {
    theoldReader_sync: {useTheOldReader: false,
        theoldreader_username: undefined,
        theoldreader_password: undefined},
    useNightMode: false,
    refreshNow: false,
    deleteLocalStorage: false,
    refreshRateInSeconds: 60
};

var configuration = {};

function addGoogleAnalyticsToHTML() {

    var html = 'var _gaq = _gaq || [];\
  _gaq.push([\'_setAccount\', \'UA-4099512-3\']);\
  _gaq.push([\'_trackPageview\']);\
\
  (function() {\
    var ga = document.createElement(\'script\'); ga.type = \'text/javascript\'; ga.async = true; \
    ga.src = (\'https:\' == document.location.protocol ? \'https://ssl\' : \'http://www\') + \'.google-analytics.com/ga.js\';\
    var s = document.getElementsByTagName(\'script\')[0]; s.parentNode.insertBefore(ga, s);\
  })();';

    var ga = script(html);
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);

}

/**
 * Entry point to the app. It initializes the Ubuntu SDK HTML5 theme
 * and connects events to handlers
 */
function onDeviceReady() {
    configuration = loadRecordFromLocalStorage("configuration");

    if (!configuration) {
        configuration = DEFAULT_CONFIGURATION;
    }

    gui = new Gui(configuration);
    gui.onConfigurationChanged = function(config) {
        saveConfigInLocalStore("configuration", configuration);

        if (configuration.theoldReader_sync.useTheOldReader) {
        }

        if (configuration.useNightMode) {
            showNightMode(configuration.useNightMode);
        }

    };


    gui.onFeedAdded = retrieveNormalizeFeedPersistAndShowInGUI;

    googleFeed.getSubscriptionList(function(subscriptions) {
//        gui.addGoogleFeedInGui(feedInfo.title, feedUrl, feedRecordsShownInGUI);
        for (var subscriptionid in subscriptions)
            this.gui.showSubscriptions("local", subscriptions[subscriptionid]);
    });

    gui.onSubscriptionClick = function(clickedFeedDataSource, clickedFeedID) {

        if (clickedFeedDataSource === "local") {
            googleFeed.retrieveSubscriptionItems(null, null, clickedFeedID, function(subscriptionItemObject) {
                gui.showFeedItems(subscriptionItemObject);
            });

        }
        if (clickedFeedDataSource === "theOldReader") {

            theOldReader.retrieveSubscriptionItems(
                    configuration.theoldReader_sync.theoldreader_username,
                    configuration.theoldReader_sync.theoldreader_password,
                    clickedFeedID,
                    function(subscriptionItemObject) {
                        gui.showFeedItems(subscriptionItemObject);
                    }
            );
        }


    };


    gui.onSubscriptionItemClicked = function(subscriptionItem) {
        gui.showArticle(subscriptionItem);
    };

    gui.onConnectToTheOldReader = function() {
        theOldReader.getSubscriptionList(
                configuration.theoldReader_sync.theoldreader_username,
                configuration.theoldReader_sync.theoldreader_password,
                function(response) {
                    showSubscriptionList(response);
                });
    };

    if (configuration.theoldReader_sync.useTheOldReader === true)
        theOldReader.getSubscriptionList(
                configuration.theoldReader_sync.theoldreader_username,
                configuration.theoldReader_sync.theoldreader_password,
                function(response) {
                    showSubscriptionList(response);
                });
}

function showSubscriptionList(subscriptionList) {

    for (var id in subscriptionList) {
//         showAlert(JSON.stringify(subscriptionListJSON[i]));
//         var id = subscriptionListJSON[i].id;
//         var title = subscriptionListJSON[i].title;
//         var categories = subscriptionListJSON[i].categories;
//         var sortid = subscriptionListJSON[i].sortid;
//         var url = subscriptionListJSON[i].url;
//         var htmlUrl = subscriptionListJSON[i].htmlUrl;
//         var iconUrl = subscriptionListJSON[i].iconUrl;
//         showSubscriptions(subscriptionListJSON[i]);
        this.gui.showSubscriptions("theOldReader", subscriptionList[id]);
    }
}

function onFeedClick(feedid) {
//    feedidAsJSON JSON.parse(feedid);
    console.log(feedid);
}
function showNightMode(nightMode) {
    if (nightMode) {
        var head = document.getElementsByName("head");
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "css/night-theme.css");
        head.appendChild(link);
    }
    else
    {
        var styleSheet = document.querySelector('link[rel=stylesheet][href="css/night-theme.css"]');
        styleSheet.remove();
    }
}

function retrieveDefaultFeeds() {
    retrieveFeedPersistAndShowSubscriptionInGUI("http://daniel-beck.org/feed/");
    retrieveFeedPersistAndShowSubscriptionInGUI("http://planet.ubuntu.com/rss20.xml");
    retrieveFeedPersistAndShowSubscriptionInGUI("http://planetkde.org/rss20.xml");
}



function retrieveNormalizeFeedPersistAndShowInGUI(feedURL) {
    feedURL = feedURL.replace(/feed:\/\//, "http://");
    if (feedURL.match(/^http:\/\/www.ebay/)) {
        feedURL += "&rss=1";
        feedURL = feedURL.replace(/\/sch\//, "\/sch/rss/?_sacat=");
    }
    googleFeed.addSubscription(feedURL, function(subscription) {
        gui.showSubscriptions("local", subscription);
//        gui.showFeedItems(subscription.items);
    });
}


function retrieveFeedPersistAndShowSubscriptionInGUI(feedURL) {
    var feed = new google.feeds.Feed(feedURL);
    feed.setNumEntries(100);
    feed.load(function(retrievedFeed) {
        if (!retrievedFeed.error) {
            persistFeed(retrievedFeed);
            addNewSubscriptionInGUI(retrievedFeed.feed.feedUrl);
        }
    });
}

function persistFeedAndAddFeedAndShowFeedEntriesInGUI(retrievedFeed) {
    persistFeed(retrievedFeed);
    addNewSubscriptionInGUI(retrievedFeed.feed.feedUrl);
}

function persistFeed(retrievedFeed) {
    var feedInfoForStorage = {"title": retrievedFeed.feed.title,
        "description": retrievedFeed.feed.description,
        "author": retrievedFeed.feed.author
    };

    var feedInfo = {"title": retrievedFeed.feed.title,
        "description": retrievedFeed.feed.description,
        "author": retrievedFeed.feed.author,
        "entries": retrievedFeed.feed.entries
    };

    feedRecordsShownInGUI[retrievedFeed.feed.feedUrl] = feedInfo;
    feedRecordsSavedInDB[retrievedFeed.feed.feedUrl] = feedInfoForStorage;
    saveConfigInLocalStore("feeds", feedRecordsSavedInDB);
}


function saveConfigInLocalStore(item, record) {
    try {
        localStorage.setItem(item, JSON.stringify(record));
    } catch (e) {
        if (e === QUOTA_EXCEEDED_ERR) {
            showError()("Error: Local Storage limit exceeds.");
        } else {
            showError("Error: Saving to local storage.");
        }
    }
}

function resetLocalStore() {
    try {
        localStorage.removeItem("feeds");
    } catch (e) {
        if (e === QUOTA_EXCEEDED_ERR) {
            showError()("Error: Local Storage limit exceeds.");
        } else {
            showError("Error: Saving to local storage.");
        }
    }
}

function addNewSubscriptionInGUI(feedUrl) {
    var feedInfo = feedRecordsShownInGUI[feedUrl];
    gui.addGoogleFeedInGui(feedInfo.title, feedUrl, feedRecordsShownInGUI);
//    showGoogleReaderSubscriptions
}

function loadFeedsFromLocalStorage() {
    return loadRecordFromLocalStorage("feeds");
}
//
function loadRecordFromLocalStorage(item) {
    if (!localStorage[item])
        return undefined;
    return JSON.parse(localStorage[item]);
}

function feedsNotInLocalStorage() {
    return typeof localStorage["feeds"] === "undefined";
}

function showAlert(message) {
    if (cordovaUsed())
        navigator.notification.alert(message);
    else
        alert(message);
}

function showError(message) {
    showAlert("Error:" + message);
}

function cordovaUsed() {
    return navigator.notification;
}