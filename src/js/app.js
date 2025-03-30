const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 1100;
const isLaptop = document.documentElement.clientWidth < 1408;

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

function animFeedBackOverlay()
{
    let section = document.querySelector('.feedback');
    let image = document.querySelector('.feedback__back');
    let skewUpdateDelay = 16;
    let lastTime = 0;
    if (section && image)
    {
        section.addEventListener('mousemove', (e) => {

            const now = Date.now();
            if (now - lastTime < skewUpdateDelay) return;

            let rect = section.getBoundingClientRect();
            let y = e.clientY - rect.top;
            let yPercent = y / rect.height;
            let yValue = 1 + yPercent;
            image.style.transform = `scale(${yValue})`;
        });
    }
}

function initLaptopPortal() {
    $('[data-laptop-portal]').each((index, elem) => {
        let target = $(elem).attr('data-laptop-portal');
        let targetNode = $(target);
        $(elem).appendTo(targetNode);
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    if(isMobile) {
        initAccordeons();
    }
    else
    {
        animFeedBackOverlay();
    }

    if(isLaptop) {
        initLaptopPortal();
    }

    initScrollHandler();
    initFixedMenu();
})