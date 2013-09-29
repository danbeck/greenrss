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
var theOldReaderlocalStorageService = new LocalStorageService(null, "0.2");
var theOldReader = new TheOldReader();
var googleFeed = new GoogleFeed();
var feedRecordsShownInGUI = {};
var feedRecordsSavedInDB = {};

var DEFAULT_CONFIGURATION = {
  theOldReader: {useTheOldReader: false,
    username: undefined,
    password: undefined},
  googleapi_sync: true,
  feedly: {
    username: undefined,
    password: undefined
  },
  useNightMode: false,
  refreshNow: false,
  deleteLocalStorage: false,
  refreshRateInSeconds: 200
};

var oldReaderSynchronizationActive;
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

  if (!window.indexedDB) {
    showWarning("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
  }

  var worker;
  var theOldReader;


  if (cordovaUsed()) {
    worker = new Worker('js/feeddownloader.js');
  }
  else {
    theOldReader = new TheOldReaderWebWorker();
  }

  syncDataWithOldReader(worker, theOldReader, configuration);

  var supportIndexedDB = typeof window.indexedDB != 'undefined';
  var supportNewIndexedDB = typeof window.IDBVersionChangeEvent != 'undefined';
  var supportsWebSql = typeof window.openDatabase != 'undefined';


  if (supportIndexedDB)
    showInfo("Version of Indexeddb is available");
  else
    showError("Version of indexeddb is not available");


  if (supportNewIndexedDB)
    showInfo("New Version of Indexeddb is available");
  else
    showError("New Version of indexeddb is not available");


  if (supportsWebSql)
    showInfo("Supports WebSQL");
  else
    showError("No WebSQL available");

//
//  var request = window.indexedDB.open("MeineTestdatenbank", 1);
//
//  request.onerror = function(event) {
//    showError(event);
//  };
//
//  request.onsuccess = function(event) {
//    var db = event.target.result;
//    var transaction = db.indexedDB.transaction(["customers"], "readwrite");
//
//    var transaction = db.transaction(["feeds"], "readwrite");
//
//    var objectStore = transaction.objectStore("feeds");
//    var data = [{url: "www.kde.org", read: false, source: "theoldreader"}, {url: "www.gnome.org", read: false, source: "local"}, {url: "www.gnome.org", read: false, source: "bla"}];
////   
//    for (var i in data) {
//      var dataAddRequest = objectStore.add(data[i]);
//      dataAddRequest.onsuccess = function(event) {
//        // event.target.result == customerData[i].ssn;
//      };
//    }
//
//  };
//  request.onupgradeneeded = function(event) {
//    var db = event.target.result;
//
//    // Create an objectStore to hold information about our customers. We're
//    // going to use "ssn" as our key path because it's guaranteed to be
//    // unique.
//    var objectStore = db.createObjectStore("feeds", {KeyPath: "url"});
//
//    // Create an index to search customers by name. We may have duplicates
//    // so we can't use a unique index.
//    objectStore.createIndex("source", "source", {unique: false});
//
//    // Create an index to search customers by email. We want to ensure that
//    // no two customers have the same email, so use a unique index.
////    objectStore.createIndex("email", "email", {unique: true});
//
//    // Store values in the newly created objectStore.
//    var data = [{url: "www.kde.org", read: false, source: "theoldreader"}, {url: "www.gnome.org", read: false, source: "local"}, {url: "www.gnome.org", read: false, source: "bla"}];
//    for (var i in  data) {
//      objectStore.add(data[i]);
//    }
//  };

  if (!localStorageService.isVersionCompatible()) {
    gui.showUpgradeWarning();
    localStorageService.clearLocalStorage();
    localStorageService.saveVersion();
  }

  gui.onConfigurationChanged = function(newConfiguration) {
    configuration = newConfiguration;
    saveConfigInLocalStore("configuration", configuration);
    if (configuration.theOldReader.useTheOldReader) {
      if (!oldReaderSynchronizationActive) {
        getSubscriptionsForTheOldReader();
        retrieveSubscriptionsForTheOldReader();
        oldReaderSynchronizationActive = setInterval(retrieveSubscriptionsForTheOldReader, 60000);
      }
    } else {
      if (oldReaderSynchronizationActive)
        clearInterval(oldReaderSynchronizationActive);
    }

  };

  gui.deleteLocalStorage = function() {
    localStorageService.clearLocalStorage();
  };
  gui.tryConnectToTheOldReader = function(onConnectionDone, onError) {
    theOldReader.__retrieveTokenIfNecessary(
            configuration.theOldReader.username,
            configuration.theOldReader.password, onConnectionDone, onError);
  };

  gui.onFeedAdded = retrieveNormalizeFeedsPersistAndShowInGUI;

  googleFeed.retrieveSubscriptions(function(subscriptions) {
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
              configuration.theOldReader.username,
              configuration.theOldReader.password,
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
              configuration.theOldReader.username,
              configuration.theOldReader.password, subscriptionItem);
      gui.showArticle(wwwurl, subscriptionItem);
    }
  };

  gui.feedSearch = function(query) {
    googleFeed.searchSubscriptions(query, function(foundFeeds) {
      gui.showFoundFeeds(foundFeeds);
    });
  };

//    gui.configSaved = function() {
//    };

  if (configuration.theOldReader.useTheOldReader === true) {
    getSubscriptionsForTheOldReader();
    retrieveSubscriptionsForTheOldReader();
    oldReaderSynchronizationActive = setInterval(retrieveSubscriptionsForTheOldReader, 60000);
  }
}

function syncDataWithOldReader(webworker, theOldReader, configuration) {
  if (!webworker)
    theOldReader.makeSync(null, configuration);
  else {
    var command = {command: "sync", conf: configuration};
    webworker.postMessage(command);
    webworker.addEventListener('message', function(e) {
      console.log('Worker said: ', e.data);
    }, false);
  }

}
function retrieveSubscriptionsForTheOldReader() {
  var username = configuration.theOldReader.username;
  var password = configuration.theOldReader.password;
  var self = this;
  theOldReader.retrieveSubscriptions(username, password,
          function(subscriptions) {
            showSubscriptionList(subscriptions);

            for (var subscriptionid in subscriptions) {
              theOldReader.retrieveSubscriptionItems(username, password, subscriptionid, function(subscriptionItemContainer) {
//                        getSubscriptionsForTheOldReader();
                self.theOldReaderlocalStorageService.getSubscriptionFromLocalStorage(subscriptionid);

//                showSubscriptionList(subscriptions);
              });

            }

          });
}

function getSubscriptionsForTheOldReader() {
  theOldReader.getSubscriptions(
          configuration.theOldReader.username,
          configuration.theOldReader.password,
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



function retrieveNormalizeFeedsPersistAndShowInGUI(feedURLs) {

  if (!feedURLs)
    return;
  if (feedURLs.length === 0)
    return;

  var feedURL = feedURLs[0];
  feedURL = feedURL.replace(/feed:\/\//, "http://");
  if (feedURL.match(/^http:\/\/www.ebay/)) {
    feedURL += "&rss=1";
    feedURL = feedURL.replace(/\/sch\//, "\/sch/rss/?_sacat=");
  }
  googleFeed.addSubscription(feedURL, function(subscription) {
    gui.showSubscriptions("local", subscription);
    var subFeeds = feedURLs.slice(1);
    retrieveNormalizeFeedsPersistAndShowInGUI(subFeeds);
  });
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

function showMessage(message) {
  if (cordovaUsed()) {
    navigator.notification.alert(message);
//    $("debuggingOutput").innerHTML = "";
    $("debuggingOutput").appendChild(dom("P", null, message));
  }
  else
    alert(message);
  $("debuggingOutput").appendChild(dom("P", null, message));
}
function showInfo(message) {
  showMessage("Info:" + message);

}
function showWarning(message) {
  showMessage("Warning:" + message);
}

function showError(message) {
  showMessage("Error:" + message);
}

function cordovaUsed() {
  return navigator.notification;
}