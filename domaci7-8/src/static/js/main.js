$(document).ready(function () {
    $(".potvrdi").click(function (e) { 
        if (!confirm('Da li ste sigurni?')) {
            e.preventDefault();
        }
    });
});