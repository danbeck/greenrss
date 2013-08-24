google.load("feeds", "1");

if (cordovaUsed()) {
// This is the event that fires when Cordova is fully loaded
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
// This is the event that then the browser window is loaded
    window.onload = onDeviceReady;
}

var UI = new UbuntuUI();
var feedRecordsShownInGUI = {};
var feedRecordsSavedInDB = {};


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

    var ga = document.createElement('script');
    ga.innerHTML = html;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);

}

/**
 * Entry point to the app. It initializes the Ubuntu SDK HTML5 theme
 * and connects events to handlers
 */
function onDeviceReady() {
    try {

        // Initialize the Ubuntu SDK HTML5 theme
        UI.init();
        // Set up the app by pushing the main view
        UI.pagestack.push("main-page");
        /***** Connecting events *****/

        connectUIToHandler();

        if (feedsNotInLocalStorage()) {
            retrieveDefaultFeeds();
        } else {
            var feedsLoadedFromLocalStorage = loadFeedsFromLocalStorage();

            for (var url in feedsLoadedFromLocalStorage) {
                retrieveFeedPersistAndShowSubscriptionInGUI(url);
            }
        }
    } catch (e) {
        showError(e.message);
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

    var aLinks = document.getElementsByTagName('li');
    for (var i = 0; i < aLinks.length; i++) {
        aLinks[i].addEventListener('touchstart', function() {
            aLinks[i].className += " tapped";
        });
        aLinks[i].addEventListener('touchend', function() {
            aLinks[i].className = "";
        });


    }
    // On clicking the scan button, show the scan page
    UI.button('addFeedButton').click(function() {
        toggle_visibility("addfeeddialog");
    });
//        var addFeedCancel = document.getElementById("addfeedcancel");
    UI.button('addfeedcancel').click(function(e) {
        hide("addfeeddialog");
    });
    UI.button('addfeedsuccess').click(function(e) {
        var newRssFeed = document.getElementById("rssFeed").value;
        retrieveFeedPersistAndShowInGUI(newRssFeed);
        hide("addfeeddialog");
    });
    // On clicking the history button, show the history page
    UI.button('reloadFeedsButton').click(function() {
//            UI.pagestack.push('reloadPage',
//                    {subtitle: 'reload Page'});
    });
    // On clicking the info button, show the info page
    UI.button('configureButton').click(function() {
//       UI.pagestack.push('configurePopover',
//                    {subtitle: 'Configuration'});
        UI.popover(this, "configurePopover").toggle();
        var configurePopover = document.getElementById("configurePopover");
        
        var leftFloat = parseFloat(configurePopover.style.left);
        leftFloat = leftFloat - 130;
//        configurePopover.style.removeAttribute("left");
        configurePopover.style.left = leftFloat +"px";
//        
//            UI.pagestack.push('extendedConfigurationPage',
//                    {subtitle: 'Configuration'});
  
//        var popover = document.getElementById("configurePopover");
//        popover.className= " height: 30em; ;margin-bottom: 30px; top:280px; left: 1658.5px; " + popover.className;
    });
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
//,"entries": retrievedFeed.feed.entries
    };

    var feedInfo = {"title": retrievedFeed.feed.title,
        "description": retrievedFeed.feed.description,
        "author": retrievedFeed.feed.author
                , "entries": retrievedFeed.feed.entries
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
    addFeedInGUI(feedInfo.title, feedUrl);
}


function showFeedEntriesInGUI(feedUrl) {
    var feedInfo = feedRecordsShownInGUI[feedUrl];

    var feedElements = document.getElementById("feedEntriesList");
    var fragment = document.createDocumentFragment();

    feedElements.innerHTML = '';
    for (var i = 0; i < feedInfo.entries.length; i++) {
        var feedEntry = feedInfo.entries[i];
        addFeedEntriesToFragment(feedEntry, fragment);
    }
    feedElements.appendChild(fragment);
}
function addFeedInGUI(feedTitle, feedUrl) {
    var p = document.createElement("p");
    p.innerHTML = feedTitle;
    var li = document.createElement("li");
    li["data-rss-link"] = feedUrl;
    li.appendChild(p);
    var feedAbos = document.getElementById("feedsAboList");
    feedAbos.appendChild(li);

    li.addEventListener('touchstart', function() {
        li.className += " tapped";
    });
    li.addEventListener('touchend', function() {
        li.className = "";
    });


    li.onclick = function showFeedEntry() {
        var url = li["data-rss-link"];

        var feedsAboListElement = document.getElementById("feedsAboList");
        var allFeeds = feedsAboListElement.childNodes;
        for (var i = 0; i < allFeeds.length; i++) {
            allFeeds[i].removeAttribute("class");
        }
        li["className"] = "active";
        showFeedEntriesInGUI(url);
    };
}


function addFeedEntriesToFragment(feedEntry, fragment) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    p1["data-article"] = feedEntry;
    a.appendChild(p1);
    a.appendChild(p2);
    p1.innerHTML = feedEntry.title;
    p2.innerHTML = feedEntry.contentSnippet;
    li.appendChild(a);
    fragment.appendChild(li);

    li.addEventListener('touchstart', function() {
        li.className += " tapped";
    });
    li.addEventListener('touchend', function() {
        li.className = "";
    });


    li.onclick = function() {
        showArticle(feedEntry, li);
    };
}

function showArticle(feedEntry, li) {
    var articleTitle = document.getElementById("articleTitle");
    articleTitle.innerHTML = '';
    var titleLink = createNewWindowLinkElement(feedEntry.link, feedEntry.title);
    articleTitle.appendChild(titleLink);

    var contentBlock = document.getElementById("articleContent");
    contentBlock.innerHTML = feedEntry.content;
    var showArticlePage = document.getElementById("showArticlePage");
    showArticlePage.innerHTML = "";
    showArticlePage.appendChild(articleTitle);
    showArticlePage.appendChild(contentBlock);
    UI.pagestack.push('showArticlePage',
            {subtitle: 'show Article'});

//             var feed = new google.feeds.Feed(feedURL);
//    feed.setNumEntries(100);
//    feed.load(function(retrievedFeed) {
//        if (!retrievedFeed.error) {
//            persistFeed(retrievedFeed);
//            addNewSubscriptionInGUI(retrievedFeed.feed.feedUrl);
//        }
//    });

}
function createNewWindowLinkElement(href, innerHTML) {
    var a = createLinkElement(href, innerHTML);
    a["target"] = "_blank";
    return a;
}

function createLinkElement(href, innerHTML) {
    var a = document.createElement("a");
    a["href"] = href;
    a.innerHTML = innerHTML;
    return a;
}

function toggle_visibility(id) {
    var e = document.getElementById(id);
    if (e.style.display === 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
}

function show(id) {
    var e = document.getElementById(id);
    e.style.display = 'block';
}

function hide(id) {
    var e = document.getElementById(id);
    e.style.display = 'none';
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