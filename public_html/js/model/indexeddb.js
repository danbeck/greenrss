function IndexeddbService() {
    this.METADATASTORE_NAME = "metadata";
    this.FEEDSTORE_NAME = "feed";
    this.CATEGORYSTORE_NAME = "category";
    this.FEEDENTRYSTORE_NAME = "feedEntry";
    this.DB_VERSION = 1;
}


IndexeddbService.prototype.init = function(success, error) {

    var dbOpenPromise = $.indexedDB("feedsmodel", {
        "version": 1,
        "schema": {
            "1": function(v) {
                v.createObjectStore("subscriptions", {keyPath: "id"});
                v.createObjectStore("categories", {keyPath: "id"});
                v.createObjectStore("items", {keyPath: "id"});
            }
//           , "2": function(versionTransaction) {
//                versionTransaction.createObjectStore("objectStore2");
//            }
        }
    });
    dbOpenPromise.done(success);
    dbOpenPromise.fail(error);
};

IndexeddbService.prototype.loadFeedModel = function(feedsmodel, success, error) {
    var that = this;
    var transactionPromise = $.indexedDB("feedsmodel").transaction(["subscriptions", "categories", "items"]).then(function(transaction) {

        var iterationPromise = $.indexedDB("feedsmodel").objectStore("subscriptions").each(function(entry) {
            var id = entry.key;
            var title = entry.value.title;
            var updatedDate = entry.value.updatedDate;
            var categories = entry.value.categories;
            var items = entry.value.items;
            var subscription = feedsmodel.createSubscription(id, title, updatedDate);
            subscription.tmpItemIds = [];
            for (var cat in categories) {
                subscription.addCategory(cat.id, cat.title);
            }
            for (var item in items) {
                subscription.tmpItemIds.push(item);
            }
        });

        iterationPromise.done(function() {
            feedsmodel.getSubscriptions().forEach(function(subscription) {
                subscription.tmpItemIds.forEach(function(itemId) {
                    var promise = $.indexedDB("feedsmodel").objectStore("items").get(itemId);
                    promise.done(function(item) {
                        subscription.addItem(item.id, item.title, item.updatedDate, item.unread, item.author, item.href, item.summary, item.content);
                    });
                });
                delete subscription.tmpItemIds;
            });
        });

        console.log("in progress");
    }, function() {
        success();
    }, function(transaction) {
        console.log("fail");
    });
};




IndexeddbService.prototype.saveFeedEntry = function(feedentry, success, error) {
    var transaction = this.database.transaction(["entries"], "readwrite");
    var objectStore = transaction.objectStore("entries");

    var request = objectStore.add(feedentry);
    request.onsuccess = function(event) {
        success();
    };
    request.onerror = function(e) {
        error(e);
    };
};

IndexeddbService.prototype.saveFeedSubscription = function(subscription, success, error) {
    var feedsmodel = subscription["feedsmodel"];
    delete subscription["feedsmodel"];

    $.indexedDB("feedsmodel").objectStore("subscriptions", true).put(subscription).then(subscriptionWritten);

    subscription["feedsmodel"] = feedsmodel;

    var categories = subscription.getCategories();
    categories.forEach(function(category) {
        $.indexedDB("feedsmodel").objectStore("categories", true).put(category).then(categoryWritten);
    });

    var items = subscription.getItems();
    items.forEach(function(item) {
        $.indexedDB("feedsmodel").objectStore("items", true).put(item).then(itemWritten);
    });

    function categoryWritten() {
        console.log("category written");
    }
    function subscriptionWritten() {
        console.log("subscription written");
    }
    function itemWritten() {
        console.log("subscription written");
    }

};


//IndexeddbService.prototype.saveSSOAuthorizationCode = function(authorizationCode, success, error) {
//    var that = this;
//
//    if (!this.database)
//        this._openDatabase(saveAuthorizationCode, success, error);
//    else
//        saveAuthorizationCode();
//
//    function saveAuthorizationCode() {
//        var transaction = that.database.transaction([that.METADATASTORE_NAME], "readwrite");
//        var store = transaction.objectStore(that.METADATASTORE_NAME);
//        var request = store.add({key: "authorizationCode", value: authorizationCode});
//        request.onsuccess = success;
//        request.onerror = error;
//    }
//};