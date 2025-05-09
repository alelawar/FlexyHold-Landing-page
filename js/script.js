// Simple scroll animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

const menu = document.getElementById('menu');
const navMobile = document.getElementById('nav-mobile');

menu.addEventListener('click', function (e) {
  e.stopPropagation();
  menu.classList.toggle('active-menu');
  navMobile.classList.toggle('hidden');
});

navMobile.addEventListener('click', function (e) {
  e.stopPropagation(); // biar gak nutup nav saat kita klik isi nav-nya
});

window.addEventListener('click', function () {
  if (!navMobile.classList.contains('hidden')) {
    // kalau nav-nya lagi aktif (tidak hidden), kita tutup
    navMobile.classList.add('hidden');
    menu.classList.remove('active-menu');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  let slider, track, slides, dotsContainer, dots;
  let currentIndex = 0;
  let autoplayInterval;
  let resizeTimeout;
  let isPointerDown = false;
  let startX, moveX, initialPosition, currentTranslate;

  initTestimonialSlider();

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      destroySlider();
      initTestimonialSlider();
    }, 200); // 200ms debounce supaya resize lebih smooth
  });

  function initTestimonialSlider() {
    slider = document.querySelector('.testimonial-slider');
    track = document.querySelector('.testimonial-track');
    slides = document.querySelectorAll('.testimonial-slide');
    dotsContainer = document.querySelector('.testimonial-dots');

    if (!slider || !track || !slides.length || !dotsContainer) return;

    const slideWidth = slider.clientWidth;
    currentIndex = 0; // Reset index ke 0 setiap init ulang

    // Setup slides
    slides.forEach((slide) => {
      slide.style.width = `${slideWidth}px`;
    });

    track.style.width = `${slideWidth * slides.length}px`;

    // Setup dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('testimonial-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    dots = document.querySelectorAll('.testimonial-dot');

    // Setup swipe events
    setupSwipeEvents();

    // Start autoplay
    startAutoplay();
  }

  function destroySlider() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
    if (track) {
      const newTrack = track.cloneNode(true); // Clone biar event lama hilang
      track.parentNode.replaceChild(newTrack, track);
      track = newTrack;
    }
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
    }
  }

  function setupSwipeEvents() {
    track.addEventListener('touchstart', startSwipe, { passive: true });
    track.addEventListener('touchmove', moveSwipe, { passive: true });
    track.addEventListener('touchend', endSwipe);

    track.addEventListener('mousedown', startSwipe);
    track.addEventListener('mousemove', moveSwipe);
    track.addEventListener('mouseup', endSwipe);
    track.addEventListener('mouseleave', endSwipe);
  }

  function startAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      goToSlide((currentIndex + 1) % slides.length);
    }, 5000);
  }

  function startSwipe(event) {
    clearInterval(autoplayInterval);
    isPointerDown = true;
    startX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    initialPosition = -currentIndex * slider.clientWidth;
    currentTranslate = initialPosition;
  }

  function moveSwipe(event) {
    if (!isPointerDown) return;
    moveX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    const diff = moveX - startX;
    currentTranslate = initialPosition + diff;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function endSwipe() {
    if (!isPointerDown) return;
    isPointerDown = false;

    const movedBy = currentTranslate - initialPosition;
    const threshold = slider.clientWidth * 0.2;

    if (Math.abs(movedBy) > threshold) {
      if (movedBy > 0) {
        goToSlide(Math.max(currentIndex - 1, 0));
      } else {
        goToSlide(Math.min(currentIndex + 1, slides.length - 1));
      }
    } else {
      goToSlide(currentIndex);
    }

    startAutoplay();
  }

  function goToSlide(index) {
    currentIndex = index;
    const position = -currentIndex * slider.clientWidth;
    track.style.transition = 'transform 0.3s ease-out';
    track.style.transform = `translateX(${position}px)`;

    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    setTimeout(() => {
      track.style.transition = '';
    }, 300);
  }
});


function selectModel(value, target) {
  document.getElementById('modelForm').scrollIntoView({ behavior: 'smooth' });
  const targetPopup = document.getElementById(target);

  targetPopup.classList.add('hidden')

  const select = document.getElementById('modelSelect');
  select.value = value;
  select.dispatchEvent(new Event('change'));

}

function selectDetail(value) {
  const detail = document.getElementById(value);
  // console.log(detail);

  detail.classList.remove('hidden')
}

function closeDetail(value) {
  const detail = document.getElementById(value);
  detail.classList.add('hidden');
}


function kirimWa() {
  const nama = document.getElementById('nama').value;
  const subjek = document.getElementById('subjek').value;
  const pesan = document.getElementById('pesan').value;
  const model = document.getElementById('modelSelect').value;

  const pesanTeks = `Halo, ${subjek}:\n\nNama: ${nama}\nPesan: ${pesan}\nModel Pilihan: ${model}`;

  const encodedMessage = encodeURIComponent(pesanTeks);
  const nomorTujuan = "6285714314371";

  const waURL = `https://wa.me/${nomorTujuan}?text=${encodedMessage}`;

  window.open(waURL, '_blank');
}




