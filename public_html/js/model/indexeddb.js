function IndexeddbService() {
    this.METADATASTORE_NAME = "metadata";
    this.FEEDSTORE_NAME = "feed";
    this.CATEGORYSTORE_NAME = "category";
    this.FEEDENTRYSTORE_NAME = "feedEntry";
}

IndexeddbService.prototype._openDatabase = function (success, error) {
    var that = this;

    var version = 1;

    // Open a connection to the datastore.
    var request = indexedDB.open('feedsmodel', 1);

    // Handle datastore upgrades.
    request.onupgradeneeded = function (e) {
        var db = e.target.result;
        e.target.transaction.onerror = error;

        db.createObjectStore(that.METADATASTORE_NAME, {keyPath: "key"});
        db.createObjectStore(that.FEEDSTORE_NAME, {keyPath: "id"});
        db.createObjectStore(that.CATEGORYSTORE_NAME, {keyPath: "id"});
        db.createObjectStore(that.FEEDENTRYSTORE_NAME, {keyPath: "id"});
    };

    // Handle successful datastore access.
    request.onsuccess = function (e) {
        // Get a reference to the DB.
        that.database = e.target.result;

        //   that.database.openOb
        // Execute the callback.
        success();
    };

    request.onerror = function (e) {
        console.log("error")
    }
};

IndexeddbService.prototype.saveSSOAuthorizationCode = function (authorizationCode, success, error) {
    var that = this;

    if (!this.database)
        this._openDatabase(saveAuthorizationCode, success, error);
    else
        saveAuthorizationCode();

    function saveAuthorizationCode() {
        var transaction = that.database.transaction([that.METADATASTORE_NAME], "readwrite");
        var store = transaction.objectStore(that.METADATASTORE_NAME);
        var request = store.add({key: "authorizationCode", value: authorizationCode});
        request.onsuccess = success;
        request.onerror = error;
    }
};