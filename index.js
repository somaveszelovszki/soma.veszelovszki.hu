$(document).ready (function() {
    $(".animated-width").each(function() {
        $(this).css("width", $(this).data("target") + "%")
    });

    $('[data-link]').click(function() {
        window.location.href = $(this).data("link");
    })

    $('[data-calculate-years-since]').each(function() {
        var elapsedTime = new Date(new Date() - Date.parse($(this).data('calculate-years-since')))
        $(this).text(Math.abs(elapsedTime.getUTCFullYear() - 1970));
    })
});
