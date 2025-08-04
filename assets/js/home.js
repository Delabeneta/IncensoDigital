document.addEventListener('DOMContentLoaded', function() {
  // Carrega elementos do header e footer
  loadIncludes();
  
  // Inicializa accordion da novena se estiver na página
  if (document.querySelector('.day-accordion')) {
    initNovenaAccordion();
  }
  
  // Inicializa funcionalidades gerais
  initGeneralFeatures();
});

function loadIncludes() {
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(element => {
    const file = element.getAttribute('data-include');
    fetch(`includes/${file}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load include: ${file}`);
        }
        return response.text();
      })
      .then(data => {
        element.innerHTML = data;
        // Reinicializa funcionalidades após carregar includes
        setTimeout(() => {
          initGeneralFeatures();
        }, 100);
      })
      .catch(error => console.error('Error loading include:', error));
  });
}

function initNovenaAccordion() {
  const accordionButtons = document.querySelectorAll('.day-btn');
  
  accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isOpen = content.classList.contains('active');
      
      // Fecha todos os outros
      document.querySelectorAll('.day-content').forEach(item => {
        item.classList.remove('active');
      });
      
      // Abre o atual se não estiver aberto
      if (!isOpen) {
        content.classList.add('active');
      }
    });
  });
  
  // Abre o primeiro dia por padrão
  if (accordionButtons.length > 0) {
    accordionButtons[0].nextElementSibling.classList.add('active');
  }
}

function initGeneralFeatures() {
  // Atualizar ano no copyright
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Inicializa barra de progresso de leitura
  initReadingProgress();
  
  // Inicializa botão "Voltar ao topo"
  initBackToTop();
  
  // Inicializa sistema de favoritos
  initBookmarkSystem();
  
  // Inicializa animações por scroll
  initScrollAnimations();
}

function initReadingProgress() {
  const progressBar = document.querySelector('.reading-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = scrollProgress + '%';
  }

  window.addEventListener('scroll', updateProgress);
  updateProgress(); // Chama uma vez para definir estado inicial
}

function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');
  if (!backToTopButton) return;

  function toggleVisibility() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleVisibility);
  
  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  toggleVisibility(); // Checa estado inicial
}

// Sistema de favoritos em memória (substitui localStorage)
let bookmarkedPrayers = new Set();

function initBookmarkSystem() {
  const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
  if (bookmarkButtons.length === 0) return;

  bookmarkButtons.forEach(button => {
    const card = button.closest('.card');
    if (!card) return;
    
    const prayerId = card.id || card.dataset.id;
    const prayerTitleElement = card.querySelector('.card-title');
    const prayerTitle = prayerTitleElement ? prayerTitleElement.textContent : 'Oração';
    
    // Estado inicial
    const isBookmarked = bookmarkedPrayers.has(prayerId);
    updateBookmarkButton(button, isBookmarked);

    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const currentlyBookmarked = bookmarkedPrayers.has(prayerId);
      
      if (currentlyBookmarked) {
        bookmarkedPrayers.delete(prayerId);
        updateBookmarkButton(button, false);
        showNotification(`${prayerTitle} removida dos favoritos.`);
      } else {
        bookmarkedPrayers.add(prayerId);
        updateBookmarkButton(button, true);
        showNotification(`${prayerTitle} adicionada aos favoritos!`);
      }
    });
  });
}

function updateBookmarkButton(button, isBookmarked) {
  const icon = button.querySelector('i');
  if (!icon) return;
  
  if (isBookmarked) {
    button.classList.add('active');
    icon.className = 'fas fa-bookmark';
  } else {
    button.classList.remove('active');
    icon.className = 'far fa-bookmark';
  }
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notification-text');
  
  if (!notification || !notificationText) {
    console.log(message); // Fallback para console se não houver elementos de notificação
    return;
  }
  
  notificationText.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .card, .prayer-item');
  if (animatedElements.length === 0) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Para de observar após animar
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Funções utilitárias
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

// Otimiza performance dos event listeners de scroll
const debouncedScrollHandler = debounce(() => {
  // Qualquer lógica adicional de scroll pode ir aqui
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Exporta funções para uso global se necessário
window.AppFunctions = {
  showNotification,
  bookmarkedPrayers,
  initBookmarkSystem,
  initGeneralFeatures
};

// Adicione ao seu arquivo JS
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('name-modal');
  const btn = document.getElementById('open-modal');
  const closeBtn = document.querySelector('.close-modal');

  btn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Trava scroll da página
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});