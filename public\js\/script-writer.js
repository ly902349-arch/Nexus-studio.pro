/**
 * Nexus Script Writer
 * نظام كتابة السيناريوهات المتقدم بالذكاء الاصطناعي
 * الإصدار: 2.0.0
 */

class ScriptWriter {
    constructor() {
        this.config = {
            templates: {
                'youtube-video': {
                    name: 'فيديو يوتيوب',
                    sections: [
                        { id: 'hook', name: 'الخطاف', duration: 15, description: 'جذب الانتباه في أول 15 ثانية' },
                        { id: 'intro', name: 'المقدمة', duration: 30, description: 'تقديم الموضوع والأهمية' },
                        { id: 'content', name: 'المحتوى', duration: 240, description: 'النقاط الرئيسية والتفاصيل' },
                        { id: 'examples', name: 'الأمثلة', duration: 120, description: 'أمثلة عملية وتطبيقات' },
                        { id: 'cta', name: 'دعوة للعمل', duration: 15, description: 'تشجيع المشاهد على التفاعل' },
                        { id: 'outro', name: 'الخاتمة', duration: 30, description: 'التلخيص والتوديع' }
                    ],
                    defaultDuration: 300 // 5 دقائق
                },
                
                'educational-tutorial': {
                    name: 'شرح تعليمي',
                    sections: [
                        { id: 'problem', name: 'المشكلة', duration: 30, description: 'توضيح المشكلة التي سيتم حلها' },
                        { id: 'solution', name: 'الحل', duration: 60, description: 'تقديم الحل العام' },
                        { id: 'steps', name: 'الخطوات', duration: 180, description: 'شرح الخطوات التفصيلية' },
                        { id: 'demo', name: 'التجربة', duration: 120, description: 'عرض عملي للحل' },
                        { id: 'tips', name: 'النصائح', duration: 60, description: 'نصائح وإرشادات إضافية' },
                        { id: 'summary', name: 'الملخص', duration: 30, description: 'تلخيص ما تم تعلمه' }
                    ],
                    defaultDuration: 480 // 8 دقائق
                },
                
                'product-review': {
                    name: 'مراجعة منتج',
                    sections: [
                        { id: 'unboxing', name: 'فتح العلبة', duration: 45, description: 'عرض المنتج لأول مرة' },
                        { id: 'features', name: 'المميزات', duration: 120, description: 'عرض مميزات المنتج' },
                        { id: 'testing', name: 'الاختبار', duration: 180, description: 'اختبار المنتج عملياً' },
                        { id: 'pros-cons', name: 'الإيجابيات والسلبيات', duration: 90, description: 'مقارنة الإيجابيات والسلبيات' },
                        { id: 'comparison', name: 'المقارنة', duration: 60, description: 'مقارنة مع منتجات مشابهة' },
                        { id: 'verdict', name: 'الخلاصة', duration: 45, description: 'التوصية النهائية' }
                    ],
                    defaultDuration: 540 // 9 دقائق
                },
                
                'storytelling': {
                    name: 'سرد القصص',
                    sections: [
                        { id: 'setup', name: 'البداية', duration: 60, description: 'تقديم الشخصيات والبيئة' },
                        { id: 'conflict', name: 'التصاعد', duration: 120, description: 'تطور الأحداث والمشاكل' },
                        { id: 'climax', name: 'الذروة', duration: 90, description: 'أهم لحظة في القصة' },
                        { id: 'resolution', name: 'الحل', duration: 60, description: 'حل المشكلات والعقد' },
                        { id: 'lesson', name: 'العبرة', duration: 45, description: 'الدرس المستفاد من القصة' },
                        { id: 'ending', name: 'النهاية', duration: 30, description: 'ختام القصة' }
                    ],
                    defaultDuration: 405 // 6.75 دقائق
                },
                
                'podcast-episode': {
                    name: 'حلقة بودكاست',
                    sections: [
                        { id: 'intro', name: 'الافتتاحية', duration: 120, description: 'تقديم الحلقة والضيوف' },
                        { id: 'topic-intro', name: 'تقديم الموضوع', duration: 180, description: 'الحديث عن موضوع الحلقة' },
                        { id: 'discussion', name: 'النقاش', duration: 1200, description: 'النقاش الرئيسي' },
                        { id: 'qa', name: 'الأسئلة', duration: 300, description: 'الرد على أسئلة المستمعين' },
                        { id: 'summary', name: 'الملخص', duration: 120, description: 'تلخيص النقاط المهمة' },
                        { id: 'outro', name: 'الختام', duration: 60, description: 'التوديع والإعلانات' }
                    ],
                    defaultDuration: 1980 // 33 دقيقة
                }
            },
            
            writingStyles: {
                'formal': 'لغة رسمية واحترافية',
                'casual': 'لغة عادية وودية',
                'energetic': 'لغة حماسية ومتحمسة',
                'humorous': 'لغة فكاهية ومرحة',
                'inspirational': 'لغة تحفيزية وملهمة'
            },
            
            targetAudiences: {
                'beginners': 'مبتدئين - يحتاج شرح مبسط',
                'intermediate': 'متوسطين - فهم أساسي للموضوع',
                'advanced': 'متقدمين - معرفة عميقة',
                'general': 'عامة الناس - مناسب للجميع',
                'professionals': 'محترفين - مصطلحات تقنية'
            }
        };
        
        this.state = {
            currentScript: null,
            scripts: [],
            activeTemplate: 'youtube-video',
            writingStyle: 'casual',
            targetAudience: 'general',
            wordCount: 0,
            estimatedDuration: 0,
            isGenerating: false
        };
        
        this.initialize();
    }
    
    initialize() {
        console.log('📝 Script Writer Initialized');
        this.loadScripts();
        this.setupEventListeners();
    }
    
    // ========== كتابة السيناريوهات ==========
    
    async generateScript(topic, options = {}) {
        if (!topic || topic.trim().length < 3) {
            throw new Error('الرجاء إدخال موضوع مفصل أكثر');
        }
        
        this.state.isGenerating = true;
        this.updateUI('generating');
        
        try {
            const template = options.template || this.state.activeTemplate;
            const duration = options.duration || this.config.templates[template].defaultDuration;
            const style = options.style || this.state.writingStyle;
            const audience = options.audience || this.state.targetAudience;
            
            if (!window.geminiAI) {
                return this.getDemoScript(topic, template, duration, style, audience);
            }
            
            const prompt = this.buildScriptPrompt(topic, template, duration, style, audience);
            const scriptText = await window.geminiAI.generateContent(prompt, {
                temperature: 0.8,
                maxTokens: 4000
            });
            
            const script = this.parseScript(scriptText, topic, template, duration, style, audience);
            this.state.currentScript = script;
            this.state.scripts.unshift(script);
            
            this.saveScripts();
            this.updateUI('ready');
            this.renderScript(script);
            
            return {
                success: true,
                script: script,
                message: '✅ تم كتابة السيناريو بنجاح'
            };
            
        } catch (error) {
            this.state.isGenerating = false;
            this.updateUI('error');
            
            return {
                success: false,
                error: error.message,
                message: '❌ فشل كتابة السيناريو'
            };
        } finally {
            this.state.isGenerating = false;
        }
    }
    
    buildScriptPrompt(topic, template, duration, style, audience) {
        const templateInfo = this.config.templates[template];
        
        return `📝 <مهمة: كتابة سيناريو فيديو احترافي باللغة العربية>
        
        الموضوع: ${topic}
        النوع: ${templateInfo.name}
        المدة: ${duration} ثانية (${Math.floor(duration/60)} دقيقة)
        الأسلوب: ${this.config.writingStyles[style]}
        الجمهور: ${this.config.targetAudiences[audience]}
        
        <هيكل السيناريو>
        ${templateInfo.sections.map(section => 
            `- ${section.name}: ${section.description} (${section.duration} ثانية)`
        ).join('\n')}
        
        <المتطلبات التفصيلية>
        
        1. **اللغة والاسلوب:**
        - استخدام اللغة العربية الفصحى الواضحة
        - الأسلوب: ${style}
        - ملاءمة اللغة للجمهور: ${audience}
        
        2. **التوقيت الدقيق:**
        - ذكر الوقت المنقضي لكل قسم
        - تقسيم النص إلى فقرات قصيرة
        - ملاحظات للمخرج حول التوقيت
        
        3. **العناصر البصرية:**
        - وصف المشاهد المقترحة
        - نوع اللقطات (wide, close-up, etc.)
        - الرسومات والنصوص على الشاشة
        - الانتقالات بين المشاهد
        
        4. **الصوت والموسيقى:**
        - المؤثرات الصوتية المناسبة
        - نوع الموسيقى الخلفية
        - نبرة الصوت والتعبير
        
        5. **التفاعل مع الجمهور:**
        - أسئلة تثير التفكير
        - دعوات للاشتراك والمتابعة
        - طلب التعليقات والتفاعل
        
        6. **ملاحظات الإنتاج:**
        - المعدات المطلوبة
        - أماكن التصوير المقترحة
        - الملابس والديكور
        
        <تنسيق المخرجات>
        - استخدم العناوين الرئيسية ##
        - أضف علامات الوقت [00:00]
        - قسم النص إلى فقرات قصيرة
        - أضف ملاحظات تقنية بين قوسين []
        
        قدم سيناريو كاملاً وجاهزاً للتصوير.`;
    }
    
    parseScript(scriptText, topic, template, duration, style, audience) {
        const sections = this.extractSections(scriptText);
        const wordCount = this.countWords(scriptText);
        const estimatedDuration = this.estimateDuration(scriptText);
        
        return {
            id: `script_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            topic: topic,
            template: template,
            duration: duration,
            style: style,
            audience: audience,
            content: scriptText,
            sections: sections,
            wordCount: wordCount,
            estimatedDuration: estimatedDuration,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            version: 1
        };
    }
    
    extractSections(scriptText) {
        const sections = [];
        const lines = scriptText.split('\n');
        let currentSection = null;
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // اكتشاف بداية قسم جديد
            if (trimmedLine.startsWith('## ') || trimmedLine.startsWith('# ')) {
                if (currentSection) {
                    sections.push(currentSection);
                }
                
                currentSection = {
                    title: trimmedLine.replace(/^#+\s*/, ''),
                    content: '',
                    timeMarkers: []
                };
            } else if (currentSection) {
                // اكتشاف علامات الوقت
                const timeMatch = trimmedLine.match(/\[(\d{2}:\d{2})\]/);
                if (timeMatch) {
                    currentSection.timeMarkers.push({
                        time: timeMatch[1],
                        text: trimmedLine.replace(/\[\d{2}:\d{2}\]\s*/, '')
                    });
                }
                
                currentSection.content += line + '\n';
            }
        }
        
        if (currentSection) {
            sections.push(currentSection);
        }
        
        return sections;
    }
    
    countWords(text) {
        const arabicWords = text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g) || [];
        const otherWords = text.split(/\s+/).filter(word => 
            !word.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/)
        );
        
        return arabicWords.length + otherWords.length;
    }
    
    estimateDuration(text) {
        // تقدير المدة بناءً على عدد الكلمات (150 كلمة = دقيقة واحدة)
        const wordsPerMinute = 150;
        const wordCount = this.countWords(text);
        return Math.ceil(wordCount / wordsPerMinute * 60); // ثانية
    }
    
    // ========== تحسين السيناريوهات ==========
    
    async optimizeScript(scriptId, optimizationType) {
        const script = this.state.scripts.find(s => s.id === scriptId);
        if (!script) {
            throw new Error('السيناريو غير موجود');
        }
        
        if (!window.geminiAI) {
            return this.getDemoOptimization(script, optimizationType);
        }
        
        const prompt = this.buildOptimizationPrompt(script, optimizationType);
        
        try {
            const optimizedText = await window.geminiAI.generateContent(prompt, {
                temperature: 0.7,
                maxTokens: 3000
            });
            
            const optimizedScript = {
                ...script,
                id: `script_opt_${Date.now()}`,
                content: optimizedText,
                optimizedFrom: scriptId,
                optimizationType: optimizationType,
                modifiedAt: new Date().toISOString(),
                version: script.version + 1
            };
            
            this.state.scripts.unshift(optimizedScript);
            this.state.currentScript = optimizedScript;
            
            this.saveScripts();
            this.renderScript(optimizedScript);
            
            return {
                success: true,
                script: optimizedScript,
                message: '✨ تم تحسين السيناريو بنجاح'
            };
            
        } catch (error) {
            console.error('Optimization failed:', error);
            throw new Error('فشل تحسين السيناريو: ' + error.message);
        }
    }
    
    buildOptimizationPrompt(script, optimizationType) {
        const optimizationPrompts = {
            'clarity': `🔍 <مهمة: تحسين وضوح السيناريو>
            
            السيناريو الأصلي: ${script.topic}
            
            <المطلوب>
            - جعل الجمل أكثر وضوحاً
            - تبسيط المصطلحات المعقدة
            - تحسين تدفق الأفكار
            - جعل النص سهل الفهم للجمهور: ${script.audience}
            
            حافظ على المحتوى الأساسي لكن جعله أوضح.`,
            
            'engagement': `🎯 <مهمة: زيادة تفاعلية السيناريو>
            
            السيناريو الأصلي: ${script.topic}
            
            <المطلوب>
            - إضافة عناصر تفاعلية
            - تحويل المعلومات إلى قصص
            - إدخال أسئلة للمشاهدين
            - زيادة التشويق والإثارة
            - تحسين دعوات العمل
            
            اجعل السيناريو أكثر جذباً للانتباه.`,
            
            'brevity': `✂️ <مهمة: تقصير السيناريو>
            
            السيناريو الأصلي: ${script.topic}
            المدة الحالية: ${Math.floor(script.estimatedDuration/60)} دقائق
            
            <المطلوب>
            - حذف المعلومات الزائدة
            - دمج الأفكار المتشابهة
            - جعل الجمل أكثر إيجازاً
            - الحفاظ على المحتوى الأساسي
            - تقليل المدة بنسبة 30%
            
            احذف ما لا يضيف قيمة للمشاهد.`,
            
            'platform': `📱 <مهمة: تكييف السيناريو لمنصة ${optimizationType}>
            
            السيناريو الأصلي: ${script.topic}
            المنصة المستهدفة: ${optimizationType}
            
            <المطلوب>
            - تعديل المدة للمنصة
            - تغيير الأسلوب للمنصة
            - إضافة عناصر خاصة بالمنصة
            - تعديل دعوات العمل
            - تكييف المحتوى لجمهور المنصة
            
            اجعل السيناريو مثالياً للمنصة المحددة.`
        };
        
        const basePrompt = optimizationPrompts[optimizationType] || optimizationPrompts.clarity;
        
        return `${basePrompt}
        
        <السيناريو الحالي>
        ${script.content.substring(0, 2000)}...
        
        قدم السيناريو المحسن مع شرح التغييرات التي أجريتها.`;
    }
    
    async generateVisualPlan(scriptId) {
        const script = this.state.scripts.find(s => s.id === scriptId);
        if (!script) {
            throw new Error('السيناريو غير موجود');
        }
        
        if (!window.geminiAI) {
            return this.getDemoVisualPlan(script);
        }
        
        const prompt = `🎬 <مهمة: إنشاء خطة بصرية للسيناريو>
        
        عنوان السيناريو: ${script.topic}
        النوع: ${script.template}
        المدة: ${Math.floor(script.estimatedDuration/60)} دقيقة
        
        <المطلوب>
        
        1. **اللقطات المقترحة:**
        - نوع اللقطة (wide, medium, close-up, etc.)
        - الزاوية والحركة
        - المدة المقترحة لكل لقطة
        
        2. **المشاهد والإعدادات:**
        - أماكن التصوير
        - الديكور والخلفيات
        - الإضاءة المطلوبة
        
        3. **الرسومات والنصوص:**
        - النصوص على الشاشة
        - الرسومات المتحركة
        - الشعارات والعلامات
        
        4. **الانتقالات والمؤثرات:**
        - الانتقالات بين المشاهد
        - المؤثرات البصرية
        - المؤثرات الصوتية
        
        5. **مخطط التصوير:**
        - ترتيب اللقطات
        - المعدات المطلوبة
        - فريق العمل اللازم
        
        6. **جدول الإنتاج:**
        - وقت التحضير
        - وقت التصوير
        - وقت المونتاج
        
        <السيناريو>
        ${script.content.substring(0, 1500)}...
        
        قدم الخطة البصرية بشكل منظم وجاهز للتنفيذ.`;
        
        try {
            const visualPlan = await window.geminiAI.generateContent(prompt, {
                temperature: 0.7,
                maxTokens: 3500
            });
            
            return {
                success: true,
                visualPlan: visualPlan,
                message: '🎨 تم إنشاء الخطة البصرية'
            };
            
        } catch (error) {
            console.error('Visual plan generation failed:', error);
            throw new Error('فشل إنشاء الخطة البصرية: ' + error.message);
        }
    }
    
    // ========== إدارة السيناريوهات ==========
    
    saveScript(script) {
        if (!this.state.currentScript) return;
        
        this.state.currentScript.modifiedAt = new Date().toISOString();
        this.state.currentScript.version++;
        
        this.saveScripts();
        this.updateUI('saved');
        
        return {
            success: true,
            message: '💾 تم حفظ السيناريو',
            version: this.state.currentScript.version
        };
    }
    
    exportScript(format = 'pdf') {
        if (!this.state.currentScript) {
            throw new Error('لا يوجد سيناريو مفتوح');
        }
        
        const script = this.state.currentScript;
        const exportData = this.formatForExport(script, format);
        
        const blob = new Blob([exportData.content], { type: exportData.mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `سيناريو_${script.topic.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return {
            success: true,
            message: '📤 تم تصدير السيناريو',
            format: format,
            fileName: a.download
        };
    }
    
    formatForExport(script, format) {
        const formats = {
            'pdf': {
                mimeType: 'application/pdf',
                content: this.generatePDF(script)
            },
            'docx': {
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                content: this.generateDocx(script)
            },
            'txt': {
                mimeType: 'text/plain',
                content: this.generateText(script)
            },
            'json': {
                mimeType: 'application/json',
                content: JSON.stringify(script, null, 2)
            }
        };
        
        return formats[format] || formats.txt;
    }
    
    generatePDF(script) {
        // محاكاة إنشاء PDF
        const content = `
            سيناريو: ${script.topic}
            النوع: ${this.config.templates[script.template]?.name || script.template}
            المدة: ${Math.floor(script.estimatedDuration/60)} دقيقة
            الكلمات: ${script.wordCount}
            التاريخ: ${new Date(script.createdAt).toLocaleDateString('ar-EG')}
            
            ${'='.repeat(50)}
            
            ${script.content}
            
            ${'='.repeat(50)}
            
            تم إنشاؤه بواسطة Nexus Studio
            ${window.CONFIG?.APP_NAME || 'Nexus Studio'} v${window.CONFIG?.VERSION || '2.0.0'}
        `;
        
        return content;
    }
    
    generateDocx(script) {
        // محاكاة إنشاء Docx
        return this.generateText(script);
    }
    
    generateText(script) {
        return script.content;
    }
    
    // ========== الواجهة ==========
    
    renderScript(script) {
        const container = document.getElementById('scriptContainer');
        if (!container) return;
        
        const template = this.config.templates[script.template];
        
        container.innerHTML = `
            <div class="script-header">
                <div class="script-title">
                    <h3>${script.topic}</h3>
                    <div class="script-meta">
                        <span class="badge template">${template?.name || script.template}</span>
                        <span class="badge duration">${Math.floor(script.estimatedDuration/60)} دقيقة</span>
                        <span class="badge words">${script.wordCount} كلمة</span>
                        <span class="badge style">${this.config.writingStyles[script.style] || script.style}</span>
                    </div>
                </div>
                
                <div class="script-actions">
                    <button class="btn" onclick="scriptWriter.saveScript()">
                        <i class="fas fa-save"></i> حفظ
                    </button>
                    <button class="btn" onclick="scriptWriter.exportScript('pdf')">
                        <i class="fas fa-download"></i> تصدير
                    </button>
                    <button class="btn" onclick="showOptimizationOptions()">
                        <i class="fas fa-magic"></i> تحسين
                    </button>
                </div>
            </div>
            
            <div class="script-sections">
                ${template?.sections.map((section, index) => `
                    <div class="section-card" data-section="${section.id}">
                        <div class="section-header">
                            <div class="section-number">${index + 1}</div>
                            <div class="section-info">
                                <h4>${section.name}</h4>
                                <p>${section.description}</p>
                            </div>
                            <div class="section-duration">${section.duration}ث</div>
                        </div>
                        
                        <div class="section-content" id="section-${section.id}">
                            ${this.extractSectionContent(script.content, section.name)}
                        </div>
                        
                        <div class="section-actions">
                            <button class="btn-sm" onclick="regenerateSection('${section.id}')">
                                <i class="fas fa-redo"></i> إعادة توليد
                            </button>
                            <button class="btn-sm" onclick="expandSection('${section.id}')">
                                <i class="fas fa-expand"></i> توسيع
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="script-stats">
                <div class="stat">
                    <i class="fas fa-clock"></i>
                    <div>
                        <div class="stat-value">${Math.floor(script.estimatedDuration/60)}:${(script.estimatedDuration%60).toString().padStart(2, '0')}</div>
                        <div class="stat-label">المدة الكلية</div>
                    </div>
                </div>
                
                <div class="stat">
                    <i class="fas fa-font"></i>
                    <div>
                        <div class="stat-value">${script.wordCount}</div>
                        <div class="stat-label">عدد الكلمات</div>
                    </div>
                </div>
                
                <div class="stat">
                    <i class="fas fa-layer-group"></i>
                    <div>
                        <div class="stat-value">${template?.sections.length || 0}</div>
                        <div class="stat-label">عدد الأقسام</div>
                    </div>
                </div>
                
                <div class="stat">
                    <i class="fas fa-calendar"></i>
                    <div>
                        <div class="stat-value">${new Date(script.createdAt).toLocaleDateString('ar-EG')}</div>
                        <div class="stat-label">تاريخ الإنشاء</div>
                    </div>
                </div>
            </div>
            
            <div class="script-full-content" style="display: none;">
                <pre>${script.content}</pre>
            </div>
        `;
        
        this.updateUI('rendered');
    }
    
    extractSectionContent(fullContent, sectionName) {
        const lines = fullContent.split('\n');
        let inSection = false;
        let sectionContent = [];
        
        for (const line of lines) {
            if (line.includes(sectionName) && (line.startsWith('#') || line.startsWith('##'))) {
                inSection = true;
                continue;
            }
            
            if (inSection) {
                if (line.startsWith('#') || line.startsWith('##')) {
                    break;
                }
                sectionContent.push(line);
            }
        }
        
        const content = sectionContent.join('\n').trim();
        return content || 'لم يتم العثور على محتوى لهذا القسم';
    }
    
    updateUI(state) {
        const elements = {
            generating: document.querySelectorAll('.generating-state'),
            ready: document.querySelectorAll('.ready-state'),
            saved: document.querySelectorAll('.saved-state'),
            error: document.querySelectorAll('.error-state'),
            rendered: document.querySelectorAll('.rendered-state')
        };
        
        // إخفاء جميع الحالات
        Object.values(elements).forEach(group => {
            group?.forEach(el => el.style.display = 'none');
        });
        
        // إظهار الحالة الحالية
        if (elements[state]) {
            elements[state].forEach(el => {
                el.style.display = 'block';
            });
        }
        
        // تحديث النصوص
        this.updateStatusText(state);
    }
    
    updateStatusText(state) {
        const statusMap = {
            generating: '⚙️ جاري كتابة السيناريو...',
            ready: '✅ جاهز للكتابة',
            saved: '💾 تم الحفظ',
            error: '❌ خطأ',
            rendered: '📝 السيناريو معروض'
        };
        
        const statusElement = document.getElementById('scriptStatus');
        if (statusElement) {
            statusElement.textContent = statusMap[state] || '';
            statusElement.className = `status-${state}`;
        }
    }
    
    // ========== النماذج التجريبية ==========
    
    getDemoScript(topic, template, duration, style, audience) {
        const templateInfo = this.config.templates[template];
        
        const demoScript = `# سيناريو: ${topic}

## المقدمة (0:00 - 0:30)
[00:00] (موسيقى حماسية تبدأ)
"أهلًا وسهلًا بيكم! النهاردة بنتكلم عن ${topic}"

[00:15] (لقطة متوسطة للمقدم)
"هل سألت نفسك يومًا عن ${topic}؟ اليوم هنعرف كل حاجة عنه!"

## المحتوى الرئيسي (0:30 - 4:00)
[00:30] (لقطة واسعة)
"أول نقطة وأهم نقطة..."

[01:00] (رسومات على الشاشة)
"هنشوف دلوقتي 3 نقاط أساسية:"

1. النقطة الأولى
2. النقطة الثانية  
3. النقطة الثالثة

[02:30] (أمثلة عملية)
"مثلاً لو عايز..."

## الخاتمة (4:00 - 4:30)
[04:00] (تلخيص)
"وبكده نكون خلصنا أهم النقاط..."

[04:15] (دعوة للعمل)
"ما تنساش تشترك في القناة وتفعل الجرس!"

💎 هذا سيناريو تجريبي. للحصول على سيناريو كامل، أضف Gemini API Key`;

        const script = this.parseScript(demoScript, topic, template, duration, style, audience);
        this.state.currentScript = script;
        this.state.scripts.unshift(script);
        
        this.saveScripts();
        this.renderScript(script);
        
        return {
            success: true,
            script: script,
            message: '🎭 هذا سيناريو تجريبي. للحصول على سيناريو حقيقي، أضف Gemini API Key'
        };
    }
    
    getDemoOptimization(script, type) {
        const optimizations = {
            clarity: '✨ تم تحسين الوضوح (وضع تجريبي)',
            engagement: '🎯 تم زيادة التفاعل (وضع تجريبي)',
            brevity: '✂️ تم التقصير (وضع تجريبي)',
            platform: `📱 تم التكييف للمنصة (وضع تجريبي)`
        };
        
        return {
            success: true,
            script: script,
            message: optimizations[type] || '✨ تم التحسين (وضع تجريبي)'
        };
    }
    
    getDemoVisualPlan(script) {
        return {
            success: true,
            visualPlan: `🎬 خطة بصرية تجريبية لـ ${script.topic}

1. اللقطات:
   - لقطة واسعة للبداية
   - لقطات مقرّبة للتفاصيل
   - لقطة متوسطة للمقدم

2. المشاهد:
   - خلفية احترافية
   - إضاءة مناسبة
   - ديكور بسيط

3. الرسومات:
   - عناوين رئيسية
   - نقاط مهمة
   - شعار القناة

💎 هذه خطة تجريبية. للحصول على خطة كاملة، أضف Gemini API Key`,
            message: '🎨 تم إنشاء خطة بصرية تجريبية'
        };
    }
    
    // ========== أدوات مساعدة ==========
    
    loadScripts() {
        try {
            const saved = localStorage.getItem('nexus_scripts');
            if (saved) {
                this.state.scripts = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Cannot load scripts:', error);
        }
    }
    
    saveScripts() {
        try {
            localStorage.setItem('nexus_scripts', JSON.stringify(this.state.scripts));
        } catch (error) {
            console.warn('Cannot save scripts:', error);
        }
    }
    
    setupEventListeners() {
        console.log('🎧 Setting up script writer event listeners...');
    }
    
    getStats() {
        return {
            totalScripts: this.state.scripts.length,
            currentScript: this.state.currentScript?.topic,
            wordCount: this.state.wordCount,
            isGenerating: this.state.isGenerating
        };
    }
    
    // ========== وظائف الواجهة ==========
    
    setTemplate(template) {
        this.state.activeTemplate = template;
        this.updateTemplateUI();
    }
    
    setWritingStyle(style) {
        this.state.writingStyle = style;
    }
    
    setTargetAudience(audience) {
        this.state.targetAudience = audience;
    }
    
    updateTemplateUI() {
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect) {
            templateSelect.value = this.state.activeTemplate;
        }
        
        const templateInfo = this.config.templates[this.state.activeTemplate];
        if (templateInfo) {
            const infoElement = document.getElementById('templateInfo');
            if (infoElement) {
                infoElement.innerHTML = `
                    <h5>${templateInfo.name}</h5>
                    <p>${templateInfo.sections.length} قسم • ${Math.floor(templateInfo.defaultDuration/60)} دقيقة</p>
                    <div class="sections-preview">
                        ${templateInfo.sections.map(s => 
                            `<span class="section-tag">${s.name}</span>`
                        ).join('')}
                    </div>
                `;
            }
        }
    }
}

// ========== التصدير والتشغيل ==========

if (typeof window !== 'undefined') {
    window.ScriptWriter = ScriptWriter;
    window.scriptWriter = new ScriptWriter();
    
    // وظائف للاستخدام في onclick
    window.generateScript = (topic, options) => window.scriptWriter.generateScript(topic, options);
    window.optimizeScript = (type) => window.scriptWriter.optimizeScript(window.scriptWriter.state.currentScript?.id, type);
    window.exportScriptAs = (format) => window.scriptWriter.exportScript(format);
    window.setScriptTemplate = (template) => window.scriptWriter.setTemplate(template);
    
    // تشغيل عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📝 Script Writer Ready');
        window.scriptWriter.updateTemplateUI();
    });
}

export default ScriptWriter;