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
            return;
        }

        mobileToggle.replaceWith(mobileToggle.cloneNode(true));
        const newMobileToggle = document.getElementById('mobileToggle');

        newMobileToggle.addEventListener('click', (e) => {
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
            if (!newMobileToggle.contains(e.target) && 
                !mobileNav.contains(e.target) && 
                mobileNav.classList.contains('nav--open')) {
                this.closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('nav--open')) {
                this.closeMobileMenu();
                newMobileToggle.focus();
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

function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        showAllElements();
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    setupSectionAnimations(observer);
}

function setupSectionAnimations(observer) {
    const aboutSection = document.querySelector('.hero__about');
    if (aboutSection) {
        aboutSection.classList.add('fade-in-up');
        observer.observe(aboutSection);
    }

    const faqSection = document.querySelector('.faq');
    if (faqSection) {
        faqSection.classList.add('fade-in-up');
        observer.observe(faqSection);
        
        const faqItems = faqSection.querySelectorAll('.faq__item');
        faqItems.forEach((item, index) => {
            item.classList.add('fade-in-up');
            item.style.transitionDelay = `${0.1 * index}s`;
            observer.observe(item);
        });
    }

    const ctaSection = document.querySelector('.cta');
    if (ctaSection) {
        ctaSection.classList.add('fade-in-up');
        observer.observe(ctaSection);
    }
    animateInnerElements(observer);
}

function animateInnerElements(observer) {
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

    const ctaContent = document.querySelector('.cta__content');
    if (ctaContent) {
        ctaContent.classList.add('fade-in-up');
        ctaContent.style.transitionDelay = '0.2s';
        observer.observe(ctaContent);
    }
}

function showAllElements() {
    const elementsToShow = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in');
    elementsToShow.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
    });
}

function initMagneticEffects() {
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
    if (isLowEndDevice()) {
        document.documentElement.classList.add('reduced-motion');
        
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

    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
    }
    
    if (navigator.connection && 
        (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g')) {
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
            
            if (fps < 30) {
                document.documentElement.classList.add('low-fps');
                
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

function initSmoothScrollOptimization() {
    let ticking = false;
    
    function updateScrollEffects() {
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

if (window.addEventListener) {
    initSmoothScrollOptimization();
}

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.documentElement.classList.add('page-hidden');
    } else {
        document.documentElement.classList.remove('page-hidden');
    }
});

const visibilityStyles = document.createElement('style');
visibilityStyles.textContent = `
    .page-hidden .hero__particle,
    .page-hidden .hero__ray,
    .page-hidden .hero__glow {
        animation-play-state: paused;
    }
`;
document.head.appendChild(visibilityStyles);

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

if (document.readyState === 'complete') {
    prefetchResources();
} else {
    window.addEventListener('load', prefetchResources);
}

if (window.matchMedia('(pointer:fine)').matches) {
    document.body.style.cursor = "none";

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

function initEarlyMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (!mobileToggle || !mobileNav) {
        return;
    }

    mobileToggle.addEventListener('click', function tempClickHandler(e) {
        e.preventDefault();
        
        const isOpen = mobileNav.classList.contains('nav--open');
        
        if (isOpen) {
            mobileToggle.classList.remove('mobile-menu-toggle--active');
            mobileNav.classList.remove('nav--open');
            document.body.classList.remove('no-scroll');
            mobileToggle.setAttribute('aria-expanded', 'false');
        } else {
            mobileToggle.classList.add('mobile-menu-toggle--active');
            mobileNav.classList.add('nav--open');
            document.body.classList.add('no-scroll');
            mobileToggle.setAttribute('aria-expanded', 'true');
        }
    });
}

class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.loadingPercentage = document.getElementById('loadingPercentage');
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.isLoading = true;
        
        this.init();
    }

    init() {
        document.body.classList.add('loading');
        this.simulateLoading();
        this.checkResourcesLoading();
    }

    simulateLoading() {
        const loadingSteps = [
            { progress: 20, duration: 300, text: "Загружаем ресурсы..." },
            { progress: 40, duration: 500, text: "Инициализируем анимации..." },
            { progress: 60, duration: 400, text: "Подготавливаем интерфейс..." },
            { progress: 80, duration: 300, text: "Финальная настройка..." },
            { progress: 100, duration: 200, text: "Готово!" }
        ];

        let currentStep = 0;
        
        const executeStep = () => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                this.updateProgress(step.progress);
                
                setTimeout(() => {
                    currentStep++;
                    executeStep();
                }, step.duration);
            } else {
                this.finalizeLoading();
            }
        };

        executeStep();
    }

    checkResourcesLoading() {
        const criticalImages = [
            'images/logofull.svg',
            'images/frames.png',
            'images/projects-avatars.png',
            'images/ray-1.png',
            'images/lightning.svg',
            'images/chart.svg',
            'images/multi.svg'
        ];

        let loadedCount = 0;
        const totalImages = criticalImages.length;

        criticalImages.forEach(src => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                const imageProgress = (loadedCount / totalImages) * 30;
                this.targetProgress = Math.max(this.targetProgress, imageProgress);
            };
            img.onerror = () => {
                loadedCount++;
            };
            img.src = src;
        });
    }

    updateProgress(progress) {
        this.targetProgress = Math.max(this.targetProgress, progress);
        
        const animate = () => {
            if (this.currentProgress < this.targetProgress) {
                this.currentProgress += (this.targetProgress - this.currentProgress) * 0.1;
                
                if (this.targetProgress - this.currentProgress < 0.1) {
                    this.currentProgress = this.targetProgress;
                }
                
                this.progressBar.style.width = `${this.currentProgress}%`;
                this.loadingPercentage.textContent = `${Math.round(this.currentProgress)}%`;
                
                if (this.currentProgress < this.targetProgress) {
                    requestAnimationFrame(animate);
                }
            }
        };
        
        animate();
    }

    finalizeLoading() {
        this.updateProgress(100);
        
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 800);
    }

    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        
        setTimeout(() => {
            this.initMainScripts();
            
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.remove();
                }
            }, 800);
        }, 100);
    }

    initMainScripts() {
        
        try {
            if (typeof RemakeStudio !== 'undefined') {
                new RemakeStudio();
            }
            
            if (typeof initTestimonialsSlider !== 'undefined') {
                initTestimonialsSlider();
            }
            
            if (typeof initFaqAccordion !== 'undefined') {
                initFaqAccordion();
            }
            
            if (typeof initHeaderScroll !== 'undefined') {
                initHeaderScroll();
            }

            setTimeout(() => {
                if (typeof initScrollAnimations !== 'undefined') {
                    initScrollAnimations();
                }
                
                if (typeof initMagneticEffects !== 'undefined') {
                    initMagneticEffects();
                }
                
                if (typeof initPerformanceOptimizations !== 'undefined') {
                    initPerformanceOptimizations();
                }
                
                if (window.requestAnimationFrame && typeof setupFrameRateOptimization !== 'undefined') {
                    setupFrameRateOptimization();
                }
            }, 500);

        } catch (error) {
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initEarlyMobileMenu();
    
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        new LoadingManager();
    } else {
        try {
            new RemakeStudio();
            initTestimonialsSlider();
            initFaqAccordion();
            initHeaderScroll();
            
            setTimeout(() => {
                initScrollAnimations();
                initMagneticEffects();
                initPerformanceOptimizations();
                if (window.requestAnimationFrame) {
                    setupFrameRateOptimization();
                }
            }, 500);
        } catch (error) {
        }
    }
});
