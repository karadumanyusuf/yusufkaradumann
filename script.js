document.addEventListener("DOMContentLoaded", () => {
  // AOS Başlatma
  AOS.init();

  // Mobil Menü Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('nav ul');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  // Nav linklere tıklayınca mobil menüyü kapatma
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  });

  // Sticky Header (sayfa kaydırıldığında header'a "sticky" class ekleme)
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Dark/Light Mode Toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeToggle.textContent = document.body.classList.contains('dark-theme')
      ? 'Light Mode'
      : 'Dark Mode';
  });

  // Proje Kartları Genişleme İşlemi (detay modal gibi açılıp kapanma)
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.project-details')) {
        card.classList.toggle('expanded');
      }
    });
  });

  // Modal İşlemleri
  const modal = document.getElementById('modal');
  const closeButton = document.querySelector('.close-button');

  function openModal(message) {
    document.getElementById('modal-text').innerHTML = message;
    modal.style.display = 'block';
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  closeButton.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // İletişim Formu Validasyonu ve Gönderim İşlemi
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');

  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function validateField(field, errorElem, validationFn, errorMsg) {
    if (!validationFn(field.value.trim())) {
      errorElem.textContent = errorMsg;
      errorElem.classList.add('visible');
      return false;
    } else {
      errorElem.textContent = '';
      errorElem.classList.remove('visible');
      return true;
    }
  }

  nameInput.addEventListener('blur', () => {
    validateField(nameInput, errorName, val => val !== "", "İsim boş bırakılamaz.");
  });
  emailInput.addEventListener('blur', () => {
    validateField(emailInput, errorEmail, validateEmail, "Geçerli bir e-posta girin.");
  });
  messageInput.addEventListener('blur', () => {
    validateField(messageInput, errorMessage, val => val !== "", "Mesaj boş bırakılamaz.");
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const isNameValid = validateField(nameInput, errorName, val => val !== "", "İsim boş bırakılamaz.");
    const isEmailValid = validateField(emailInput, errorEmail, validateEmail, "Geçerli bir e-posta girin.");
    const isMessageValid = validateField(messageInput, errorMessage, val => val !== "", "Mesaj boş bırakılamaz.");

    if (isNameValid && isEmailValid && isMessageValid) {
      openModal('Mesajınız gönderildi. En kısa sürede geri dönüş sağlanacaktır.');
      contactForm.reset();
    }
  });

  // Chart.js: Yetenek Seviyesi Grafiği (Radar Chart)
  const skillsChartElem = document.getElementById('skillsChart');
  if (skillsChartElem) {
    const ctx = skillsChartElem.getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Python', 'JavaScript', 'HTML/CSS', 'React', 'Node JS', 'C++'],
        datasets: [
          {
            label: 'Yetenek Seviyesi (%)',
            data: [90, 80, 85, 75, 70, 65],
            backgroundColor: 'rgba(33, 147, 176, 0.2)',
            borderColor: 'rgba(33, 147, 176, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(33, 147, 176, 1)',
          },
        ],
      },
      options: {
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
            },
          },
        },
      },
    });
  }

  // Progress Bar Animasyonu
  const progressFills = document.querySelectorAll('.progress-fill');
  function animateProgressBars() {
    progressFills.forEach((fill) => {
      const percentage = fill.getAttribute('data-percentage');
      fill.style.width = percentage + '%';
    });
  }
  animateProgressBars();

  // Projeleri Filtreleme Özelliği
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((button) => button.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        if (filterValue === 'all' || card.classList.contains(filterValue)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Animasyonlu İstatistikler (Count Up)
  const statItems = document.querySelectorAll('.stat-number');
  function animateStats() {
    statItems.forEach((stat) => {
      const target = +stat.getAttribute('data-target');
      const updateCount = () => {
        const current = +stat.innerText;
        const increment = target / 200;
        if (current < target) {
          stat.innerText = Math.ceil(current + increment);
          setTimeout(updateCount, 20);
        } else {
          stat.innerText = target;
        }
      };
      updateCount();
    });
  }

  const statsSection = document.getElementById('stats');
  let statsAnimated = false;
  window.addEventListener('scroll', () => {
    const statsPosition = statsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;
    if (statsPosition < screenPosition && !statsAnimated) {
      animateStats();
      statsAnimated = true;
    }
  });
});
