async function loadPartials() {
  const headerRoot = document.querySelector('#site-header-root');
  const footerRoot = document.querySelector('#site-footer-root');
  const [headerHtml, footerHtml] = await Promise.all([
    headerRoot ? fetch('partials/header.html').then((r) => r.text()) : Promise.resolve(''),
    footerRoot ? fetch('partials/footer.html').then((r) => r.text()) : Promise.resolve(''),
  ]);
  if (headerRoot) headerRoot.innerHTML = headerHtml;
  if (footerRoot) footerRoot.innerHTML = footerHtml;
}

function initCart() {
  const cartCount = document.querySelector('#cart-count');
  if (!cartCount) return;
  let cart = Number(localStorage.getItem('flowerbx-cart') || 0);
  cartCount.textContent = cart;
  document.querySelectorAll('.product-card a, .add-to-cart').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.tagName === 'A' && link.getAttribute('href') === '#') event.preventDefault();
      cart += 1;
      localStorage.setItem('flowerbx-cart', cart);
      cartCount.textContent = cart;
    });
  });
}

function initNewsletter() {
  const form = document.querySelector('#newsletter-form');
  const message = document.querySelector('#form-message');
  if (!form || !message) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = new FormData(form).get('email');
    message.textContent = `Thank you — ${email} has been added to the letter.`;
    form.reset();
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  const link = document.querySelector(`.main-nav a[data-page="${page}"]`);
  if (link) link.classList.add('active');
}

function initCarousel(root) {
  const slides = Array.from(root.querySelectorAll('.carousel-slide'));
  const dotsWrap = root.querySelector('.carousel-dots');
  const prevBtn = root.querySelector('.carousel-prev');
  const nextBtn = root.querySelector('.carousel-next');
  if (!slides.length) return;
  let index = 0;
  let timer;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => show(i, true));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function show(next, userTriggered) {
    slides[index].classList.remove('is-active');
    dots[index].classList.remove('is-active');
    index = (next + slides.length) % slides.length;
    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');
    if (userTriggered) restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), 6000);
  }

  prevBtn?.addEventListener('click', () => show(index - 1, true));
  nextBtn?.addEventListener('click', () => show(index + 1, true));
  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', restart);

  show(0);
  restart();
}

function initCarousels() {
  document.querySelectorAll('.hero-carousel, .collection-rotator').forEach(initCarousel);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadPartials();
  initCart();
  initNewsletter();
  initMobileNav();
  initActiveNav();
  initCarousels();
});
