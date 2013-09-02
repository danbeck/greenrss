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


Gui.prototype.onSubscriptionClick = function(subscriptionId) {

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
Gui.prototype.showTheOldReaderSubscriptions = function(headerName, subscription) {
    var self = this;

    if (!$(headerName)) {
        header = dom("li", {id: headerName, "data-role": "cloudlocation"},
        dom("h2", null, headerName));
        $(SUBSCRIPTIONS_LIST).appendChild(header);
    }
    if (subscription.categories !== undefined && subscription.categories.length > 0) {
        for (var i = 0; i < subscription.categories.length; i++) {
            var category = subscription.categories[i];
            if (!$(category.id)) {

                var categoryElement = dom("header", {id: category.id},
                dom("A", {href: "#"},
//                dom("ASIDE", null,
//                        dom("IMG", {src: "img/ListItemIsExpanded@8.png"})),
                dom("P", null, "+ " + category.label)));
                insertAfter($(headerName), categoryElement);
            }

            var li = dom("LI", {"data-subscription-url": subscription.url, "data-subscription-id": subscription.id},
            dom("A", {href: "#"},
            dom("ASIDE", null,
                    dom("IMG", {width: "35px", height: "35px", src: subscription.iconUrl})),
                    dom("P", null, subscription.title)
                    ));
            $(category.id).appendChild(li);

            li.onclick = function showFeedEntry() {
                var clickedFeedId = li.getAttribute("data-subscription-id");

                self.onSubscriptionClick(clickedFeedId);
            };
        }
    }
    else {

        var li = dom("LI", {"data-subscription-url": subscription.url, "data-subscription-id": subscription.id},
        dom("P", null, subscription.title));

        insertAfter($(headerName), li);

        li.onclick = function showFeedEntry() {
            var clickedFeedUrl = li.getAttribute("data-subscription-id");
            self.onSubscriptionClick(clickedFeedUrl);
        };
    }
};


// new method.
Gui.prototype.showGoogleReaderSubscriptions = function(headerName, subscription) {
    var self = this;

    if (!$(headerName)) {
        header = dom("li", {id: headerName, "data-role": "cloudlocation"},
        dom("h2", null, headerName));
        $(SUBSCRIPTIONS_LIST).appendChild(header);
    }
    if (subscription.categories !== undefined && subscription.categories.length > 0) {
        for (var i = 0; i < subscription.categories.length; i++) {
            var category = subscription.categories[i];
            if (!$(category.id)) {

                var categoryElement = dom("header", {id: category.id},
                dom("A", {href: "#"},
//                dom("ASIDE", null,
//                        dom("IMG", {src: "img/ListItemIsExpanded@8.png"})),
                dom("P", null, " > " + category.label)));
                insertAfter($(headerName), categoryElement);
            }

            var li = dom("LI", {"data-subscription-id": subscription.id, "data-source": headerName},
            dom("A", {href: "#"},
            dom("ASIDE", null,
                    dom("IMG", {width: "35px", height: "35px", src: subscription.image})),
                    dom("P", null, subscription.title)
                    ));
            $(category.id).appendChild(li);

            li.onclick = function showFeedEntry() {
                var clickedFeedId = li.getAttribute("data-subscription-id");

                self.onSubscriptionClick(clickedFeedId);
            };
        }
    }
    else {

        var li = dom("LI", {"data-subscription-id": subscription.id, "data-source": headerName},
        dom("P", null, subscription.title));

        insertAfter($(headerName), li);

        li.onclick = function showFeedEntry() {
            var clickedFeedUrl = li.getAttribute("data-subscription-id");
            self.onSubscriptionClick(clickedFeedUrl);
        };
    }
};

// works for the old reader
Gui.prototype.showTheOldReaderFeedItems = function(feedItems) {
    $(SUBSCRIPTION_ITEMS_LIST).innerHTML = "";
    for (var i = 0; i < feedItems.length; i++)
        this.__showTheOldReaderFeedItem(feedItems[i]);

    $(SUBSCRIPTION_ITEMS_SMALLDISPLAY_LIST).innerHTML = "";
    for (var i = 0; i < feedItems.length; i++)
        this.__showTheOldReaderFeedItem(feedItems[i]);
};

// works for the old reader
Gui.prototype.__showTheOldReaderFeedItem = function(item) {

//    alternate: Array[1]
//annotations: Array[0]
//author: "Rose Pastore"
//canonical: Array[1]
//categories: Array[3]
//comments: Array[0]
//crawlTimeMsec: "1377898200000"
//id: "tag:google.com,2005:reader/item/52214d6142d7600f6800116e"
//likingUsers: Array[0]
//origin: Object
//published: 1377898200
//summary: Object
//  - content: "<div>↵<img src="http://www.popsci.com/files/imagecache/article_image_large/articles/braininadish.jpg" alt="" title=""><div>↵<strong>Brain In A Dish</strong> <p>A 3-D model brain organoid with different brain regions. All cells show up blue, neural stem cells are red and neurons are green.</p> <em><p>Madeline A. Lancaster</p> </em>↵</div>↵</div><div> <p><b>4 millimeters</b>: the size of a <a href="http://www.popsci.com/science/article/2013-08/whoa-scientists-grow-brain-dish">three-dimensional, self-organizing model of a developing human brain</a> grown in a lab using stem cells</p> <p><b>10 octillion</b>: the number of two-megaton nuclear bombs that would need to explode simultaneously to match the <a href="http://www.popsci.com/scitech/article/2009-09/what-does-star-sound">sound of a supernova</a></p> <p></p> <p><b>225 million years</b>: the time it would take to <a href="http://www.popsci.com/military-aviation-%2526-space/article/2008-08/how-long-would-it-take-walk-light-year">walk a light-year</a></p> <p></p> <p><b>8.5 hours</b>: the length of a year on this <a href="http://www.popsci.com/science/article/2013-08/nightmare-planet-covered-boiling-lava-whips-around-sun-85-hours">nightmare exoplanet covered in boiling lava</a></p> <p></p> <p><b>115</b>: the number of protons in the nucleus of ununpentium, the temporary name for the <a href="http://www.popsci.com/science/article/2013-08/new-accelerator-study-confirms-theoretical-element-115-exists">newly discovered superheavy element 115</a> </p> <p><b>200,000</b>: the record amount of thrust generated in a recent NASA test of the <a href="http://www.popsci.com/technology/article/2013-08/nasa-tests-largest-3-d-printed-rocket-part-ever">largest 3-D printed rocket part ever</a></p> <p></p> <p><b>$160,000</b>: about how much cash you could get for <a href="http://www.popsci.com/technology/article/2010-01/which-organs-can-i-live-without-and-how-much-cash-can-i-get-them">one of your kidneys</a> in Israel</p> <p><b>$10,000</b>: the grant money a 37-year-old chimpanzee won for his sanctuary in a recent <a href="http://www.popsci.com/science/article/2013-08/meet-most-artistic-chimps-year">chimp art contest</a> (he painted the work below with his tongue)</p> <p></p> <p><b>25</b>: the number of children and adults sickened in a <a href="http://www.popsci.com/science/article/2013-08/latest-us-measles-outbreak-centered-around-vaccine-skeptic-megachurch">recent measles outbreak</a> traced to a Texas megachurch, the pastor of which had previously criticized vaccines</p> <p><b>$102 million</b>: the cost of a <a href="http://www.popsci.com/technology/article/2013-08/why-us-building-high-tech-bubonic-plague-lab-kazakhstan">high-tech bubonic plague lab</a> the Pentagon is building in Kazakhstan</p> <p></p> <p><b>50,000</b>: the number of signatures needed for a <a href="http://www.popsci.com/science/article/2013-08/idea-name-storms-after-global-warming-denying-politicians">petition to name storms after climate change deniers (the petition had 59,124 as of this writing)</a></p> <p><b>36</b>: the number of square segments, each made from four bony plates, in a <a href="http://www.popsci.com/science/article/2013-07/squishable-armor">seahorse's uncrushable tail</a>. Researchers hope to use this squishable armor to build an awesome robotic arm.</p> <p></p> <p><b>$3,500</b>: the funding this <a href="http://www.popsci.com/diy/article/2013-08/diy-self-driving-car-vehicles">DIY team</a> needs to build a circuit board that would let anyone make any car robotic</p> <p></p> <p><b>25</b>: the number of people who will be <a href="http://www.popsci.com/technology/article/2013-08/people-who-will-be-next-steve-jobs">the next Steve Jobs</a></p> <p><br></p>↵<p></p> </div><img width="1" height="1" src="http://feeds.popsci.com/c/34567/f/632419/s/309c425a/sc/4/mf.gif"><br><div><table><tr>↵<td>↵<a href="http://share.feedsportal.com/share/twitter/?u=http%3A%2F%2Fwww.popsci.com%2Fscience%2Farticle%2F2013-08%2Fweek-numbers-scientists-grow-brain-element-115-exists-and-more&amp;t=The+Week+In+Numbers%3A+Scientists+Grow+A+Brain%2C+Element+115+Exists%2C+And+More"><img src="http://res3.feedsportal.com/social/twitter.png"></a> <a href="http://share.feedsportal.com/share/facebook/?u=http%3A%2F%2Fwww.popsci.com%2Fscience%2Farticle%2F2013-08%2Fweek-numbers-scientists-grow-brain-element-115-exists-and-more&amp;t=The+Week+In+Numbers%3A+Scientists+Grow+A+Brain%2C+Element+115+Exists%2C+And+More"><img src="http://res3.feedsportal.com/social/facebook.png"></a> <a href="http://share.feedsportal.com/share/linkedin/?u=http%3A%2F%2Fwww.popsci.com%2Fscience%2Farticle%2F2013-08%2Fweek-numbers-scientists-grow-brain-element-115-exists-and-more&amp;t=The+Week+In+Numbers%3A+Scientists+Grow+A+Brain%2C+Element+115+Exists%2C+And+More"><img src="http://res3.feedsportal.com/social/linkedin.png"></a> <a href="http://share.feedsportal.com/share/gplus/?u=http%3A%2F%2Fwww.popsci.com%2Fscience%2Farticle%2F2013-08%2Fweek-numbers-scientists-grow-brain-element-115-exists-and-more&amp;t=The+Week+In+Numbers%3A+Scientists+Grow+A+Brain%2C+Element+115+Exists%2C+And+More"><img src="http://res3.feedsportal.com/social/googleplus.png"></a> <a href="http://share.feedsportal.com/share/email/?u=http%3A%2F%2Fwww.popsci.com%2Fscience%2Farticle%2F2013-08%2Fweek-numbers-scientists-grow-brain-element-115-exists-and-more&amp;t=The+Week+In+Numbers%3A+Scientists+Grow+A+Brain%2C+Element+115+Exists%2C+And+More"><img src="http://res3.feedsportal.com/social/email.png"></a>↵</td>↵<td></td>↵</tr></table></div><br><br><a href="http://da.feedsportal.com/r/173608410690/u/0/f/632419/c/34567/s/309c425a/sc/4/rc/1/rc.htm"><img src="http://da.feedsportal.com/r/173608410690/u/0/f/632419/c/34567/s/309c425a/sc/4/rc/1/rc.img"></a><br><a href="http://da.feedsportal.com/r/173608410690/u/0/f/632419/c/34567/s/309c425a/sc/4/rc/2/rc.htm"><img src="http://da.feedsportal.com/r/173608410690/u/0/f/632419/c/34567/s/309c425a/sc/4/rc/2/rc.img"></a><br><a href="http://da.feedsportal.com/r/173608410690/u/0/f/632419/c/34567/s/309c425a/sc/4/rc/3/rc.htm"><img src="http://da.feedsportal.com/r/173608410690/u/0/f/632419/c/34567/s/309c425a/sc/4/rc/3/rc.img"></a><br><br><a href="http://da.feedsportal.com/r/173608410690/u/0/f/632419/c/34567/s/309c425a/a2.htm"><img src="http://da.feedsportal.com/r/173608410690/u/0/f/632419/c/34567/s/309c425a/a2.img"></a><img width="1" height="1" src="http://pi.feedsportal.com/r/173608410690/u/0/f/632419/c/34567/s/309c425a/a2t.img">"
//  - direction: "ltr"
//timestampUsec: "1377898200000000"
//title: "The Week In Numbers: Scientists Grow A Brain, Element 115 Exists, And More"
//updated: 1377898200

    var self = this;

    var text = stripHTML(item.summary.content);

    var li = dom("LI", null, dom("A", null, dom("P", null, item.title), dom("P", null, text)));

    li.onclick = new function() {
        var id = li.getAttribute("id");
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
