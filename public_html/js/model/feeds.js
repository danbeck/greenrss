function FeedsModel(indexeddbService) {
    this.indexeddbService = indexeddbService;
    this.subscriptions = [];
}

FeedsModel.prototype.addSubscription = function(subscription) {
    this.subscriptions.push(subscription);
};


function Subscription(id, title, updatedDate, categories, items) {
    this.id = id;
    this.title = title;
    this.updatedDate = updatedDate;
    this.items = items;
    this.categories = categories;
}

Subscription.prototype.addItems = function(items) {
    var that = this;
    items.forEach(function(item) {
        that.addItems(item);
    });
};

Subscription.prototype.addItem = function(item) {
    this.items.add(item);
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