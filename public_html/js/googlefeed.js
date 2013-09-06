google.load("feeds", "1");

function GoogleFeed() {

    this.__DEFAULT_FEEDS = ["http://daniel-beck.org/feed/",
        "http://planet.ubuntu.com/rss20.xml",
        "http://planetkde.org/rss20.xml"];

    this.__SUBSCRIPTIONS_LOCAL_STORAGE = "google-subscriptions";
}

GoogleFeed.prototype.addSubscription = function(feedUrl, onSubscriptionAdded) {
    var self = this;
    var persistedsubscriptions = this.__getAllSubscriptionsFromLocalStorage();
    self.__loadFeedsFromGoogle(feedUrl, function(googlefeed) {
        var addedSubscription = self.__addSubscription(persistedsubscriptions, googlefeed);
        self.__saveSubscriptionsInLocalStorage(persistedsubscriptions);
        onSubscriptionAdded(addedSubscription);
    }
    );
};

GoogleFeed.prototype.setRead = function(subscriptionItem, dummyCallback) {
    var allSubscriptions = this.__getAllSubscriptionsFromLocalStorage();
    var persistedSubscription = allSubscriptions[subscriptionItem.subscriptionId];
    var persistedSubscriptionItems = persistedSubscription["items"];
    var persistedSubscriptionItem = persistedSubscriptionItems[subscriptionItem.id];
    persistedSubscriptionItem["read"] = true;
    this.__saveSubscriptionsInLocalStorage(allSubscriptions);
    dummyCallback();
};

GoogleFeed.prototype.retrieveSubscriptions = function(onGetSubscriptionList) {
    var self = this;

    if (!localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE]) {
        var subscriptions = {};

        var amountOfFeedsToShow = this.__DEFAULT_FEEDS.length;

        for (var i = 0; i < this.__DEFAULT_FEEDS.length; i++) {

            self.__loadFeedsFromGoogle(this.__DEFAULT_FEEDS[i], function(subscription) {
                self.__addSubscription(subscriptions, subscription);
                amountOfFeedsToShow--;
                if (amountOfFeedsToShow === 0) {
                    self.__saveSubscriptionsInLocalStorage(subscriptions);
                    onGetSubscriptionList(subscriptions);
                }
            });
        }
    }
    else {
        var feedsToLoad = self.__getAllSubscriptionsFromLocalStorage();
        onGetSubscriptionList(feedsToLoad);
    }
};

GoogleFeed.prototype.retrieveSubscriptionItems = function(notUsed1, notUsed2, clickedFeedID, onRetrieveSubscriptionItems) {
    var items = this.__getSubscriptionItemsFromLocalStorage(clickedFeedID);
    onRetrieveSubscriptionItems(items);
};


GoogleFeed.prototype.__addSubscription = function(subscription, googleFeed) {
    var subscriptionid = encodeURI(googleFeed.feedUrl);

    subscription[subscriptionid] = {
        id: subscriptionid,
        url: googleFeed.feedUrl,
        wwwurl: googleFeed.link,
        title: googleFeed.title,
        categories: undefined,
        image: undefined,
        items: this.__asSubscriptionItems(subscriptionid, googleFeed.entries)
    };

    return subscription[subscriptionid];
};


GoogleFeed.prototype.__getSubscriptionItemsFromLocalStorage = function(subscriptionId) {
    var subscription = this.__getSubscriptionFromLocalStorage(subscriptionId);
    return subscription["items"];
};

GoogleFeed.prototype.__getSubscriptionFromLocalStorage = function(subscriptionId) {
    var subscriptions = this.__getAllSubscriptionsFromLocalStorage();
    return subscriptions[subscriptionId];
};

GoogleFeed.prototype.__getAllSubscriptionsFromLocalStorage = function() {
    var subscriptionString = localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE];
    if (subscriptionString)
        return JSON.parse(subscriptionString);
    else
        return {};
};

GoogleFeed.prototype.__saveSubscriptionsInLocalStorage = function(subscriptions) {
    localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE] = JSON.stringify(subscriptions);
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

    var subscriptionItemId = encodeURI(googleFeedEntry.link);
    var subscriptionItem = {id: subscriptionItemId,
        title: googleFeedEntry.title,
        url: googleFeedEntry.link,
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