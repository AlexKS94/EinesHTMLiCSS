import 'animate.css';
import '../scss/styles.scss';

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.roller_card');
  let currentIndex = 0;

  let currentSlide = 0;
  const track = document.getElementById('carouselTrack');
  const slides2 = document.querySelectorAll('.carousel_img');

  function animateSlide(slide) {
    const image = slide.querySelector('.roller_card_img');
    const title = slide.querySelector('h1');
    const text = slide.querySelector('p');
    const button = slide.querySelector('.button');

    [image, title, text, button].forEach((node) => {
      if (!node) return;

      node.classList.remove(
        'animate__animated',
        'animate__fadeIn',
        'animate__fadeInUp',
        'animate__fadeInDown',
        'animate__zoomIn',
      );

      void node.offsetWidth;
    });

    if (image) {
      image.classList.add('animate__animated', 'animate__zoomIn');
    }

    if (title) {
      title.classList.add('animate__animated', 'animate__fadeInDown');
    }

    if (text) {
      text.classList.add('animate__animated', 'animate__fadeInUp');
    }

    if (button) {
      button.classList.add('animate__animated', 'animate__fadeIn');
    }
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    animateSlide(slides[index]);
  }

  if (slides.length > 0) {
    showSlide(currentIndex);

    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }, 5000);
  }

  function updateCarousel() {
    if (!track) return;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  function moveSlide(direction) {
    currentSlide += direction;

    if (currentSlide < 0) {
      currentSlide = slides2.length - 1;
    }

    if (currentSlide >= slides2.length) {
      currentSlide = 0;
    }

    updateCarousel();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }

  const titlesLeft = document.querySelectorAll('.reveal_left');
  const titlesRight = document.querySelectorAll('.reveal_right');

  const titleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const currentTitle = entry.target;

        currentTitle.classList.remove('animate__animated', 'animate__fadeInLeft', 'animate__fadeInRight');

        void currentTitle.offsetWidth;

        if (currentTitle.classList.contains('reveal_left')) {
          currentTitle.classList.add('animate__animated', 'animate__fadeInLeft');
        }

        if (currentTitle.classList.contains('reveal_right')) {
          currentTitle.classList.add('animate__animated', 'animate__fadeInRight');
        }

        currentTitle.style.opacity = '1';
        titleObserver.unobserve(currentTitle);
      });
    },
    {
      threshold: 0.25,
    },
  );

  titlesLeft.forEach((titleLeft) => {
    titleObserver.observe(titleLeft);
  });

  titlesRight.forEach((titleRight) => {
    titleObserver.observe(titleRight);
  });

  window.moveSlide = moveSlide;
  window.goToSlide = goToSlide;
});
