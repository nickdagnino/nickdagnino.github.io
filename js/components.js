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

    // Project Visibility Toggle Logic
    const projectVisibilityToggle = document.getElementById('project-visibility-toggle');
    if (projectVisibilityToggle) {
        // Define the slugs of projects you want to hide when the filter is active.
        // These should match the 'data-project-slug' attributes in your HTML.
        const inactiveProjectSlugs = [
            'hover-cycle',
            'portfolio-site',
            'magnolia-airbrakes', // Example: if you want to hide the Magnolia card
            'glide-strike',       // Example: if you want to hide the Glide Strike quick pick
            'har-v'               // Example: if you want to hide the har-V quick pick
        ];

        // Retrieve filter state from localStorage, default to false (show all projects)
        let projectFilterActive = localStorage.getItem('projectFilterActive') === 'true';

        const applyProjectFilter = () => {
            // Update button text and title based on current filter state
            projectVisibilityToggle.textContent = projectFilterActive ? 'Show All Projects' : 'Show Curated Projects';
            projectVisibilityToggle.title = projectFilterActive ? 'Currently showing a curated selection of projects. Click to show all projects.' : 'Currently showing all projects. Click to show a curated selection.';

            // Select all project tiles and trading cards
            document.querySelectorAll('.project-tile, .trading-card').forEach(projectElement => {
                const slug = projectElement.dataset.projectSlug;

                // If the project has a slug and is in the inactive list, and the filter is active, hide it.
                if (slug && inactiveProjectSlugs.includes(slug) && projectFilterActive) {
                    projectElement.classList.add('hidden');
                } else {
                    // Otherwise, ensure it's visible
                    projectElement.classList.remove('hidden');
                }
            });
        };

        // Apply filter on page load to reflect saved state
        applyProjectFilter();

        // Add event listener for the toggle button
        projectVisibilityToggle.addEventListener('click', () => {
            projectFilterActive = !projectFilterActive; // Toggle the state
            localStorage.setItem('projectFilterActive', String(projectFilterActive)); // Save state
            applyProjectFilter(); // Re-apply the filter
        });
    }
}
