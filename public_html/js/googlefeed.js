google.load("feeds", "1");

function GoogleFeed() {

    this.__DEFAULT_FEEDS = ["http://daniel-beck.org/feed/",
        "http://planet.ubuntu.com/rss20.xml",
        "http://planetkde.org/rss20.xml"];

    this.__SUBSCRIPTIONS_LOCAL_STORAGE = "google-subscriptions";
}

GoogleFeed.prototype.addSubscription = function(feedUrl, onSubscriptionAdded) {
    localStorage["feeds"].feedUrl = "null";
    onSubscriptionAdded.apply(undefined, onSubscriptionAdded.arguments);
};

GoogleFeed.prototype.getSubscriptionList = function(onGetSubscriptionList) {
    var self = this;

    if (!localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE]) {
        var subscriptions = {};

        var amountOfFeedsToShow = this.__DEFAULT_FEEDS.length;

        for (var i = 0; i < this.__DEFAULT_FEEDS.length; i++) {

            self.__loadFeedsFromGoogle(this.__DEFAULT_FEEDS[i], function(googlefeed) {
                self.__addSubscription(subscriptions, googlefeed);
                amountOfFeedsToShow--;
                if (amountOfFeedsToShow === 0) {
                    localStorage[self.__SUBSCRIPTIONS_LOCAL_STORAGE] = JSON.stringify(subscriptions);
                    onGetSubscriptionList(subscriptions);
                }
            });
        }
    }
    else {
        var feedsToLoad = JSON.parse(localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE]);
        onGetSubscriptionList(feedsToLoad);
    }
};

GoogleFeed.prototype.retrieveSubscriptionItems = function(notUsed1, notUsed2, clickedFeedID, onRetrieveSubscriptionItems) {
    var feedsToLoad = JSON.parse(localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE]);
    onRetrieveSubscriptionItems(feedsToLoad[clickedFeedID].items);
};


GoogleFeed.prototype.__addSubscription = function(subscription, googleFeed) {
    var subscriptionid = "feed-" + Math.random();
    subscription[subscriptionid] = {
        id: subscriptionid,
        url: googleFeed.url,
        wwwurl: googleFeed.link,
        title: googleFeed.title,
        categories: undefined,
        image: undefined,
        items: this.__asSubscriptionItems(subscriptionid, googleFeed.entries)
    };
};

GoogleFeed.prototype.__asSubscriptionItems = function(subscriptionId, googleFeedEntries) {

    var subscriptionItems = {};
    for (var i = 0; i < googleFeedEntries.length; i++) {
        var googleFeedEntry = googleFeedEntries[i];
        var item = this.__asSubscriptionItem(subscriptionId, googleFeedEntry);
        subscriptionItems[googleFeedEntry.link] = item;
    }
    return subscriptionItems;
};

GoogleFeed.prototype.__asSubscriptionItem = function(subscriptionId, googleFeedEntry) {

    var subscriptionItem = {id: googleFeedEntry.link,
        title: googleFeedEntry.title,
        "subscriptionId": subscriptionId,
        "contentSnippet": googleFeedEntry.contentSnippet,
        "content": googleFeedEntry.content,
        "read": false
    };
    return subscriptionItem;
};

GoogleFeed.prototype.__loadFeedsFromGoogle = function(feedUrl, onFeedLoad) {
    var feed = new google.feeds.Feed(feedUrl);
    feed.setNumEntries(100);
    feed.load(function(retrievedFeed) {
        if (!retrievedFeed.error) {
            onFeedLoad(retrievedFeed.feed);
        }
    });
};
