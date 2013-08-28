function TheOldReader() {
    this.THEOLDREADER_API_URL = "https://theoldreader.com/reader/api/0/";
}

TheOldReader.prototype.getLoginToken = function(email, password, gotToken) {
    var url = this.THEOLDREADER_API_URL + "accounts/ClientLogin";
    var data = "output=json&client=RamSamSamReader&accountType=HOSTED&service=reader&Email=" + email + "&Passwd=" + password;
    postUrlEncodedHttpRequest(url, data, gotToken);
};

TheOldReader.prototype.__saveToken = function(response) {
    this.token = response.Auth;
};

TheOldReader.prototype.getSubscriptionList = function(email, password, onSubscription) {
    if (!this.token)
        getLoginToken(email, password, this.getSubscriptionList(email, password, onSubscription));
    else {
        var url = THEOLDREADER_API_URL + "subscription/list?output=json";
        getHttpRequest(url, onSubscription);
    }
};


