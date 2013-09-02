google.load("feeds", "1");

function GoogleFeed() {

    this.__DEFAULT_FEEDS = ["http://daniel-beck.org/feed/",
        "http://planet.ubuntu.com/rss20.xml",
        "http://planetkde.org/rss20.xml"];
}

GoogleFeed.prototype.addSubscription = function(feedUrl, onSubscriptionAdded) {
    localStorage["feeds"].feedUrl = "null";
    onSubscriptionAdded.apply(undefined, onSubscriptionAdded.arguments);
};

GoogleFeed.prototype.getSubscriptionList = function(onGetSubscriptionList) {
    var self = this;

    var feedsToLoad;
    if (!localStorage["google-subscriptions"]) {
        var subscription = {};

        var amountOfFeedsToShow = this.__DEFAULT_FEEDS.length;

        for (var i = 0; this.__DEFAULT_FEEDS.length; i++) {

            self.__loadFeedsFromGoogle(this.__DEFAULT_FEEDS[i], function(googlefeed) {
                var feedurl = feed.feedUrl;
//                var subscriptionItems = self.__asSubscriptionItems(feedurl, googlefeed.entries);

                __addSubscription(subscription, feedurl, googlefeed);
//                subscription[feedurl] = {
//                    wwwurl: feed.link,
//                    title: feed.title,
//                    categories: undefined,
//                    image: undefined,
//                    items: subscriptionItems
//                };
                amountOfFeedsToShow--;
                if (amountOfFeedsToShow === 0)
                    onGetSubscriptionList(subscription);
            });
        }
    }
    else {
        feedsToLoad = JSON.parse(localStorage["google-subscriptions"]);
        onGetSubscriptionList(feedsToLoad);
    }

};



GoogleFeed.prototype.__addSubscription = function(subscription, feedurl, googleFeed) {
    subscription[feedurl] = {
        wwwurl: googlefeed.link,
        title: googlefeed.title,
        categories: undefined,
        image: undefined,
        items: this.__asSubscriptionItems(feedurl, googleFeed.entries)
    };
};

GoogleFeed.prototype.__asSubscriptionItems = function(subscriptionId, googleFeedEntries) {

    var subscriptionItems = [];
    for (var i = 0; i < googleFeedEntries.length; i++) {
        var item = this.__asSubscriptionItem(subscriptionId, googleFeedEntries[i]);
        subscriptionItems.push(item);
    }
    return subscriptionItems;
};

GoogleFeed.prototype.__asSubscriptionItem = function(subscriptionId, googleFeedEntry) {

    var subscriptionItem = {title: googleFeedEntry.title,
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


