const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const arcCards = document.querySelectorAll('.arc-card');
const arcCardTitles = document.querySelectorAll('.arc-card-title');
const arcCardTexts = document.querySelectorAll('.arc-card p');
const footer = document.querySelector('footer');
const footerLinks = document.querySelectorAll('footer a');
const icon = themeToggle.querySelector('i');
const navbar = document.querySelector('nav');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// Navbar scroll control
let lastScroll = 0;
const scrollThreshold = 10;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        navbar.classList.add('hide');
    } else {
        navbar.classList.remove('hide');
    }
    lastScroll = currentScroll;
});

// Calculate scrollbar width and set CSS variable
function setScrollbarWidth() {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;';
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
}

// Theme toggle functionality
let isThemeChanging = false;

// Mobile menu functionality
function initializeMobileMenu() {
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            this.classList.toggle('mobile-menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.classList.remove('mobile-menu-open');
            }
        });
    }
}

// Latest Update functionality
async function updateLatestChapter() {
    try {
        const response = await fetch('data/chapters.json');
        const data = await response.json();
        const latestChapter = data.latest_chapter;
        
        // Format timestamp
        const timestamp = new Date(latestChapter.timestamp);
        const now = new Date();
        const timeDiff = now - timestamp;
        const minutes = Math.floor(timeDiff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        let timeAgo;
        if (days > 0) {
            timeAgo = `${days} hari yang lalu`;
        } else if (hours > 0) {
            timeAgo = `${hours} jam yang lalu`;
        } else if (minutes > 0) {
            timeAgo = `${minutes} menit yang lalu`;
        } else {
            timeAgo = 'Baru saja diupdate';
        }

        // Update HTML content
        const latestUpdateHTML = `
            <img src="img/emilasmall.png" alt="Chapter ${latestChapter.arc} - ${latestChapter.chapter}">
            <div class="latest-update-content">
                <a href="${latestChapter.url}" class="text-decoration-none">
                    <div class="latest-update-title">
                        Arc ${latestChapter.arc} - Bab ${latestChapter.chapter}: ${latestChapter.title} <span class="latest-update-badge">NEW</span>
                    </div>
                    <p class="latest-update-text">${latestChapter.description}</p>
                    <div class="latest-update-time">${timeAgo}</div>
                </a>
            </div>
        `;

        document.querySelector('.latest-update').innerHTML = latestUpdateHTML;
    } catch (error) {
        console.error('Error updating latest chapter:', error);
    }
}

// Update latest chapter on page load
document.addEventListener('DOMContentLoaded', function() {
    setScrollbarWidth();
    body.setAttribute('data-theme', 'dark');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    initializeMobileMenu();
    updateLatestChapter();
    
    // Update latest chapter every minute
    setInterval(updateLatestChapter, 60000);
});

// Theme toggle with debounce
themeToggle.addEventListener('click', function() {
    if (isThemeChanging) return;
    isThemeChanging = true;
    
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        body.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    setTimeout(() => {
        isThemeChanging = false;
    }, 300);
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setScrollbarWidth, 250);
});

// Navbar toggle functionality
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
        navbarCollapse.classList.toggle('show');
    });

    // Close navbar when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
            navbarCollapse.classList.remove('show');
        }
    });

    // Close navbar when clicking a nav-link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbarCollapse.classList.remove('show');
        });
    });
}

// Dark Mode Toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    updateDarkModeIcon(savedTheme === 'dark');
}

darkModeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateDarkModeIcon(newTheme === 'dark');
});

function updateDarkModeIcon(isDark) {
    const icon = darkModeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}