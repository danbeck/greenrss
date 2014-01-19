function AppView(presentationModel) {

    var that = this;
    this.presentationModel = presentationModel;

    registerEventHandler();


    function registerEventHandler() {
        $("#connectToFeedly").click(function() {
            that.presentationModel.authenticateWithCloud(function(response) {
                
                $.mobile.changePage('#showOAuthLogin', 'pop');
//                $.mobile.loadPage( response );
                $("#showOAuthLogin div").html(response);
                
            });
        });
    }
}

AppView.prototype.showInitialPage = function() {
    console.log("show initial page");
};