function Gui() {
    this.UI = new UbuntuUI();
    this.UI.init();

    // Set up the app by pushing the main view
    this.UI.pagestack.push("main-page");
    var backButton = document.querySelector("li a[data-role=\"back\"]");

    var that = this;
    this.UI.button('configureButton').click(function() {
        that.openConfigurePage(this, that.onConfigurationChanged);
    });

    // On clicking the scan button, show the scan page
    this.UI.button('addFeedButton').click(function() {
        show("addfeeddialog");

    });

    this.UI.button('addfeedsuccess').click(function() {
        var feedSubscriptionURL = $("rssFeed").value;
        that.onFeedAdded(feedSubscriptionURL);
        hide("addfeeddialog");
    });

    UI.button('addfeedcancel').click(function() {
        hide("addfeeddialog");
    });
}

Gui.prototype.onConfigurationChanged = function() {
};

Gui.prototype.onFeedAdded = function() {
};
Gui.prototype.reload = function() {
};
Gui.prototype.openConfigurePage = function(openConfigButton) {

    var returnValue = {useTheOldReader: false, useNightMode: false};

    var backButtonEventListener = function() {

    };

    var theoldreader_username;
    var theoldreader_password;

//this.UI.too

    this.UI.popover(openConfigButton, "configurePopover").toggle();

    var configurePopover = $("configurePopover");
    var leftFloat = parseFloat(configurePopover.style.left);
    leftFloat = leftFloat - 130;
    configurePopover.style.left = leftFloat + "px";

    var li = $('extendConfigurationMenuItem');

    var that = this;
    li.onclick = function() {
        that.UI.popover(this, "configurePopover").toggle();



        that.UI.pagestack.push('extendedConfigurationPage',
                {subtitle: 'Configuration'});
        var useTheOldReader = $("theoldreader_use_sync");

        var theoldreaderUsername = $("theoldreader_username");

        theoldreaderUsername.addEventListener("onkeyup", function() {
            theoldreader_username = theoldreaderUsername.value;
        });
        var theoldreaderPassword = $("theoldreader_password");
        theoldreaderUsername.addEventListener("keyup", function() {
            theoldreader_password = theoldreaderPassword.value;
        });
    };

    return that.onConfigurationChanged(returnValue);
};

Gui.prototype.addFeedInGui = function(feedTitle, feedUrl, feedRecord) {
    var pa = createP(feedTitle);
    var li = createLi(pa);
    li["data-rss-link"] = feedUrl;

    $("feedsAboList").appendChild(li);

    li.addEventListener('touchstart', function() {
        li.className += " tapped";
    });
    li.addEventListener('touchend', function() {
        li.className = "";
    });

    var that = this;

    li.onclick = function showFeedEntry() {
        var clickedFeedUrl = li["data-rss-link"];

        var feedsAboListElement = $("feedsAboList");
        var allFeeds = feedsAboListElement.childNodes;
        for (var i = 0; i < allFeeds.length; i++) {
            allFeeds[i].removeAttribute("class");
        }
        li["className"] = "active";
        showFeedEntriesInGUI(clickedFeedUrl, feedRecord, that);
    };

    function showFeedEntriesInGUI(clickedFeedUrl, feedRecord, that) {
        var feedInfo = feedRecord[clickedFeedUrl];

        var feedElements = $("feedEntriesList");
        var fragment = document.createDocumentFragment();

        feedElements.innerHTML = '';
        for (var i = 0; i < feedInfo.entries.length; i++) {
            var feedEntry = feedInfo.entries[i];
            addFeedEntriesToFragment(feedEntry, fragment, that);
        }
        feedElements.appendChild(fragment);
    }


    function addFeedEntriesToFragment(feedEntry, fragment, that) {
        var a = document.createElement("a");
        var p1 = createP(feedEntry.title);
        var p2 = createP(feedEntry.contentSnippet);
        p1["data-article"] = feedEntry;
        a.appendChild(p1);
        a.appendChild(p2);
        var li = createLi(a);

        fragment.appendChild(li);

        li.addEventListener('touchstart', function() {
            li.className += " tapped";
        });
        li.addEventListener('touchend', function() {
            li.className = "";
        });


        li.onclick = function() {
            showArticle(feedEntry, that);
        };
    }

    function showArticle(feedEntry, that) {
        var articleTitle = $("articleTitle");
        articleTitle.innerHTML = '';
        var titleLink = linkOpenInNewWindow(feedEntry.link, feedEntry.title);
        articleTitle.appendChild(titleLink);

        var contentBlock = $("articleContent");
        contentBlock.innerHTML = feedEntry.content;
        var showArticlePage = $("showArticlePage");
        showArticlePage.innerHTML = "";
        showArticlePage.appendChild(articleTitle);
        showArticlePage.appendChild(contentBlock);
        that.UI.pagestack.push('showArticlePage',
                {subtitle: 'show Article'});
    }

};