//google.load("feeds", "1");

if (cordovaUsed()) {
// This is the event that fires when Cordova is fully loaded
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
// This is the event that then the browser window is loaded
    window.onload = onDeviceReady;
    addGoogleAnalyticsToHTML();
}

var gui;


var localStorageService = new LocalStorageService(null, "0.2");
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
    refreshRateInSeconds: 600
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

    var ga = dom("SCRIPT", null);
    ga.innerHTML = html;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);

}

/**
 * Entry point to the app. It initializes the Ubuntu SDK HTML5 theme
 * and connects events to handlers
 */
function onDeviceReady() {
    configuration = loadConfigurationOrCreateDefault();

    gui = new Gui(configuration);
    gui.onConfigurationChanged = function(config) {
        saveConfigInLocalStore("configuration", configuration);
    };

    if(!localStorageService.isVersionCompatible()){
        gui.showUpgradeWarning();
        localStorageService.clearLocalStorage();
        localStorageService.saveVersion();
    }

    gui.onFeedAdded = retrieveNormalizeFeedPersistAndShowInGUI;

    googleFeed.retrieveSubscriptions(function(subscriptions) {
//        gui.addGoogleFeedInGui(feedInfo.title, feedUrl, feedRecordsShownInGUI);
        for (var subscriptionid in subscriptions)
            this.gui.showSubscriptions("local", subscriptions[subscriptionid]);
    });

    gui.onSubscriptionClick = function(clickedFeedDataSource, clickedFeedID) {

        if (clickedFeedDataSource === "local") {
            googleFeed.retrieveSubscriptionItems(null, null, clickedFeedID, function(subscriptionItemContainer) {
                gui.showFeedItems("local", subscriptionItemContainer);
            });

        }
        if (clickedFeedDataSource === "theOldReader") {
            theOldReader.getSubscriptionItems(
                    configuration.theoldReader_sync.theoldreader_username,
                    configuration.theoldReader_sync.theoldreader_password,
                    clickedFeedID,
                    function(subscriptionItemObject) {
                        gui.showFeedItems("theOldReader", subscriptionItemObject);
                    }
            );
        }
    };


    gui.onSubscriptionItemClicked = function(source, wwwurl, subscriptionItem) {
        if (source === "local") {
            googleFeed.setRead(subscriptionItem, function() {
                gui.showArticle(wwwurl, subscriptionItem);
            });
        }
        if (source === "theOldReader") {
            theOldReader.setRead(
                    configuration.theoldReader_sync.theoldreader_username,
                    configuration.theoldReader_sync.theoldreader_password, subscriptionItem);
            gui.showArticle(wwwurl, subscriptionItem);
        }
    };

    gui.feedSearch = function(query) {
        googleFeed.searchSubscriptions(query, function(foundFeeds) {
            gui.showFoundFeeds(foundFeeds);
        });
    };

    gui.onConnectToTheOldReader = function() {
        setInterval(retrieveSubscriptionsForTheOldReader, 60000);
    };

    if (configuration.theoldReader_sync.useTheOldReader === true) {
        getSubscriptionsForTheOldReader();
        retrieveSubscriptionsForTheOldReader();
        setInterval(retrieveSubscriptionsForTheOldReader, 60000);
    }
}

function retrieveSubscriptionsForTheOldReader() {
    var username = configuration.theoldReader_sync.theoldreader_username;
    var password = configuration.theoldReader_sync.theoldreader_password;
    theOldReader.retrieveSubscriptions(username, password,
            function(subscriptions) {
                showSubscriptionList(subscriptions);

                for (var subscriptionid in subscriptions) {
                    theOldReader.retrieveSubscriptionItems(username, password, subscriptionid, function(subscriptionItemContainer) {
                    });

                }
            });
}

function getSubscriptionsForTheOldReader() {
    theOldReader.getSubscriptions(
            configuration.theoldReader_sync.theoldreader_username,
            configuration.theoldReader_sync.theoldreader_password,
            function(response) {
                showSubscriptionList(response);
            });
}

function loadConfigurationOrCreateDefault() {
    var configuration = loadRecordFromLocalStorage("configuration");
    if (!configuration) {
        configuration = DEFAULT_CONFIGURATION;
    }
    return configuration;
}

function showSubscriptionList(subscriptionList) {

    for (var id in subscriptionList) {
        this.gui.showSubscriptions("theOldReader", subscriptionList[id]);
    }
}

function retrieveDefaultFeeds() {
    retrieveFeedPersistAndShowSubscriptionInGUI("http://daniel-beck.org/feed/");
    retrieveFeedPersistAndShowSubscriptionInGUI("http://planet.ubuntu.com/rss20.xml");
    retrieveFeedPersistAndShowSubscriptionInGUI("http://planetkde.org/rss20.xml");
    retrieveFeedPersistAndShowSubscriptionInGUI("http://omgubuntu.co.uk/feed");
}



function retrieveNormalizeFeedPersistAndShowInGUI(feedURL) {
    feedURL = feedURL.replace(/feed:\/\//, "http://");
    if (feedURL.match(/^http:\/\/www.ebay/)) {
        feedURL += "&rss=1";
        feedURL = feedURL.replace(/\/sch\//, "\/sch/rss/?_sacat=");
    }
    googleFeed.addSubscription(feedURL, function(subscription) {
        gui.showSubscriptions("local", subscription);
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