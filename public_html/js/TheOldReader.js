function TheOldReader() {
    this.__THEOLDREADER_API_URL = "https://theoldreader.com/reader/api/0/";
    this.__THEOLDREADER_CLIENT_LOGIN_URL = this.__THEOLDREADER_API_URL + "accounts/ClientLogin";
    this.__THEOLDREADER_SUBSCRIPTIONLIST_URL = this.__THEOLDREADER_API_URL + "subscription/list?output=json";
    this.__THEOLDREADER_ITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json";
    this.__THEOLDREADER_ALLITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json&s=user/-/state/com.google/reading-list";
    this.__THEOLDREADER_READITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json&s=user/-/state/com.google/read";
    this.__THEOLDREADER_UNREADITEM_IDS_URL = this.__THEOLDREADER_API_URL + "stream/items/ids?output=json&xt=user/-/state/com.google/read";
    this.__THEOLDREADER_ITEM_CONTENT_URL = this.__THEOLDREADER_API_URL + "stream/items/contents?output=json";
//    this.__THEOLDREADER_ITEM_CONTENT_URL = this.__THEOLDREADER_API_URL + "stream/contents?output=json";
}

TheOldReader.prototype.retrieveLoginToken = function(email, password, gotToken) {
    var self = this;
    var data = "output=json&client=RamSamSamReader&accountType=HOSTED&service=reader&Email="
            + email + "&Passwd=" + password;
    postUrlEncodedHttpRequest(this.__THEOLDREADER_CLIENT_LOGIN_URL, data, function(response) {
        self.__saveToken(response);
        gotToken.apply(undefined, gotToken.arguments);
    });
};


TheOldReader.prototype.getSubscriptionList = function(email, password,
        onGetSubscriptionList) {
//    this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
//    var url = this.__THEOLDREADER_SUBSCRIPTIONLIST_URL;
//    getHttpRequest(url, onGetSubscriptionList);
    var self = this;

    this.__retrieveTokenIfNecessary(email, password, function() {
        getHttpRequest(self.__THEOLDREADER_SUBSCRIPTIONLIST_URL, onGetSubscriptionList);
    });
};



TheOldReader.prototype.getAllItemIds = function(email, password,
        onGetAllItemIds) {
    var self = this;
    this.__retrieveTokenIfNecessary(email, password, function() {

        getHttpRequest(self.__THEOLDREADER_ALLITEM_IDS_URL, function(allItemIds) {
            var itemRefs = JSON.parse(allItemIds).itemRefs;
            var urlParameter = createUrlParamerters(itemRefs);
            postUrlEncodedHttpRequest(self.__THEOLDREADER_ITEM_CONTENT_URL, urlParameter, onGetAllItemIds);

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


TheOldReader.prototype.getReadItemIds = function(email, password,
        onGetSubscriptionList) {
    this.__retrieveTokenIfNecessary(email, password, onGetSubscriptionList);
    getHttpRequest(this.__THEOLDREADER_READITEM_IDS_URL, onGetSubscriptionList);
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
        self.retrieveLoginToken(email, password, func);
    else
        func.apply(undefined, func.arguments);
};

TheOldReader.prototype.__saveToken = function(response) {
    var jsonResponse = JSON.parse(response);
    this.token = jsonResponse.Auth;
};