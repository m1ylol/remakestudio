class RemakeStudio {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.initMobileMenu();
        
        this.handleResize();
        
        this.handleKeyboard();
    }

    initMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileNav = document.getElementById('mobileNav');
        const navLinks = document.querySelectorAll('.nav--mobile .nav__link');

        if (!mobileToggle || !mobileNav) {
            console.warn('Mobile menu elements not found');
            return;
        }

        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNav.classList.contains('nav--open')) {
                    this.closeMobileMenu();
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && 
                !mobileNav.contains(e.target) && 
                mobileNav.classList.contains('nav--open')) {
                this.closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('nav--open')) {
                this.closeMobileMenu();
                mobileToggle.focus();
            }
        });
    }

    toggleMobileMenu() {
        const mobileNav = document.getElementById('mobileNav');
        const isOpen = mobileNav.classList.contains('nav--open');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileNav = document.getElementById('mobileNav');
        const body = document.body;

        mobileToggle.classList.add('mobile-menu-toggle--active');
        mobileNav.classList.add('nav--open');
        body.classList.add('no-scroll');
        mobileToggle.setAttribute('aria-expanded', 'true');

        const firstLink = mobileNav.querySelector('.nav__link');
        if (firstLink) {
            firstLink.focus();
        }
    }

    closeMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileNav = document.getElementById('mobileNav');
        const body = document.body;

        mobileToggle.classList.remove('mobile-menu-toggle--active');
        mobileNav.classList.remove('nav--open');
        body.classList.remove('no-scroll');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const mobileNav = document.getElementById('mobileNav');
            if (window.innerWidth > 1050 && mobileNav?.classList.contains('nav--open')) {
                this.closeMobileMenu();
            }
        });
    }

    handleKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleTabNavigation(e) {
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav?.classList.contains('nav--open')) {
            const focusableElements = mobileNav.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
}

function initTestimonialsSlider() {
    const sliderContainer = document.querySelector('.feature-card--recommendations');
    if (!sliderContainer) return;

    const track = sliderContainer.querySelector('#testimonialsTrack');
    const slides = Array.from(track.querySelectorAll('.testimonial-slide'));
    const dots = Array.from(sliderContainer.querySelectorAll('.testimonial-dot'));
    const slideCount = slides.length;

    if (slideCount === 0) return;

    let currentIndex = 0;
    let autoSlideInterval = null;
    let userInteracted = false;

    function updateSlider(newIndex) {
        const oldIndex = currentIndex;
        if (newIndex === oldIndex) return;

        const currentSlide = slides[oldIndex];
        const newSlide = slides[newIndex];

        const isForward = (newIndex > oldIndex || (newIndex === 0 && oldIndex === slideCount - 1)) && !(newIndex === slideCount - 1 && oldIndex === 0);
        
        currentSlide.classList.remove('active');
        newSlide.classList.add('active');

        currentSlide.classList.add(isForward ? 'prev' : 'next');
        
        currentSlide.addEventListener('transitionend', () => {
            currentSlide.classList.remove('prev', 'next');
        }, { once: true });

        dots[oldIndex].classList.remove('active');
        dots[newIndex].classList.add('active');

        currentIndex = newIndex;
    }
    
    const next = () => updateSlider((currentIndex + 1) % slideCount);
    const prev = () => updateSlider((currentIndex - 1 + slideCount) % slideCount);

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        userInteracted = true;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            updateSlider(index);
        });
    });

    let startX = 0;
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoSlide();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (Math.abs(startX - endX) > 50) {
            if (startX > endX) {
                next();
            } else {
                prev();
            }
        }
    }, { passive: true });
    
    autoSlideInterval = setInterval(next, 5000);
}

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');

        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
            header.classList.add('header--hidden');
        } else {
            header.classList.remove('header--hidden');
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        new RemakeStudio();
        initTestimonialsSlider();
        initFaqAccordion();
        initHeaderScroll();
    } catch (error) {
        console.error('Failed to initialize scripts:', error);
    }
});









// ПОЛНЫЙ ДОПОЛНИТЕЛЬНЫЙ JAVASCRIPT (ИСПРАВЛЕННАЯ ВЕРСИЯ) - добавить в конец script.js

// Анимации появления при скролле
document.addEventListener('DOMContentLoaded', function() {
    // Настройка анимаций появления при скролле
    initScrollAnimations();
    
    // Магнитные эффекты для кнопок (только для десктопа)
    initMagneticEffects();
    
    // Оптимизации производительности
    initPerformanceOptimizations();
    
    // Запускаем мониторинг FPS
    if (window.requestAnimationFrame) {
        setupFrameRateOptimization();
    }
});

function initScrollAnimations() {
    // Проверяем поддержку IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // Если не поддерживается, просто показываем все элементы
        showAllElements();
        return;
    }

    // Настройки для наблюдателя
    const observerOptions = {
        threshold: 0.1, // Элемент считается видимым при 10% видимости
        rootMargin: '0px 0px -50px 0px' // Триггер чуть раньше полного появления
    };

    // Создаем наблюдателя
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс для анимации появления
                entry.target.classList.add('in-view');
                
                // Перестаем наблюдать за этим элементом
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Добавляем классы анимаций к секциям и настраиваем наблюдение
    setupSectionAnimations(observer);
}

function setupSectionAnimations(observer) {
    // About секция (hero__about) - ИСПРАВЛЕНО: только при скролле
    const aboutSection = document.querySelector('.hero__about');
    if (aboutSection) {
        aboutSection.classList.add('fade-in-up');
        observer.observe(aboutSection);
    }
    
    // FAQ секция
    const faqSection = document.querySelector('.faq');
    if (faqSection) {
        faqSection.classList.add('fade-in-up');
        observer.observe(faqSection);
        
        // Анимируем элементы FAQ с задержкой
        const faqItems = faqSection.querySelectorAll('.faq__item');
        faqItems.forEach((item, index) => {
            item.classList.add('fade-in-up');
            item.style.transitionDelay = `${0.1 * index}s`;
            observer.observe(item);
        });
    }

    // CTA секция
    const ctaSection = document.querySelector('.cta');
    if (ctaSection) {
        ctaSection.classList.add('fade-in-up');
        observer.observe(ctaSection);
    }

    // Footer - УБИРАЕМ анимацию появления
    // const footer = document.querySelector('.footer');
    // if (footer) {
    //     footer.classList.add('fade-in-up');
    //     observer.observe(footer);
    // }

    // Анимируем элементы внутри секций с разными направлениями
    animateInnerElements(observer);
}

function animateInnerElements(observer) {
    // About card - анимация только при скролле
    const aboutCard = document.querySelector('.about-card');
    const aboutDescription = document.querySelector('.about-card__description');
    
    if (aboutCard) {
        aboutCard.classList.add('fade-in-up');
        aboutCard.style.transitionDelay = '0.1s';
        observer.observe(aboutCard);
    }
    
    if (aboutDescription) {
        aboutDescription.classList.add('fade-in-up');
        aboutDescription.style.transitionDelay = '0.3s';
        observer.observe(aboutDescription);
    }

    // FAQ заголовок слева, аккордеон справа
    const faqHeader = document.querySelector('.faq__header');
    const faqAccordion = document.querySelector('.faq__accordion');
    
    if (faqHeader) {
        faqHeader.classList.add('fade-in-left');
        observer.observe(faqHeader);
    }
    
    if (faqAccordion) {
        faqAccordion.classList.add('fade-in-right');
        observer.observe(faqAccordion);
    }

    // CTA контент
    const ctaContent = document.querySelector('.cta__content');
    if (ctaContent) {
        ctaContent.classList.add('fade-in-up');
        ctaContent.style.transitionDelay = '0.2s';
        observer.observe(ctaContent);
    }

    // Footer элементы - УБИРАЕМ анимации появления для footer
    // const footerTop = document.querySelector('.footer__top');
    // const footerNav = document.querySelector('.footer__nav');
    // const footerBottom = document.querySelector('.footer__bottom');
    
    // if (footerTop) {
    //     footerTop.classList.add('fade-in-up');
    //     footerTop.style.transitionDelay = '0.1s';
    //     observer.observe(footerTop);
    // }
    
    // if (footerNav) {
    //     footerNav.classList.add('fade-in-up');
    //     footerNav.style.transitionDelay = '0.2s';
    //     observer.observe(footerNav);
    // }
    
    // if (footerBottom) {
    //     footerBottom.classList.add('fade-in-up');
    //     footerBottom.style.transitionDelay = '0.3s';
    //     observer.observe(footerBottom);
    // }
}

function showAllElements() {
    // Для браузеров без поддержки IntersectionObserver
    const elementsToShow = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in');
    elementsToShow.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
    });
}

function initMagneticEffects() {
    // Магнитные эффекты для кнопок (только для десктопа)
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        const magneticElements = document.querySelectorAll('.button--primary, .button--secondary');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = element.getBoundingClientRect();
                const centerX = left + width / 2;
                const centerY = top + height / 2;
                
                const deltaX = (e.clientX - centerX) * 0.1;
                const deltaY = (e.clientY - centerY) * 0.1;
                
                element.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-2px) scale(1.02)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
}

function initPerformanceOptimizations() {
    // Отключение анимаций на слабых устройствах
    if (isLowEndDevice()) {
        document.documentElement.classList.add('reduced-motion');
        
        // Ускоряем анимации на слабых устройствах
        const style = document.createElement('style');
        style.textContent = `
            .fade-in-up, .fade-in-left, .fade-in-right, .fade-in {
                transition-duration: 0.3s !important;
            }
            .hero__stats, .hero__content, .hero__about,
            .feature-card--operations, .feature-card--reports,
            .feature-card--multi, .feature-card--recommendations {
                animation-duration: 0.3s !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Оптимизация для touch устройств
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
    }
    
    // Дополнительная оптимизация для очень медленных соединений
    if (navigator.connection && 
        (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g')) {
        // Отключаем все анимации появления
        const style = document.createElement('style');
        style.textContent = `
            .fade-in-up, .fade-in-left, .fade-in-right, .fade-in,
            .hero__stats, .hero__content, .hero__about,
            .feature-card--operations, .feature-card--reports,
            .feature-card--multi, .feature-card--recommendations {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

function isLowEndDevice() {
    const memory = navigator.deviceMemory;
    const connection = navigator.connection;
    
    return (
        (memory && memory < 4) ||
        (connection && connection.effectiveType && 
         (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) ||
        navigator.hardwareConcurrency < 4
    );
}

// Дополнительная оптимизация FPS
function setupFrameRateOptimization() {
    let lastTime = 0;
    let frames = 0;
    let fps = 60;

    const measureFPS = (currentTime) => {
        frames++;
        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frames * 1000) / (currentTime - lastTime));
            frames = 0;
            lastTime = currentTime;
            
            // Если FPS низкий, упрощаем анимации
            if (fps < 30) {
                document.documentElement.classList.add('low-fps');
                
                // Добавляем стили для низкого FPS
                if (!document.getElementById('low-fps-styles')) {
                    const style = document.createElement('style');
                    style.id = 'low-fps-styles';
                    style.textContent = `
                        .low-fps .hero__particle,
                        .low-fps .hero__ray,
                        .low-fps .hero__glow {
                            animation-duration: 20s !important;
                            animation-timing-function: linear !important;
                        }
                        .low-fps .button::before,
                        .low-fps .feature-card,
                        .low-fps .faq__item {
                            transition-duration: 0.2s !important;
                        }
                    `;
                    document.head.appendChild(style);
                }
            } else {
                document.documentElement.classList.remove('low-fps');
            }
        }
        requestAnimationFrame(measureFPS);
    };

    if (!isLowEndDevice()) {
        requestAnimationFrame(measureFPS);
    }
}

// Дополнительные utility функции
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Дополнительная оптимизация скролла
function initSmoothScrollOptimization() {
    // Оптимизируем скролл события
    let ticking = false;
    
    function updateScrollEffects() {
        // Здесь можно добавить дополнительные эффекты при скролле
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    // Throttled scroll handler
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Инициализируем оптимизацию скролла
if (window.addEventListener) {
    initSmoothScrollOptimization();
}

// Обработка видимости страницы для оптимизации
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Страница скрыта - можно приостановить тяжелые анимации
        document.documentElement.classList.add('page-hidden');
    } else {
        // Страница видима - возобновляем анимации
        document.documentElement.classList.remove('page-hidden');
    }
});

// CSS для оптимизации скрытой страницы
const visibilityStyles = document.createElement('style');
visibilityStyles.textContent = `
    .page-hidden .hero__particle,
    .page-hidden .hero__ray,
    .page-hidden .hero__glow {
        animation-play-state: paused;
    }
`;
document.head.appendChild(visibilityStyles);

// Prefetch критичных ресурсов
function prefetchResources() {
    const criticalResources = [
        'images/logofull.svg',
        'images/frames.png',
        'images/projects-avatars.png',
        'images/loupe.svg'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Запускаем prefetch после загрузки
if (document.readyState === 'complete') {
    prefetchResources();
} else {
    window.addEventListener('load', prefetchResources);
}

console.log('RemakeStudio animations initialized successfully! 🚀');








if (window.matchMedia('(pointer:fine)').matches) {
    document.body.style.cursor = "none"; // Скрываем стандартный курсор

    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mousedown', () => {
      cursor.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('click');
    });
  }