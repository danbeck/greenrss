function LocalStorageService(localStoragekey, compabilityVersion) {
  this.__SUBSCRIPTIONS_LOCAL_STORAGE = localStoragekey;
  this.__compabilityVersion = compabilityVersion;
}


//LocalStorageService.prototype.__getSubscriptionItemsFromLocalStorage = function(subscriptionId) {
//    var subscription = this.__getSubscriptionFromLocalStorage(subscriptionId);
//    return subscription["items"];
//};


LocalStorageService.prototype.isVersionCompatible = function() {
  if (!localStorage)
    return false;
  return localStorage["version"] === this.__compabilityVersion;
};


LocalStorageService.prototype.saveVersion = function() {
  localStorage["version"] = this.__compabilityVersion;
};


LocalStorageService.prototype.clearLocalStorage = function() {
  localStorage.clear();
};

LocalStorageService.prototype.keyExist = function() {
  return localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE];
};

LocalStorageService.prototype.getSubscriptionFromLocalStorage = function(subscriptionId) {
  var subscriptions = this.getAllSubscriptionsFromLocalStorage();
  return subscriptions[subscriptionId];
};

LocalStorageService.prototype.getAllSubscriptionsFromLocalStorage = function() {
  var subscriptionString = localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE];
  if (subscriptionString)
    return JSON.parse(subscriptionString);
  else
    return {};
};



/*
 * old:
 * subscriptions: {
 http://daniel-beck.org/feed/: {
 id: "http://daniel-beck.org/feed/"
 title: "Daniel's Blog"
 url: "http://daniel-beck.org/feed/"
 wwwurl: "http://daniel-beck.org"
 items: {
 title: "Daniel's Blog"
 url: "http://daniel-beck.org/feed/"
 wwwurl: "http://daniel-beck.org"
 http://daniel-beck.org/ramsamsam-reader-design-updates/: {
 content: "<h1>A new icon</h1>↵<div style="width:145px"><a href"
 contentSnippet: "A new icon Lucas Romero Di Benedetto and Sam Hewitt created an icon for RamSamSam Reader. The icon is beautiful, thanks Lucas ..."
 id: "http://daniel-beck.org/ramsamsam-reader-design-updates/"
 publishedDate: "Thu, 05 Sep 2013 09:25:58 -0700"
 read: false
 subscriptionId: "http://daniel-beck.org/feed/"
 title: "RamSamSam Reader: layout updates"
 url: "http://daniel-beck.org/ramsamsam-reader-design-updates/"
 }
 */


/*
 * new:
 * subscription: {
 id: "http://daniel-beck.org/feed/"
 syncid: "http://daniel-beck.org/feed/"
 title: "Daniel's Blog"
 subscriptionurl: "http://daniel-beck.org/feed/"
 wwwurl: "http://daniel-beck.org"
 items: {
 title: "Daniel's Blog"
 url: "http://daniel-beck.org/feed/"
 wwwurl: "http://daniel-beck.org"
 http://daniel-beck.org/ramsamsam-reader-design-updates/: {
 content: "<h1>A new icon</h1>↵<div style="width:145px"><a href"
 contentSnippet: "A new icon Lucas Romero Di Benedetto and Sam Hewitt created an icon for RamSamSam Reader. The icon is beautiful, thanks Lucas ..."
 id: "http://daniel-beck.org/ramsamsam-reader-design-updates/"
 publishedDate: "Thu, 05 Sep 2013 09:25:58 -0700"
 read: false
 subscriptionId: "http://daniel-beck.org/feed/"
 title: "RamSamSam Reader: layout updates"
 url: "http://daniel-beck.org/ramsamsam-reader-design-updates/"
 }
 */
LocalStorageService.prototype.saveSubscriptionsInLocalStorage = function(subscriptions) {
  var request = indexedDB.open("subscriptions", 4);

  request.onupgradeneeded = function(event) {
    var db = event.target.result;

    // Create an objectStore to hold information about our customers. We're
    // going to use "ssn" as our key path because it's guaranteed to be
    // unique.
//    db.deleteObjectStore("subscriptions");
//    var objectStore = db.createObjectStore("subscriptions", {keyPath: "id", autoIncrement: true});
    var objectStore = db.createObjectStore("subscriptions", {keyPath: undefined, autoIncrement: true});
//
//    // Create an index to search customers by name. We may have duplicates
//    // so we can't use a unique index.
//    objectStore.createIndex("syncid", "syncid", {unique: true});

  };


  request.onsuccess = function(event) {
    var db = this.result;
    var transaction = db.transaction(["subscriptions"], "readwrite");
    var store = transaction.objectStore("subscriptions");

    for (var i in subscriptions) {
      var request = store.put(subscriptions[i]);
      store.put(subscriptions[i]);
    }
  };


  request.onerror = function(event) {
    console.log("found error");
    var db = this.result;

  };
//  localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE] = JSON.stringify(subscriptions);
};