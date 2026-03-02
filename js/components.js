document.addEventListener('DOMContentLoaded', function () {
    const existingHeader = document.querySelector('.site-header');
    if (existingHeader) {
        initializeHeaderBehavior();
    } else {
        fetch('/components/header.html')
            .then(response => response.text())
            .then(html => {
                document.body.insertAdjacentHTML('afterbegin', html);
                initializeHeaderBehavior();
            });
    }

    const hasFooter = document.querySelector('footer');
    if (!hasFooter) {
        fetch('/components/footer.html')
            .then(response => response.text())
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
            });
    }
});

function initializeHeaderBehavior() {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const drawer = document.getElementById('mobile-nav');

    if (!header || !menuToggle || !drawer) {
        return;
    }

    const closeMenu = () => {
        header.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
        const willOpen = !header.classList.contains('is-open');
        header.classList.toggle('is-open', willOpen);
        menuToggle.setAttribute('aria-expanded', String(willOpen));
    });

    drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 920) {
                closeMenu();
            }
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 920) {
            closeMenu();
            header.classList.remove('mobile-collapsed');
        }
    });

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 920 || header.classList.contains('is-open')) {
            return;
        }

        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY;
        const pastThreshold = currentScrollY > 80;

        header.classList.toggle('mobile-collapsed', scrollingDown && pastThreshold);
        lastScrollY = currentScrollY;
    }, { passive: true });
}
