function IndexeddbService() {
    this.METADATASTORE_NAME = "metadata";
    this.FEEDSTORE_NAME = "feed";
    this.CATEGORYSTORE_NAME = "category";
    this.FEEDENTRYSTORE_NAME = "feedEntry";
}

IndexeddbService.prototype._openDatabase = function (success, error) {
    var that = this;

    indexedDB.onerror = function (e) {
        console.log(e)
    };

    var openDBRequest = indexedDB.open("feedsmodel", 1);
    openDBRequest.onupgradeneeded = function (e) {
        that.database = openDBRequest.result;
        that.database.createObjectStore(that.METADATASTORE_NAME, {keyPath: "key"});
        that.feedStore = that.database.createObjectStore(that.FEEDSTORE_NAME, {keyPath: "id"});
        that.categoryStore = that.database.createObjectStore(that.CATEGORYSTORE_NAME, {keyPath: "id"});
        that.feedEntryStore = that.database.createObjectStore(that.FEEDENTRYSTORE_NAME, {keyPath: "id"});

        success();
    };

    openDBRequest.onerror = function (e) {
        console.log("Error");
        console.dir(e);
        error(e);
    };

    openDBRequest.onsuccess = function (e) {
        that.database = e.target.result;
        console.log("Success");
        console.dir(e);
        success();
    };
};

IndexeddbService.prototype.saveSSOAuthorizationCode = function (authorizationCode, success, error) {
    var that = this;

    if (!this.database)
        this._openDatabase(saveAuthorizationCode, error);
    else
        saveAuthorizationCode();

    function saveAuthorizationCode() {
        var transaction = that.database.transaction([that.METADATASTORE_NAME, "readwrite"]);
        var store = transaction.objectStore(that.METADATASTORE_NAME);
        var request = store.add({key: "authorizationCode", value: authorizationCode});
        request.onSuccess(success);
        request.onError(error);
    }
};

IndexeddbService.prototype.loadFeed = function (feedsmodel) {
    $.indexedDB("feedsmodel", {
        1: function (versionTransaction) {
            versionTransaction.createObjectStore("feeds", {keyPath: "id"});
        }});

};