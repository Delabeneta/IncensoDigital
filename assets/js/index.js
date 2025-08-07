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
  
  // Inicializa animações por scroll
  initScrollAnimations();
}

function initReadingProgress() {
  const progressBar = document.querySelector('.reading-progress');
  if (!progressBar) return;

  let isUpdating = false;

  function updateProgress() {
    if (isUpdating) return;

    requestAnimationFrame(() => { 
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      progressBar.style.transform = `scaleX(${scrollProgress / 100})`;
      progressBar.style.transformOrigin = 'left';

      isUpdating = false;
    });

    isUpdating = true;
  }

  let scrollTimeout;
  function debouncedUpdateProgress() {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateProgress, 10);
  }

  window.addEventListener('scroll', debouncedUpdateProgress, { passive: true });
  updateProgress(); // Chama uma vez para definir estado inicial
}

function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');
  if (!backToTopButton) return;

  let isVisible = false; 

  function toggleVisibility() {
    const shouldShow = window.pageYOffset > 300;

    if (shouldShow && !isVisible) {
      backToTopButton.classList.add('visible');
      isVisible = true;
    } else if (!shouldShow && isVisible) { 
      backToTopButton.classList.remove('visible');
      isVisible = false;
    }
  }

  const debouncedToggleVisibility = debounce(toggleVisibility, 16);

  window.addEventListener('scroll', debouncedToggleVisibility, {passive: true});
  
  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  toggleVisibility(); 
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notification-text');
  
  if (!notification || !notificationText) {
    console.log(message);
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
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Função debounce utilitária
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

window.AppFunctions = {
  showNotification,
  initGeneralFeatures
};

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('name-modal');
  const btn = document.getElementById('open-modal');
  const closeBtn = document.querySelector('.modal-close');
  const overlay = document.querySelector('.modal-overlay');

  btn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  }, { passive: true });
});