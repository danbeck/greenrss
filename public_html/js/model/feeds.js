function FeedsModel(indexeddbService) {
    this.subscriptions = {};
    this.categories = {};
    this.items = {};
    if (indexeddbService !== null)
        this.indexeddbService = indexeddbService;

}
FeedsModel.prototype.loadFromDatabase = function(success, error) {
    this.indexeddbService.loadFeedModel(this, success, error);
};
//FeedsModel.prototype.getOrCreateSubscription = function(id, title, updatedDate, categories) {
//    if (this.subscriptions[id]) {
//        return this.subscriptions[id];
//    }
//    else {
//        var newSubscription = new Subscription(id, title, updatedDate, categories, []);
//        this.subscriptions[id] = newSubscription;
//        return newSubscription;
//    }
//};
//
//FeedsModel.prototype.addSubscription = function(subscription) {
//    this.subscriptions.push(subscription);
//    this.indexeddbService.saveFeedSubscription(subscription, function() {
//        console.log("ok");
//    }, function() {
//        console.log("ERROR");
//    });
//    if (subscription.categories) {
//        subscription.categories.forEach(function(category) {
//            if (!this.categories[category.id]) {
//                this.categories[category.id] = category;
//            }
//        });
//    }
//};


FeedsModel.prototype.getOrCreateSubscription = function(id, title, updatedDate, categories) {
    if (this.subscriptions[id])
        return this.subscriptions[id];
    else
        this.createSubscription(id, title, updatedDate, categories);
};

FeedsModel.prototype.createSubscription = function(id, title, updatedDate) {
    var newSubscription = new Subscription(this, id, title, updatedDate);
    this.subscriptions[id] = newSubscription;

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
function Item(id, title, updatedDate, unread, author, summary, content, href) {
    this.id = id;
    this.title = title;
    this.updatedDate = updatedDate;
    this.unread = unread;
    this.author = author;
    this.summary = summary;
    this.content = content;
    this.href = href;
}
