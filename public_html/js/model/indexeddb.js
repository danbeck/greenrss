function IndexeddbService() {
}

IndexeddbService.prototype.loadFeed = function(feedsmodel) {
    $.indexedDB("feedsmodel", {
        1: function(versionTransaction) {
            versionTransaction.createObjectStore("feeds", {keyPath: "id"});
        }});

};