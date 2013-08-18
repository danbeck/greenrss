google.load("feeds", "1");
//if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
//// This is the event that fires when Cordova is fully loaded
//    document.addEventListener("deviceready", onDeviceReady, false);
//} else {
//// This is the event that then the browser window is loaded
//    window.onload = onDeviceReady;
//}


if (cordovaUsed()) {
// This is the event that fires when Cordova is fully loaded
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
// This is the event that then the browser window is loaded
    window.onload = onDeviceReady;
}

/**
 * Instance of the Ubuntu UI used to provide an interface to the
 * Ubuntu SDK HTML5 theme
 * @type {UbuntuUI}
 */

var UI = new UbuntuUI();
var feedRecordsShownInGUI = {};
/**
 * Entry point to the app. It initializes the Ubuntu SDK HTML5 theme
 * and connects events to handlers
 */
function onDeviceReady() {
    try {

        if (typeof localStorage["feeds"] === "undefined") {
            try {
                localStorage.setItem("feeds", JSON.stringify(feedRecordsShownInGUI));
                retrieveFeedPersistAndShowInGUI("http://daniel-beck.org/feed/");
            } catch (e) {
                if (e === QUOTA_EXCEEDED_ERR) {
                    showError()("Error: Local Storage limit exceeds.");
                } else {
                    showError("Error: Saving to local storage.");
                }
            }
        } else {
            feedRecordsShownInGUI = JSON.parse(localStorage["feeds"]);
            for (var url in feedRecordsShownInGUI) {
                retrieveFeedPersistAndShowInGUI(url);
            }
        }

        /***** Initialization *****/

        // Initialize the Ubuntu SDK HTML5 theme
        UI.init();
        // Set up the app by pushing the main view
        UI.pagestack.push("main-page");
        /***** Connecting events *****/

        // On clicking the scan button, show the scan page
        UI.button('addFeedButton').click(function(e) {
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
        UI.button('reloadFeedsButton').click(function(e) {
            UI.pagestack.push('reloadPage',
                    {subtitle: 'reload Page'});
        });
        // On clicking the info button, show the info page
        UI.button('configureButton').click(function(e) {
            UI.pagestack.push('configurePage',
                    {subtitle: 'Configuration'});
        });

    } catch (e) {
        showError(e.message);
    }

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

function persistFeedAndAddFeedAndShowFeedEntriesInGUI(retrievedFeed) {
    persistFeed(retrievedFeed);
    addFeedAndShowFeedEntriesInGUI(retrievedFeed.feed.feedUrl);
}
function persistFeed(retrievedFeed) {
    var feedInfo = {"title": retrievedFeed.feed.title,
        "description": retrievedFeed.feed.description,
        "author": retrievedFeed.feed.author,
        "entries": retrievedFeed.feed.entries};

    feedRecordsShownInGUI[retrievedFeed.feed.feedUrl] = feedInfo;
    localStorage.setItem("feeds", JSON.stringify(feedRecordsShownInGUI));
}

function addFeedAndShowFeedEntriesInGUI(feedUrl) {
    var feedInfo = feedRecordsShownInGUI[feedUrl];
    addFeedInGUI(feedInfo.title, feedUrl);

    var feedElements = document.getElementById("feedEntriesList");
    feedElements.innerHTML = '';
    for (var i = 0; i < feedInfo.entries.length; i++) {
        var feedEntry = feedInfo.entries[i];
        addFeedEntriesInGUI(feedEntry);
    }
}

function showFeedEntriesInGUI(feedUrl) {
    var feedInfo = feedRecordsShownInGUI[feedUrl];

    var feedElements = document.getElementById("feedEntriesList");
    feedElements.innerHTML = '';
    for (var i = 0; i < feedInfo.entries.length; i++) {
        var feedEntry = feedInfo.entries[i];
        addFeedEntriesInGUI(feedEntry);
    }
}
function addFeedInGUI(feedTitle, feedUrl) {
    var p = document.createElement("p");
    p.innerHTML = feedTitle;
    var li = document.createElement("li");
    p["data-rss-link"] = feedUrl;
    li.appendChild(p);
    var feedAbos = document.getElementById("feedsAboList");
    feedAbos.appendChild(li);

    p.onclick = function showFeedEntry() {
        var url = p["data-rss-link"];
        showFeedEntriesInGUI(url);
    };
}


function addFeedEntriesInGUI(feedEntry) {

//    var li = document.createElement("li");
//    var p = document.createElement("p");
//    var titleSpan = document.createElement("span");
//    titleSpan["className"] = "title";
//    var summarySpan = document.createElement("span");
//    summarySpan["className"] = "summary";
//    titleSpan.innerHTML = feedEntry.title;
//    summarySpan.innerHTML = feedEntry.contentSnippet;
//    p.appendChild(titleSpan);
//    p.appendChild(summarySpan);
//    li.appendChild(p);
//
//    var feedElements = document.getElementById("feedEntriesList");
//    feedElements.appendChild(li);

    var li = document.createElement("li");
    var a = document.createElement("a");
    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    p1["data-article"] = feedEntry;
//    h3["data-role"] = "content";
//    p["data-role"] = "content";
    a.appendChild(p1);
    a.appendChild(p2);
    p1.innerHTML = feedEntry.title;
    p2.innerHTML = feedEntry.contentSnippet;
//    a.appendChild(p);
    li.appendChild(a);
    var feedElements = document.getElementById("feedEntriesList");
    feedElements.appendChild(li);

    li.onclick = function showFeedEntry() {
//        var content = p.getElementsByClassName("content")[0];
//        if (!content) {
        var articleTitle = document.getElementById("articleTitle");
        articleTitle.innerHTML = '';
        var titleLink = createNewWindowLinkElement(feedEntry.link, feedEntry.title);
        articleTitle.appendChild(titleLink);
        
        var contentBlock = document.getElementById("articleContent");
        contentBlock.innerHTML = feedEntry.content;
        showArticlePage = document.getElementById("showArticlePage");
        showArticlePage.innerHTML = "";
        showArticlePage.appendChild(articleTitle);
        showArticlePage.appendChild(contentBlock);
        UI.pagestack.push('showArticlePage',
                {subtitle: 'show Article'});

    };
//    }
//
//        else {
//            p.removeChild(content);
//        }
//    };
//    
//    
//    header.innerHTML = feedEntry.title;

//    var titleSpan = document.createElement("span");
//    titleSpan["className"] = "title";
//    var summarySpan = document.createElement("span");
//    summarySpan["className"] = "summary";
//    titleSpan.innerHTML = feedEntry.title;
//    p.appendChild(titleSpan);
//    p.appendChild(summarySpan);
//    li.appendChild(p);

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