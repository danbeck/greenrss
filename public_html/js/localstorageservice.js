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

LocalStorageService.prototype.saveSubscriptionsInLocalStorage = function(subscriptions) {
    localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE] =JSON.stringify(subscriptions);
};