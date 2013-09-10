function LocalStorageService(localStoragekey){
	this.__SUBSCRIPTIONS_LOCAL_STORAGE = localStoragekey;	
} 


//LocalStorageService.prototype.__getSubscriptionItemsFromLocalStorage = function(subscriptionId) {
//    var subscription = this.__getSubscriptionFromLocalStorage(subscriptionId);
//    return subscription["items"];
//};

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
    localStorage[this.__SUBSCRIPTIONS_LOCAL_STORAGE] = JSON.stringify(subscriptions);
};