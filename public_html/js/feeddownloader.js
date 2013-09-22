function TheOldReaderWebWorker() {
  this.__THEOLDREADER_API_URL = "https://theoldreader.com/reader/api/0/";
  this.__THEOLDREADER_CLIENT_LOGIN_URL = this.__THEOLDREADER_API_URL + "accounts/ClientLogin";
  this.__THEOLDREADER_SUBSCRIPTIONLIST_URL = this.__THEOLDREADER_API_URL + "subscription/list?output=json";
  this.__THEOLDREADER_ITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json";
  this.__THEOLDREADER_ALLITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json&s=user/-/state/com.google/reading-list";
  this.__THEOLDREADER_ITEM_IDS_FOR_FEED_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json&s=";
  this.__THEOLDREADER_READITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json&s=user/-/state/com.google/read";
  this.__THEOLDREADER_UNREADITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json&xt=user/-/state/com.google/read";
  this.__THEOLDREADER_ITEM_CONTENT_URL = this.__THEOLDREADER_API_URL + "stream/items/contents?output=json";
  this.__THEOLDREADER_UNREADCOUNT_URL = this.__THEOLDREADER_API_URL + "unread-count?output=json";
  this.__THEOLDREADER_UPDATEITEM_URL = this.__THEOLDREADER_API_URL + "edit-tag";

  this.__SUBSCRIPTIONS_LOCAL_STORAGE = "theoldreader-subscriptions";
  this.localStorageService = new LocalStorageService(this.__SUBSCRIPTIONS_LOCAL_STORAGE);
  //    this.__THEOLDREADER_ITEM_CONTENT_URL = this.__THEOLDREADER_API_URL + "stream/contents?output=json";
}

TheOldReaderWebWorker.prototype.retrieveLoginToken = function(email, password, gotToken, onError) {
  var that = this;
  var data = "output=json&client=RamSamSamReader&accountType=HOSTED&service=reader&Email="
          + email + "&Passwd=" + password;
  postUrlEncodedHttpRequest(this.__THEOLDREADER_CLIENT_LOGIN_URL, data, function(response) {
    that.__saveToken(response);
    gotToken.apply(undefined, gotToken.arguments);
  }, onError);
};

TheOldReaderWebWorker.prototype.retrieveSubscriptions = function(email, password,
        onGetSubscriptionList) {
  var that = this;

  this.__retrieveTokenIfNecessary(email, password, function() {
    getHttpRequest(that.__THEOLDREADER_SUBSCRIPTIONLIST_URL, function(result) {
      var subscriptionList = JSON.parse(result).subscriptions;

      var result = {};

      for (var i = 0; i < subscriptionList.length; i++) {
        var subscription = subscriptionList[i];
        var subscriptionid = subscription.id;
        result[subscriptionid] = {
          id: subscriptionid,
          url: subscription.url,
          wwwurl: subscription.htmlUrl,
          title: subscription.title,
          categories: subscription.categories,
          image: subscription.iconUrl};
      }
      that.localStorageService.saveSubscriptionsInLocalStorage(result);
      onGetSubscriptionList(result);
    });
  });
};


TheOldReaderWebWorker.prototype.getSubscriptions = function(email, password,
        onGetSubscriptionList) {
  var that = this;

  var subscriptions = that.localStorageService
          .getAllSubscriptionsFromLocalStorage();
  onGetSubscriptionList(subscriptions);
};


TheOldReaderWebWorker.prototype.retrieveUnreadCount = function(email, password,
        onRetrieveUnreadCound) {
  var that = this;

  this.__retrieveTokenIfNecessary(email, password, function() {
    getHttpRequest(that.__THEOLDREADER_UNREADCOUNT_URL, function(result) {
      var resultObject = JSON.parse(result);
      ;

      onRetrieveUnreadCound(result);
    });
  });
};

TheOldReaderWebWorker.prototype.getAllItemIds = function(email, password,
        onGetAllItemIds) {
  var that = this;
  this.__retrieveTokenIfNecessary(email, password, function() {

    getHttpRequest(that.__THEOLDREADER_ALLITEM_IDS_URL, function(allItemIds) {
      var itemRefs = JSON.parse(allItemIds).itemRefs;
      var urlParameter = createUrlParamerters(itemRefs);
      postUrlEncodedHttpRequest(that.__THEOLDREADER_ITEM_CONTENT_URL, urlParameter, onGetAllItemIds);

      function createUrlParamerters(itemRefs) {
        if (itemRefs.length === 0)
          return "";

        var urlParameter = "i=";
        var newArray = new Array();
        for (var i = 0; i < itemRefs.length; i++) {
          newArray.push(itemRefs[i].id);
        }
        urlParameter += newArray.join("&i=");
        return urlParameter;
      }
    });
  });
};


TheOldReaderWebWorker.prototype.getReadItemIds = function(email, password,
        onGetSubscriptionList) {
  this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
  getHttpRequest(this.__THEOLDREADER_READITEM_IDS_URL, onGetSubscriptionList);
};

TheOldReaderWebWorker.prototype.getItemIdsForFolder = function(email, password,
        onGetSubscriptionList) {
  this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
  var url = this.__THEOLDREADER_ITEM_IDS_URL + "subscription/list?output=json";
  getHttpRequest(url, onGetSubscriptionList);
};

//TheOldReaderWebWorker.prototype.getItemIdsForSubscription = function(email, password,
//        onGetSubscriptionList) {
//    this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
//    var url = this.__THEOLDREADER_API_URL + "subscription/list?output=json";
//    getHttpRequest(url, onGetSubscriptionList);
//};


TheOldReaderWebWorker.prototype.retrieveSubscriptionItems = function(email, password, subscriptionid,
        onGetAllItemIds) {
  var that = this;
  this.__retrieveTokenIfNecessary(email, password, function() {

    getHttpRequest(that.__THEOLDREADER_ITEM_IDS_FOR_FEED_URL + subscriptionid, function(itemIds) {
      var itemRefs = JSON.parse(itemIds).itemRefs;
      var urlParameter = createUrlParamerters(itemRefs);
      postUrlEncodedHttpRequest(that.__THEOLDREADER_ITEM_CONTENT_URL, urlParameter, function(response) {
        var feedItemsContainer = JSON.parse(response);
        var result = convertToSubscriptionItems(subscriptionid, feedItemsContainer);
        var allSubscriptions = that.localStorageService.getAllSubscriptionsFromLocalStorage();
        allSubscriptions[subscriptionid]["items"] = result["items"];
        that.localStorageService.saveSubscriptionsInLocalStorage(allSubscriptions);
        onGetAllItemIds(result);
      });

      function createUrlParamerters(itemRefs) {
        if (itemRefs.length === 0)
          return "";

        var urlParameter = "i=";
        var newArray = new Array();
        for (var i = 0; i < itemRefs.length; i++) {
          newArray.push(itemRefs[i].id);
        }
        urlParameter += newArray.join("&i=");
        return urlParameter;
      }

      function convertToSubscriptionItems(subscriptionid, theOldReaderFeedItems) {
        var items = theOldReaderFeedItems.items;
        var itemsFromResult = {};

        var result = {items: itemsFromResult};
        if (theOldReaderFeedItems["alternate"] && theOldReaderFeedItems["alternate"]["href"])
          result["wwwurl"] = theOldReaderFeedItems["alternate"]["href"];
        if (items !== undefined)
          for (var i = 0; i < items.length; i++) {
            itemsFromResult[items[i].id] = convertToSubscriptionItem(subscriptionid, items[i]);
          }
        return result;
      }


      function convertToSubscriptionItem(subscriptionid, theOldReaderFeedItem) {
        var text = stripHTML(theOldReaderFeedItem.summary.content);
        var itemWasRead = false;
        if (theOldReaderFeedItem.categories.indexOf("user/-/state/com.google/read") !== -1)
          itemWasRead = true;

        var result = {id: theOldReaderFeedItem.id,
          title: theOldReaderFeedItem.title,
          subscriptionId: subscriptionid,
          contentSnippet: text,
          content: theOldReaderFeedItem.summary.content,
          read: itemWasRead};
        return result;
      }
    });
  });
};

TheOldReaderWebWorker.prototype.getSubscriptionItems = function(email, password,
        subscriptionid, onGetAllItemIds) {
  var subscriptions = this.localStorageService
          .getSubscriptionFromLocalStorage(subscriptionid);
  onGetAllItemIds(subscriptions);
};

TheOldReaderWebWorker.prototype.getUnreadItemIds = function(email, password,
        onGetSubscriptionList) {
  this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
  var url = this.__THEOLDREADER_UNREADITEM_IDS_URL;
  getHttpRequest(url, onGetSubscriptionList);
};


TheOldReaderWebWorker.prototype.setRead = function(email, password, subscriptionitem) {
  var url = this.__THEOLDREADER_UPDATEITEM_URL;
  var data = "i=" + subscriptionitem.id + "&a=user/-/state/com.google/read";
  this.__retrieveTokenIfNecessary(email, password, function() {
    postUrlEncodedHttpRequest(url, data, function() {
    }, function() {
    });
  });

};


TheOldReaderWebWorker.prototype.__retrieveTokenIfNecessary = function(email, password,
        func, onError) {
  var that = this;
  if (!this.token)
    that.retrieveLoginToken(email, password, func, onError);
  else
    func.apply(undefined, func.arguments);
};

TheOldReaderWebWorker.prototype.__saveToken = function(response) {
  var jsonResponse = JSON.parse(response);
  this.token = jsonResponse.Auth;
};

function makeSync(self) {
  self.postMessage("createing theoldread obj");
  var theOldReaderWebWorker = new TheOldReaderWebWorker();
  self.postMessage("retrievesubscritptions");
  theOldReaderWebWorker.retrieveSubscriptions("d..com", "", function() {
    self.postMessage("done");
  });
}

self.addEventListener('message', function(e) {
  if (e.data.command === "sync") {
    self.postMessage("starting sync");
    makeSync(self);
  }
}, false);