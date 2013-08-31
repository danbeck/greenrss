function TheOldReader() {
    this.__THEOLDREADER_API_URL = "https://theoldreader.com/reader/api/0/";
    this.__THEOLDREADER_CLIENT_LOGIN_URL = this.__THEOLDREADER_API_URL + "accounts/ClientLogin";
    this.__THEOLDREADER_SUBSCRIPTIONLIST_URL = this.__THEOLDREADER_API_URL + "subscription/list?output=json";
    this.__THEOLDREADER_ITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json";
    this.__THEOLDREADER_ALLITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json&s=user/-/state/com.google/reading-list";
    this.__THEOLDREADER_READITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json&s=user/-/state/com.google/read";
    this.__THEOLDREADER_UNREADITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json&xt=user/-/state/com.google/read";
//    this.__THEOLDREADER_ITEM_CONTENT_URL = this.__THEOLDREADER_API_URL + "stream/items/contents?output=json";
    this.__THEOLDREADER_ITEM_CONTENT_URL = this.__THEOLDREADER_API_URL + "stream/contents?output=json";
}

TheOldReader.prototype.getLoginToken = function(email, password, gotToken) {
    var self = this;
    var url = this.__THEOLDREADER_CLIENT_LOGIN_URL;
    var data = "output=json&client=RamSamSamReader&accountType=HOSTED&service=reader&Email="
            + email + "&Passwd=" + password;
    postUrlEncodedHttpRequest(url, data, function(response) {
        self.__saveToken(response, gotToken);
    });
};


TheOldReader.prototype.getSubscriptionList = function(email, password,
        onGetSubscriptionList) {
    this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
    var url = this.__THEOLDREADER_SUBSCRIPTIONLIST_URL;
    getHttpRequest(url, onGetSubscriptionList);
};



TheOldReader.prototype.getAllItemIds = function(email, password,
        onGetSubscriptionList) {
    var self = this;
    this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
    var url = this.__THEOLDREADER_ALLITEM_IDS_URL;
    getHttpRequest(url, function(allItemIds) {
        var itemRefs = JSON.parse(allItemIds).itemRefs;
        var urlParameter = "";
        for (var i = 0; i < itemRefs.length; i++) {
            urlParameter += "&i=" + itemRefs[i].id;
//            onGetSubscriptionList();
        }
        getHttpRequest(self.__THEOLDREADER_ITEM_CONTENT_URL + urlParameter, onGetSubscriptionList);
    });
};


TheOldReader.prototype.getReadItemIds = function(email, password,
        onGetSubscriptionList) {
    this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
    var url = this.__THEOLDREADER_READITEM_IDS_URL;
    getHttpRequest(url, onGetSubscriptionList);
};

TheOldReader.prototype.getItemIdsForFolder = function(email, password,
        onGetSubscriptionList) {
    this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
    var url = this.__THEOLDREADER_ITEM_IDS_URL + "subscription/list?output=json";
    getHttpRequest(url, onGetSubscriptionList);
};

TheOldReader.prototype.getItemIdsForSubscription = function(email, password,
        onGetSubscriptionList) {
    this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
    var url = this.__THEOLDREADER_API_URL + "subscription/list?output=json";
    getHttpRequest(url, onGetSubscriptionList);
};

TheOldReader.prototype.getUnreadItemIds = function(email, password,
        onGetSubscriptionList) {
    this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
    var url = this.__THEOLDREADER_UNREADITEM_IDS_URL;
    getHttpRequest(url, onGetSubscriptionList);
};


TheOldReader.prototype.__retrieveTokenIfNecessary = function(email, password,
        func) {
    var self = this;
    if (!this.token)
        self.getLoginToken(email, password, function() {
            self.__retrieveTokenIfNecessary(email, password, func);
        });
};

TheOldReader.prototype.__saveToken = function(response, func) {
    var jsonResponse = JSON.parse(response);
    this.token = jsonResponse.Auth;
    func();
};