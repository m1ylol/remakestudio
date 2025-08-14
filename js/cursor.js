// ЗАМЕНИТЬ весь класс CustomCursor в script.js

// Custom Cursor Class
class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.cursorOutline = null;
        
        this.cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.dotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.outlinePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        
        this.isVisible = false;
        this.animationId = null;
        
        // Проверяем, поддерживается ли hover (исключаем мобильные)
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            // Ждем полной загрузки DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
            } else {
                this.init();
            }
        }
    }
    
    init() {
        // Получаем элементы курсора
        this.cursor = document.getElementById('cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorOutline = document.querySelector('.cursor-outline');
        
        if (!this.cursor || !this.cursorDot || !this.cursorOutline) {
            console.error('Cursor elements not found');
            return;
        }
        
        // Начальная позиция курсора
        this.cursor.style.opacity = '0';
        
        // Отслеживание движения мыши
        document.addEventListener('mousemove', this.updateCursorPosition.bind(this));
        document.addEventListener('mouseenter', this.showCursor.bind(this));
        document.addEventListener('mouseleave', this.hideCursor.bind(this));
        
        // Анимации для кликов
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        
        // Ждем немного и добавляем слушатели
        setTimeout(() => {
            this.addHoverListeners();
            this.addTextListeners();
        }, 100);
        
        // Запуск анимационного цикла
        this.animate();
        
        console.log('Custom cursor initialized');
    }
    
    updateCursorPosition(e) {
        this.cursorPos.x = e.clientX;
        this.cursorPos.y = e.clientY;
        
        if (!this.isVisible) {
            this.showCursor();
        }
    }
    
    showCursor() {
        this.isVisible = true;
        if (this.cursor) {
            this.cursor.style.opacity = '1';
        }
    }
    
    hideCursor() {
        this.isVisible = false;
        if (this.cursor) {
            this.cursor.style.opacity = '0';
        }
    }
    
    onMouseDown() {
        if (this.cursor) {
            this.cursor.classList.add('click');
        }
    }
    
    onMouseUp() {
        if (this.cursor) {
            this.cursor.classList.remove('click');
        }
    }
    
    addHoverListeners() {
        // Элементы для hover эффекта
        const hoverElements = document.querySelectorAll(`
            a, button, input, select, textarea,
            .social-link, .converter-icon, .btn-play, 
            .indicator, .slider-container, [role="button"]
        `);
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (this.cursor) {
                    this.cursor.classList.add('hover');
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (this.cursor) {
                    this.cursor.classList.remove('hover');
                }
            });
        });
    }
    
    addTextListeners() {
        // Элементы для текстового курсора
        const textElements = document.querySelectorAll(`
            input[type="text"], input[type="email"], input[type="password"], 
            input[type="number"], textarea, [contenteditable="true"]
        `);
        
        textElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (this.cursor) {
                    this.cursor.classList.add('text');
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (this.cursor) {
                    this.cursor.classList.remove('text');
                }
            });
        });
    }
    
    animate() {
        if (!this.cursorDot || !this.cursorOutline) {
            this.animationId = requestAnimationFrame(this.animate.bind(this));
            return;
        }
        
        // Плавное следование курсора за мышью
        const speed = 0.2;
        const outlineSpeed = 0.15;
        
        // Позиция точки (быстрая)
        this.dotPos.x += (this.cursorPos.x - this.dotPos.x) * speed;
        this.dotPos.y += (this.cursorPos.y - this.dotPos.y) * speed;
        
        // Позиция обводки (медленная)
        this.outlinePos.x += (this.cursorPos.x - this.outlinePos.x) * outlineSpeed;
        this.outlinePos.y += (this.cursorPos.y - this.outlinePos.y) * outlineSpeed;
        
        // Применяем позиции
        this.cursorDot.style.left = this.dotPos.x + 'px';
        this.cursorDot.style.top = this.dotPos.y + 'px';
        
        this.cursorOutline.style.left = this.outlinePos.x + 'px';
        this.cursorOutline.style.top = this.outlinePos.y + 'px';
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
    
    // Метод для программного управления курсором
    setCursorState(state) {
        if (this.cursor) {
            this.cursor.className = 'cursor ' + state;
        }
    }
    
    // Метод для временных эффектов
    addTemporaryEffect(effectClass, duration = 300) {
        if (this.cursor) {
            this.cursor.classList.add(effectClass);
            setTimeout(() => {
                this.cursor.classList.remove(effectClass);
            }, duration);
        }
    }
    
    // Метод для уничтожения курсора
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.cursor) {
            this.cursor.remove();
        }
    }
}

// ЗАМЕНИТЬ инициализацию в DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Остальные инициализации...
    new PhotoSlider();
    new CurrencyConverter();
    new AudioPlayer();
    
    // Добавляем кастомный курсор с задержкой
    setTimeout(() => {
        window.customCursor = new CustomCursor();
    }, 500);
});