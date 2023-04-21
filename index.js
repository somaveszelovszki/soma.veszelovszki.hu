$(document).ready (function() {
    $(".animated-width").each(function() {
        $(this).css("width", $(this).data("target") + "%")
    });

    $('[data-link]').click(function() {
        window.location.href = $(this).data("link");
    })

    $('[data-calculate-years-since]').each(function() {
        let elapsedTime = new Date(new Date() - Date.parse($(this).data('calculate-years-since')))
        $(this).text(Math.abs(elapsedTime.getUTCFullYear() - 1970));
    })

    $('.joke').each(function() {
        fetch("https://v2.jokeapi.dev/joke/any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart")
            .then((info) => info.json())
            .then((item) => {
                $(this).find('.setup').text(item.setup)
                $(this).find('.delivery').text(item.delivery)
            });
    });
});
