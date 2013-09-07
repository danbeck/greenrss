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


    this.UI = new UbuntuUI();
    this.UI.init();
    this.convergence = computeConvergence();

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



    this.UI.button('configureButton').click(function() {
        self.openConfigurePage(this, self.onConfigurationChanged);
    });

    this.UI.button('connectToTheOldReader').click(function() {
        self.onConnectToTheOldReader();
    });

    // On clicking the scan button, show the scan page
    this.UI.button('addFeedButton').click(function() {
        show($("addfeeddialog"));

    });

    this.UI.button('addfeedsuccess').click(function() {
        var feedSubscriptionURL = $("rssFeed").value;
        self.onFeedAdded(feedSubscriptionURL);
        hide($("addfeeddialog"));
    });

    this.UI.button('addfeedcancel').click(function() {
        hide($("addfeeddialog"));
    });

//    window.onhashchange = function() {
//        self.__back();
//    };

//    window.onbeforeunload = function() {
//        self.__back();
//    };
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
        if (window.matchMedia("(max-width: 479px)").matches) {
            return UI_CONVERGENCE_SMALL_DISPLAY;
        }
        if (window.matchMedia("(min-width: 480px)").matches) {
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

Gui.prototype.__back = function() {
    if (this.UI._pageStack.depth() > 1)
        this.UI._pageStack.pop();
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
    var firstStyleSheet = document.querySelector("link[rel=stylesheet][href=\"css/index.css\"]");

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
        nightModeSytlesheet.remove();
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
Gui.prototype.showSubscriptions = function(headerName, subscription) {
    var self = this;

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
        var aside;
        if (subscription.image) {
            aside = dom("ASIDE", null, dom("IMG", {width: "35px", height: "35px", src: subscription.image}));
        }
        else {
            aside = dom("ASIDE", null);
        }
        var li = dom("LI", {"data-subscription-id": subscription.id, "data-source": headerName},
        dom("A", null, aside, dom("P", null, subscription.title)));

        li.addEventListener("touchstart", function(e) {
            e.preventDefault();
            e.target.click();
//            li["className"] = "touchBeforeActive";
        });
        li.addEventListener("click", function showFeedEntry() {
            self.__addSelectClassAndCallOnSubscriptionClick(li);
        });

        return li;
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

Gui.prototype.showFeedItems = function(source, feedItems) {
    $(SUBSCRIPTION_ITEMS_LIST).innerHTML = "";
    $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).innerHTML = "";

    if (isEmpty(feedItems)) {
        var li = dom("LI", {class: "noItems"}, "There are no items in this subscription");
        var mobileLi = li.cloneNode(true);
        $(SUBSCRIPTION_ITEMS_LIST).appendChild(li);
        $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).appendChild(mobileLi);
    } else {
        for (var feedItem in  feedItems)
            this.__showFeedItem(source, feedItems[feedItem]);
    }

    if (this.convergence === UI_CONVERGENCE_SMALL_DISPLAY) {

        this.UI.pagestack.push(SUBSCRIPTION_ITEMS_SMALLDISPLAY_PANE, {
            subtitle: 'subscription items'
        });
    }
};

Gui.prototype.__showFeedItem = function(source, subscriptionItem) {

    var self = this;

    var itemWasReadClass = null;
    if (subscriptionItem.read === true)
        itemWasReadClass = {class: "read"};

    var contentSnippetElement = dom("P", null);
    contentSnippetElement.innerHTML = subscriptionItem.contentSnippet;
    var li = dom("LI", {"data-subscriptionitem-id": subscriptionItem.id, "data-subscription-id": subscriptionItem.subscriptionId}, dom("A", itemWasReadClass, dom("P", null, subscriptionItem.title), contentSnippetElement));

    li.onclick = function() {
        self.onSubscriptionItemClicked(source, subscriptionItem);
    };

    var mobileLi = li.cloneNode(true);

    mobileLi.onclick = function() {
        self.onSubscriptionItemClicked(source, subscriptionItem);
    };
    $(SUBSCRIPTION_ITEMS_LIST).appendChild(li);
    $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).appendChild(mobileLi);
};

Gui.prototype.showArticle = function(subscriptionItem) {
    var selector = "[data-subscriptionitem-id=\"" + subscriptionItem.id + "\"]";
    var subscriptionItemElements = document.querySelectorAll(selector);

    for (var i = 0; i < subscriptionItemElements.length; i++) {
        var subscriptionItemElement = subscriptionItemElements[i];
        subscriptionItemElement.firstChild.setAttribute("class", "read");
    }

    var articleTitle = $("articleTitle");
    articleTitle.innerHTML = '';
    var titleLink = linkOpenInNewWindow(subscriptionItem.url, subscriptionItem.title);
    articleTitle.appendChild(titleLink);
    var contentBlock = $("articleContent");
    contentBlock.innerHTML = subscriptionItem.content;
    var showArticlePage = $("showArticlePage");
    showArticlePage.innerHTML = "";
    showArticlePage.appendChild(articleTitle);
    showArticlePage.appendChild(contentBlock);

    this.UI.pagestack.push('showArticlePage', {
        subtitle: 'show Article'
    });
};