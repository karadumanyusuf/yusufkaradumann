document.addEventListener("DOMContentLoaded", () => {
  AOS.init();

  // Hamburger Menü İşlemleri (Sidebar)
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('nav ul');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  // Nav linklerine tıklandığında sidebar'ı kapat
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  });
  // Sidebar dışında tıklanırsa kapat (mobil)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });

  // Sticky Header
  const header = document.getElementById('header');
  let lastScrollTime = 0;
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime < 50) return;
    lastScrollTime = now;
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Dark/Light Tema Değiştirici
  const themeToggle = document.getElementById('theme-toggle');
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.textContent = 'Light Mode';
    } else {
      document.body.classList.remove('dark-theme');
      themeToggle.textContent = 'Dark Mode';
    }
  }
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Hava Durumu Dropdown İşlemleri
  const weatherDisplay = document.querySelector('.weather-display');
  const weatherContainer = document.querySelector('.weather-container');
  weatherDisplay.addEventListener('click', (e) => {
    e.stopPropagation();
    weatherContainer.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (!weatherContainer.contains(e.target)) {
      weatherContainer.classList.remove('active');
    }
  });

  // Hava Durumu İşlemleri
  function fetchWeather(city) {
    const url = `https://wttr.in/${city}?format=%t+%C`;
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let [temperature, ...rest] = data.split(" ");
        let condition = rest.join(" ");
        weatherDisplay.innerHTML = `${temperature} ${condition} <i class="fas fa-chevron-down"></i>`;
      })
      .catch(error => {
        console.error("Hava durumu alınamadı:", error);
        weatherDisplay.textContent = "Hava durumu yüklenemedi";
      });
  }
  function fetchLocation() {
    fetch("https://ip-api.com/json/")
      .then(response => response.json())
      .then(data => {
        fetchWeather(data.city);
      })
      .catch(error => {
        console.error("Konum alınamadı:", error);
        weatherDisplay.textContent = "Konum bilgisi alınamıyor";
      });
  }
  fetchLocation();
  const updateWeatherBtn = document.getElementById("update-weather");
  const cityInput = document.getElementById("city-input");
  updateWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city);
      weatherContainer.classList.remove('active');
    }
  });

  // Proje Kartlarının Aç/Kapanması
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.project-details')) {
        card.classList.toggle('expanded');
      }
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        card.classList.toggle('expanded');
      }
    });
  });

  // Modal İşlevselliği
  const modal = document.getElementById('modal');
  const closeButton = document.querySelector('.close-button');
  function openModal(message) {
    document.getElementById('modal-text').innerHTML = message;
    modal.style.display = 'block';
    closeButton.focus();
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
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });

  // İletişim Formu Doğrulama
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
  function validateField(field, errorElem, validator, errorMsg) {
    if (!validator(field.value.trim())) {
      errorElem.textContent = errorMsg;
      errorElem.classList.add('visible');
      field.classList.add('invalid');
      return false;
    } else {
      errorElem.textContent = '';
      errorElem.classList.remove('visible');
      field.classList.remove('invalid');
      return true;
    }
  }
  [
    { elem: nameInput, errorElem: errorName, validator: val => val !== "", msg: "İsim boş bırakılamaz." },
    { elem: emailInput, errorElem: errorEmail, validator: validateEmail, msg: "Geçerli bir e-posta girin." },
    { elem: messageInput, errorElem: errorMessage, validator: val => val !== "", msg: "Mesaj boş bırakılamaz." }
  ].forEach(({ elem, errorElem, validator, msg }) => {
    elem.addEventListener('blur', () => validateField(elem, errorElem, validator, msg));
    elem.addEventListener('input', () => validateField(elem, errorElem, validator, msg));
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

  // Chart.js ile Yetenek Grafiği
  const skillsChartElem = document.getElementById('skillsChart');
  if (skillsChartElem) {
    const ctx = skillsChartElem.getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Python', 'JavaScript', 'HTML/CSS', 'React', 'Node JS', 'C++'],
        datasets: [{
          label: 'Yetenek Seviyesi (%)',
          data: [90, 80, 85, 75, 70, 65],
          backgroundColor: 'rgba(33, 147, 176, 0.2)',
          borderColor: 'rgba(33, 147, 176, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(33, 147, 176, 1)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: { stepSize: 20 }
          }
        }
      }
    });
  }

  // Yetenek İlerleme Çubuklarının Animasyonu
  const progressFills = document.querySelectorAll('.progress-fill');
  progressFills.forEach((fill) => {
    const percentage = fill.getAttribute('data-percentage');
    fill.style.width = percentage + '%';
  });

  // Proje Filtreleme
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(button => button.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        if (filterValue === 'all' || card.classList.contains(filterValue)) {
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = '0.3';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });

  // Slider Fonksiyonu ve Touch Swipe Desteği
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let currentIndex = 0;
  const slideCount = slides.length;
  const slideInterval = 3000;
  let autoSlide = setInterval(nextSlide, slideInterval);

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = slideCount - 1;
    } else if (index >= slideCount) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });
  function resetInterval() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, slideInterval);
  }
  slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider.addEventListener('mouseleave', () => {
    autoSlide = setInterval(nextSlide, slideInterval);
  });
  
  // Touch swipe desteği
  let startX = 0;
  let endX = 0;
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  slider.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
  });
  slider.addEventListener('touchend', () => {
    const diff = startX - endX;
    if (diff > 50) {
      nextSlide();
      resetInterval();
    } else if (diff < -50) {
      prevSlide();
      resetInterval();
    }
  });
});
