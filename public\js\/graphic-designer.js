/**
 * Nexus Graphic Designer
 * مصمم الجرافيك الذكي بالذكاء الاصطناعي
 * الإصدار: 2.0.0
 */

class GraphicDesigner {
    constructor() {
        this.config = {
            canvasSizes: {
                'youtube-thumbnail': { width: 1280, height: 720, name: 'ثامبريل يوتيوب' },
                'instagram-post': { width: 1080, height: 1080, name: 'منشور انستجرام' },
                'instagram-story': { width: 1080, height: 1920, name: 'ستوري انستجرام' },
                'facebook-cover': { width: 820, height: 312, name: 'غلاف فيسبوك' },
                'twitter-header': { width: 1500, height: 500, name: 'هيدر تويتر' },
                'linkedin-banner': { width: 1584, height: 396, name: 'بانر لينكدإن' },
                'tiktok-video': { width: 1080, height: 1920, name: 'فيديو تيك توك' },
                'custom': { width: 1200, height: 800, name: 'مخصص' }
            },
            
            colorPalettes: {
                'professional': ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
                'vibrant': ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb'],
                'pastel': ['#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#bfdbfe'],
                'dark': ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'],
                'gradient': ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
            },
            
            fontFamilies: {
                'Cairo': 'Cairo, sans-serif',
                'Almarai': 'Almarai, sans-serif',
                'Tajawal': 'Tajawal, sans-serif',
                'Arial': 'Arial, sans-serif',
                'Roboto': 'Roboto, sans-serif',
                'Montserrat': 'Montserrat, sans-serif'
            },
            
            templates: {
                'youtube-thumbnail': [
                    {
                        name: 'تحدي وإثارة',
                        colors: ['#dc2626', '#f59e0b', '#000000'],
                        layout: 'صورة كبيرة مع نص مائل',
                        elements: ['صورة', 'نص كبير', 'أيقونة']
                    },
                    {
                        name: 'تعليمي احترافي',
                        colors: ['#1e3a8a', '#3b82f6', '#ffffff'],
                        layout: 'صورة مع نص جانبي',
                        elements: ['صورة', 'قائمة', 'شعار']
                    }
                ],
                'instagram-post': [
                    {
                        name: 'بسيط وأنيق',
                        colors: ['#ffffff', '#000000', '#6b7280'],
                        layout: 'نص في المنتصف',
                        elements: ['نص', 'خلفية', 'حدود']
                    },
                    {
                        name: 'ملون وجذاب',
                        colors: ['#ec4899', '#8b5cf6', '#f59e0b'],
                        layout: 'تدرج لوني مع نص',
                        elements: ['تدرج', 'نص', 'أيقونات']
                    }
                ]
            }
        };
        
        this.state = {
            currentDesign: null,
            designs: [],
            canvasSize: 'youtube-thumbnail',
            activeTool: 'select',
            selectedElements: [],
            history: [],
            historyIndex: -1,
            isGenerating: false,
            layers: []
        };
        
        this.canvas = null;
        this.ctx = null;
        
        this.initialize();
    }
    
    initialize() {
        console.log('🎨 Graphic Designer Initialized');
        this.loadDesigns();
        this.setupCanvas();
        this.setupEventListeners();
    }
    
    // ========== إدارة التصاميم ==========
    
    async createDesign(options = {}) {
        const designId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const size = this.config.canvasSizes[options.size || this.state.canvasSize];
        
        const design = {
            id: designId,
            name: options.name || `تصميم ${this.state.designs.length + 1}`,
            type: options.size || this.state.canvasSize,
            size: size,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            elements: [],
            background: options.background || {
                type: 'color',
                value: '#ffffff'
            },
            settings: {
                guides: true,
                grid: false,
                snap: true
            },
            version: 1
        };
        
        this.state.currentDesign = design;
        this.state.designs.push(design);
        this.state.layers = [];
        
        this.saveDesigns();
        this.setupCanvasSize(size.width, size.height);
        this.updateDesignUI();
        
        return {
            success: true,
            design: design,
            message: '🎨 تم إنشاء تصميم جديد'
        };
    }
    
    async openDesign(designId) {
        const design = this.state.designs.find(d => d.id === designId);
        if (!design) {
            throw new Error('التصميم غير موجود');
        }
        
        this.state.currentDesign = design;
        this.state.layers = design.elements || [];
        
        this.setupCanvasSize(design.size.width, design.size.height);
        this.renderDesign(design);
        this.updateDesignUI();
        
        return {
            success: true,
            design: design,
            message: '📂 تم فتح التصميم'
        };
    }
    
    saveDesign() {
        if (!this.state.currentDesign) return;
        
        this.state.currentDesign.modifiedAt = new Date().toISOString();
        this.state.currentDesign.elements = this.state.layers;
        this.state.currentDesign.version++;
        
        this.saveDesigns();
        this.updateDesignUI();
        
        return {
            success: true,
            message: '💾 تم حفظ التصميم',
            version: this.state.currentDesign.version
        };
    }
    
    async exportDesign(format = 'png', quality = 1) {
        if (!this.state.currentDesign || !this.canvas) {
            throw new Error('لا يوجد تصميم مفتوح');
        }
        
        const exportId = `export_${Date.now()}`;
        
        // محاكاة عملية التصدير
        this.showExportProgress(0);
        
        for (let i = 0; i <= 100; i += 10) {
            await this.delay(200);
            this.showExportProgress(i);
        }
        
        const exportData = {
            id: exportId,
            designId: this.state.currentDesign.id,
            format: format,
            quality: quality,
            fileName: `${this.state.currentDesign.name}.${format}`,
            fileSize: this.calculateFileSize(format),
            dimensions: {
                width: this.state.currentDesign.size.width,
                height: this.state.currentDesign.size.height
            },
            downloadUrl: this.generateDownloadUrl(format),
            createdAt: new Date().toISOString()
        };
        
        this.saveExport(exportData);
        this.showExportProgress(100);
        
        return {
            success: true,
            export: exportData,
            message: '📤 جاهز للتنزيل'
        };
    }
    
    // ========== عناصر التصميم ==========
    
    addText(options = {}) {
        const textId = `text_${Date.now()}`;
        
        const textElement = {
            id: textId,
            type: 'text',
            content: options.content || 'نص جديد',
            position: {
                x: options.x || 100,
                y: options.y || 100,
                width: options.width || 300,
                height: options.height || 100
            },
            style: {
                fontFamily: options.fontFamily || 'Cairo',
                fontSize: options.fontSize || 36,
                color: options.color || '#000000',
                backgroundColor: options.backgroundColor || 'transparent',
                alignment: options.alignment || 'right',
                fontWeight: options.fontWeight || 'normal',
                fontStyle: options.fontStyle || 'normal',
                textDecoration: options.textDecoration || 'none',
                lineHeight: options.lineHeight || 1.5,
                opacity: options.opacity || 1
            },
            effects: {
                shadow: options.shadow || null,
                outline: options.outline || null,
                gradient: options.gradient || null
            },
            createdAt: new Date().toISOString()
        };
        
        this.state.layers.push(textElement);
        this.saveToHistory('add_text', textElement);
        this.renderElement(textElement);
        this.saveDesign();
        
        return textElement;
    }
    
    addImage(url, options = {}) {
        const imageId = `image_${Date.now()}`;
        
        const imageElement = {
            id: imageId,
            type: 'image',
            url: url,
            position: {
                x: options.x || 50,
                y: options.y || 50,
                width: options.width || 400,
                height: options.height || 300,
                rotation: options.rotation || 0,
                scale: options.scale || 1
            },
            style: {
                opacity: options.opacity || 1,
                borderRadius: options.borderRadius || 0,
                border: options.border || null,
                filter: options.filter || null
            },
            createdAt: new Date().toISOString()
        };
        
        this.state.layers.push(imageElement);
        this.saveToHistory('add_image', imageElement);
        this.renderElement(imageElement);
        this.saveDesign();
        
        return imageElement;
    }
    
    addShape(type, options = {}) {
        const shapeId = `shape_${Date.now()}`;
        
        const shapeElement = {
            id: shapeId,
            type: 'shape',
            shapeType: type,
            position: {
                x: options.x || 150,
                y: options.y || 150,
                width: options.width || 200,
                height: options.height || 200,
                rotation: options.rotation || 0
            },
            style: {
                fill: options.fill || '#6366f1',
                stroke: options.stroke || null,
                strokeWidth: options.strokeWidth || 0,
                opacity: options.opacity || 1,
                borderRadius: type === 'rectangle' ? (options.borderRadius || 0) : 0
            },
            createdAt: new Date().toISOString()
        };
        
        this.state.layers.push(shapeElement);
        this.saveToHistory('add_shape', shapeElement);
        this.renderElement(shapeElement);
        this.saveDesign();
        
        return shapeElement;
    }
    
    addIcon(iconName, options = {}) {
        const iconId = `icon_${Date.now()}`;
        
        const iconElement = {
            id: iconId,
            type: 'icon',
            icon: iconName,
            position: {
                x: options.x || 200,
                y: options.y || 200,
                size: options.size || 64,
                rotation: options.rotation || 0
            },
            style: {
                color: options.color || '#000000',
                opacity: options.opacity || 1
            },
            createdAt: new Date().toISOString()
        };
        
        this.state.layers.push(iconElement);
        this.saveToHistory('add_icon', iconElement);
        this.renderElement(iconElement);
        this.saveDesign();
        
        return iconElement;
    }
    
    // ========== تحرير العناصر ==========
    
    selectElement(elementId) {
        this.state.selectedElements = [elementId];
        this.updatePropertiesPanel();
        this.highlightElement(elementId);
    }
    
    updateElement(elementId, updates) {
        const elementIndex = this.state.layers.findIndex(el => el.id === elementId);
        if (elementIndex === -1) return;
        
        const oldElement = { ...this.state.layers[elementIndex] };
        this.state.layers[elementIndex] = {
            ...oldElement,
            ...updates,
            modifiedAt: new Date().toISOString()
        };
        
        this.saveToHistory('update_element', { elementId, oldElement, newElement: this.state.layers[elementIndex] });
        this.renderElement(this.state.layers[elementIndex]);
        this.saveDesign();
        
        return this.state.layers[elementIndex];
    }
    
    deleteElement(elementId) {
        const elementIndex = this.state.layers.findIndex(el => el.id === elementId);
        if (elementIndex === -1) return;
        
        const deletedElement = this.state.layers[elementIndex];
        this.state.layers.splice(elementIndex, 1);
        
        this.saveToHistory('delete_element', deletedElement);
        this.clearCanvas();
        this.renderAllElements();
        this.saveDesign();
        
        return deletedElement;
    }
    
    duplicateElement(elementId) {
        const element = this.state.layers.find(el => el.id === elementId);
        if (!element) return;
        
        const duplicated = {
            ...JSON.parse(JSON.stringify(element)),
            id: `${element.type}_${Date.now()}_copy`,
            position: {
                ...element.position,
                x: element.position.x + 20,
                y: element.position.y + 20
            }
        };
        
        this.state.layers.push(duplicated);
        this.saveToHistory('duplicate_element', duplicated);
        this.renderElement(duplicated);
        this.saveDesign();
        
        return duplicated;
    }
    
    moveElement(elementId, x, y) {
        return this.updateElement(elementId, {
            position: { x, y }
        });
    }
    
    resizeElement(elementId, width, height) {
        return this.updateElement(elementId, {
            position: { width, height }
        });
    }
    
    changeElementColor(elementId, color) {
        const element = this.state.layers.find(el => el.id === elementId);
        if (!element) return;
        
        if (element.type === 'text') {
            return this.updateElement(elementId, {
                style: { ...element.style, color }
            });
        } else if (element.type === 'shape') {
            return this.updateElement(elementId, {
                style: { ...element.style, fill: color }
            });
        } else if (element.type === 'icon') {
            return this.updateElement(elementId, {
                style: { ...element.style, color }
            });
        }
    }
    
    // ========== التأثيرات والمرشحات ==========
    
    applyFilter(elementId, filterType, intensity = 1) {
        const element = this.state.layers.find(el => el.id === elementId);
        if (!element) return;
        
        const filters = {
            'blur': `blur(${intensity}px)`,
            'brightness': `brightness(${intensity})`,
            'contrast': `contrast(${intensity}%)`,
            'grayscale': `grayscale(${intensity})`,
            'sepia': `sepia(${intensity})`,
            'hue-rotate': `hue-rotate(${intensity}deg)`,
            'saturate': `saturate(${intensity})`
        };
        
        if (element.type === 'image') {
            return this.updateElement(elementId, {
                style: { 
                    ...element.style, 
                    filter: filters[filterType] || filterType 
                }
            });
        }
    }
    
    applyShadow(elementId, shadowOptions) {
        const element = this.state.layers.find(el => el.id === elementId);
        if (!element) return;
        
        const shadow = {
            color: shadowOptions.color || '#000000',
            offsetX: shadowOptions.offsetX || 2,
            offsetY: shadowOptions.offsetY || 2,
            blur: shadowOptions.blur || 4,
            spread: shadowOptions.spread || 0
        };
        
        return this.updateElement(elementId, {
            effects: { ...element.effects, shadow }
        });
    }
    
    applyGradient(elementId, gradientOptions) {
        const element = this.state.layers.find(el => el.id === elementId);
        if (!element) return;
        
        const gradient = {
            type: gradientOptions.type || 'linear',
            colors: gradientOptions.colors || ['#6366f1', '#8b5cf6'],
            direction: gradientOptions.direction || 90,
            stops: gradientOptions.stops || [0, 100]
        };
        
        return this.updateElement(elementId, {
            effects: { ...element.effects, gradient }
        });
    }
    
    // ========== الذكاء الاصطناعي ==========
    
    async generateDesignWithAI(prompt, options = {}) {
        if (!prompt || prompt.trim().length < 5) {
            throw new Error('الرجاء إدخال وصف مفصل للتصميم');
        }
        
        this.state.isGenerating = true;
        this.updateUI('generating');
        
        try {
            if (!window.geminiAI) {
                return this.getDemoDesign(prompt, options);
            }
            
            const designPrompt = this.buildDesignPrompt(prompt, options);
            const aiResponse = await window.geminiAI.generateContent(designPrompt, {
                temperature: 0.8,
                maxTokens: 3000
            });
            
            const designSpecs = this.parseDesignSpecs(aiResponse);
            await this.applyDesignSpecs(designSpecs);
            
            this.updateUI('ready');
            
            return {
                success: true,
                specs: designSpecs,
                message: '🤖 تم إنشاء التصميم بالذكاء الاصطناعي'
            };
            
        } catch (error) {
            this.state.isGenerating = false;
            this.updateUI('error');
            
            return {
                success: false,
                error: error.message,
                message: '❌ فشل إنشاء التصميم'
            };
        } finally {
            this.state.isGenerating = false;
        }
    }
    
    buildDesignPrompt(prompt, options) {
        const size = this.config.canvasSizes[options.size || this.state.canvasSize];
        
        return `🎨 <مهمة: تصميم جرافيك بالذكاء الاصطناعي>
        
        الوصف: ${prompt}
        نوع التصميم: ${size.name}
        الأبعاد: ${size.width} × ${size.height} بيكسل
        الاستخدام: ${options.purpose || 'عام'}
        الجمهور: ${options.audience || 'عربي'}
        
        <المطلوب>
        
        1. **التصميم العام:**
        - مفهوم التصميم الرئيسي
        - التخطيط (Layout) المناسب
        - التوازن البصري
        
        2. **الألوان:**
        - لوحة ألوان كاملة (5-7 ألوان)
        - الألوان الرئيسية والثانوية
        - التنسيق اللوني المناسب
        
        3. **الطبقات والعناصر:**
        - عدد الطبقات المطلوبة
        - نوع كل عنصر (نص، صورة، شكل)
        - مواقع العناصر
        
        4. **النصوص:**
        - النصوص المطلوبة
        - الخطوط المناسبة
        - أحجام النصوص
        
        5. **التأثيرات البصرية:**
        - الظلال والتدرجات
        - الشفافية والخلط
        - التأثيرات الخاصة
        
        6. **التفاصيل التقنية:**
        - إحداثيات كل عنصر
        - ألوان كل عنصر (كود HEX)
        - إعدادات كل عنصر
        
        <تنسيق المخرجات>
        قدم المواصفات بتنسيق JSON واضح مع:
        - colors: مصفوفة الألوان
        - layout: وصف التخطيط
        - elements: مصفوفة العناصر
        - fonts: الخطوط المستخدمة
        - effects: التأثيرات
        
        اجعل التصميم احترافياً وجذاباً.`;
    }
    
    parseDesignSpecs(aiResponse) {
        try {
            // محاولة استخراج JSON من الرد
            const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                             aiResponse.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // إذا لم يكن JSON، إنشاء مواصفات من النص
            return {
                colors: ['#6366f1', '#8b5cf6', '#ffffff', '#000000'],
                layout: 'تصميم متوازن مع تركيز بصري',
                elements: [
                    { type: 'text', content: 'عنوان التصميم', position: { x: 100, y: 100 } },
                    { type: 'shape', shapeType: 'rectangle', position: { x: 50, y: 50 } }
                ],
                fonts: ['Cairo', 'Arial'],
                effects: ['shadow', 'gradient']
            };
            
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return this.getDefaultSpecs();
        }
    }
    
    async applyDesignSpecs(specs) {
        // تطبيق مواصفات التصميم
        this.clearCanvas();
        this.state.layers = [];
        
        // تطبيق الخلفية
        if (specs.background) {
            this.state.currentDesign.background = specs.background;
        }
        
        // تطبيق العناصر
        if (specs.elements && Array.isArray(specs.elements)) {
            for (const elementSpec of specs.elements) {
                await this.createElementFromSpec(elementSpec);
            }
        }
        
        this.renderAllElements();
        this.saveDesign();
    }
    
    async createElementFromSpec(spec) {
        switch (spec.type) {
            case 'text':
                return this.addText({
                    content: spec.content || 'نص',
                    x: spec.position?.x || 100,
                    y: spec.position?.y || 100,
                    fontFamily: spec.fontFamily || 'Cairo',
                    fontSize: spec.fontSize || 36,
                    color: spec.color || '#000000'
                });
                
            case 'image':
                if (spec.url) {
                    return this.addImage(spec.url, {
                        x: spec.position?.x || 50,
                        y: spec.position?.y || 50,
                        width: spec.position?.width || 400,
                        height: spec.position?.height || 300
                    });
                }
                break;
                
            case 'shape':
                return this.addShape(spec.shapeType || 'rectangle', {
                    x: spec.position?.x || 150,
                    y: spec.position?.y || 150,
                    width: spec.position?.width || 200,
                    height: spec.position?.height || 200,
                    fill: spec.fill || '#6366f1'
                });
                
            case 'icon':
                return this.addIcon(spec.iconName || 'star', {
                    x: spec.position?.x || 200,
                    y: spec.position?.y || 200,
                    size: spec.size || 64,
                    color: spec.color || '#000000'
                });
        }
    }
    
    // ========== القوالب الجاهزة ==========
    
    async loadTemplate(templateName) {
        const templates = this.config.templates[this.state.canvasSize];
        if (!templates) {
            throw new Error('لا توجد قوالب لهذا النوع');
        }
        
        const template = templates.find(t => t.name === templateName);
        if (!template) {
            throw new Error('القالب غير موجود');
        }
        
        this.clearCanvas();
        this.state.layers = [];
        
        // تطبيق القالب
        this.state.currentDesign.background = {
            type: 'gradient',
            value: template.colors
        };
        
        // إضافة عناصر القالب
        template.elements.forEach(elementType => {
            switch (elementType) {
                case 'نص':
                    this.addText({
                        content: 'عنوان التصميم',
                        x: 200,
                        y: 200,
                        fontFamily: 'Cairo',
                        fontSize: 48,
                        color: '#ffffff'
                    });
                    break;
                    
                case 'صورة':
                    // صورة افتراضية
                    this.addImage('https://via.placeholder.com/400x300', {
                        x: 100,
                        y: 100,
                        width: 400,
                        height: 300
                    });
                    break;
                    
                case 'شكل':
                    this.addShape('rectangle', {
                        x: 50,
                        y: 50,
                        width: 200,
                        height: 200,
                        fill: template.colors[0],
                        borderRadius: 10
                    });
                    break;
            }
        });
        
        this.renderAllElements();
        this.saveDesign();
        
        return {
            success: true,
            template: template,
            message: '📋 تم تحميل القالب'
        };
    }
    
    // ========== الكنفاس والرسم ==========
    
    setupCanvas() {
        this.canvas = document.getElementById('designCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvasSize(1280, 720);
        
        // إضافة مستمعات الأحداث للكنفاس
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }
    
    setupCanvasSize(width, height) {
        if (!this.canvas) return;
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        
        this.renderAllElements();
    }
    
    renderAllElements() {
        if (!this.ctx) return;
        
        // مسح الكنفاس
        this.clearCanvas();
        
        // رسم الخلفية
        this.drawBackground();
        
        // رسم جميع العناصر
        this.state.layers.forEach(element => {
            this.renderElement(element);
        });
        
        // رسم العناصر المحددة
        this.state.selectedElements.forEach(elementId => {
            this.highlightElement(elementId);
        });
        
        // رسم الأدلة والشبكة
        if (this.state.currentDesign?.settings.guides) {
            this.drawGuides();
        }
    }
    
    renderElement(element) {
        if (!this.ctx) return;
        
        this.ctx.save();
        
        // تطبيق التحويلات
        this.ctx.translate(element.position.x + (element.position.width / 2 || 0), 
                          element.position.y + (element.position.height / 2 || 0));
        this.ctx.rotate((element.position.rotation || 0) * Math.PI / 180);
        
        switch (element.type) {
            case 'text':
                this.drawText(element);
                break;
                
            case 'image':
                this.drawImage(element);
                break;
                
            case 'shape':
                this.drawShape(element);
                break;
                
            case 'icon':
                this.drawIcon(element);
                break;
        }
        
        // تطبيق التأثيرات
        if (element.effects) {
            this.applyEffects(element);
        }
        
        this.ctx.restore();
    }
    
    drawText(element) {
        this.ctx.font = `${element.style.fontStyle} ${element.style.fontWeight} ${element.style.fontSize}px ${element.style.fontFamily}`;
        this.ctx.fillStyle = element.style.color;
        this.ctx.textAlign = element.style.alignment;
        this.ctx.textBaseline = 'middle';
        this.ctx.globalAlpha = element.style.opacity || 1;
        
        // خلفية النص
        if (element.style.backgroundColor && element.style.backgroundColor !== 'transparent') {
            this.ctx.fillStyle = element.style.backgroundColor;
            this.ctx.fillRect(-element.position.width / 2, -element.position.height / 2, 
                            element.position.width, element.position.height);
        }
        
        // النص نفسه
        this.ctx.fillStyle = element.style.color;
        this.ctx.fillText(element.content, 0, 0, element.position.width);
    }
    
    drawImage(element) {
        const img = new Image();
        img.src = element.url;
        
        img.onload = () => {
            this.ctx.save();
            this.ctx.translate(-element.position.width / 2, -element.position.height / 2);
            this.ctx.globalAlpha = element.style.opacity || 1;
            
            // تطبيق الزوايا المدورة
            if (element.style.borderRadius > 0) {
                this.ctx.beginPath();
                this.ctx.roundRect(0, 0, element.position.width, element.position.height, 
                                 element.style.borderRadius);
                this.ctx.clip();
            }
            
            this.ctx.drawImage(img, 0, 0, element.position.width, element.position.height);
            this.ctx.restore();
        };
    }
    
    drawShape(element) {
        this.ctx.fillStyle = element.style.fill;
        this.ctx.globalAlpha = element.style.opacity || 1;
        
        if (element.style.stroke) {
            this.ctx.strokeStyle = element.style.stroke;
            this.ctx.lineWidth = element.style.strokeWidth || 1;
        }
        
        this.ctx.beginPath();
        
        switch (element.shapeType) {
            case 'rectangle':
                if (element.style.borderRadius > 0) {
                    this.ctx.roundRect(-element.position.width / 2, -element.position.height / 2,
                                     element.position.width, element.position.height,
                                     element.style.borderRadius);
                } else {
                    this.ctx.rect(-element.position.width / 2, -element.position.height / 2,
                                element.position.width, element.position.height);
                }
                break;
                
            case 'circle':
                this.ctx.arc(0, 0, element.position.width / 2, 0, Math.PI * 2);
                break;
                
            case 'triangle':
                this.ctx.moveTo(0, -element.position.height / 2);
                this.ctx.lineTo(element.position.width / 2, element.position.height / 2);
                this.ctx.lineTo(-element.position.width / 2, element.position.height / 2);
                this.ctx.closePath();
                break;
        }
        
        if (element.style.stroke) {
            this.ctx.stroke();
        }
        this.ctx.fill();
    }
    
    drawIcon(element) {
        // محاكاة رسم أيقونة
        this.ctx.fillStyle = element.style.color;
        this.ctx.globalAlpha = element.style.opacity || 1;
        
        const size = element.position.size;
        
        switch (element.icon) {
            case 'star':
                this.drawStar(0, 0, size / 2, size / 4, 5);
                break;
                
            case 'heart':
                this.drawHeart(0, 0, size / 2);
                break;
                
            case 'arrow':
                this.ctx.beginPath();
                this.ctx.moveTo(-size / 4, -size / 4);
                this.ctx.lineTo(size / 4, 0);
                this.ctx.lineTo(-size / 4, size / 4);
                this.ctx.closePath();
                this.ctx.fill();
                break;
        }
    }
    
    applyEffects(element) {
        if (element.effects.shadow) {
            const s = element.effects.shadow;
            this.ctx.shadowColor = s.color;
            this.ctx.shadowOffsetX = s.offsetX;
            this.ctx.shadowOffsetY = s.offsetY;
            this.ctx.shadowBlur = s.blur;
        }
        
        if (element.effects.gradient) {
            const g = element.effects.gradient;
            let gradient;
            
            if (g.type === 'linear') {
                gradient = this.ctx.createLinearGradient(-100, 0, 100, 0);
            } else {
                gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
            }
            
            g.colors.forEach((color, index) => {
                gradient.addColorStop(g.stops[index] / 100 || index / (g.colors.length - 1), color);
            });
            
            this.ctx.fillStyle = gradient;
        }
    }
    
    clearCanvas() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawBackground() {
        if (!this.ctx || !this.state.currentDesign) return;
        
        const bg = this.state.currentDesign.background;
        
        if (bg.type === 'color') {
            this.ctx.fillStyle = bg.value;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (bg.type === 'gradient' && Array.isArray(bg.value)) {
            const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
            bg.value.forEach((color, index) => {
                gradient.addColorStop(index / (bg.value.length - 1), color);
            });
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    drawGuides() {
        if (!this.ctx) return;
        
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.lineWidth = 1;
        
        // خط الوسط الأفقي
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        
        // خط الوسط العمودي
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
        
        // خطوط الثلث
        const thirdW = this.canvas.width / 3;
        const thirdH = this.canvas.height / 3;
        
        for (let i = 1; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(thirdW * i, 0);
            this.ctx.lineTo(thirdW * i, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, thirdH * i);
            this.ctx.lineTo(this.canvas.width, thirdH * i);
            this.ctx.stroke();
        }
    }
    
    highlightElement(elementId) {
        const element = this.state.layers.find(el => el.id === elementId);
        if (!element || !this.ctx) return;
        
        this.ctx.save();
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.strokeRect(
            element.position.x - 5,
            element.position.y - 5,
            element.position.width + 10,
            element.position.height + 10
        );
        
        this.ctx.restore();
    }
    
    // ========== أدوات الرسم ==========
    
    drawStar(cx, cy, outerRadius, innerRadius, points) {
        this.ctx.beginPath();
        
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points;
            const x = cx + radius * Math.sin(angle);
            const y = cy - radius * Math.cos(angle);
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawHeart(cx, cy, size) {
        this.ctx.beginPath();
        
        // رسم شكل القلب
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(cx, cy + size / 4);
        
        // النصف الأيسر
        this.ctx.bezierCurveTo(
            cx, cy, 
            cx - size / 2, cy, 
            cx - size / 2, cy + size / 4
        );
        
        // النصف الأيمن
        this.ctx.bezierCurveTo(
            cx - size / 2, cy + size / 2, 
            cx, cy + size * 0.75, 
            cx, cy + size
        );
        
        this.ctx.bezierCurveTo(
            cx, cy + size * 0.75, 
            cx + size / 2, cy + size / 2, 
            cx + size / 2, cy + size / 4
        );
        
        this.ctx.bezierCurveTo(
            cx + size / 2, cy, 
            cx, cy, 
            cx, cy + size / 4
        );
        
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    // ========== إدارة التاريخ ==========
    
    saveToHistory(action, data) {
        this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        this.state.history.push({ action, data, timestamp: new Date().toISOString() });
        this.state.historyIndex++;
        
        // الحد الأقصى للتاريخ: 50 إجراء
        if (this.state.history.length > 50) {
            this.state.history.shift();
            this.state.historyIndex--;
        }
    }
    
    undo() {
        if (this.state.historyIndex < 0) return;
        
        const historyItem = this.state.history[this.state.historyIndex];
        this.state.historyIndex--;
        
        // التراجع عن الإجراء
        this.applyHistoryAction(historyItem, true);
        this.renderAllElements();
        
        return historyItem;
    }
    
    redo() {
        if (this.state.historyIndex >= this.state.history.length - 1) return;
        
        this.state.historyIndex++;
        const historyItem = this.state.history[this.state.historyIndex];
        
        // إعادة الإجراء
        this.applyHistoryAction(historyItem, false);
        this.renderAllElements();
        
        return historyItem;
    }
    
    applyHistoryAction(historyItem, isUndo) {
        switch (historyItem.action) {
            case 'add_text':
            case 'add_image':
            case 'add_shape':
            case 'add_icon':
                if (isUndo) {
                    this.state.layers = this.state.layers.filter(el => el.id !== historyItem.data.id);
                } else {
                    this.state.layers.push(historyItem.data);
                }
                break;
                
            case 'delete_element':
                if (isUndo) {
                    this.state.layers.push(historyItem.data);
                } else {
                    this.state.layers = this.state.layers.filter(el => el.id !== historyItem.data.id);
                }
                break;
                
            case 'update_element':
                const elementIndex = this.state.layers.findIndex(el => el.id === historyItem.data.elementId);
                if (elementIndex !== -1) {
                    this.state.layers[elementIndex] = isUndo ? 
                        historyItem.data.oldElement : 
                        historyItem.data.newElement;
                }
                break;
        }
    }
    
    // ========== الواجهة ==========
    
    updateDesignUI() {
        const design = this.state.currentDesign;
        
        // تحديث معلومات التصميم
        const elements = {
            designName: document.getElementById('designName'),
            designSize: document.getElementById('designSize'),
            designLayers: document.getElementById('designLayers'),
            designModified: document.getElementById('designModified')
        };
        
        if (elements.designName && design) {
            elements.designName.textContent = design.name;
        }
        
        if (elements.designSize && design) {
            elements.designSize.textContent = `${design.size.width} × ${design.size.height}`;
        }
        
        if (elements.designLayers && design) {
            elements.designLayers.textContent = this.state.layers.length;
        }
        
        if (elements.designModified && design) {
            elements.designModified.textContent = new Date(design.modifiedAt).toLocaleDateString('ar-EG');
        }
    }
    
    updatePropertiesPanel() {
        const panel = document.getElementById('propertiesPanel');
        if (!panel || this.state.selectedElements.length === 0) return;
        
        const elementId = this.state.selectedElements[0];
        const element = this.state.layers.find(el => el.id === elementId);
        if (!element) return;
        
        panel.innerHTML = `
            <div class="properties-header">
                <h5>خصائص العنصر</h5>
                <div class="element-type">${element.type}</div>
            </div>
            
            <div class="properties-section">
                <h6>الموضع</h6>
                <div class="property">
                    <label>X:</label>
                    <input type="number" value="${element.position.x}" 
                           onchange="graphicDesigner.moveElement('${element.id}', this.value, ${element.position.y})">
                </div>
                <div class="property">
                    <label>Y:</label>
                    <input type="number" value="${element.position.y}" 
                           onchange="graphicDesigner.moveElement('${element.id}', ${element.position.x}, this.value)">
                </div>
            </div>
            
            ${element.type === 'text' ? `
                <div class="properties-section">
                    <h6>النص</h6>
                    <textarea onchange="graphicDesigner.updateElement('${element.id}', {content: this.value})">
                        ${element.content}
                    </textarea>
                </div>
            ` : ''}
            
            <div class="properties-actions">
                <button class="btn-sm" onclick="graphicDesigner.duplicateElement('${element.id}')">
                    <i class="fas fa-copy"></i> نسخ
                </button>
                <button class="btn-sm" onclick="graphicDesigner.deleteElement('${element.id}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `;
    }
    
    updateUI(state) {
        const elements = {
            generating: document.querySelectorAll('.generating-state'),
            ready: document.querySelectorAll('.ready-state'),
            error: document.querySelectorAll('.error-state')
        };
        
        Object.values(elements).forEach(group => {
            group?.forEach(el => el.style.display = 'none');
        });
        
        if (elements[state]) {
            elements[state].forEach(el => {
                el.style.display = 'block';
            });
        }
    }
    
    showExportProgress(percentage) {
        const progressElement = document.getElementById('exportProgress');
        const progressBar = document.getElementById('exportProgressBar');
        const progressText = document.getElementById('exportProgressText');
        
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `جاري التصدير... ${percentage}%`;
        if (progressElement) {
            progressElement.style.display = percentage === 100 ? 'none' : 'block';
        }
    }
    
    // ========== أدوات مساعدة ==========
    
    calculateFileSize(format) {
        const width = this.state.currentDesign?.size.width || 1280;
        const height = this.state.currentDesign?.size.height || 720;
        
        // تقدير حجم الملف
        let sizePerPixel = 4; // RGBA
        if (format === 'jpg') sizePerPixel = 3; // RGB
        if (format === 'png') sizePerPixel = 4; // RGBA
        
        const sizeInBytes = width * height * sizePerPixel;
        return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    
    generateDownloadUrl(format) {
        if (!this.canvas) return '#';
        
        const dataUrl = this.canvas.toDataURL(`image/${format}`, 1);
        return dataUrl;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    getDefaultSpecs() {
        return {
            colors: ['#6366f1', '#8b5cf6', '#ffffff', '#000000'],
            layout: 'تصميم احترافي',
            elements: [],
            fonts: ['Cairo'],
            effects: []
        };
    }
    
    getDemoDesign(prompt, options) {
        const size = this.config.canvasSizes[options.size || this.state.canvasSize];
        
        // إنشاء تصميم تجريبي
        this.clearCanvas();
        this.state.layers = [];
        
        // خلفية تدرجية
        this.state.currentDesign.background = {
            type: 'gradient',
            value: ['#6366f1', '#8b5cf6']
        };
        
        // إضافة نص
        this.addText({
            content: prompt.substring(0, 30),
            x: size.width / 2 - 150,
            y: size.height / 2 - 50,
            width: 300,
            fontFamily: 'Cairo',
            fontSize: 48,
            color: '#ffffff',
            alignment: 'center'
        });
        
        // إضافة شكل
        this.addShape('rectangle', {
            x: size.width / 2 - 200,
            y: size.height / 2 - 100,
            width: 400,
            height: 200,
            fill: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 20
        });
        
        this.renderAllElements();
        
        return {
            success: true,
            message: '🎨 هذا تصميم تجريبي. للحصول على تصميم حقيقي، أضف Gemini API Key'
        };
    }
    
    loadDesigns() {
        try {
            const saved = localStorage.getItem('nexus_designs');
            if (saved) {
                this.state.designs = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Cannot load designs:', error);
        }
    }
    
    saveDesigns() {
        try {
            localStorage.setItem('nexus_designs', JSON.stringify(this.state.designs));
        } catch (error) {
            console.warn('Cannot save designs:', error);
        }
    }
    
    saveExport(exportData) {
        try {
            const exports = JSON.parse(localStorage.getItem('nexus_design_exports') || '[]');
            exports.push(exportData);
            localStorage.setItem('nexus_design_exports', JSON.stringify(exports));
        } catch (error) {
            console.error('Failed to save export:', error);
        }
    }
    
    setupEventListeners() {
        console.log('🎧 Setting up graphic designer event listeners...');
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // البحث عن عنصر تم النقر عليه
        const clickedElement = this.state.layers.find(element => {
            return x >= element.position.x &&
                   x <= element.position.x + element.position.width &&
                   y >= element.position.y &&
                   y <= element.position.y + element.position.height;
        });
        
        if (clickedElement) {
            this.selectElement(clickedElement.id);
        } else {
            this.state.selectedElements = [];
            this.updatePropertiesPanel();
        }
    }
    
    handleMouseDown(e) {
        // معالجة بدء السحب
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        // معالجة السحب
        const dx = e.clientX - this.dragStartX;
        const dy = e.clientY - this.dragStartY;
        
        if (this.state.selectedElements.length > 0) {
            const elementId = this.state.selectedElements[0];
            const element = this.state.layers.find(el => el.id === elementId);
            if (element) {
                this.moveElement(elementId, element.position.x + dx, element.position.y + dy);
                this.dragStartX = e.clientX;
                this.dragStartY = e.clientY;
            }
        }
    }
    
    handleMouseUp() {
        this.isDragging = false;
    }
    
    getStats() {
        return {
            totalDesigns: this.state.designs.length,
            currentDesign: this.state.currentDesign?.name,
            layersCount: this.state.layers.length,
            selectedElements: this.state.selectedElements.length,
            historySteps: this.state.history.length
        };
    }
}

// ========== التصدير والتشغيل ==========

if (typeof window !== 'undefined') {
    window.GraphicDesigner = GraphicDesigner;
    window.graphicDesigner = new GraphicDesigner();
    
    // وظائف للاستخدام في onclick
    window.createNewDesign = (options) => window.graphicDesigner.createDesign(options);
    window.addTextElement = (options) => window.graphicDesigner.addText(options);
    window.addImageElement = (url, options) => window.graphicDesigner.addImage(url, options);
    window.generateDesignWithAI = (prompt, options) => window.graphicDesigner.generateDesignWithAI(prompt, options);
    window.exportDesignAs = (format, quality) => window.graphicDesigner.exportDesign(format, quality);
    window.undoDesign = () => window.graphicDesigner.undo();
    window.redoDesign = () => window.graphicDesigner.redo();
    
    // تشغيل عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎨 Graphic Designer Ready');
    });
}

export default GraphicDesigner;