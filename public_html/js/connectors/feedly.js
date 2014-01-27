function Feedly() {
//    this.BASE_URL = "http://cloud.feedly.com/v3/";
    this.HOST_URL = "http://sandbox.feedly.com";
    this.redirect_uri = "http://localhost:8080";
    this.BASE_URL = this.HOST_URL + "/v3";
    this.client_id = "sandbox187";
    this.client_secret = "YACE8Q0VK79N7AKH5FWXFLUD";
    this.userId = undefined;
    this.refreshToken = undefined;
    this.accessToken = undefined;
    this.expiresIn = undefined;
}


Feedly.prototype.ssoLoginURL = function() {
    return this.BASE_URL + "/auth/auth?" +
            "response_type=code&" +
            "client_id=sandbox187&" +
            "redirect_uri=http%3A%2F%2Flocalhost%3A8080&"
            + "scope=https%3A%2F%2Fcloud.feedly.com%2Fsubscriptions";
};


Feedly.prototype.retrieveAccessToken = function(authorizationCode, success) {
    var that = this;

    var url = this.BASE_URL + "/auth/token";
    var data = {
        code: authorizationCode,
        client_id: this.client_id,
        client_secret: this.client_secret,
        redirect_uri: this.redirect_uri,
        grant_type: "authorization_code"
    };

    $.post(url, data).success(function(response) {
        that.userId = response.id;
        that.refreshToken = response.refresh_token;
        that.accessToken = response.access_token;
        that.expiresIn = response.expires_in;
        success();
    });
};