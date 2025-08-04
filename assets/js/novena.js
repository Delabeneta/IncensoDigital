document.addEventListener('DOMContentLoaded', function() {
  // Inicializa todas as funcionalidades da novena
  initNovenaAccordion();
  initCopyButtons();
  initBackToTop();
  initProgressBar();
  initSocialSharing();
  initEmailSharing();
  
  // Auto-abre o dia atual
  openCurrentDay();
});


function initNovenaAccordion() {
  const accordions = document.querySelectorAll('.day-accordion');
  
  accordions.forEach(accordion => {
    const btn = accordion.querySelector('.day-btn');
    
    btn.addEventListener('click', () => {
      // Fecha todos os outros
      document.querySelectorAll('.day-accordion').forEach(item => {
        if (item !== accordion) {
          item.classList.remove('active');
        }
      });
      
      // Abre/fecha o atual
      accordion.classList.toggle('active');
    });
  });
  
  // Abre o primeiro por padrão
  if (accordions.length > 0) {
    accordions[0].classList.add('active');
  }
}

function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.btn-copy');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const prayerSection = this.closest('.prayer-section');
      const prayerContent = prayerSection.querySelector('.prayer-content');
      
      if (!prayerContent) return;
      
      // Extrai o texto limpo, removendo elementos desnecessários
      const textToCopy = extractCleanText(prayerContent);
      
      // Usa a API moderna de clipboard ou fallback
      copyToClipboard(textToCopy)
        .then(() => {
          showCopySuccess(this);
        })
        .catch(() => {
          // Fallback para navegadores mais antigos
          fallbackCopyToClipboard(textToCopy);
          showCopySuccess(this);
        });
    });
  });
}

function extractCleanText(element) {
  // Clone o elemento para não modificar o original
  const clone = element.cloneNode(true);
  
  // Remove elementos desnecessários
  const elementsToRemove = clone.querySelectorAll('.btn-copy, script, style');
  elementsToRemove.forEach(el => el.remove());
  
  // Retorna o texto limpo
  return clone.innerText.trim();
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    return Promise.reject('Clipboard API not available');
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Erro ao copiar texto:', err);
  }
  
  document.body.removeChild(textArea);
}

function showCopySuccess(button) {
  const originalIcon = button.innerHTML;
  button.innerHTML = '<i class="fas fa-check"></i>';
  button.style.color = '#28a745';
  
  // Cria notificação visual
  showNotification('Oração copiada com sucesso!');
  
  setTimeout(() => {
    button.innerHTML = originalIcon;
    button.style.color = '';
  }, 2000);
}

function initBackToTop() {
  const backToTopButton = document.querySelector('.btn-top');
  if (!backToTopButton) return;
  
  // Otimiza com throttle
  let ticking = false;
  
  function updateBackToTop() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateBackToTop);
      ticking = true;
    }
  });
  
  backToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  if (!progressBar) return;
  
  let ticking = false;
  
  function updateProgress() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    progressBar.style.width = scrollProgress + '%';
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  });
}

function initSocialSharing() {
  const shareButtons = document.querySelectorAll('.btn-share');
  
  shareButtons.forEach(button => {
    button.addEventListener('click', function() {
      const platform = 
                      this.classList.contains('whatsapp') ? 'whatsapp' : '';
                      
      
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      const text = encodeURIComponent('Falaaaa, Azulejo do Céu! Casca de jatobá. Por onde tu andas, profeta! Vem Rezar a novena com a gente 🔥🔥 ');
      
      let shareUrl = '';
      
      switch(platform) {
        
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${text} ${url}`;
          break;
       
      }
      
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    });
  });
}




function openCurrentDay() {
  // Calcula o dia atual da novena (baseado na data)
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 8, 6); // 6 de agosto (mês 8 = agosto)
  
  // Se estivermos no período da novena (6-14 agosto)
  if (today >= startDate && today <= new Date(today.getFullYear(), 7, 14)) {
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const currentDay = daysDiff + 1;
    
    if (currentDay >= 1 && currentDay <= 9) {
      const currentDayButton = document.querySelector(`.day-accordion:nth-child(${currentDay}) .day-btn`);
      if (currentDayButton) {
        setTimeout(() => {
          currentDayButton.click();
        }, 500);
      }
    }
  } else {
    // Fora do período, abre o primeiro dia
    const firstDayButton = document.querySelector('.day-accordion:first-child .day-btn');
    if (firstDayButton) {
      setTimeout(() => {
        firstDayButton.click();
      }, 500);
    }
  }
}

function showNotification(message) {
  // Cria uma notificação temporária se não existir um sistema
  let notification = document.getElementById('temp-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'temp-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 9999;
      font-family: inherit;
      font-size: 14px;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.style.transform = 'translateX(0)';
  
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
  }, 3000);
}

// Otimização de performance
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

// Exporta funções para uso global se necessário
window.NovenaFunctions = {
  openCurrentDay,
  showNotification,
  copyToClipboard
};