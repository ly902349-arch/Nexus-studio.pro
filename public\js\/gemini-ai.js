// Gemini AI Integration - النسخة المبسطة
// هذه نسخة مبسطة للبدء، ثم نضيف المزيد

'use strict';

class GeminiAI {
    constructor() {
        this.config = window.CONFIG || {};
        this.apiKey = this.config.GEMINI_API_KEY || 'AIzaSyBh6axDLjhHMkLnyh4r0eR3wFUpaRZSmqQ';
        this.model = this.config.AI?.defaultModel || 'gemini-pro';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
        
        this.isDemoMode = this.apiKey === 'demo_mode' || !this.apiKey;
        this.conversationHistory = [];
        
        this.initialize();
    }
    
    initialize() {
        console.log(`🤖 Gemini AI ${this.isDemoMode ? 'Demo' : 'Live'} Mode Initialized`);
        
        if (this.isDemoMode) {
            this.showDemoWarning();
        }
    }
    
    showDemoWarning() {
        console.warn('⚠️ الوضع التجريبي مفعل. أضف Gemini API Key في config.js');
        return '🎯 أنت في الوضع التجريبي. أضف API Key للحصول على ميزات كاملة.';
    }
    
    // الوظيفة الأساسية
    async generateContent(prompt, options = {}) {
        if (this.isDemoMode) {
            return this.getDemoResponse(prompt);
        }
        
        try {
            const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: options.temperature || 0.7,
                        maxOutputTokens: options.maxTokens || 2048
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                          'لم أتمكن من إنشاء رد. حاول مرة أخرى.';
            
            // حفظ في السجل
            this.addToHistory('user', prompt);
            this.addToHistory('assistant', result);
            
            return result;
            
        } catch (error) {
            console.error('Gemini AI Error:', error);
            return this.handleError(error);
        }
    }
    
    // توليد سيناريو
    async generateScript(topic, duration = 5) {
        const prompt = `اكتب سيناريو فيديو عربي احترافي عن: ${topic}
        المدة: ${duration} دقائق
        الهيكل: مقدمة، محتوى رئيسي، خاتمة
        النبرة: احترافية وجذابة
        أضف دعوة للعمل وتوقيتات.`;
        
        return await this.generateContent(prompt, { temperature: 0.8 });
    }
    
    // توليد أفكار
    async generateVideoIdeas(keywords, count = 5) {
        const prompt = `أعطني ${count} أفكار فيديو عربية مبتكرة عن: ${keywords.join(', ')}
        لكل فكرة قدم: عنوان جذاب، فكرة أساسية، جمهور مستهدف، مدة مقترحة.`;
        
        return await this.generateContent(prompt, { temperature: 0.9 });
    }
    
    // تحليل أداء
    async analyzePerformance(data) {
        const prompt = `حلل أداء الفيديو التالي:
        المشاهدات: ${data.views || 'غير متوفر'}
        التفاعل: ${data.engagement || 'غير متوفر'}%
        مدة المشاهدة: ${data.watchTime || 'غير متوفر'}
        
        قدم تحليلاً مع نقاط القوة والضعف وتوصيات.`;
        
        return await this.generateContent(prompt, { temperature: 0.6 });
    }
    
    // تصميم ثامبريل
    async generateThumbnailPrompt(videoTopic) {
        const prompt = `صمم وصفاً لثامبريل احترافي لفيديو عن: ${videoTopic}
        قدم: ألوان مناسبة، نصوص وعناوين، عناصر بصرية، أسلوب تصميمي.`;
        
        return await this.generateContent(prompt, { temperature: 0.8 });
    }
    
    // ========== وضع التجربة ==========
    
    getDemoResponse(prompt) {
        const responses = {
            'مرحبا': 'مرحباً بك! 👋 كيف يمكنني مساعدتك اليوم في Nexus Studio؟',
            'شكرا': 'العفو! 😊 سعيد بمساعدتك. هل تحتاج لشيء آخر؟',
            'مساعدة': 'أستطيع مساعدتك في: كتابة السيناريوهات، توليد الأفكار، تحليل الأداء، تصميم الجرافيك. اختر المهمة المناسبة!',
            'سيناريو': '📝 **سيناريو تجريبي:**\n\nالمقدمة: مرحباً بك في هذا الفيديو التعليمي\nالمحتوى: 3 نقاط رئيسية مع أمثلة\nالخاتمة: تلخيص ودعوة للاشتراك\n\n💎 للحصول على سيناريو حقيقي، أضف API Key',
            'فكرة': '💡 **5 أفكار تجريبية:**\n1. كيفية البدء في اليوتيوب\n2. نصائح لزيادة المشاهدات\n3. أدوات مجانية لصناع المحتوى\n4. تحليل قنوات ناجحة\n5. استراتيجيات التسويق\n\n✨ أضف API Key لأفكار مخصصة',
            'تحليل': '📊 **تحليل تجريبي:**\n✅ نقاط القوة: العنوان جذاب\n⚠️ نقاط الضعف: يمكن تحسين المقدمة\n💡 توصيات: أضف عناصر تفاعلية\n\n🔧 أضف API Key لتحليل دقيق'
        };
        
        const lowerPrompt = prompt.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerPrompt.includes(key.toLowerCase())) {
                return response;
            }
        }
        
        return `🤖 **مساعد Nexus Studio**\n\nيمكنني مساعدتك في:\n✨ كتابة سيناريوهات الفيديو\n💡 توليد أفكار المحتوى\n📊 تحليل أداء الفيديوهات\n🎨 تصميم الثمبنيلات\n📡 تحضير البث المباشر\n\n💎 **للتجربة الكاملة:**\n1. احصل على Gemini API Key\n2. أضفه في config.js\n3. استمتع بذكاء اصطناعي حقيقي!\n\n💬 جرب: "اكتب سيناريو عن..." أو "أعطني أفكار عن..."`;
    }
    
    handleError(error) {
        return `⚠️ حدث خطأ في الاتصال: ${error.message}\n💡 تحقق من اتصال الإنترنت و API Key`;
    }
    
    addToHistory(role, content) {
        this.conversationHistory.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });
        
        // الحفاظ على آخر 20 رسالة
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }
    
    getHistory() {
        return [...this.conversationHistory];
    }
    
    clearHistory() {
        this.conversationHistory = [];
        return '🗑️ تم مسح سجل المحادثة';
    }
    
    getStats() {
        return {
            isDemo: this.isDemoMode,
            historyLength: this.conversationHistory.length,
            lastActivity: this.conversationHistory[this.conversationHistory.length - 1]?.timestamp
        };
    }
}

// التصدير
if (typeof window !== 'undefined') {
    window.GeminiAI = GeminiAI;
    window.geminiAI = new GeminiAI();
    
    // التهيئة التلقائية
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ Gemini AI Ready for Nexus Studio');
    });
}

export default GeminiAI;