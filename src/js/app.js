const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 1140;

window.accordeons = {};

function initAccordeons() {
    window.accordeons.footer = UIkit.accordion($('.footer__block-menu'), {
       content: '> .footer__menu-items',
       toggle: '> .footer__menu-title'
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    if(isMobile) {
        initAccordeons();
    }
})