import initCloud from './cloud.js'

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 1100;
const isLaptop = document.documentElement.clientWidth < 1408;



function initAccordeons() {
    window.accordeons = {};

    if(isMobile) {
        window.accordeons.footer = UIkit.accordion($('.footer__block-menu'), {
            content: '> .footer__menu-items',
            toggle: '> .footer__menu-title'
        });

        window.accordeons.frontTable = UIkit.accordion($('.front-table__table'), {
            content: '> .front-table__elem-content',
            toggle: '> .front-table__header'
        });
    }

    window.accordeons.footer = UIkit.accordion($('.faq__accordion'), {
        content: '> .faq__accordion-content',
        toggle: '> .faq__accordion-title'
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

function animFeedBackOverlay() {
    let section = document.querySelector('.feedback');
    let image = document.querySelector('.feedback__back');
    
    if (!section || !image) return;

    let lastSkewTime = 0;
    let skewUpdateDelay = 16; 
    let lastScrollTime = 0;
    let scrollUpdateDelay = 100; 

   
    const handleMouseMove = (e) => {
        const now = Date.now();
        if (now - lastSkewTime < skewUpdateDelay) return;
        lastSkewTime = now;
        
        updateTransform(e);
    };

    
    const handleScroll = () => {
        const now = Date.now();
        if (now - lastScrollTime < scrollUpdateDelay) return;
        lastScrollTime = now;
        
        
        const fakeEvent = {
            clientX: lastMouseX,
            clientY: lastMouseY
        };
        updateTransform(fakeEvent);
    };


    let lastMouseX = 0;
    let lastMouseY = 0;
    
    section.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        handleMouseMove(e);
    });


    const updateTransform = (e) => {
        let rect = section.getBoundingClientRect();
        let y = e.clientY - rect.top;
        let yPercent = y / rect.height;
        let yValue = 1 + yPercent * 0.5; 
        
        image.style.transform = `scale(${yValue})`;
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

function initLaptopPortal() {
    $('[data-laptop-portal]').each((index, elem) => {
        let target = $(elem).attr('data-laptop-portal');
        let targetNode = $(target);
        $(elem).appendTo(targetNode);
    })
}

function initSliders() {
    window.tabSliderRight = new Swiper('.tab-slider__right', {
        loop: true,
        allowTouchMove: false,
    });
    
    let tabSliderElems = $('.tab-slider__pagination-elem');

    window.tabSliderLeft = new Swiper('.tab-slider__left', {
        loop: true,
        navigation: {
            prevEl: '.tab-slider__button_prev',
            nextEl: '.tab-slider__button_next',
        },
        thumbs: {
            swiper: window.tabSliderRight
        },
        pagination: {
            el: '.tab-slider__pagination',
            clickable: true,
            bulletActiveClass: 'tabs__elem_active',
            renderBullet: function (index, className) {
                return '<li class="tab-slider__pagination-elem tabs__elem text_link-sm ' + className + '">' + $(tabSliderElems[index]).text() + '</li>';
            },
        },
    });

    window.wideSlider = new Swiper('.wide-slider__left', {
        loop: true,
        navigation: {
            prevEl: '.wide-slider__button_prev',
            nextEl: '.wide-slider__button_next',
        },
    })

    if(isTablet) {
        window.frontProgramsTablet = new Swiper('.front-programs__swiper', {
            spaceBetween: 12,
            slidesPerView: 'auto',
        })
    }
    
}

function initAnchors() {
    $('a[href^="#"]').on('click', function(e) {
        let href = $(this).attr('href');
        if(!href || href == '#') {
            return;
        }

        e.preventDefault();
        const target = $(href);
        $('html, body').animate({
            scrollTop: target.offset().top - 50
        }, 1000, function() {
            window.location.hash = target.selector;
        });
    });
}

jQuery.fn.outerHTML = function() {
    return jQuery('<div />').append(this.eq(0).clone()).html();
  };
function initComponentsCopy() {
    $('.ui-wrapper > *').click(function(event) {
        event.preventDefault();

        if($(this).text().includes('text')) {
            navigator.clipboard.writeText($(this).text());
        }
        else {
            let html = $(this).outerHTML();
            html = html.replaceAll('images/icons/link.svg', '@img/icons/link.svg');
            navigator.clipboard.writeText(html);
        }
        UIkit.notification({
            message: 'HTML в буфере!',
            status: 'primary',
            pos: 'bottom-right',
            timeout: 5000
        });
    })
}

function initParticles() {
    particlesJS.load('particles', '../static/particles.json', function() {
        console.log('callback - particles.js config loaded');
    });
}

function initSkyBlocks() {
    let $this = document.querySelector("#sky-blocks");
    if(!$this) {
        return;
    }
    let Engine = Matter.Engine, 
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        World = Matter.World,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint;
        
    const params = {
        isStatic: true,
        restitution: 0.01,
        render: {
            fillStyle: "tranparent",
        }
    };
    const canvasSize = {
        width: $this.clientWidth,
        height: $this.clientHeight
    };
    const engine = Engine.create({});
    const render = Render.create({
        element: $this,
        engine: engine,
        options: {
            ...canvasSize,
            background: "transparent",
            wireframes: false
        }
    });
    const floor = Bodies.rectangle(canvasSize.width / 2, canvasSize.height, canvasSize.width, 20, params);
    const wall1 = Bodies.rectangle(0, canvasSize.height / 2, 20, canvasSize.height, params);
    const wall2 = Bodies.rectangle(canvasSize.width, canvasSize.height / 2, 20, canvasSize.height, params);
    const top = Bodies.rectangle(canvasSize.width / 2, 0, canvasSize.width, 20, params);
    const featureItems = $this.querySelectorAll(".sky-blocks__elem");
    const featureBodies = [...featureItems].map( (elemRef) => {
        const width = elemRef.offsetWidth;
        const height = elemRef.offsetHeight;
        elemRef.style.opacity = 1
        const randomX = Math.random() * (canvasSize.width - width) + width / 2;
        const randomY = 100;
        let item = Bodies.rectangle(randomX, randomY, width, height, {
            restitution: 0.01,
            render: {
                fillStyle: "transparent"
            },
        });
        return {
            body: item,
            elem: elemRef,
            render() {
                const {x, y} = this.body.position;
                this.elem.style.top = `${Math.abs(y - 20)}px`;
                this.elem.style.left = `${x - width / 2}px`;
                this.elem.style.transform = `rotate(${this.body.angle}rad)`;
            }
        };
    }
    );
    const mouse = Mouse.create($this);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 0.1,
            damping: 0.1,
            render: {
                visible: false
            }
        }
    });
    mouse.element.removeEventListener("wheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    mouseConstraint.mouse.element.removeEventListener("wheel", mouseConstraint.mouse.mousewheel);
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
    if ($(window).innerWidth() < 1200) {
        mouseConstraint.mouse.element.removeEventListener('touchstart', mouseConstraint.mouse.mousedown);
        mouseConstraint.mouse.element.removeEventListener('touchmove', mouseConstraint.mouse.mousemove);
        mouseConstraint.mouse.element.removeEventListener('touchend', mouseConstraint.mouse.mouseup);
        mouseConstraint.mouse.element.addEventListener('touchstart', mouseConstraint.mouse.mousedown, {
            passive: true
        });
        mouseConstraint.mouse.element.addEventListener('touchmove', (e) => {
            if (mouseConstraint.body) {
                mouseConstraint.mouse.mousemove(e);
            }
        }
        );
        mouseConstraint.mouse.element.addEventListener('touchend', (e) => {
            if (mouseConstraint.body) {
                mouseConstraint.mouse.mouseup(e);
            }
        }
        );
    }
    engine.positionIterations = 12;
    engine.velocityIterations = 10;
    engine.constraintIterations = 8;
    World.add(engine.world, [floor, ...featureBodies.map( (box) => box.body), wall1, wall2, top, mouseConstraint]);
    render.mouse = mouse;
    Runner.run(engine);
    Render.run(render);
    (function rerender() {
        featureBodies.forEach( (element) => {
            element.render();
        }
        );
        Engine.update(engine, 12);
        requestAnimationFrame(rerender);
    }
    )();
    Matter.Events.on(engine, 'beforeUpdate', () => {
        engine.world.bodies.forEach(body => {
            const maxSpeed = 5;
            const velocity = body.velocity;
            const speed = Math.sqrt(velocity.x * 2 + velocity.y * 2);
            if (speed > maxSpeed) {
                Matter.Body.setVelocity(body, {
                    x: (velocity.x / speed) * maxSpeed,
                    y: (velocity.y / speed) * maxSpeed,
                });
            }
        }
        );
    }
    );
}

class Select {
    constructor(root) {
        this.root = $(root);
        this.dropdown = $(root).find('.select__dropdown');
        this.options = $(root).find('.select__option');
        this.input = $(root).find('.select__value');
        this.text = $(root).find('.button__text');

        this.init.call(this);
        this.bindListeners.call(this);
    }

    init() {
        UIkit.dropdown(this.dropdown, {
            mode: 'click',
            animation: 'uk-animation-slide-top-small',
            offset: 8,
        });

        this.selectElem(this.options.get(0));
    }

    bindListeners() {
        let select = this;
        this.options.on('click', function (event){
            event.preventDefault();
            select.selectElem(this);
        })
    }

    selectElem(elem) {
        this.root.find('.select__option_active').removeClass('select__option_active');
        $(elem).addClass('select__option_active');
        this.input.val($(elem).data('value'));
        this.text.text($(elem).text());
    }
}

function initSelect() {
    $('.select').each((index, elem) => {
        new Select(elem);
    })
}

function initFilterTabs() {
    let tabs = $('.filter__tabs .filter__tab-elem');
    tabs.on('click', function(event) {
        tabs.removeClass('tabs__elem_active');
        $(this).addClass('tabs__elem_active');
    })
}


document.addEventListener('DOMContentLoaded', (event) => {

    initAccordeons();
    if(!isMobile)
    {
        animFeedBackOverlay();
    }

    if(isLaptop) {
        initLaptopPortal();
    }

    initScrollHandler();
    initFixedMenu();
    initSliders();
    initAnchors();
    initComponentsCopy();
    //initParticles();
    initSkyBlocks();
    initSelect();
    initFilterTabs();
})