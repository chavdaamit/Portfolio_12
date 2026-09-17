// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme in localStorage or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateButtonIcon(savedTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonIcon(newTheme);
    });
    
    // Update button icon based on theme
    function updateButtonIcon(theme) {
        if (theme === 'dark') {
            themeToggle.textContent = '☀️';
            themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
            themeToggle.textContent = '🌙';
            themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
        }
    }
});

// Smooth Scroll Navigation + Active Nav Highlighting
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    
    // Get navbar height for offset
    function getNavbarHeight() {
        return navbar ? navbar.offsetHeight : 80;
    }
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navbarHeight = getNavbarHeight();
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
                    bsCollapse.hide();
                }
                
                // Update active state immediately
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Active nav highlighting on scroll using IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const navLinkMap = {};
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            navLinkMap[href.substring(1)] = link;
        }
    });
    
    const observerOptions = {
        root: null,
        rootMargin: `-${getNavbarHeight()}px 0px -60% 0px`,
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const correspondingLink = navLinkMap[id];
            
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Handle window resize to update rootMargin
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            sectionObserver.disconnect();
            const newOptions = {
                root: null,
                rootMargin: `-${getNavbarHeight()}px 0px -60% 0px`,
                threshold: 0.1
            };
            const newObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const id = entry.target.getAttribute('id');
                    const correspondingLink = navLinkMap[id];
                    
                    if (entry.isIntersecting) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        if (correspondingLink) {
                            correspondingLink.classList.add('active');
                        }
                    }
                });
            }, newOptions);
            
            sections.forEach(section => {
                newObserver.observe(section);
            });
        }, 100);
    });
    
    // Initial check for active section on load
    setTimeout(() => {
        const scrollPos = window.scrollY + getNavbarHeight() + 50;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                if (navLinkMap[sectionId]) {
                    navLinkMap[sectionId].classList.add('active');
                }
            }
        });
    }, 100);
});