document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-current-year]').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });

    // Click-to-load YouTube embeds: <button class="video" data-youtube-id="...">
    document.querySelectorAll('[data-youtube-id]').forEach((button) => {
        button.addEventListener('click', () => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${button.dataset.youtubeId}?autoplay=1&rel=0`;
            iframe.title = button.getAttribute('aria-label') || 'YouTube video';
            iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
            iframe.allowFullscreen = true;
            button.replaceChildren(iframe);
            button.removeAttribute('aria-label');
        }, { once: true });
    });

    // MONDRIAN <-> INRANDOM anagram: tiles slide to the positions listed in data-target.
    document.querySelectorAll('[data-anagram]').forEach((anagram) => {
        const tiles = [...anagram.querySelectorAll('.anagram-tile')];
        const button = anagram.querySelector('button');
        const label = button.querySelector('span');
        let shuffled = false;

        button.addEventListener('click', () => {
            shuffled = !shuffled;
            const step = tiles[1].offsetLeft - tiles[0].offsetLeft;
            tiles.forEach((tile, index) => {
                const target = Number(tile.dataset.target);
                const offset = shuffled ? (target - index) * step : 0;
                tile.style.transform = `translateX(${offset}px)`;
            });
            label.textContent = shuffled ? 'Back' : 'Rearrange';
            anagram.querySelector('[aria-live]').textContent = shuffled ? 'IN RANDOM' : 'MONDRIAN';
        });
    });
});
