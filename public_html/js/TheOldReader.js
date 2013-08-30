function TheOldReader() {
    this.THEOLDREADER_API_URL = "https://theoldreader.com/reader/api/0/";
}

TheOldReader.prototype.getLoginToken = function(email, password, gotToken) {
    var self = this;
    var url = this.THEOLDREADER_API_URL + "accounts/ClientLogin";
    var data = "output=json&client=RamSamSamReader&accountType=HOSTED&service=reader&Email="
            + email + "&Passwd=" + password;
    postUrlEncodedHttpRequest(url, data, function(response) {
        self.__saveToken(response, gotToken);
    });
};

TheOldReader.prototype.__saveToken = function(response, func) {
    var jsonResponse = JSON.parse(response);
    this.token = jsonResponse.Auth;
    func();
};

TheOldReader.prototype.getSubscriptionList = function(email, password,
        onGetSubscriptionList) {
    var self = this;
    if (!this.token)
        self.getLoginToken(email, password, function() {
            self.getSubscriptionList(email, password, onGetSubscriptionList);
        });
    else {
        var url = self.THEOLDREADER_API_URL + "subscription/list?output=json";
        getHttpRequest(url, onGetSubscriptionList);
    }
};