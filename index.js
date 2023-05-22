$(document).ready(function () {
    $(".animated-width").each(function () {
        $(this).css("width", $(this).data("target-width"))
    });

    $(".animated-height").each(function () {
        $(this).css("height", $(this).data("target-height"))
    });

    $('[data-link]').click(function () {
        window.location.href = $(this).data("link");
    })

    $('[data-link-new]').click(function () {
        window.open($(this).data("link-new"), '_blank').focus();
    })

    $('[data-calculate-years-since]').each(function () {
        let elapsedTime = new Date(new Date() - Date.parse($(this).data('calculate-years-since')))
        $(this).text(Math.abs(elapsedTime.getUTCFullYear() - 1970));
    })

    $('[data-markdown-src]').each(function () {
        let view = $(this)
        $.ajax({
            url: view.data("markdown-src"),
            success: function (text) {
                view.html(new showdown.Converter().makeHtml(text))
            }
        });
    })

    $('.joke').each(function () {
        fetch("https://v2.jokeapi.dev/joke/programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart")
            .then((info) => info.json())
            .then((item) => {
                $(this).find('.setup').text(item.setup)
                $(this).find('.delivery').text(item.delivery)
            });
    })
});
