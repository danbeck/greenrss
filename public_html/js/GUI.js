function Gui(configuration) {
    var that = this;

    this.UI = new UbuntuUI();
    this.UI.init();
    this.configuration = configuration;

    // Set up the app by pushing the main view
    this.UI.pagestack.push("main-page");
    // var backButton = document.querySelector("li a[data-role=\"back\"]");

    this.UI.button('configureButton').click(function() {
        that.openConfigurePage(this, that.onConfigurationChanged);
    });

    this.UI.button('connectToTheOldReader').click(function() {
        that.onConnectToTheOldReader();
    });

    // On clicking the scan button, show the scan page
    this.UI.button('addFeedButton').click(function() {
        show($("addfeeddialog"));

    });

    this.UI.button('addfeedsuccess').click(function() {
        var feedSubscriptionURL = $("rssFeed").value;
        that.onFeedAdded(feedSubscriptionURL);
        hide($("addfeeddialog"));
    });

    this.UI.button('addfeedcancel').click(function() {
        hide($("addfeeddialog"));
    });
}

Gui.prototype.onConfigurationChanged = function() {
};

Gui.prototype.onFeedAdded = function() {
};

Gui.prototype.onConnectToTheOldReader = function() {
};

Gui.prototype.reload = function() {
};
Gui.prototype.openConfigurePage = function(openConfigButton) {

    var that = this;

    // var backButtonEventListener = function() {
    // };


    this.UI.popover(openConfigButton, "configurePopover").toggle();

    var configurePopover = $("configurePopover");
    var leftFloat = parseFloat(configurePopover.style.left);
    leftFloat = leftFloat - 130;
    configurePopover.style.left = leftFloat + "px";


    if (configuration.useNightMode) {
        $("useNightMode")["checked"] = true;
    } else {
        $("useNightMode").removeAttribute("checked");
    }

    $("useNightMode").onclick = function() {
        configuration.useNightMode = !configuration.useNightMode;
        if (configuration.useNightMode) {
            that.__activateNightMode();
        }
        else {
            that.__deactiveNightMode();
        }
    };

    $('extendConfigurationMenuItem').onclick = function() {
        that.UI.popover(this, "configurePopover").hide();

        that.UI.pagestack.push('extendedConfigurationPage', {
            subtitle: 'Configuration'
        });

        hide($("addFeedButton").parentNode);
        hide($("reloadFeedsButton").parentNode);
        hide(openConfigButton.parentNode);

        var oldReaderConf = configuration.theoldReader_sync;
        if (oldReaderConf.useTheOldReader === true) {
            $("theoldreader_use_sync").setAttribute("checked", true);
            $("theoldreader_use_sync").setAttribute("data-checkbox-enabled", true);
        }
        else {

            $("theoldreader_use_sync").setAttribute("data-checkbox-enabled", false);
            $("theoldreader_username").setAttribute("disabled", true);
            $("theoldreader_password").setAttribute("disabled", true);
            $("theoldreader_save_password").setAttribute("disabled", true);

        }
        if (oldReaderConf.theoldreader_username)
            $("theoldreader_username").value = oldReaderConf.theoldreader_username;


        $("theoldreader_use_sync").onclick = function() {
            var oldValue = $("theoldreader_use_sync").getAttribute("data-checkbox-enabled");
            $("theoldreader_use_sync").setAttribute("data-checkbox-enabled", oldValue !== "true");

            if ($("theoldreader_use_sync").getAttribute("data-checkbox-enabled") === "true") {
                $("theoldreader_username").removeAttribute("disabled");
                $("theoldreader_password").removeAttribute("disabled");
                $("theoldreader_save_password").removeAttribute("disabled");
                configuration.theoldReader_sync.useTheOldReader = true;
            } else {
                $("theoldreader_username")["disabled"] = true;
                $("theoldreader_password")["disabled"] = true;
                $("theoldreader_save_password")["disabled"] = true;
                configuration.theoldReader_sync.useTheOldReader = false;
            }
        };

        $("theoldreader_username").onkeyup = function() {
            configuration.theoldReader_sync.theoldreader_username = this.value;
        };

        $("theoldreader_password").onkeyup = function() {
            configuration.theoldReader_sync.theoldreader_password = this.value;
        };
    };

    var backButton = document.querySelector("li a[data-role=\"back\"]");

    backButton.addEventListener("click", function(e) {

        that.UI.popover(openConfigButton, "configurePopover").hide();
        if (isDisplayed($("extendedConfigurationPage")))
            that.UI.pagestack.pop('extendedConfigurationPage', {
                subtitle: 'Configuration'
            });

        show($("addFeedButton").parentNode);
        show($("reloadFeedsButton").parentNode);
        show(openConfigButton.parentNode);

        var useTheOldReader = $("theoldreader_use_sync")["data-checkbox-enabled"];
        var theoldreaderUsername = $("theoldreader_username").value;
        var theoldreaderPassword = $("theoldreader_password").value;
        if (useTheOldReader)
            configuration.useTheOldReader = useTheOldReader;

        if (theoldreaderUsername && theoldreaderUsername !== "")
            configuration.theoldreaderUsername = theoldreaderUsername;

        if (theoldreaderPassword && theoldreaderPassword !== "")
            configuration.theoldreaderPassword = theoldreaderPassword;

        return that.onConfigurationChanged(configuration);

    });
};

Gui.prototype.__activateNightMode = function() {
//	var firstStyleSheet = document.getElementByName("stylesheet");;
//	
//	var nightStyleSheet = document.createElement("stylesheet");
//	nightStyleSheet.setAttribute("src", "css/night-theme.css");
//	insetAfter(firstStyleSheet);
};
Gui.prototype.__deactiveNightMode = function() {

};
Gui.prototype.__validateConfigurationAndCallOnConfigurationChanged = function(that, openConfigButton) {
    that.UI.popover(openConfigButton, "configurePopover").hide();
    if (isDisplayed($("extendedConfigurationPage")))
        that.UI.pagestack.pop('extendedConfigurationPage', {
            subtitle: 'Configuration'
        });

    show($("addFeedButton").parentNode);
    show($("reloadFeedsButton").parentNode);
    show(openConfigButton.parentNode);

    var useTheOldReader = $("theoldreader_use_sync")["data-checkbox-enabled"];
    var theoldreaderUsername = $("theoldreader_username").value;
    var theoldreaderPassword = $("theoldreader_password").value;
    if (useTheOldReader)
        that.configuration.useTheOldReader = useTheOldReader;

    if (theoldreaderUsername && theoldreaderUsername !== "")
        that.configuration.theoldreaderUsername = theoldreaderUsername;

    if (theoldreaderPassword && theoldreaderPassword !== "")
        that.configuration.theoldreaderPassword = theoldreaderPassword;

    return that.onConfigurationChanged(that.configuration);
};

Gui.prototype.showSubscriptions = function(headerName, subscription, onSubscriptionClick) {
    var self = this;

    if (!$(headerName)) {
        var header = document.createElement("li");
        header.id = headerName;
        header.setAttribute("data-role", "cloudlocation");
        var headerParagraph = document.createElement("h2");
        headerParagraph.innerHTML = headerName;

        header.appendChild(headerParagraph);
        $("feedsAboList").appendChild(header);
    }
    if (subscription.categories !== undefined && subscription.categories.length > 0) {
        for (var i = 0; i < subscription.categories.length; i++) {
            var category = subscription.categories[i];
            var header = $(headerName);
            if (!$(category.id)) {
                var categoryElement = document.createElement("header");

                var a = document.createElement("a");
                a.setAttribute("href", "#");

                var p = document.createElement("p");
                p.innerHTML = category.label;
                categoryElement.id = category.id;
//                categoryElement.innerHTML = category.label;

                var iconAside = document.createElement("aside");
                var icon = document.createElement("img");
//                icon.setAttribute("width", "25px");
//                icon.setAttribute("height", "25px");
                icon.setAttribute("src", "img/ListItemIsExpanded@8.png");
                iconAside.appendChild(icon);
                a.appendChild(iconAside);
                a.appendChild(p);
                categoryElement.appendChild(a);

//                var iconAside = document.createElement("p");
                insertAfter($(headerName), categoryElement);

            }
            var iconAside = document.createElement("aside");
            var icon = document.createElement("img");
            icon.setAttribute("width", "35px");
            icon.setAttribute("height", "35px");
            icon.setAttribute("src", subscription.iconUrl);
            iconAside.appendChild(icon);
            var a = document.createElement("a");
            a.setAttribute("href", "#");
            a.appendChild(iconAside);
            var p = createP(subscription.title);
            a.appendChild(p);
            var li = createLi(a);
//            var a = createLi();
            li["data-rss-link"] = subscription.url;
            li["data-feed-id"] = subscription.id;

            $(category.id).appendChild(li);

            li.onclick = function showFeedEntry() {
                var clickedFeedUrl = li.getAttribute("data-rss-link");

                onSubscriptionClick(clickedFeedUrl);
            };
        }
    }
    else {
        var pa = createP(subscription.title);
        var li = createLi(pa);
        li["data-rss-link"] = subscription.url;
        li["data-feed-id"] = subscription.id;

        insertAfter($(headerName), li);

        li.onclick = function showFeedEntry() {
            var clickedFeedUrl = li.getAttribute("data-rss-link");

            onSubscriptionClick(clickedFeedUrl);
        };

    }


};


Gui.prototype.showFeedItem = function(item, onFeedClick) {
    var a = document.createElement("a");
    var p1 = createP(item.title);
    var p2 = createP(item.summary);
//        p1["data-article"] = feedEntry;
    a.appendChild(p1);
    a.appendChild(p2);
    var li = createLi(a);

    li.onclick = new function() {
        var id = li.getAttribute("id");
        onFeedClick(id);
    };
    $("feedEntriesList").appendChild(li);

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
        that.UI.pagestack.push('showArticlePage', {
            subtitle: 'show Article'
        });
    }

};