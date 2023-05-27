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

    $('.draggable').draggable();

    $('.letter-tile').mouseup(function (e) {
        const m = $('#letter-tile-m').position().left;
        const o = $('#letter-tile-o').position().left;
        const n = $('#letter-tile-n').position().left;
        const d = $('#letter-tile-d').position().left;
        const r = $('#letter-tile-r').position().left;
        const i = $('#letter-tile-i').position().left;
        const a = $('#letter-tile-a').position().left;
        const n2 = $('#letter-tile-n2').position().left;

        const positions = [i, Math.min(n, n2), r, a, Math.max(n, n2), d, o, m];
        const sorted = [...positions].sort((a, b) => a - b)

        if (positions.every((pos, i) => pos == sorted[i])) {
            $('.letter-tile').animate(
                { deg: 360 },
                {
                    duration: 500,
                    easing: 'linear',
                    step: function (now) {
                        let rotation = `rotate(${now}deg)`
                        $(this).css('-webkit-transform', rotation);
                        $(this).css('-moz-transform', rotation);
                        $(this).css('transform', rotation);
                    }
                }
            );

            const marginLeft = parseInt($('#letter-tile-m').css("marginLeft").replace('px', ''));
            const marginRight = parseInt($('#letter-tile-m').css("marginRight").replace('px', ''));
            const width = $('#letter-tile-m').width();

            const pos = (before, after) => ((after >= 2 ? after + 0.5 : after) - before) * (width + marginLeft + marginRight);

            $('#letter-tile-i').animate({ left: pos(5, 0), top: 0 }, 1000);
            $('#letter-tile-n').animate({ left: pos(2, 1), top: 0 }, 1000);
            $('#letter-tile-r').animate({ left: pos(4, 2), top: 0 }, 1000);
            $('#letter-tile-a').animate({ left: pos(6, 3), top: 0 }, 1000);
            $('#letter-tile-n2').animate({ left: pos(7, 4), top: 0 }, 1000);
            $('#letter-tile-d').animate({ left: pos(3, 5), top: 0 }, 1000);
            $('#letter-tile-o').animate({ left: pos(1, 6), top: 0 }, 1000);
            $('#letter-tile-m').animate({ left: pos(0, 7), top: 0 }, 1000);
        }
    });
});
