google.load("feeds", "1");

function GoogleFeed() {

    this.__DEFAULT_FEEDS = ["http://daniel-beck.org/feed/",
        "http://planet.ubuntu.com/rss20.xml",
        "http://planetkde.org/rss20.xml"];

    this.localStorageService = new LocalStorageService("google-subscriptions");
}

GoogleFeed.prototype.searchSubscriptions = function(query, findDone) {
	google.feeds.findFeeds(query, findDone);
};


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
    var allSubscriptions = this.localStorageService.getAllSubscriptionsFromLocalStorage();
    var persistedSubscription = allSubscriptions[subscriptionItem.subscriptionId];
    var persistedSubscriptionItems = persistedSubscription["items"];
    var persistedSubscriptionItem = persistedSubscriptionItems[subscriptionItem.id];
    persistedSubscriptionItem["read"] = true;
    this.localStorageService.saveSubscriptionsInLocalStorage(allSubscriptions);
    dummyCallback();
};

GoogleFeed.prototype.retrieveSubscriptions = function(onGetSubscriptionList) {
    var self = this;

    if (!self.localStorageService.keyExist()) {
        var subscriptions = {};

        var amountOfFeedsToShow = this.__DEFAULT_FEEDS.length;

        for (var i = 0; i < this.__DEFAULT_FEEDS.length; i++) {

            self.__loadFeedsFromGoogle(this.__DEFAULT_FEEDS[i], function(googleFeed) {
                self.__addSubscription(subscriptions, googleFeed);
                amountOfFeedsToShow--;
                if (amountOfFeedsToShow === 0) {
                    self.localStorageService.saveSubscriptionsInLocalStorage(subscriptions);
                    onGetSubscriptionList(subscriptions);
                }
            });
        }
    }
    else {
        var persistedSubscriptions = self.localStorageService.getAllSubscriptionsFromLocalStorage();
        for(var feedUrl in persistedSubscriptions){
        	self.__loadFeedsFromGoogle(feedUrl, function(googleFeed){
        		var retrievedSubscription = self.__asSubscriptionValue(googleFeed);
        		persistedSubscriptions = updateGoogleFeed(persistedSubscriptions, retrievedSubscription);
        		 self.localStorageService.saveSubscriptionsInLocalStorage(persistedSubscriptions);
        		 onGetSubscriptionList(persistedSubscriptions);
        	});
        	
        }
    }
    
    function updateGoogleFeed(persitedSubscriptions, retrievedSubscription){
		var feedUrl = retrievedSubscription["url"];
    	var persistedSubscription = persitedSubscriptions[feedUrl];
		if(!persistedSubscription){
			persitedSubscriptions[feedUrl] = retrievedSubscription;
		} 
		else {
		
			var retrievedSubscriptionItems = retrievedSubscription["items"];
			var persistedSubscriptionItemsObj = persistedSubscription["items"];
			for(subscriptionItemsUrl in retrievedSubscriptionItems){
				if (!persistedSubscriptionItemsObj[subscriptionItemsUrl]){
					persistedSubscriptionItemsObj[subscriptionItemsUrl] = retrievedSubscriptionItems[subscriptionItemsUrl];
				} else {
					var oldReadState= persistedSubscriptionItemsObj[subscriptionItemsUrl]["read"];
					persistedSubscriptionItemsObj[subscriptionItemsUrl] = retrievedSubscriptionItems[subscriptionItemsUrl];
					persistedSubscriptionItemsObj[subscriptionItemsUrl]["read"] = oldReadState;
			}
     		}
		}
		return persistedSubscriptions;		
	}
    
    function addNewSubscriptionArticle(subscriptionItemsObj, url){
    	
    }
};

GoogleFeed.prototype.retrieveSubscriptionItems = function(notUsed1, notUsed2, clickedFeedID, onRetrieveSubscriptionItems) {
    var itemContainer = this.localStorageService.getSubscriptionFromLocalStorage(clickedFeedID);
    onRetrieveSubscriptionItems(itemContainer);
};


GoogleFeed.prototype.__addSubscription = function(subscription, googleFeed) {
    var subscriptionid = encodeURI(googleFeed.feedUrl);

    subscription[subscriptionid] = this.__asSubscriptionValue(googleFeed);
    return subscription[subscriptionid];
};


GoogleFeed.prototype.__asSubscriptionValue = function(googleFeed) {
    var subscriptionid = encodeURI(googleFeed.feedUrl);

    var subscriptionObject = {
    		 id: subscriptionid,
    	        url: googleFeed.feedUrl,
    	        wwwurl: googleFeed.link,
    	        title: googleFeed.title,
    	        categories: undefined,
    	        image: undefined,
    	        items: this.__asSubscriptionItems(subscriptionid, googleFeed.entries)
    };
    return subscriptionObject;
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
        publishedDate: googleFeedEntry.publishedDate,
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