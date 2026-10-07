document.addEventListener('DOMContentLoaded', () => {
    // Header gets a bottom border once the page is scrolled.
    const header = document.querySelector('.site-header');
    if (header) {
        const update = () => header.classList.toggle('scrolled', window.scrollY > 8);
        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    // Highlights the header link of the section currently in view.
    const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
    const spied = navLinks
        .map((link) => [link, document.querySelector(link.getAttribute('href'))])
        .filter(([, section]) => section);
    if (spied.length) {
        let ticking = false;
        const highlight = () => {
            ticking = false;
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
            let current = null;
            spied.forEach(([link, section]) => {
                if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = link;
            });
            if (atBottom) current = spied[spied.length - 1][0];
            navLinks.forEach((link) => {
                link.classList.toggle('active', link === current);
                if (link === current) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        };
        highlight();
        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(highlight);
            }
        }, { passive: true });
    }

    // Email links also copy the address, for visitors without a mail app set up.
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(toast);
    let toastTimer;

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500);
    };

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            const field = document.createElement('textarea');
            field.value = text;
            field.setAttribute('readonly', '');
            field.style.cssText = 'position:fixed;opacity:0';
            document.body.append(field);
            field.select();
            const copied = document.execCommand('copy');
            field.remove();
            return copied;
        }
    };

    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
        link.addEventListener('click', async () => {
            const address = link.getAttribute('href').slice('mailto:'.length).split('?')[0];
            if (await copyText(address)) {
                showToast(`Email copied: ${address}`);
            }
        });
    });

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

    // MONDRIAN -> INRANDOM puzzle: drag tiles (or tap two to swap) until they spell the target word.
    document.querySelectorAll('[data-anagram]').forEach((anagram) => {
        const row = anagram.querySelector('.anagram-tiles');
        const status = anagram.querySelector('.anagram-status');
        const reset = anagram.querySelector('.anagram-reset');
        const target = anagram.dataset.anagram;
        const initialOrder = [...row.children];
        const initialStatus = status.textContent;
        let selected = null;
        let solved = false;

        const tiles = () => [...row.children];
        const word = () => tiles().map((tile) => tile.textContent.trim()).join('');

        // Animates siblings from their old position to the new one after a DOM reorder.
        const flip = (elements, mutate) => {
            const before = new Map(elements.map((el) => [el, el.getBoundingClientRect().left]));
            mutate();
            elements.forEach((el) => {
                const delta = before.get(el) - el.getBoundingClientRect().left;
                if (!delta) return;
                el.style.transition = 'none';
                el.style.transform = `translateX(${delta}px)`;
                requestAnimationFrame(() => {
                    el.style.transition = '';
                    el.style.transform = '';
                });
            });
        };

        const check = () => {
            if (word() !== target) return;
            solved = true;
            anagram.classList.add('solved');
            tiles().forEach((tile, index) => {
                tile.style.setProperty('--i', index);
                tile.disabled = true;
            });
            status.textContent = 'Solved! MONDRIAN really is IN RANDOM.';
            reset.hidden = false;
        };

        const select = (tile) => {
            if (selected === tile) {
                tile.classList.remove('selected');
                selected = null;
            } else if (selected) {
                const a = selected;
                a.classList.remove('selected');
                selected = null;
                flip(tiles(), () => {
                    const marker = document.createElement('span');
                    row.replaceChild(marker, a);
                    row.replaceChild(a, tile);
                    row.replaceChild(tile, marker);
                });
                check();
            } else {
                selected = tile;
                tile.classList.add('selected');
            }
        };

        row.addEventListener('pointerdown', (event) => {
            const tile = event.target.closest('.anagram-tile');
            if (!tile || solved || event.button !== 0) return;
            event.preventDefault();

            const startX = event.clientX;
            const startLeft = tile.offsetLeft;
            let moved = false;

            const onMove = (e) => {
                const dx = e.clientX - startX;
                if (!moved && Math.abs(dx) < 4) return;
                if (!moved) {
                    moved = true;
                    if (selected) {
                        selected.classList.remove('selected');
                        selected = null;
                    }
                    tile.classList.add('dragging');
                }
                const follow = () => {
                    tile.style.transform = `translateX(${dx - (tile.offsetLeft - startLeft)}px)`;
                };
                follow();

                // Keep swapping with neighbors until the dragged tile sits between them.
                // Layout positions (offsetLeft) ignore the FLIP transforms of animating neighbors.
                const center = startLeft + dx + tile.offsetWidth / 2;
                const middle = (el) => el.offsetLeft + el.offsetWidth / 2;
                for (;;) {
                    const prev = tile.previousElementSibling;
                    const next = tile.nextElementSibling;
                    if (next && center >= middle(next)) {
                        flip([next], () => row.insertBefore(next, tile));
                    } else if (prev && center <= middle(prev)) {
                        flip([prev], () => row.insertBefore(tile, prev));
                    } else {
                        break;
                    }
                }
                follow();
            };

            const onUp = () => {
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                window.removeEventListener('pointercancel', onUp);
                if (moved) {
                    tile.classList.remove('dragging');
                    tile.style.transform = '';
                    check();
                } else {
                    select(tile);
                }
            };

            // Listen on the window so the drag ends even if the pointer is released over another element.
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
            window.addEventListener('pointercancel', onUp);
        });

        // Keyboard: Enter/Space selects and swaps like a tap.
        row.addEventListener('keydown', (event) => {
            const tile = event.target.closest('.anagram-tile');
            if (!tile || solved || (event.key !== 'Enter' && event.key !== ' ')) return;
            event.preventDefault();
            select(tile);
        });

        reset.addEventListener('click', () => {
            solved = false;
            anagram.classList.remove('solved');
            flip(tiles(), () => initialOrder.forEach((tile) => {
                tile.disabled = false;
                row.appendChild(tile);
            }));
            status.textContent = initialStatus;
            reset.hidden = true;
        });
    });
});
