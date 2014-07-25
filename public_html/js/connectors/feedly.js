function Feedly(feedsModel) {
    this.feedsModel = feedsModel;
    this.HOST_URL = "http://sandbox.feedly.com";
    this.redirect_uri = "http://localhost";
    this.BASE_URL = this.HOST_URL + "/v3";
    this.client_id = "sandbox";
    this.client_secret = "ES3R6KCEG46BW9MYD332";
    this.userId = undefined;
    this.ssoAuthorizationCode = undefined;
    this.accessToken = undefined;
    this.refreshToken = undefined;
    this.expiresIn = undefined;
}


Feedly.prototype.ssoLoginURL = function() {
    return this.BASE_URL + "/auth/auth?" +
            "response_type=code&" +
            "client_id=" + this.client_id + "&" +
            "redirect_uri=" + this.redirect_uri + "&"
            + "scope=https%3A%2F%2Fcloud.feedly.com%2Fsubscriptions";
};

//Feedly.prototype.setSSOAuthorization = function(code, success) {
//    var that = this;
//
//    this.ssoAuthorizationCode = code;
//    retrieveAccessToken(success);
//
//    function retrieveAccessToken(successFunc) {
//        var url = that.BASE_URL + "/auth/token";
//        var data = {
//            code: that.ssoAuthorizationCode,
//            client_id: that.client_id,
//            client_secret: that.client_secret,
//            redirect_uri: that.redirect_uri,
//            grant_type: "authorization_code"
//        };
//
//        console.dir("POST:" + url);
//        console.dir(data);
//
//        $.post(url, data).success(function(response) {
//            console.dir(response);
//            that.userId = response.id;
//            that.refreshToken = response.refresh_token;
//            that.accessToken = response.access_token;
//            that.expiresIn = response.expires_in;
//
//            that.feedsModel.setAccessToken(that.accessToken);
//            successFunc();
//        });
//    }
//};


Feedly.prototype.subscribeFeed = function(url, success) {
    var that = this;
    executePostRequest();

    function executePostRequest() {
        var feedlyPostUrl = that.BASE_URL + "/subscriptions";
        var data = {
            id: "feed/" + url
//            Authorization: "OAuth " + that.accessToken
        };

        console.dir(data);
        $.ajax({type: "POST",
            url: feedlyPostUrl,
            headers: {
//                testa:"danieol", 
                Authorization: "OAuth " +
                        that.accessToken},
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "json"
        }).success(function(response) {
            console.dir(response);
            successFunc();
        }).error(function(e) {
            console.log("got error");
        });
    }
};

Feedly.prototype.syncServiceConfigured = function() {
    this.accessToken = localStorage.getItem("feedly.accesstoken");
    if (!this.accessToken)
        return false;

    this.refreshToken = localStorage.getItem("feedly.refreshtoken");
    this.expiresIn = localStorage.getItem("feedly.expiresin");
    return true;
};

Feedly.prototype.retrieveAccessToken = function(code, success) {
    var that = this;

    var url = that.BASE_URL + "/auth/token";
    var data = {
        code: code,
        client_id: that.client_id,
        client_secret: that.client_secret,
        redirect_uri: that.redirect_uri,
        grant_type: "authorization_code"
    };

    console.dir("POST:" + url);
    console.dir(data);

    $.post(url, data).success(function(response) {
        console.dir(response);
        that.userId = response.id;
        that.accessToken = response.access_token;
        that.refreshToken = response.refresh_token;
        that.expiresIn = response.expires_in;

        localStorage.setItem("feedly.accesstoken", that.accessToken);
        localStorage.setItem("feedly.refreshtoken", that.refreshToken);
        localStorage.setItem("feedly.expiresin", that.expiresIn);
        success();
    });
};

Feedly.prototype.ssoLoginURL = function() {
    return this.BASE_URL + "/auth/auth?" +
            "response_type=code&" +
            "client_id=" + this.client_id + "&" +
            "redirect_uri=" + this.redirect_uri + "&"
            + "scope=https%3A%2F%2Fcloud.feedly.com%2Fsubscriptions";
};

Feedly.prototype.retrieveStream = function(subscriptionModel, success, error) {
    var that = this;
    var url = that.BASE_URL + "/streams/contents?streamId=" + subscriptionModel.id;

    $.ajax({type: "GET",
        url: url,
        headers: {
            Authorization: "OAuth " +
                    that.accessToken}
    }).success(function(stream) {
        stream.items.forEach(function(el) {
            console.dir(el);
            var content = "";
            var summary = "";
            if (el.summary) {
                summary = el.summary.content;
                var div = document.createElement("div");
                div.innerHTML = el.summary.content;
                var text = div.textContent || div.innerText || "";
                summary = text;
                if (text.length > 250)
                    summary = summary.substring(0, 250) + "...";
            }
            else if (el.content)
                summary = el.content.content.substring(0, 120) + "...";

            if (el.content)
                content = el.content.content;
            else if (el.summary)
                content = el.summary.content;

            subscriptionModel.addItem(el.id, el.title, el.updated, el.unread, el.author,
                    el.origin.htmlUrl, summary, content);

        });
//        this.feedsModel.
        console.dir(stream);
        success(stream);
    }).error(function(e) {
        console.log("got error");
        error();
    });
};

Feedly.prototype.retrieveSubscriptions = function(feedsmodel, success, error) {
    var that = this;

    getFeedsFromCloud(success, error);
    function getFeedsFromCloud(successFunc, error) {
        var url = that.BASE_URL + "/subscriptions";
        var data = {
            Authorization: "OAuth " + that.accessToken
        };

        console.dir(data);
        $.ajax({type: "GET",
            url: url,
            headers: {Authorization: "OAuth " + that.accessToken}
        }).success(function(subscriptions) {
            console.dir(subscriptions);

            subscriptions.forEach(function(subscription) {
                var subscriptionModel = feedsmodel.getSubscription(subscription.id);
                if (!subscriptionModel)
                    subscriptionModel = feedsmodel.createSubscription(subscription.id, subscription.title);
                that.retrieveStream(subscriptionModel, function() {
                    subscriptionModel.persistSubscription();
                }, function() {
                    console.log("error");
                });
            });
//            that.retrieveStream();
            successFunc(feedsmodel);
        }).error(function(e) {
            console.log("got error");
            error();
        });
    }
};