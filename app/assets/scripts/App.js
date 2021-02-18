import '../styles/styles.css';
import MobileMenu from './modules/MobileMenu.js';
import RevealOnScroll from './modules/RevealOnScroll.js';

if (module.hot) {
    module.hot.accept();
};

let mobileMenu = new MobileMenu();
new RevealOnScroll(document.querySelectorAll(".feature-item"), 75);
new RevealOnScroll(document.querySelectorAll(".testimonial"), 60);


