// ⚠️ ⚠️ ⚠️ ملف إعدادات آمن - لا تشاركه ⚠️ ⚠️ ⚠️
// Nexus Studio Configuration - النسخة الكاملة

const CONFIG = {
    // ========== إعدادات الذكاء الاصطناعي ==========
    GEMINI_API_KEY: 'AIzaSyBh6axDLjhHMkLnyh4r0eR3wFUpaRZSmqQ', // ⬅️ ضع مفتاحك هنا
    
    // ========== إعدادات التطبيق ==========
    APP_NAME: 'Nexus Studio',
    VERSION: '2.0.0',
    AUTHOR: 'Nexus Team',
    BUILD_DATE: '2024-01-01',
    
    // ========== إعدادات الواجهة ==========
    THEME: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        dark: '#1f2937',
        light: '#f9fafb',
        gray: '#6b7280'
    },
    
    // ========== إعدادات الذكاء الاصطناعي ==========
    AI: {
        defaultModel: 'gemini-pro',
        temperature: 0.7,
        maxTokens: 2048,
        language: 'ar',
        safetySettings: {
            harassment: 'BLOCK_MEDIUM_AND_ABOVE',
            hate_speech: 'BLOCK_MEDIUM_AND_ABOVE',
            sexually_explicit: 'BLOCK_MEDIUM_AND_ABOVE',
            dangerous_content: 'BLOCK_MEDIUM_AND_ABOVE'
        }
    },
    
    // ========== إعدادات الفيديو ==========
    VIDEO: {
        defaultResolution: '1080p',
        supportedResolutions: ['360p', '480p', '720p', '1080p', '4K'],
        defaultFPS: 30,
        supportedFPS: [24, 30, 60],
        aspectRatios: ['16:9', '1:1', '9:16', '4:5']
    },
    
    // ========== إعدادات البث المباشر ==========
    LIVE_STREAM: {
        simultaneousPlatforms: 3,
        defaultDuration: 60,
        recordStream: true,
        platforms: {
            youtube: { name: 'YouTube', color: '#FF0000' },
            facebook: { name: 'Facebook', color: '#1877F2' },
            twitch: { name: 'Twitch', color: '#9146FF' },
            tiktok: { name: 'TikTok', color: '#000000' }
        }
    },
    
    // ========== إعدادات التخزين ==========
    STORAGE: {
        maxProjects: 50,
        maxScripts: 100,
        maxDesigns: 50,
        autoSave: true,
        backupInterval: 300000 // 5 دقائق
    },
    
    // ========== الميزات ==========
    FEATURES: {
        aiAssistant: true,
        videoEditor: true,
        liveStream: true,
        scriptWriter: true,
        graphicDesigner: true,
        analytics: true,
        export: true,
        templates: true
    },
    
    // ========== الروابط ==========
    URLS: {
        github: 'https://github.com/nexus-studio',
        documentation: 'https://docs.nexus-studio.com',
        support: 'https://support.nexus-studio.com',
        api: 'https://api.nexus-studio.com'
    },
    
    // ========== الإعدادات الافتراضية ==========
    DEFAULTS: {
        user: {
            language: 'ar',
            theme: 'light',
            notifications: true,
            autoSave: true
        },
        project: {
            name: 'مشروع جديد',
            resolution: '1080p',
            fps: 30,
            aspectRatio: '16:9'
        },
        export: {
            format: 'mp4',
            quality: 'high',
            includeWatermark: true
        }
    }
};

// ========== وظائف المساعدة ==========
const ConfigHelper = {
    // التحقق من صحة المفتاح
    validateAPIKey(key) {
        if (!key || key === 'demo_mode') {
            return { valid: false, mode: 'demo', message: 'الوضع التجريبي' };
        }
        
        if (key.startsWith('AIza') && key.length > 30) {
            return { valid: true, mode: 'live', message: 'مفتاح صالح' };
        }
        
        return { valid: false, mode: 'invalid', message: 'مفتاح غير صالح' };
    },
    
    // الحصول على إعدادات الميزة
    getFeatureSettings(feature) {
        return CONFIG.FEATURES[feature] || false;
    },
    
    // التحقق من دعم المنصة
    isPlatformSupported(platform) {
        return platform in CONFIG.LIVE_STREAM.platforms;
    },
    
    // الحصول على معلومات المنصة
    getPlatformInfo(platform) {
        return CONFIG.LIVE_STREAM.platforms[platform] || null;
    },
    
    // التحقق من الدقة المدعومة
    isResolutionSupported(resolution) {
        return CONFIG.VIDEO.supportedResolutions.includes(resolution);
    },
    
    // إنشاء تدرج لوني
    createGradient(color1, color2) {
        return `linear-gradient(135deg, ${color1}, ${color2})`;
    },
    
    // تنسيق الوقت
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // تنسيق الحجم
    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// ========== التصدير الآمن ==========
(function() {
    // نسخة آمنة للإستخدام العام
    const safeConfig = { ...CONFIG };
    
    // إخفاء المفتاح في الكونسول
    Object.defineProperty(safeConfig, 'GEMINI_API_KEY', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: CONFIG.GEMINI_API_KEY
    });
    
    // إضافة المساعد
    safeConfig.helper = ConfigHelper;
    
    // التصدير
    if (typeof window !== 'undefined') {
        window.CONFIG = Object.freeze(safeConfig);
        window.ConfigHelper = ConfigHelper;
    }
    
    // رسالة التحقق
    const keyCheck = ConfigHelper.validateAPIKey(CONFIG.GEMINI_API_KEY);
    console.log(`🚀 ${CONFIG.APP_NAME} v${CONFIG.VERSION}`);
    console.log(`🔑 حالة API: ${keyCheck.message}`);
    console.log(`🎨 الوضع: ${keyCheck.mode === 'demo' ? 'تجريبي' : 'فعّال'}`);
    console.log(`📅 البناء: ${CONFIG.BUILD_DATE}`);
})();

// للمستخدمين المتقدمين
export default CONFIG;