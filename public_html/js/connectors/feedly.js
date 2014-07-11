function Feedly(feedsModel) {
//    this.BASE_URL = "http://cloud.feedly.com/v3/";
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

Feedly.prototype.setSSOAuthorization = function(code) {
    this.ssoAuthorizationCode = code;
};


Feedly.prototype.subscribeFeed = function(url, success) {
    var that = this;
    executePostRequest();
    
    function executePostRequest() {
        var feedlySubscriptionUrl = that.BASE_URL + "/subscriptions";
        var data = {
            id: "feed/§" + url
        };

        $.post(feedlySubscriptionUrl, data).success(function(response) {
            success();
        });
    }
};





Feedly.prototype.synchronizeFeeds = function(success, error) {
    var that = this;

    if (!this.accessToken && !this.ssoAuthorizationCode) {
        error("No accessToken and no ssoAuthorization Code");
    }
    else if (!this.accessToken && this.ssoAuthorizationCode)
        retrieveAccessToken(function() {
            console.log("got access token " + that.accessToken);
            console.log("got refresh token " + that.refreshToken);
            console.log("expires in " + that.expiresIn);
            getFeedsFromCloud(function() {
                success();
            });
//            that.loggedInListeners.notifyChangeListeners();
        });

    else if (this.accessToken) {
        getFeedsFromCloud(function() {
            success();
        });

    }

    function getFeedsFromCloud(successFunc) {
        var url = that.BASE_URL + "/subscriptions";
        var data = {
            Authorization: "OAuth " + that.accessToken
        };

        $.ajax({type: "GET",
            url: url,
            headers: {"Authorization": that.accessToken}
        }).success(function(response) {
            console.dir(response);
            successFunc();
        }).error(function(e) {
            console.log("got error");
        });
    }

    function retrieveAccessToken(successFunc) {
        var url = that.BASE_URL + "/auth/token";
        var data = {
            code: that.ssoAuthorizationCode,
            client_id: that.client_id,
            client_secret: that.client_secret,
            redirect_uri: that.redirect_uri,
            grant_type: "authorization_code"
        };

        $.post(url, data).success(function(response) {
            that.userId = response.id;
            that.refreshToken = response.refresh_token;
            that.accessToken = response.access_token;
            that.expiresIn = response.expires_in;

            that.feedsModel.setAccessToken(that.accessToken);
            successFunc();
        });
    }
};