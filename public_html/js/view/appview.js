
function AppView(presentationModel) {
    this.presentationModel = presentationModel;

    $('div[data-role="dialog"]').on('pagebeforeshow', function(e, ui) {
        ui.prevPage.addClass("ui-dialog-background ");
    });

    $('div[data-role="dialog"]').on('pagehide', function(e, ui) {
        $(".ui-dialog-background ").removeClass("ui-dialog-background ");
    });
}



AppView.prototype.registerListeners = function() {
    this.registerModelChangeListeners();
    this.registerGuiEventListeners();
};

AppView.prototype.registerModelChangeListeners = function() {
    console.log("show initial page");
};


AppView.prototype.registerGuiEventListeners = function() {

    var that = this;
    registerConnectToFeedlyEventHandler();
    registerAddFeed();

    function registerConnectToFeedlyEventHandler() {
        $("#connectToFeedly").click(function() {

            var url = that.presentationModel.ssoLoginURL();
            $.mobile.changePage(url, {showLoadMsg: true});
        });
    }


    function registerAddFeed() {
        $("#addButton").click(function() {
            that.presentationModel.saveTestFeed(function() {
                alert("saving done");
            });
        });
    }
};


AppView.prototype.showInitialPage = function() {
    var url = undefined;

    if (this.presentationModel.firstStepsPageMustBeShown()) {
        url = "#firstStepPage";
    }


    if (url)
        $.mobile.changePage(url);

};

