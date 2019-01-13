document.addEventListener("DOMContentLoaded", function(ev) {
    var btnRefresh = document.getElementById('btn-refresh');
    btnRefresh.addEventListener('touchend', function(ev) {
        setTimeout(function() {
            ev.target.className = "c-busy-ref";
            location.reload();
        }, 50);
    });
}, false);
