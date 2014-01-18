function Feedly() {
//    this.URL = "http://cloud.feedly.com/v3/profile";
//    this.BASE_URL = "http://cloud.feedly.com/v3/";
    this.BASE_URL = "http://sandbox.feedly.com/v3/";

}

Feedly.prototype.loginUser = function() {
    var url = this.BASE_URL + "/auth/auth";
    var urlParameters = {
        response_type: "code",
        client_id: "sandbox187",
        redirect_uri: "http://localhost:8080",
        scope: "https://cloud.feedly.com/subscriptions"
    };

    $.get(url, urlParameters).success(function(returned) {
        alert(returned);
    });
};


Feedly.prototype.loginUser = function() {
    var url = this.BASE_URL + "/auth/auth";
    var urlParameters = {
        response_type: "code",
        client_id: "sandbox187",
        redirect_uri: "http://localhost:8080",
        scope: "https://cloud.feedly.com/subscriptions"
    };

    $.get(url, urlParameters).success(function(returned) {
        alert(returned);
    });
};