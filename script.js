document.addEventListener("DOMContentLoaded", () => {
  AOS.init();

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('nav ul');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  });

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
      field.classList.add('invalid');
      return false;
    } else {
      errorElem.textContent = '';
      errorElem.classList.remove('visible');
      field.classList.remove('invalid');
      return true;
    }
  }
  [ {elem: nameInput, errorElem: errorName, validator: val => val !== "", msg: "İsim boş bırakılamaz."},
    {elem: emailInput, errorElem: errorEmail, validator: validateEmail, msg: "Geçerli bir e-posta girin."},
    {elem: messageInput, errorElem: errorMessage, validator: val => val !== "", msg: "Mesaj boş bırakılamaz."}
  ].forEach(({elem, errorElem, validator, msg}) => {
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
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: { stepSize: 20 },
          },
        },
      },
    });
  }

  const progressFills = document.querySelectorAll('.progress-fill');
  function animateProgressBars() {
    progressFills.forEach((fill) => {
      const percentage = fill.getAttribute('data-percentage');
      fill.style.width = percentage + '%';
    });
  }
  animateProgressBars();

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

  const statItems = document.querySelectorAll('.stat-number');
  function animateStats() {
    statItems.forEach((stat) => {
      const target = +stat.getAttribute('data-target');
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();
      function updateStat(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        stat.innerText = Math.floor(progress * target);
        if (progress < 1) {
          requestAnimationFrame(updateStat);
        } else {
          stat.innerText = target;
        }
      }
      requestAnimationFrame(updateStat);
    });
  }
  const statsSection = document.getElementById('stats');
  let statsAnimated = false;
  window.addEventListener('scroll', () => {
    if (!statsSection) return;
    const statsPosition = statsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;
    if (statsPosition < screenPosition && !statsAnimated) {
      animateStats();
      statsAnimated = true;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  let currentIndex = 0;
  const slideCount = slides.length;
  const slideInterval = 3000; 

  function goToSlide(index) {
    slider.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    goToSlide(currentIndex);
  }

  // Otomatik slider
  setInterval(nextSlide, slideInterval);
});


document.addEventListener("DOMContentLoaded", () => {
  const weatherDisplay = document.getElementById("weather-info");

  function fetchWeather(city) {
    const url = `https://wttr.in/${city}?format=%t+%C`;
    
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let [temperature, condition] = data.split(" ");
        if (temperature === "0°C") temperature = "0°C"; // +0 yerine düz 0 gösterimi
        weatherDisplay.innerHTML = `<span class="weather-icon">☁</span> ${temperature} ${condition}`;
      })
      .catch(error => {
        console.error("Hava durumu alınamadı:", error);
        weatherDisplay.innerHTML = "Hava durumu yüklenemedi";
      });
  }

  function fetchLocation() {
    fetch("http://ip-api.com/json/")
      .then(response => response.json())
      .then(data => {
        fetchWeather(data.city);
      })
      .catch(error => {
        console.error("Konum alınamadı:", error);
        weatherDisplay.innerHTML = "Konum bilgisi alınamıyor";
      });
  }

  fetchLocation();
});

