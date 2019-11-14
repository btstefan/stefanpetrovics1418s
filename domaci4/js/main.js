$(document).ready(function() {
    $('.reg_btn').click(function() { 
        $('#reg').css("display", "block");
    });
    $('.exit').click(function() {
        $('#reg').css("display", "none");
    });
    $('.reg_wrap').click(function() {
        $('#reg').css("display", "none");
    });
});

$(document).ready(function() {
    $('#mob_btn').click(function(){
        $('.navigacija').toggleClass('mobnav');
    });
    $('.navigacija').click(function(){
        $('.navigacija').removeClass('mobnav');
    });
});

$(document).ready(function() {
    $("a").on('click', function(event) {

        if (this.hash !== "") {
            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 1000, function() {

                window.location.hash = hash;
            });
        }
    });
});
