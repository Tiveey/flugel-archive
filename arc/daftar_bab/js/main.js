// Toggle Navbar
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

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

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Text Animation
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.hero h1');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        
        let delay = 0;
        const words = text.split(' ');
        
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            
            [...word].forEach((char, charIndex) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'animated-text';
                charSpan.textContent = char;
                charSpan.style.animationDelay = `${delay}s`;
                delay += 0.03; // Delay between each character
                wordSpan.appendChild(charSpan);
            });
            
            // Add space after word
            if (wordIndex < words.length - 1) {
                const space = document.createElement('span');
                space.className = 'animated-text word-end';
                space.textContent = ' ';
                space.style.animationDelay = `${delay}s`;
                delay += 0.03;
                wordSpan.appendChild(space);
            }
            
            title.appendChild(wordSpan);
        });
    }
}); 

let lastScroll = 0;
const navbar = document.querySelector('.navbar');
const scrollThreshold = 10;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        navbar.classList.add('hide');
    } 
    else {
        navbar.classList.remove('hide');
    }

    lastScroll = currentScroll;
});