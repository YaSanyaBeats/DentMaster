const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 1140;

window.accordeons = {};

function initAccordeons() {
    window.accordeons.footer = UIkit.accordion($('.footer__block-menu'), {
       content: '> .footer__menu-items',
       toggle: '> .footer__menu-title'
    });
}

function initScrollHandler() {
    updateScrollHandler();
    $(window).on('scroll', updateScrollHandler);
}

function updateScrollHandler() {
    let currentScroll = $(this).scrollTop();
    if(currentScroll > 20) {
        $('body').addClass('scroll');
        hideFixedMenu();
    }
    else {
        $('body').removeClass('scroll');
        showFixedMenu();
    }
}

function initFixedMenu() {
    let list = $('.menu__list');
    let button = $('.menu__button');
    button.on('click', function(event) {
        event.preventDefault();
        list.toggleClass('menu__list_active');
        button.toggleClass('menu__button_active');
        button.blur();
    })
}

function showFixedMenu() {
    let list = $('.menu__list');
    let button = $('.menu__button');
    list.addClass('menu__list_active');
    button.addClass('menu__button_active');
}

function hideFixedMenu() {
    let list = $('.menu__list');
    let button = $('.menu__button');
    list.removeClass('menu__list_active');
    button.removeClass('menu__button_active');
}

document.addEventListener('DOMContentLoaded', (event) => {
    if(isMobile) {
        initAccordeons();
    }
    initScrollHandler();
    initFixedMenu();
})