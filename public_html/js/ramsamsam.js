google.load("feeds", "1");

if (cordovaUsed()) {
// This is the event that fires when Cordova is fully loaded
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
// This is the event that then the browser window is loaded
    window.onload = onDeviceReady;
}

var UI = new UbuntuUI();
var gui;

var feedRecordsShownInGUI = {};
var feedRecordsSavedInDB = {};

var configuration = {};
var theoldreader_username;
var theoldreader_password;
var useTheOldReader;
var lastPageWasConfigurationPage = false;

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
    gui = new Gui();
    gui.onConfigurationChanged = function(config) {
        configuration = config;
    };

    gui.onFeedAdded = retrieveFeedPersistAndShowInGUI;

    connectUIToHandler();

    if (feedsNotInLocalStorage()) {
        retrieveDefaultFeeds();
    } else {
        var feedsLoadedFromLocalStorage = loadFeedsFromLocalStorage();

        for (var url in feedsLoadedFromLocalStorage) {
            retrieveFeedPersistAndShowSubscriptionInGUI(url);
        }
    }

}

function loadFeedsFromLocalStorage() {
    return JSON.parse(localStorage["feeds"]);
}
function feedsNotInLocalStorage() {
    return typeof localStorage["feeds"] === "undefined";
}
function retrieveDefaultFeeds() {
    retrieveFeedPersistAndShowSubscriptionInGUI("http://daniel-beck.org/feed/");
    retrieveFeedPersistAndShowSubscriptionInGUI("http://planet.ubuntu.com/rss20.xml");
    retrieveFeedPersistAndShowSubscriptionInGUI("http://planetkde.org/rss20.xml");
}
function connectUIToHandler() {

//    var aLinks = document.getElementsByTagName('li');
//    for (var i = 0; i < aLinks.length; i++) {
//        aLinks[i].addEventListener('touchstart', function() {
//            aLinks[i].className += " tapped";
//        });
//        aLinks[i].addEventListener('touchend', function() {
//            aLinks[i].className = "";
//        });

}

function verifyAndSaveOldReaderAccessData() {
    if (lastPageWasConfigurationPage) {
        checkConfigurationPage();
    }
    var theoldreaderStorage = localStorage["theoldReader"];
    theoldreaderStorage["username"] = theoldreader_username;
    theoldreaderStorage["password"] = theoldreader_password;
}

function retrieveFeedPersistAndShowInGUI(feedURL) {
    var feed = new google.feeds.Feed(feedURL);
    feed.setNumEntries(100);
    feed.load(function(retrievedFeed) {
        if (!retrievedFeed.error) {
            persistFeedAndAddFeedAndShowFeedEntriesInGUI(retrievedFeed);
        }
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
    try {
        localStorage.setItem("feeds", JSON.stringify(feedRecordsSavedInDB));
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
    gui.addFeedInGui(feedInfo.title, feedUrl, feedRecordsShownInGUI);
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