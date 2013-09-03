var UI_CONVERGENCE_SMALL_DISPLAY = "smalldisplay";
var UI_CONVERGENCE_BIG_DISPLAY = "bigdisplay";

var MAIN_PAGE = "mainPage";

//const SUBSCRIPTIONS_PANE = "subscriptionPane";
var SUBSCRIPTIONS_LIST = "subscriptionsList";
var SUBSCRIPTION_ITEMS_SMALLDISPLAY_PANE = "subscriptionItemsSmallDisplayPane";
var SUBSCRIPTION_ITEMS_LIST = "subscriptionItemsList";
var SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST = "subscriptionItemsSmallDisplayList";



function Gui(configuration) {
    var that = this;


    this.UI = new UbuntuUI();
    this.UI.init();
    this.convergence = computeConvergence();

    this.configuration = configuration;

    // Set up the app by pushing the main view
    this.UI.pagestack.push(MAIN_PAGE);
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

    window.onresize = function() {
        var newConvergence = computeConvergence();
        if (that.convergence !== newConvergence) {
            that.convergence = newConvergence;
            var pageStack = that.UI._pageStack;
            pageStack._pages = new Array();
            that.UI.pagestack.push(MAIN_PAGE, {
                subtitle: 'mainpage'
            });
        }
    };

    function computeConvergence() {
        if (window.matchMedia("(max-width: 599px)").matches) {
            return UI_CONVERGENCE_SMALL_DISPLAY;
        }
        if (window.matchMedia("(min-width: 600px)").matches) {
            return UI_CONVERGENCE_BIG_DISPLAY;
        }
    }
}

Gui.prototype.onConfigurationChanged = function() {
};

Gui.prototype.onFeedAdded = function() {
};

Gui.prototype.onFeedItemClicked = function() {
};

Gui.prototype.onConnectToTheOldReader = function() {
};

Gui.prototype.reload = function() {
};
Gui.prototype.openConfigurePage = function(openConfigButton) {

    var that = this;

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


Gui.prototype.onSubscriptionClick = function(datasource, subscriptionId) {

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

// new method.
Gui.prototype.showGoogleReaderSubscriptions = function(headerName, subscription) {
    var self = this;

    if (!headerName) {
        headerName = "local";
    }

    if (!$(headerName)) {
        header = dom("li", {id: headerName, "class": "feedlocation"},
        dom("h2", null, headerName));
        $(SUBSCRIPTIONS_LIST).appendChild(header);
    }

//    subscription.categories = [{id: "c1", label: "test"}];
    if (subscription.categories !== undefined && subscription.categories.length > 0) {
        for (var i = 0; i < subscription.categories.length; i++) {
            var category = subscription.categories[i];
            if (!$(category.id)) {

                var categoryElement = dom("header", {id: category.id},
                dom("A", {href: "#", "data-category-id": category.id},
                dom("P", null, category.label)));
                insertAfter($(headerName), categoryElement);
            }

            var image = null;
            if (!subscription.image) {
                image = dom("IMG", {width: "35px", height: "35px", src: subscription.image});
            }

            var li = dom("LI", {"data-subscription-id": subscription.id, "data-source": headerName},
            dom("A", {href: "#"},
            dom("ASIDE", null, image), dom("P", null, subscription.title)
                    ));
            $(category.id).appendChild(li);

            li.onclick = function showFeedEntry() {

                self.__markItemActiveAndNotifyObserver(li);
            };
        }
    }
    else {

        var li = dom("LI", {"data-subscription-id": subscription.id, "data-source": headerName},
        dom("P", null, subscription.title));

        insertAfter($(headerName), li);

        li.onclick = function showFeedEntry() {

            self.__markItemActiveAndNotifyObserver(li);
        };
    }
};


Gui.prototype.__markItemActiveAndNotifyObserver = function(li) {

//	var subscriptionElement = $(SUBSCRIPTIONS_LIST).childNodes;
//	for ( var i = 0; i < subscriptionElement.length; i++) {
//		if (subscriptionElement[i].getAttribute("data-subscription-id"))
//			subscriptionElement[i].removeAttribute("class");
//	}

    var subscriptions = document.querySelectorAll("[data-subscription-id]");
    for (var i = 0; i < subscriptions.length; i++) {
        subscriptions[i].removeAttribute("class");
    }

    var subscriptions = document.querySelectorAll("[data-category-id]");
    for (var i = 0; i < subscriptions.length; i++) {
        subscriptions[i].removeAttribute("class");
    }
//		this.__markItemChildrenInactive( $(SUBSCRIPTIONS_LIST));


    li["className"] = "active";
    var clickedFeedId = li.getAttribute("data-subscription-id");
    var clickedFeedDataSource = li.getAttribute("data-source");

    this.onSubscriptionClick(clickedFeedDataSource, clickedFeedId);
};

Gui.prototype.__markItemChildrenInactive = function(element) {
    var children = element.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.getAttribute("data-subscription-id"))
            child.removeAttribute("class");
        if (child.childNodes) {
            for (var j = 0; j < child.childNodes.length; j++) {
                this.__markItemChildrenInactive(child.childNodes[j]);
            }
        }
    }
};

// works for the old reader
Gui.prototype.showTheOldReaderFeedItems = function(feedItems) {
    $(SUBSCRIPTION_ITEMS_LIST).innerHTML = "";
    $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).innerHTML = "";
//    for (var i = 0; i < feedItems.length; i++)
//        this.__showTheOldReaderFeedItem(feedItems[i]);
//
//    $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).innerHTML = "";
//    for (var i = 0; i < feedItems.length; i++)
//        this.__showTheOldReaderFeedItem(feedItems[i]);



    for (var feedItem in  feedItems)
        this.__showTheOldReaderFeedItem(feedItems[feedItem]);

//    for (var i = 0; i < feedItems.length; i++)
//        this.__showTheOldReaderFeedItem(feedItems[i]);
};

// works for the old reader
Gui.prototype.__showTheOldReaderFeedItem = function(subscriptionItem) {

    var self = this;

    var itemWasReadClass = null;
    if (subscriptionItem.read===true)
        itemWasReadClass = {class: "read"};
    var li = dom("LI", {"data-subscriptionitem-id": subscriptionItem.id}, dom("A", itemWasReadClass, dom("P", null, subscriptionItem.title), dom("P", null, subscriptionItem.contentSnippet)));

    li.onclick = new function() {
        var id = li.getAttribute("data-subscriptionitem-id");
        self.onFeedItemClicked(id);
    };
    $(SUBSCRIPTION_ITEMS_LIST).appendChild(li);
    $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).appendChild(li.cloneNode(true));

};

Gui.prototype.addGoogleFeedInGui = function(feedTitle, feedUrl, feedRecord) {
    var that = this;

    var li = dom("LI", {"data-rss-link": feedUrl}, dom("P", null, feedTitle));
    $(SUBSCRIPTIONS_LIST).appendChild(li);

    li.addEventListener('touchstart', function() {
        li.className += " tapped";
    });
    li.addEventListener('touchend', function() {
        li.className = "";
    });


    li.onclick = function showFeedEntry() {
        var clickedFeedUrl = li.getAttribute("data-rss-link");

        var feedsAboListElement = $(SUBSCRIPTIONS_LIST);
        var allFeeds = feedsAboListElement.childNodes;
        for (var i = 0; i < allFeeds.length; i++) {
            allFeeds[i].removeAttribute("class");
        }
        li["className"] = "active";

        if (that.convergence === UI_CONVERGENCE_SMALL_DISPLAY) {
            that.UI.pagestack.push(SUBSCRIPTION_ITEMS_SMALLDISPLAY_PANE, {
                subtitle: 'show FeedItem'
            });
        }

        showGoogleFeedEntriesInGUI(clickedFeedUrl, feedRecord, that);
    };

    function showGoogleFeedEntriesInGUI(clickedFeedUrl, feedRecord, that) {
        var feedInfo = feedRecord[clickedFeedUrl];

        var fragment = document.createDocumentFragment();

        $(SUBSCRIPTION_ITEMS_LIST).innerHTML = '';
        for (var i = 0; i < feedInfo.entries.length; i++) {
            var feedEntry = feedInfo.entries[i];
            addGoogleFeedEntriesToFragment(feedEntry, fragment, that);
        }
        $(SUBSCRIPTION_ITEMS_LIST).appendChild(fragment);

        var fragment = document.createDocumentFragment();

        $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).innerHTML = '';
        for (var i = 0; i < feedInfo.entries.length; i++) {
            var feedEntry = feedInfo.entries[i];
            addGoogleFeedEntriesToFragment(feedEntry, fragment, that);
        }
        $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).appendChild(fragment);
    }

    function addGoogleFeedEntriesToFragment(feedEntry, fragment, that) {

        var li = dom("LI", null,
                dom("A", null,
                dom("P", {"data-article": feedEntry}, feedEntry.title),
                dom("P", null, feedEntry.contentSnippet)));

        fragment.appendChild(li);

        li.addEventListener('touchstart', function() {
            li.className += " tapped";
        });
        li.addEventListener('touchend', function() {
            li.className = "";
        });

        li.onclick = function() {
            showGoogleArticle(feedEntry, that);
        };
    }

    function showGoogleArticle(feedEntry, that) {
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
            subtitle: 'show Article',
        });
    }

};