const cartCount = document.querySelector('#cart-count');
const form = document.querySelector('#newsletter-form');
const message = document.querySelector('#form-message');
let cart = Number(localStorage.getItem('flowerbx-cart') || 0);
cartCount.textContent = cart;

document.querySelectorAll('.product-card a').forEach((link) => {
  link.addEventListener('click', () => {
    cart += 1;
    localStorage.setItem('flowerbx-cart', cart);
    cartCount.textContent = cart;
  });
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = new FormData(form).get('email');
  message.textContent = `Thank you — ${email} has been added to the letter.`;
  form.reset();
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.main-nav').classList.toggle('is-open');
});
