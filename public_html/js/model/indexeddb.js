function IndexeddbService() {
    this.METADATASTORE_NAME = "metadata";
    this.FEEDSTORE_NAME = "feed";
    this.CATEGORYSTORE_NAME = "category";
    this.FEEDENTRYSTORE_NAME = "feedEntry";
    this.DB_VERSION = 1;
}


IndexeddbService.prototype.init = function(success, error) {
    var that = this;

    // Open a connection to the datastore.
    var request = indexedDB.open('feedsmodel', 1);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
        var db = e.target.result;
        e.target.transaction.onerror = error;

        db.createObjectStore("subscriptions", {keyPath: "id"});
        db.createObjectStore("categories", {keyPath: "id"});
        db.createObjectStore("entries", {keyPath: "id"});
    };

    // Handle successful datastore access.
    request.onsuccess = function(e) {
        // Get a reference to the DB.
        that.database = e.target.result;
        success();
    };

    request.onerror = function(e) {
        console.log("error");
        console.dir(e);
        error(e);
    };
};


IndexeddbService.prototype.loadFeedModel = function(feedsmodel, success, error) {
    var transaction = this.database.transaction(["subscriptions", "categories", "entries"], "readonly");
    var objectStore = transaction.objectStore("subscriptions");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var id = cursor.key;
            var title = cursor.value.title;
            var updatedDate = cursor.value.updatedDate;
            var categories = cursor.value.categories;
            var items = cursor.value.items;

            var subscription = new Subscription(id, title, updatedDate, categories, items);
            feedsmodel.addSubscription(subscription);
            cursor.continue();
        }
        else {
            console.log("finished reading indexeddb");
        }
    };
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
    var transaction = this.database.transaction(["subscriptions", "entries"], "readwrite");
    var objectStore = transaction.objectStore("subscriptions");
//    var objectStore = transaction.objectStore("entries");

    var request = objectStore.add(subscription);
    request.onsuccess = function(event) {
//        subscription.ite

        success();
    };
    request.onerror = function(e) {
        error(e);
    };
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