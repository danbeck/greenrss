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
    var request = indexedDB.open('KDE', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
        var db = e.target.result;

        e.target.transaction.onerror = error;
//        e.target.transaction.onerror = tDB.onerror;

        // Delete the old datastore.
        if (db.objectStoreNames.contains('todo')) {
            db.deleteObjectStore('todo');
        }

        // Create a new datastore.
        var store = db.createObjectStore('todo', {
            keyPath: 'timestamp'
        });
    };

    // Handle successful datastore access.
    request.onsuccess = function(e) {
        // Get a reference to the DB.
        datastore = e.target.result;

        // Execute the callback.
        success();
    };

    request.onerror = function(e){
        console.log("error")
    }
//    var request = indexedDB.open("feedsmodel", 2);
//    request.onupgradeneeded = function (e) {
//        // that.database = request.result;
//        that.database = e.target.result;
//        that.metadataStore = that.database.createObjectStore(that.METADATASTORE_NAME, {keyPath: "key"});
//        that.feedStore = that.database.createObjectStore(that.FEEDSTORE_NAME, {keyPath: "id"});
//        that.categoryStore = that.database.createObjectStore(that.CATEGORYSTORE_NAME, {keyPath: "id"});
//        that.feedEntryStore = that.database.createObjectStore(that.FEEDENTRYSTORE_NAME, {keyPath: "id"});
//
//        success();
//    };
//
//    request.onerror = function (e) {
//        console.log("Error");
//        console.dir(e);
//        error(e);
//    };
//
//    request.onsuccess = function (e) {
//        console.log("Success");
//        that.database = e.target.result;
//        console.dir(e);
//        success();
//    };
};

IndexeddbService.prototype.saveSSOAuthorizationCode = function (authorizationCode, success, error) {
    var that = this;

    if (!this.database)
        this._openDatabase(saveAuthorizationCode, success, error);
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