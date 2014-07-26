function FeedsModel(indexeddbService, cloudService) {
    this.subscriptions = {};
    this.categories = {};
    this.items = {};
    this.cloudService = cloudService;
    this.subscriptionAddedListener = new ChangeListeners();
//    if (indexeddbService !== null)
    this.indexeddbService = indexeddbService;

}

FeedsModel.prototype.retrieveAccessToken = function(code, success) {
    this.cloudService.retrieveAccessToken(code, success);
};

FeedsModel.prototype.ssoLoginURL = function() {
    return this.cloudService.ssoLoginURL();
};

FeedsModel.prototype.initAndloadFromDatabase = function(success, error) {
    var that = this;

    this.indexeddbService.init(function() {
        that.loadFromDatabase(function() {
            that.cloudService.retrieveSubscriptions(that, logNothing, logNothing);
        }, logNothing);
    }, logNothing);
    function logNothing() {
//        cons
    }
};

FeedsModel.prototype.registerSubscriptionAddedListener = function(handler) {
    this.subscriptionAddedListener.add(handler);
};


FeedsModel.prototype.loadFromDatabase = function(success, error) {
    this.indexeddbService.loadFeedModel(this, success, error);
};



FeedsModel.prototype.syncServiceConfigured = function() {
    if (!this.cloudService)
        return false;
    return this.cloudService.syncServiceConfigured();
};

FeedsModel.prototype.setCloudService = function(cloudServiceKey) {
    if (cloudServiceKey === "feedly")
        this.cloudService = new Feedly(this.feedsModel);
    if (cloudServiceKey === "theoldreader")
        this.cloudService = new TheOldReader(this.feedsModel);
    if (cloudServiceKey === "local")
        this.cloudService = new GoogleFeedService(this.feedsModel);
    localStorage.setItem("cloudService", cloudServiceKey);

};



FeedsModel.prototype.synchronizeFeeds = function(success, error) {
    this.cloudService.retrieveSubscriptions(this, saveFeeds, error);

    function saveFeeds() {
        console.log("TODO: save feeds in indexeddb");
        success();
    }
};



FeedsModel.prototype.subscribeFeed = function(url, success) {
    return this.cloudService.subscribeFeed(url, success);
};

FeedsModel.prototype.getOrCreateSubscription = function(id, title, updatedDate) {
    if (this.subscriptions[id])
        return this.subscriptions[id];
    else
        this.createSubscription(id, title, updatedDate);
};

FeedsModel.prototype.getSubscription = function(id) {
    if (this.subscriptions[id])
        return this.subscriptions[id];
    return null;
};

FeedsModel.prototype.createSubscription = function(id, title, updatedDate) {
    var newSubscription = new Subscription(this, id, title, updatedDate);
    this.subscriptions[id] = newSubscription;
    this.subscriptionAddedListener.notify(newSubscription);
    return newSubscription;
};

FeedsModel.prototype.createAndPersistSubscription = function(id, title, updatedDate, success) {
    var newSubscription = this.createSubscription(id, title, updatedDate);

    newSubscription.persistSubscription();
    return newSubscription;
};



FeedsModel.prototype.getSubscriptions = function() {
    var result = [];
    for (var id in this.subscriptions) {
        result.push(this.subscriptions[id]);
    }
    return result;
};

function Subscription(feedsmodel, id, title, updatedDate, categories, items) {
    this.feedsmodel = feedsmodel;
    this.id = id;
    this.title = title;
    this.updatedDate = updatedDate;
    this.items = {};
    this.categories = {};
}

Subscription.prototype.addItem = function(id, title, updatedDate, unread, author, href, summary, content) {
    this.items[id] = title;
    var newItem = new Item(id, title, updatedDate, unread, author, href, summary, content);
    this.feedsmodel.items[id] = newItem;
    return newItem;
};

Subscription.prototype.persistSubscription = function() {
    this.feedsmodel.indexeddbService.saveFeedSubscription(this,
            function() {
                console.log("feed saved");
            },
            function() {
                console.log("feed saved");
            }
    );
};

Subscription.prototype.addCategory = function(id, title) {
    this.categories[id] = title;
    this.feedsmodel.categories[id] = new Category(id, title);
};

Subscription.prototype.getItem = function(id) {
    return this.feedsmodel.items[id];
};

Subscription.prototype.getItems = function() {
    var result = [];
    for (var itemid in this.items) {
        result.push(this.feedsmodel.items[itemid]);
    }
    return result;
};


Subscription.prototype.getCategories = function() {
    var that = this;
    var result = [];
    for (var catid in this.categories) {
        result.push(that.feedsmodel.categories[catid]);
    }
    return result;
};

function Category(id, title) {
    this.id = id;
    this.title = title;
}
function Item(id, title, updatedDate, unread, author, href, summary, content) {
    this.id = id;
    this.title = title;
    this.updatedDate = updatedDate;
    this.unread = unread;
    this.author = author;
    this.href = href;
    this.summary = summary;
    this.content = content;
}
