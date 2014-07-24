/**
 * ApplicationModel = {
 *   categories: [category_1, category_2, category3]
 *   cloudService: Feedly or theOldreader or ...
 * }
 *
 * Category: {
 *   name: "categoryname,
 *   Feed: [feed_1, feed2, feed3]
 * }
 * Feed = {
 *  category: category1,
 *     feedUrl: "www.kde.org",
 *  title: "KDE latest news",
 *  description: "some news and so",
 *  author: "Diego",
 *  entries: [entry_1, entry_2, entry_3]
 * }
 *
 * Entry = {
 *     Feed: feed,
 *  title: "This is the first KDE feed",
 *  link: "www.kde.org/myfeed/1.html",
 *  content: "body of the HTML. Since this value can contain tags, it should be displayed with element.innerHTML=content"
 *  contentSnippet: "A snippet < 120 chars. No HTML Tags contained"
 *  publishedDate: "13 Apr 2007 12:40:07 -0700". Can be parsed with new Date(entry.publishedDate).
 * }
 */


function ApplicationModel(indexeddbService) {
    console.log("Creating ApplicationModel");
    var that = this;
    this.feedsModel = new FeedsModel(indexeddbService);

    this.cloudService = cloudService(this.feedsModel);
//    this.loggedInListeners = new ChangeListeners();

    indexeddbService.init(function() {
        that.feedsModel.loadFromDatabase(function() {
            that.cloudService.retrieveSubscriptions();
        }, function() {
            console.log("error");
        });
    }, function() {
        console.log("error");
    });

    function cloudService(feedsModel) {
        var cloudServiceConf = localStorage.getItem("cloudService");
        if (cloudServiceConf === "feedly")
            return new Feedly(feedsModel);
        if (cloudServiceConf === "theoldreader")
            return new TheOldReader(feedsModel);
        if (cloudServiceConf === "local")
            return new GoogleFeedService(feedsModel);
        return null;
    }
//    this.
}
ApplicationModel.prototype.setCloudService = function(cloudServiceKey) {
    if (cloudServiceKey === "feedly")
        this.cloudService = new Feedly(this.feedsModel);
    if (cloudServiceKey === "theoldreader")
        this.cloudService = new TheOldReader(this.feedsModel);
    if (cloudServiceKey === "local")
        this.cloudService = new GoogleFeedService(this.feedsModel);
    localStorage.setItem("cloudService", cloudServiceKey);

};


ApplicationModel.prototype.syncServiceConfigured = function() {
    if (!this.cloudService)
        return false;
    return this.cloudService.syncServiceConfigured();
};

ApplicationModel.prototype.loadFromDatabase = function() {
    console.log("load FeedModel from database");
    //  this.indexeddbService.loadFeed(this);
};

ApplicationModel.prototype.registerLoggedInListener = function(func) {
    this.loggedInListeners.add(func);
};

ApplicationModel.prototype.useFeedlySynchronization = function() {
    this.cloudService = new Feedly();
};
ApplicationModel.prototype.useTheOlderReaderSynchronization = function() {
    this.cloudService = new TheOldReader();
};
ApplicationModel.prototype.useTinyTinySynchronization = function() {
    this.cloudService = new TinyTiny();
};
ApplicationModel.prototype.useNoSynchronization = function() {
    this.cloudService = new GoogleFeedService();
};
ApplicationModel.prototype.authenticateWithCloud = function(success) {
    this.cloudService.loginUser(success);
};


ApplicationModel.prototype.extractSSOAuthorizationFromURL = function(url, success) {
    var regex = /http:\/\/.*?code=((\w|\-)*)/;
    if (regex.test(url)) {
        this.code = url.match(regex)[1];

        var indexOfNewParameter = this.code.indexOf("&");
        if (indexOfNewParameter !== -1) {
            this.code = this.code.substring(0, indexOfNewParameter);
        }

        return this.code;
    }
};

ApplicationModel.prototype.retrieveAccessToken = function(code, success) {
    this.cloudService.retrieveAccessToken(code, success);
};


ApplicationModel.prototype.retrieveFeeds = function(success, error) {
    if (!this.cloudService)
        return;

    this.cloudService.retrieveSubscriptions(saveFeeds, error);

    function saveFeeds() {
        console.log("save feeds in indexeddb");
        success();
    }
};


ApplicationModel.prototype.subscribeFeed = function(url, success) {
    return this.cloudService.subscribeFeed(url, success);
};


ApplicationModel.prototype.ssoLoginURL = function() {
    return this.cloudService.ssoLoginURL();
};
