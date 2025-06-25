// Main application functionality
class NovelSite {
  constructor() {
      this.currentPage = 1;
      this.chaptersPerPage = 10;
      this.totalChapters = 245;
      this.sortOrder = 'desc'; // 'asc' or 'desc'
      this.bookmarked = false;
      
      this.init();
  }

  init() {
      this.setupEventListeners();
      this.generateChapters();
      this.initTheme(); // Inisialisasi tema
  }

  setupEventListeners() {
      // Mobile menu toggle
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (mobileMenuBtn && mobileMenu) {
          mobileMenuBtn.addEventListener('click', () => {
              // Tampilkan/sembunyikan menu
              mobileMenu.classList.toggle('hidden');
              mobileMenu.classList.toggle('show');

              // Ganti ikon hamburger menjadi ikon X dan sebaliknya
              const icon = mobileMenuBtn.querySelector('i');
              if (icon) {
                  icon.classList.toggle('fa-bars');
                  icon.classList.toggle('fa-times');
              }
          });
      }

      // Bookmark functionality
      const bookmarkBtn = document.querySelector('.bookmark-btn');
      if (bookmarkBtn) {
          bookmarkBtn.addEventListener('click', (e) => {
              this.toggleBookmark(e.target.closest('.bookmark-btn'));
          });
      }

      // Synopsis toggle
      const synopsisToggle = document.querySelector('.synopsis-toggle');
      if (synopsisToggle) {
          synopsisToggle.addEventListener('click', () => {
              this.toggleSynopsis();
          });
      }

      // Sort chapters
      const sortBtn = document.querySelector('.sort-btn');
      if (sortBtn) {
          sortBtn.addEventListener('click', () => {
              this.toggleSort();
          });
      }

      // Load more chapters
      const loadMoreBtn = document.querySelector('.load-more-btn');
      if (loadMoreBtn) {
          loadMoreBtn.addEventListener('click', () => {
              this.loadMoreChapters();
          });
      }

      // Theme Toggle Button (Desktop)
      const themeToggleBtn = document.getElementById('theme-toggle-btn');
      if (themeToggleBtn) {
          themeToggleBtn.addEventListener('click', () => {
              this.toggleDarkMode();
          });
      }

      // Theme Toggle Button (Mobile)
      const themeToggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');
      if (themeToggleBtnMobile) {
          themeToggleBtnMobile.addEventListener('click', () => {
              this.toggleDarkMode();
          });
      }

      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
          if (!e.target.closest('.dropdown')) {
              document.querySelectorAll('.dropdown-menu').forEach(menu => {
                  menu.style.opacity = '0';
                  menu.style.visibility = 'hidden';
              });
          }
      });
  }

  initTheme() {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const htmlElement = document.documentElement;
      const themeToggleBtn = document.getElementById('theme-toggle-btn');
      const themeToggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');

      if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
          htmlElement.classList.add('dark');
          if (themeToggleBtn) {
              themeToggleBtn.classList.add('dark');
          }
          if (themeToggleBtnMobile) {
              themeToggleBtnMobile.classList.add('dark');
          }
      } else {
          htmlElement.classList.remove('dark');
          if (themeToggleBtn) {
              themeToggleBtn.classList.remove('dark');
          }
          if (themeToggleBtnMobile) {
              themeToggleBtnMobile.classList.remove('dark');
          }
      }
  }

  toggleDarkMode() {
      const htmlElement = document.documentElement;
      const themeToggleBtn = document.getElementById('theme-toggle-btn');
      const themeToggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');

      if (htmlElement.classList.contains('dark')) {
          htmlElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
          if (themeToggleBtn) {
              themeToggleBtn.classList.remove('dark');
          }
          if (themeToggleBtnMobile) {
              themeToggleBtnMobile.classList.remove('dark');
          }
      } else {
          htmlElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
          if (themeToggleBtn) {
              themeToggleBtn.classList.add('dark');
          }
          if (themeToggleBtnMobile) {
              themeToggleBtnMobile.classList.add('dark');
          }
      }
  }

  toggleBookmark(button) {
      const isBookmarked = button.dataset.bookmarked === 'true';
      const icon = button.querySelector('i');
      const text = button.querySelector('span');

      if (isBookmarked) {
          button.dataset.bookmarked = 'false';
          icon.className = 'far fa-bookmark';
          text.textContent = 'Bookmark';
          button.classList.remove('bookmarked');
          this.showMessage('Bookmark dihapus', 'success');
      } else {
          button.dataset.bookmarked = 'true';
          icon.className = 'fas fa-bookmark';
          text.textContent = 'Bookmarked';
          button.classList.add('bookmarked');
          this.showMessage('Novel ditambahkan ke bookmark', 'success');
      }

      // Add animation
      icon.style.transform = 'scale(1.2)';
      setTimeout(() => {
          icon.style.transform = 'scale(1)';
      }, 200);
  }

  toggleSynopsis() {
      const synopsisHidden = document.querySelector('.synopsis-hidden');
      const toggleBtn = document.querySelector('.synopsis-toggle');
      const toggleIcon = toggleBtn.querySelector('i');
      const toggleText = toggleBtn.querySelector('span');

      if (synopsisHidden.classList.contains('hidden')) {
          synopsisHidden.classList.remove('hidden');
          synopsisHidden.classList.add('fade-in-up');
          toggleText.textContent = 'Sembunyikan';
          toggleIcon.className = 'fas fa-chevron-up text-xs';
      } else {
          synopsisHidden.classList.add('hidden');
          synopsisHidden.classList.remove('fade-in-up');
          toggleText.textContent = 'Baca Selengkapnya';
          toggleIcon.className = 'fas fa-chevron-down text-xs';
      }
  }

  toggleSort() {
      const sortBtn = document.querySelector('.sort-btn');
      const icon = sortBtn.querySelector('i');
      const text = sortBtn.querySelector('span') || sortBtn;

      if (this.sortOrder === 'desc') {
          this.sortOrder = 'asc';
          icon.className = 'fas fa-sort-numeric-up mr-1';
          text.textContent = 'Terlama';
      } else {
          this.sortOrder = 'desc';
          icon.className = 'fas fa-sort-numeric-down mr-1';
          text.textContent = 'Terbaru';
      }

      this.currentPage = 1;
      this.generateChapters();
  }

  generateChapters() {
      const chapterList = document.querySelector('.chapter-list');
      if (!chapterList) return;

      chapterList.innerHTML = '';
      
      let actualChapters = [];
      const pageTitle = document.title;

      if (pageTitle.includes('Arc 2')) {
          // Untuk Arc 2, bab tetap kosong
          actualChapters = [];
      } else if (pageTitle.includes('Arc 1')) { 
          // Untuk Arc 1, gunakan bab asli
          actualChapters = [
              {
                  number: 'Prolog',
                  title: 'Panas Permulaan yang Membinasakan',
                  file: 'daftar_bab/arc_bab/arc1/prolog.html',
                  releaseDate: '10 Juni 2025',
                  readingTime: 8
              },
              {
                  number: 'Bab 1',
                  title: 'Akhir dari Permulaan',
                  file: 'daftar_bab/arc_bab/arc1/bab1.html',
                  releaseDate: '10 Juni 2025',
                  readingTime: 45
              }
          ];
      } else if (pageTitle.includes('Arc 9')) {
          // Untuk Arc 9, gunakan bab-bab yang telah ditentukan
          actualChapters = [
              {
                  number: 'Bab 1',
                  title: 'Doa Seperti Awan',
                  file: 'daftar_bab/arc_bab/arc9/bab1.html',
                  releaseDate: '10 Juli 2025',
                  readingTime: 10
              },
              {
                  number: 'Bab 2',
                  title: 'Tidak Bermain Sebagai Penjahat',
                  file: 'daftar_bab/arc_bab/arc9/bab2.html',
                  releaseDate: '11 Juli 2025',
                  readingTime: 12
              },
              {
                  number: 'Bab 3',
                  title: 'Setiap Duka Untukmu',
                  file: 'daftar_bab/arc_bab/arc9/bab3.html',
                  releaseDate: '12 Juli 2025',
                  readingTime: 15
              },
              {
                  number: 'Bab 4',
                  title: 'Orang Bodoh',
                  file: 'daftar_bab/arc_bab/arc9/bab4.html',
                  releaseDate: '13 Juli 2025',
                  readingTime: 11
              },
              {
                  number: 'Bab 5',
                  title: 'Sembilan Ratus Tiga Puluh Satu Pukulan',
                  file: 'daftar_bab/arc_bab/arc9/bab5.html',
                  releaseDate: '14 Juli 2025',
                  readingTime: 18
              },
          ];
      } else {
          // Default untuk arc lain (saat ini kosong sesuai edit sebelumnya untuk Arc 2)
          actualChapters = [];
      }

      // Sort berdasarkan sortOrder
      const sortedChapters = this.sortOrder === 'desc' ? 
          [...actualChapters].reverse() : 
          actualChapters;

      sortedChapters.forEach((chapter, index) => {
          const chapterElement = this.createChapterElement(chapter, index);
          chapterList.appendChild(chapterElement);
      });

      const loadMoreBtn = document.querySelector('.load-more-btn');
      if (loadMoreBtn) {
          if (actualChapters.length === 0) { // Jika tidak ada bab, sembunyikan "Muat Lebih Banyak"
              loadMoreBtn.style.display = 'none';
          } else {
              // Menampilkan tombol jika ada bab
              loadMoreBtn.style.display = 'block'; 
          }
      }
  }

  createChapterElement(chapter, index) {
      const div = document.createElement('div');
      div.className = 'chapter-item bg-gray-50 hover:bg-gray-100 p-4 rounded-lg cursor-pointer transition-all duration-200 fade-in-up dark:bg-gray-700 dark:hover:bg-gray-600';
      div.style.animationDelay = `${index * 50}ms`;

      const isNew = chapter.number === 'Bab 1'; // Bab 1 sebagai chapter terbaru

      div.innerHTML = `
          <div class="flex items-center justify-between">
              <div class="flex-1">
                  <div class="flex items-center space-x-3">
                      <h4 class="font-medium text-gray-900 dark:text-gray-100">${chapter.number}: ${chapter.title}</h4>
                      ${isNew ? '<span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>' : ''}
                  </div>
                  <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span><i class="far fa-clock mr-1"></i>${chapter.readingTime} menit baca</span>
                      <span><i class="far fa-calendar mr-1"></i>${chapter.releaseDate}</span>
                      <span><i class="far fa-eye mr-1"></i>${this.generateViewCount()} views</span>
                  </div>
              </div>
              <div class="flex items-center space-x-2">
                  <button class="text-gray-400 hover:text-novel-primary transition-colors duration-200" title="Bookmark Chapter">
                      <i class="far fa-bookmark"></i>
                  </button>
                  <i class="fas fa-chevron-right text-gray-400"></i>
              </div>
          </div>
      `;

      // Add click event
      div.addEventListener('click', () => {
          this.showMessage(`Membuka ${chapter.number}...`, 'info');
          // Redirect ke file chapter yang sesuai
          window.location.href = chapter.file;
      });

      return div;
  }

  generateReleaseDate(chapterNum) {
      const baseDate = new Date('2020-01-01');
      const daysToAdd = (chapterNum - 1) * 3; // 3 days between chapters
      const releaseDate = new Date(baseDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
      
      return releaseDate.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
      });
  }

  generateViewCount() {
      return (Math.floor(Math.random() * 50000) + 1000).toLocaleString('id-ID');
  }

  loadMoreChapters() {
      const loadMoreBtn = document.querySelector('.load-more-btn');
      if (loadMoreBtn) {
          loadMoreBtn.innerHTML = '<i class="loading-spinner mr-2"></i>Memuat...';
          
          setTimeout(() => {
              this.currentPage++;
              this.generateChapters();
              loadMoreBtn.innerHTML = 'Muat Lebih Banyak';
          }, 1000);
      }
  }

  showMessage(message, type = 'info') {
      // Remove existing messages
      document.querySelectorAll('.toast-message').forEach(msg => msg.remove());

      const toast = document.createElement('div');
      toast.className = `toast-message fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white fade-in-up`;
      
      switch (type) {
          case 'success':
              toast.classList.add('bg-green-500');
              toast.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
              break;
          case 'error':
              toast.classList.add('bg-red-500');
              toast.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
              break;
          case 'info':
          default:
              toast.classList.add('bg-blue-500');
              toast.innerHTML = `<i class="fas fa-info-circle mr-2"></i>${message}`;
              break;
      }

      document.body.appendChild(toast);

      // Auto remove after 3 seconds
      setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(100%)';
          setTimeout(() => toast.remove(), 300);
      }, 3000);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NovelSite();
});

// Additional utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
      const later = () => {
          clearTimeout(timeout);
          func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
  };
}

// Smooth scroll to top function
function scrollToTop() {
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
}

// Add scroll to top button
window.addEventListener('scroll', debounce(() => {
  let scrollTopBtn = document.getElementById('scroll-top-btn');
  
  if (!scrollTopBtn) {
      scrollTopBtn = document.createElement('button');
      scrollTopBtn.id = 'scroll-top-btn';
      scrollTopBtn.className = 'fixed bottom-6 right-6 bg-novel-primary text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 z-40 opacity-0 invisible';
      scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
      scrollTopBtn.addEventListener('click', scrollToTop);
      document.body.appendChild(scrollTopBtn);
  }
  
  if (window.pageYOffset > 300) {
      scrollTopBtn.classList.remove('opacity-0', 'invisible');
      scrollTopBtn.classList.add('opacity-100', 'visible');
  } else {
      scrollTopBtn.classList.add('opacity-0', 'invisible');
      scrollTopBtn.classList.remove('opacity-100', 'visible');
  }
}, 100));

// Handle offline/online status
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
});

// Service worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
              console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
              console.log('SW registration failed: ', registrationError);
          });
  });
}
