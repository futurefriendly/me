document.addEventListener('DOMContentLoaded', function(ev) {
    diff_platform({
        android: function() {
            iNoBounce.disable();
        },
        ios: function() {
            iNoBounce.enable()
        }
    });
    shareFn();
}, false);
