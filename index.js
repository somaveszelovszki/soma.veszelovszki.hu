$(document).ready (function() {
    $(".animated-width").each(function() {
        $(this).css("width", $(this).data("target") + "%")
    });
});
