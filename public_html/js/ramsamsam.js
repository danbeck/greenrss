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

var THEOLDREADER_API_URL = "https://theoldreader.com/reader/api/0/";

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
    configuration = loadRecordFromLocalStorage("configuration");

    if (!configuration) {
        configuration = DEFAULT_CONFIGURATION;
    }

    gui = new Gui(configuration);
    gui.onConfigurationChanged = function(config) {
        saveItemInLocalStore("configuration", configuration);

        if (configuration.theoldReader_sync.useTheOldReader) {
            theoldreader_getLoginToken(configuration.theoldReader_sync.theoldreader_username,
                    configuration.theoldReader_sync.theoldreader_password, function(auth) {
                showAlert("login token was: " + auth);
            });
        }
    };


    gui.onFeedAdded = retrieveFeedPersistAndShowInGUI;

    if (feedsNotInLocalStorage()) {
        retrieveDefaultFeeds();
    } else {
        var feedsLoadedFromLocalStorage = loadFeedsFromLocalStorage();

        for (var url in feedsLoadedFromLocalStorage) {
            retrieveFeedPersistAndShowSubscriptionInGUI(url);
        }
    }
}

function retrieveDefaultFeeds() {
    retrieveFeedPersistAndShowSubscriptionInGUI("http://daniel-beck.org/feed/");
    retrieveFeedPersistAndShowSubscriptionInGUI("http://planet.ubuntu.com/rss20.xml");
    retrieveFeedPersistAndShowSubscriptionInGUI("http://planetkde.org/rss20.xml");
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
    saveItemInLocalStore("feeds", feedRecordsSavedInDB);
}


function theoldreader_getLoginToken(email, password, gotToken) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", THEOLDREADER_API_URL + "accounts/ClientLogin", true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;');
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState !== 4)
            return;
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            gotToken(response.Auth);
        }
    };
    xhr.send("output=json&client=RamSamSamReader&accountType=HOSTED&service=reader&Email=" + email + "&Passwd=" + password);
}


function saveItemInLocalStore(item, record) {
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
    gui.addFeedInGui(feedInfo.title, feedUrl, feedRecordsShownInGUI);
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