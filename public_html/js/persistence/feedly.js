function Feedly() {
//    this.BASE_URL = "http://cloud.feedly.com/v3/";
    this.HOST_URL = "http://sandbox.feedly.com";
    this.BASE_URL = this.HOST_URL + "/v3";

    //----------------------------------
}

Feedly.prototype.loginUser = function(success) {
    var that = this;

    var url = this.BASE_URL + "/auth/auth";
    var urlParameters = {
        response_type: "code",
        client_id: "sandbox187",
        redirect_uri: "http://localhost:8080",
        scope: "https://cloud.feedly.com/subscriptions"
    };

    $.get(url, urlParameters).success(function(response) {
        response = response.replace(/src="\//g, 'src="' + that.HOST_URL + '/');
//        var matches = response.match(/<style>(.*)<\/style>/m)
//        var style = matches[1];
        success(response);
    });
};


//var APP_DATA = {
//    feedsModel: null,
//    presentationModel: null,
////    appview: angezeigteListe: null
//};

//            if (/http:\/\/.*?code=.*/.test(window.location.href)) {
//                alert("got the code");
//            } else {
//                authInFeedly();
//            }
// $(document).ready(function() {
// });
