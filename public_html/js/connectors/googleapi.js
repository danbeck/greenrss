function GoogleFeedService() {
    this.syncServiceConfigured = function() {
        return true;
    };

    this.retrieveSubscriptions = function(feedsmodel) {
        var self = this;
        feedsmodel.getSubscriptions().forEach(function(subscription) {
            loadFeedsFromGoogle(subscription.id, function(googlefeed) {
                if (googlefeed.entries) {
//                var subscriptionid = encodeURI(googlefeed.feedUrl);
                    googlefeed.entries.forEach(function(entry) {
                        subscription.addItem(entry.link, entry.title, entry.publishedDate, true,
                                entry.author, entry.link, entry.contentSnippet, entry.content);
                    });
                }
            }
            );

        });
//        var persistedsubscriptions = this.localStorageService.getAllSubscriptionsFromLocalStorage();
    };


    loadFeedsFromGoogle = function(feedUrl, onFeedLoad) {
        var feed = new google.feeds.Feed(feedUrl);
        feed.setNumEntries(100);
        feed.load(function(retrievedFeed) {
            if (!retrievedFeed.error) {
                onFeedLoad(retrievedFeed.feed);
            }
        });
    };
}


