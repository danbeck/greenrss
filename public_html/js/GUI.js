var UI_CONVERGENCE_SMALL_DISPLAY = "smalldisplay";
var UI_CONVERGENCE_BIG_DISPLAY = "bigdisplay";

var MAIN_PAGE = "mainPage";

//const SUBSCRIPTIONS_PANE = "subscriptionPane";
var SUBSCRIPTIONS_LIST = "subscriptionsList";
var SUBSCRIPTION_ITEMS_SMALLDISPLAY_PANE = "subscriptionItemsSmallDisplayPane";
var SUBSCRIPTION_ITEMS_LIST = "subscriptionItemsList";
var SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST = "subscriptionItemsSmallDisplayList";



function Gui(configuration) {
    var self = this;

    var actionBar;
    if (cordovaUsed()) {
        actionBar = window.plugins.actionbar;
    }
    this.UI = new UbuntuUI();
    //needed because of a bug with "toolbar"
    UI = this.UI;
    this.UI.init();
    this.convergence = computeConvergence();
    this.backButton = document.querySelector("li a[data-role=\"back\"]");
    this.configuration = configuration;

    // Set up the app by pushing the main view
    this.UI.pagestack.push(MAIN_PAGE);
    // var backButton = document.querySelector("li a[data-role=\"back\"]");

    if (configuration.useNightMode) {
        self.__activateNightMode();
    }
    else {
        self.__deactiveNightMode();
    }

    this.UI.button('configureButton').click(function(e) {
        e.stopImmediatePropagation();
        self.openConfigurePage(this, self.onConfigurationChanged);
    });

    new FastButton($("useNightMode"), function(e) {
        e.stopPropagation();
        configuration.useNightMode = !configuration.useNightMode;
        if (configuration.useNightMode) {
            self.__activateNightMode();
        }
        else {
            self.__deactiveNightMode();
        }
        self.onConfigurationChanged(configuration);
    });

//
//    $("footer").addEventListener("click", function(e) {
//        var el = e.srcElement || e.target;
//        if (el.id && /footer/i.test(el.id)) {
//            self.UI.toolbar("footer").toggle();
//        }
//    });


    UI.button("deleteLocalStorage").click(function() {
        self.deleteLocalStorage();
    });
    UI.toolbar("footer").touch(function(e) {
        var el = e.srcElement || e.target;
        if (el.id && /footer/i.test(el.id)) {
            self.UI.toolbar("footer").toggle();
        }
    });

    $("rssFeed").addEventListener("keyup", function() {
        var input = $("rssFeed").value;

        if (input && input.length > 2 && input !== "htt"
                && input !== "http" && input.substring(0, 5) !== "http:") {
            self.feedSearch(input);
        } else {
            self.UI.list("#foundfeeds").removeAllItems();
        }
    });

    this.UI.button('saveconfig').click(function() {
        self.__saveConfig();
    });

    // On clicking the scan button, show the scan page
    this.UI.button('addFeedButton').click(function() {
        show($("addfeeddialog"));

    });


    this.UI.button('addfeedsuccess').click(function() {
        var feedsList = $("foundfeedsList");
        if (feedsList.childNodes.length === 0) {
            var feedSubscriptionURL = $("rssFeed").value;
            var oneElementListToAdd = new Array();
            oneElementListToAdd.push(feedSubscriptionURL);
            self.onFeedAdded(oneElementListToAdd);
            hide($("addfeeddialog"));
        }
        else {
            var listToAdd = new Array();
            for (var i = 0; i < feedsList.childNodes.length; i++) {
                var checkbox = feedsList.childNodes[i].childNodes[1].firstChild;
                var feedSubscriptionURL = feedsList.childNodes[i].getAttribute("data-role-url");
                var checked = checkbox.checked;
                if (checked) {
                    listToAdd.push(feedSubscriptionURL);
                }
            }
            self.onFeedAdded(listToAdd);

            hide($("addfeeddialog"));

        }
    });

    this.UI.button('addfeedcancel').click(function() {
        hide($("addfeeddialog"));
    });

    history.pushState("jiberrish", null, null);

    window.onpopstate = function() {
        history.pushState("jiberrish", null, null);
        self.__back();
        showAllToolbarButtons();
    };
    window.onresize = function() {
        var newConvergence = computeConvergence();
        if (self.convergence !== newConvergence) {
            self.convergence = newConvergence;
            var pageStack = self.UI._pageStack;
            pageStack._pages = new Array();
            self.UI.pagestack.push(MAIN_PAGE, {
                subtitle: 'mainpage'
            });
            showAllToolbarButtons();
        }
    };

    function showAllToolbarButtons() {
        show($("addFeedButton").parentNode);
        show($("reloadFeedsButton").parentNode);
        show($("configureButton").parentNode);
    }

    function computeConvergence() {
        if (window.matchMedia("(max-width: 639px)").matches) {
            return UI_CONVERGENCE_SMALL_DISPLAY;
        }
        if (window.matchMedia("(min-width: 640px)").matches) {
            return UI_CONVERGENCE_BIG_DISPLAY;
        }
    }
}

Gui.prototype.deleteLocalStorage = function() {
};
Gui.prototype.__saveConfig = function() {
    var self = this;
    self.configuration = self.__updateConfigurationFromConfigPage();
    var connectToTheOldReader = self.UI.dialog("connectToOldReaderDialog");
    connectToTheOldReader.show();

    self.tryConnectToTheOldReader(function(token) {
        connectToTheOldReader.hide();
        self.onConfigurationChanged(self.configuration);
    }, function() {
        connectToTheOldReader.hide();
        var dialog = self.UI.dialog("couldNotConnectToTheOldReader");
        dialog.show();
//            self.
        self.onConfigurationChanged(self.configuration);
        self.UI.button("couldNotConnectPrompt").click(function() {
            dialog.hide();
        });
    });
};
Gui.prototype.showFoundFeeds = function(foundFeeds) {

    if (!foundFeeds.entries)
        return;
    var feeds = foundFeeds.entries.slice(0, 5);
    var ubuntuList = this.UI.list("#foundfeeds");
    ubuntuList.removeAllItems();
    for (var i = 0; i < feeds.length; i++) {

        var p = dom("P");
        p.innerHTML = feeds[i].title;
        var content = dom("P", {"style": "text-overflow: ellipsis;margin-right:4.5rem;"});
        content.innerHTML = feeds[i].title;
        var checkbox = dom("INPUT", {type: "checkbox"});
        var newListItem = dom("LI", {"data-role-url": feeds[i].url}, content, dom("LABEL", null, checkbox, dom("SPAN", null)));
        new FastButton(newListItem, function() {
            var check = this.childNodes[1].firstChild;
            check.checked = !check.checked;
        });
        $("foundfeedsList").appendChild(newListItem);
    }
};

Gui.prototype.onConfigurationChanged = function() {
};


Gui.prototype.feedSearch = function() {
};

Gui.prototype.onFeedAdded = function() {
};

Gui.prototype.onFeedItemClicked = function() {
};

Gui.prototype.configSaved = function() {
};

Gui.prototype.reload = function() {
};

Gui.prototype.__back = function() {
    if (this.UI._pageStack.depth() > 1)
        this.UI._pageStack.pop();
};

Gui.prototype.__updateConfigurationFromConfigPage = function() {
    this.configuration.theoldReader_sync.useTheOldReader = $("theoldreader_use_sync").checked;
    this.configuration.theoldReader_sync.theoldreader_username = $("theoldreader_username").value;
    this.configuration.theoldReader_sync.theoldreader_password = $("theoldreader_password").value;
    return this.configuration;
};

Gui.prototype.openConfigurePage = function(openConfigButton) {

    var self = this;

    this.UI.popover(openConfigButton, "configurePopover").toggle();

    var configurePopover = $("configurePopover");
    var leftFloat = parseFloat(configurePopover.style.left);
    leftFloat = leftFloat - 130;
    configurePopover.style.left = leftFloat + "px";

    restablishPopover(self.configuration);
    restablishConfigurationPage(self.configuration);

    $('extendConfigurationMenuItem').onclick = function() {
        self.UI.popover(this, "configurePopover").hide();

        self.UI.pagestack.push('extendedConfigurationPage', {
            subtitle: 'Configuration'
        });

        hide($("addFeedButton").parentNode);
        hide($("reloadFeedsButton").parentNode);
        hide(openConfigButton.parentNode);


        $("theoldreader_use_sync").onclick = function() {
            if ($("theoldreader_use_sync").checked) {
                $("theoldreader_username").removeAttribute("disabled");
                $("theoldreader_password").removeAttribute("disabled");
            }
            else {
                $("theoldreader_username")["disabled"] = true;
                $("theoldreader_password")["disabled"] = true;
            }
        };
    };

    self.backButton.addEventListener("click", function(e) {

        self.UI.popover(openConfigButton, "configurePopover").hide();
        if (isDisplayed($("extendedConfigurationPage")))
            self.UI.pagestack.pop('extendedConfigurationPage', {
                subtitle: 'Configuration'
            });

        show($("addFeedButton").parentNode);
        show($("reloadFeedsButton").parentNode);
        show(openConfigButton.parentNode);

//        self.configuration = self.__updateConfigurationFromConfigPage();
//        return self.onConfigurationChanged(self.configuration);
    });

    function restablishPopover(configuration) {
        if (configuration.useNightMode) {
            $("useNightMode")["checked"] = true;
        } else {
            $("useNightMode").removeAttribute("checked");
        }
    }
    function restablishConfigurationPage(configuration) {
        if (configuration.theoldReader_sync.useTheOldReader === true) {
            $("theoldreader_use_sync").checked = true;
        }
        else {
            $("theoldreader_username").setAttribute("disabled", true);
            $("theoldreader_password").setAttribute("disabled", true);
        }
        $("theoldreader_username").value = configuration.theoldReader_sync.theoldreader_username;
        $("theoldreader_password").value = configuration.theoldReader_sync.theoldreader_password;
    }
};

Gui.prototype.__activateNightMode = function() {
    var firstStyleSheet = document.querySelector("link[rel=stylesheet][href=\"css/ramsamsam-withoutscrolling.css\"]");

    var nightModeSytlesheet = dom("LINK", {rel: "stylesheet", href: "css/night-theme.css"});
    insertAfter(firstStyleSheet, nightModeSytlesheet);
//	
//	var nightStyleSheet = document.createElement("stylesheet");
//	nightStyleSheet.setAttribute("src", "css/night-theme.css");
//	insetAfter(firstStyleSheet);
};
Gui.prototype.__deactiveNightMode = function() {

    var nightModeSytlesheet = document.querySelector("link[rel=stylesheet][href=\"css/night-theme.css\"]");
    if (nightModeSytlesheet)
        removeNode(nightModeSytlesheet);
};


Gui.prototype.onSubscriptionClick = function(datasource, subscriptionId) {

};
// new method.
Gui.prototype.showSubscriptions = function(headerName, subscription) {
    var self = this;

    if (document.querySelector("li[data-subscription-id=\"" + subscription.id + "\"]"))
        return;
    if (!headerName) {
        headerName = "local";
    }

    if (!$(headerName)) {
        var header = dom("li", {id: headerName, "class": "feedlocation"},
        dom("h2", null, headerName));
        $(SUBSCRIPTIONS_LIST).appendChild(header);
    }

    var subscriptionCategories = subscription.categories;
    if (subscriptionCategories === undefined || subscription.categories.length === 0) {
        subscriptionCategories = [{label: "No Category", id: headerName + "NoCategory"}];

    }
    for (var i = 0; i < subscriptionCategories.length; i++) {
        createSubscriptionElementUnderCategory(subscriptionCategories[i], subscription);
    }

    function createSubscriptionElementUnderCategory(category, subscription) {
        if (!$(category.id)) {
            var categoryElement = dom("header", {id: category.id},
            dom("A", {"data-category-id": category.id},
            dom("P", null, category.label)));
            insertAfter($(headerName), categoryElement);
        }

        var li = createSubscriptionElement(subscription);
        $(category.id).appendChild(li);
    }

    function createSubscriptionElement(subscription) {
        var numberOfUnreadItems = numberOfUnreadItems(subscription);
        var aside;
        if (subscription.image) {
            aside = dom("ASIDE", null, dom("IMG", {width: "35px", height: "35px", src: subscription.image}));
        }
        else {
            aside = dom("ASIDE", null);
        }

        var titleSpan = dom("SPAN", {"class": "title"}, subscription.title);
        var numberOfUnreadItemsSpan = dom("SPAN", {"class": "unread"}, "" + numberOfUnreadItems);
        var li = dom("LI", {"data-subscription-id": subscription.id, "data-source": headerName},
        dom("A", null, aside, dom("P", {class: "title"}, titleSpan), dom("P", {class: "unread"}, numberOfUnreadItemsSpan)));

        new FastButton(li, function showFeedEntry() {
            li["className"] = "touchBeforeActive";
            self.__addSelectClassAndCallOnSubscriptionClick(li);
        });

        return li;

        function numberOfUnreadItems(subscription) {
            var number = 0;
            var items = subscription["items"];
            for (itemKey in items) {
                if (items[itemKey]["read"] === false)
                    number++;
            }
            return number;
        }
    }
};


Gui.prototype.__addSelectClassAndCallOnSubscriptionClick = function(li) {

    var subscriptions = document.querySelectorAll("#subscriptionPane [data-subscription-id]");
    for (var i = 0; i < subscriptions.length; i++) {
        subscriptions[i].removeAttribute("class");
    }

    var subscriptions = document.querySelectorAll("#subscriptionPane [data-category-id]");
    for (var i = 0; i < subscriptions.length; i++) {
        subscriptions[i].removeAttribute("class");
    }

    li["className"] = "active";
    var clickedFeedId = li.getAttribute("data-subscription-id");
    var clickedFeedDataSource = li.getAttribute("data-source");

    this.onSubscriptionClick(clickedFeedDataSource, clickedFeedId);
};

Gui.prototype.addFeedItemsToHTML = function(source, feedItemContainer) {
    $(SUBSCRIPTION_ITEMS_LIST).innerHTML = "";
    $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).innerHTML = "";

    var feedItems = feedItemContainer["items"];

    var sortedFeedItems = new Array();
    for (var feedItem in feedItems) {
        sortedFeedItems.push(feedItems[feedItem]);
    }
    sortedFeedItems.sort(function(a, b) {
        var dateA = new Date(a.publishedDate), dateB = new Date(b.publishedDate);
        return dateB - dateA;//sort by date ascending
    });

    if (isEmpty(feedItems)) {
        var li = dom("LI", {class: "noItems"}, "There are no items in this subscription");
        var mobileLi = li.cloneNode(true);
        $(SUBSCRIPTION_ITEMS_LIST).appendChild(li);
        $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).appendChild(mobileLi);
    } else {
        var fragment = document.createDocumentFragment();
        var mobileFragment = document.createDocumentFragment();
//        for (var feedItem in  feedItems) {
        for (var i = 0; i < sortedFeedItems.length; i++) {
            var feedItemObj = sortedFeedItems[i];
            this.__showFeedItem(fragment, mobileFragment, source, feedItemContainer.wwwurl, feedItemObj);

        }
        $(SUBSCRIPTION_ITEMS_LIST).appendChild(fragment);
        $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).appendChild(mobileFragment);
    }
};

Gui.prototype.showFeedItems = function(source, feedItemContainer) {
    this.addFeedItemsToHTML(source, feedItemContainer);
    if (this.convergence === UI_CONVERGENCE_SMALL_DISPLAY) {

        this.UI.pagestack.push(SUBSCRIPTION_ITEMS_SMALLDISPLAY_PANE, {
            subtitle: 'subscription items'
        });
    }
};

Gui.prototype.__showFeedItem = function(fragment, mobileFragment, source, wwwurl, subscriptionItem) {

    var self = this;

    var itemWasReadClass = null;
    if (subscriptionItem.read === true)
        itemWasReadClass = {class: "read"};

    var contentSnippetElement = dom("P", null);
    contentSnippetElement.innerHTML = subscriptionItem.contentSnippet.substring(0, 300);
    var li = dom("LI", {"data-subscriptionitem-id": subscriptionItem.id}, dom("A", itemWasReadClass, dom("P", null, subscriptionItem.title), contentSnippetElement));

    new FastButton(li, function() {
        self.onSubscriptionItemClicked(source, wwwurl, subscriptionItem);
    });

    var mobileLi = li.cloneNode(true);

    new FastButton(mobileLi, function() {
        self.onSubscriptionItemClicked(source, wwwurl, subscriptionItem);
    });
    fragment.appendChild(li);
    mobileFragment.appendChild(mobileLi);
};

Gui.prototype.showUpgradeWarning = function() {
//      show($("upgradeDialogWarning"));
};
Gui.prototype.showArticle = function(wwwurl, subscriptionItem) {
    var selector = "[data-subscriptionitem-id=\"" + subscriptionItem.id + "\"]";
    var subscriptionItemElement = document.querySelector(selector);

    var wasRead = subscriptionItemElement.firstChild.getAttribute("class") === "read";

    subscriptionItemElement.firstChild.setAttribute("class", "read");

    if (!wasRead) {
        var unreadItemsElement = document.querySelector("#subscriptionsList li.active a p span.unread");
        unreadItemsElement.innerText = unreadItemsElement.innerText - 1;
    }


    var articleTitle = $("articleTitle");
    articleTitle.innerHTML = '';

    var titleLink = dom("A", {href: subscriptionItem.url, target: "_blank"}, subscriptionItem.title);
    articleTitle.appendChild(titleLink);
    var contentBlock = $("articleContent");
//    var base = document.getElementsByName("base")[0];
//    if (base)
//        base.remove();
//    var newbase = dom("BASE", {href: wwwurl, target: "_blank"});
//    var someTagFromHead = document.querySelector("meta[name=viewport]");
//    insertAfter(someTagFromHead, newbase);
    var content = subscriptionItem.content.replace(/<a /g, "<a target=\"_blank\"");
//    content = content.replace(/href="^(?!http)/g, "href=" + wwwurl);


    contentBlock.innerHTML = content;
    var showArticlePage = $("showArticlePage");
    showArticlePage.innerHTML = "";
    showArticlePage.appendChild(articleTitle);

    showArticlePage.appendChild(contentBlock);

    this.UI.pagestack.push('showArticlePage', {
        subtitle: 'show Article'
    });
};