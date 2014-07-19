function FeedsModel(indexeddbService) {
    this.indexeddbService = indexeddbService;
    this.subscriptions = {};
    this.categories = {};
}
FeedsModel.prototype.getOrCreateSubscription = function(id, title, updatedDate, categories) {
    if (this.subscriptions[id]) {
        return this.subscriptions[id];
    }
    else {
        var newSubscription = new Subscription(id, title, updatedDate, categories, []);
        this.subscriptions[id] = newSubscription;
        return newSubscription;
    }
};

FeedsModel.prototype.addSubscription = function(subscription) {
    this.subscriptions.push(subscription);
    if (subscription.categories) {
        subscription.categories.forEach(function(category) {
            if (!this.categories[category.id]) {
                this.categories[category.id] = category;
            }
        });
    }
};


function Subscription(id, title, updatedDate, categories, items) {
    this.id = id;
    this.title = title;
    this.updatedDate = updatedDate;
    this.items = items;
    this.categories = categories;
}

Subscription.prototype.addItems = function(items) {
    for (var item in items) {
//    if (object.hasOwnProperty(property)) 
        this.addItem(item);
    }
};

Subscription.prototype.addItem = function(id, title, updatedDate, unread, author, href, summary, content) {
    this.items[id] = new Entry(id, title, updatedDate, unread, author, href, summary, content);
};

function Category(id, title) {
    this.id = id;
    this.title = title;
}

function Entry(id, title, updatedDate, unread, author, summary, content, href) {
    this.id = id;
    this.title = title;
    this.updatedDate = updatedDate;
    this.unread = unread;
    this.author = author;
    this.summary = summary;
    this.content = content;
    this.href = href;
}