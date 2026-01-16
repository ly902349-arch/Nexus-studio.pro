/**
 * Nexus Live Stream Manager
 * نظام البث المباشر المتكامل للمنصات المتعددة
 * الإصدار: 2.0.0
 */

class LiveStreamManager {
    constructor() {
        this.config = {
            platforms: {
                youtube: {
                    name: 'YouTube',
                    icon: 'fab fa-youtube',
                    color: '#FF0000',
                    enabled: true,
                    requiresKey: true
                },
                facebook: {
                    name: 'Facebook Live',
                    icon: 'fab fa-facebook',
                    color: '#1877F2',
                    enabled: true,
                    requiresKey: true
                },
                twitch: {
                    name: 'Twitch',
                    icon: 'fab fa-twitch',
                    color: '#9146FF',
                    enabled: true,
                    requiresKey: true
                },
                tiktok: {
                    name: 'TikTok Live',
                    icon: 'fab fa-tiktok',
                    color: '#000000',
                    enabled: true,
                    requiresKey: true
                },
                instagram: {
                    name: 'Instagram Live',
                    icon: 'fab fa-instagram',
                    color: '#E4405F',
                    enabled: false,
                    requiresKey: true
                }
            },
            
            // إعدادات الفيديو
            videoSettings: {
                resolution: '1080p',
                fps: 30,
                bitrate: 4500,
                audioBitrate: 128
            },
            
            // إعدادات البث
            streamSettings: {
                simultaneousPlatforms: 3,
                autoStart: false,
                recordStream: true,
                saveChat: true,
                generateTranscript: true
            }
        };
        
        this.state = {
            isLive: false,
            isSettingUp: false,
            currentStream: null,
            selectedPlatforms: ['youtube'],
            streamStats: {
                viewers: 0,
                likes: 0,
                comments: 0,
                shares: 0,
                duration: 0
            },
            chatMessages: [],
            errors: []
        };
        
        this.streamKeys = {};
        this.initialize();
    }
    
    initialize() {
        console.log('📡 Live Stream Manager Initialized');
        this.loadStreamKeys();
        this.setupEventListeners();
    }
    
    // ========== إعداد البث ==========
    
    async setupStream(options = {}) {
        if (this.state.isSettingUp) {
            throw new Error('جاري إعداد بث آخر حالياً');
        }
        
        this.state.isSettingUp = true;
        this.updateUI('setup');
        
        try {
            // تحضير خطة البث بالذكاء الاصطناعي
            const streamPlan = await this.prepareStreamPlan(options);
            
            // إنشاء كائن البث
            this.state.currentStream = {
                id: `stream_${Date.now()}`,
                title: options.title || 'بث مباشر بدون عنوان',
                description: options.description || '',
                category: options.category || 'education',
                tags: options.tags || [],
                scheduleTime: options.scheduleTime || null,
                platforms: this.getPlatformConfigs(this.state.selectedPlatforms),
                plan: streamPlan,
                createdAt: new Date().toISOString(),
                status: 'ready'
            };
            
            // توليد مفاتيح البث
            await this.generateStreamKeys();
            
            // إعداد واجهة البث
            this.setupStreamUI();
            
            this.state.isSettingUp = false;
            this.updateUI('ready');
            
            return {
                success: true,
                stream: this.state.currentStream,
                message: '✅ تم إعداد البث بنجاح'
            };
            
        } catch (error) {
            this.state.isSettingUp = false;
            this.state.errors.push(error.message);
            this.updateUI('error');
            
            return {
                success: false,
                error: error.message,
                message: '❌ فشل إعداد البث'
            };
        }
    }
    
    async prepareStreamPlan(options) {
        if (!window.geminiAI) {
            return this.getDefaultStreamPlan(options);
        }
        
        const prompt = `📡 <مهمة: تحضير خطة بث مباشر متكاملة>
        
        الموضوع: ${options.title || 'بث مباشر عام'}
        المدة: ${options.duration || 60} دقيقة
        الجمهور: ${options.audience || 'عربي عام'}
        الهدف: ${options.objective || 'التوعية والتعليم'}
        
        <مطلوب>
        
        🎯 **التحضير المسبق:**
        - 5 خطوات للتحضير قبل 24 ساعة
        - 3 خطوات للتحضير قبل ساعة
        - قائمة المعدات المطلوبة
        
        ⏰ **الجدول الزمني التفصيلي** (دقيقة بدقيقة):
        - الافتتاحية (5 دقائق)
        - المحتوى الرئيسي (45 دقيقة)
        - التفاعل مع الجمهور (8 دقائق)
        - الخاتمة (2 دقائق)
        
        💬 **خطة التفاعل:**
        - 10 أسئلة مفتوحة
        - 5 أنشطة تفاعلية
        - إدارة التعليقات السلبية
        - حوافز المشاركة
        
        📢 **الترويج:**
        - منشورات قبل البث (3 أنواع)
        - منشورات خلال البث
        - منشورات بعد البث
        - هاشتاقات مقترحة
        
        🎨 **العناصر البصرية:**
        - تصميم البانر
        - الترحيب على الشاشة
        - الشعارات والعلامات
        - العروض التقديمية
        
        🔧 **المتطلبات الفنية:**
        - إعدادات الكاميرا
        - إعدادات الصوت
        - إعدادات الإضاءة
        - خطط الطوارئ
        
        قدم الخطة بشكل منظم وجاهز للتنفيذ.`;
        
        try {
            const plan = await window.geminiAI.generateContent(prompt, {
                temperature: 0.7,
                maxTokens: 3000
            });
            
            return this.parseStreamPlan(plan);
        } catch (error) {
            console.warn('AI plan failed, using default:', error);
            return this.getDefaultStreamPlan(options);
        }
    }
    
    getDefaultStreamPlan(options) {
        return {
            title: options.title || 'بث مباشر',
            duration: options.duration || 60,
            sections: [
                {
                    time: '00:00-00:05',
                    title: 'الافتتاحية',
                    description: 'الترحيب وتقديم الموضوع'
                },
                {
                    time: '00:05-00:50',
                    title: 'المحتوى الرئيسي',
                    description: 'شرح الموضوع مع أمثلة'
                },
                {
                    time: '00:50-00:58',
                    title: 'التفاعل',
                    description: 'الرد على الأسئلة والتفاعل'
                },
                {
                    time: '00:58-01:00',
                    title: 'الختام',
                    description: 'التلخيص والتوديع'
                }
            ],
            questions: [
                'ما رأيك في الموضوع؟',
                'هل لديك أي تجارب مشابهة؟',
                'ما الذي تريد معرفته أكثر؟'
            ],
            hashtags: ['#بث_مباشر', '#نقاش', '#تعلم']
        };
    }
    
    // ========== بدء البث ==========
    
    async startStream() {
        if (!this.state.currentStream) {
            throw new Error('لم يتم إعداد البث بعد');
        }
        
        if (this.state.isLive) {
            throw new Error('البث يعمل بالفعل');
        }
        
        try {
            this.state.isLive = true;
            this.state.currentStream.status = 'live';
            this.state.currentStream.startTime = new Date().toISOString();
            
            this.updateUI('live');
            this.startStatsTracker();
            this.startChatSimulation();
            
            // بدء التسجيل
            if (this.config.streamSettings.recordStream) {
                this.startRecording();
            }
            
            return {
                success: true,
                message: '🎬 البث المباشر يعمل الآن!',
                streamUrl: this.getStreamUrl(),
                dashboardUrl: this.getDashboardUrl()
            };
            
        } catch (error) {
            this.state.isLive = false;
            this.state.currentStream.status = 'error';
            this.state.errors.push(error.message);
            
            return {
                success: false,
                error: error.message,
                message: '❌ فشل بدء البث'
            };
        }
    }
    
    async stopStream() {
        if (!this.state.isLive) {
            throw new Error('لا يوجد بث نشط');
        }
        
        try {
            this.state.isLive = false;
            this.state.currentStream.status = 'ended';
            this.state.currentStream.endTime = new Date().toISOString();
            
            // إيقاف المهام
            this.stopStatsTracker();
            this.stopChatSimulation();
            
            // إنهاء التسجيل
            if (this.config.streamSettings.recordStream) {
                await this.stopRecording();
            }
            
            // حفظ التحليلات
            await this.saveStreamAnalytics();
            
            this.updateUI('ended');
            
            return {
                success: true,
                message: '⏹️ تم إنهاء البث بنجاح',
                analytics: await this.getStreamAnalytics()
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '❌ فشل إيقاف البث'
            };
        }
    }
    
    // ========== إدارة المنصات ==========
    
    getPlatformConfigs(platformNames) {
        return platformNames.map(name => ({
            ...this.config.platforms[name],
            key: this.streamKeys[name] || null,
            rtmpUrl: this.getRTMPUrl(name),
            status: 'ready'
        })).filter(p => p.enabled);
    }
    
    getRTMPUrl(platform) {
        const urls = {
            youtube: 'rtmp://a.rtmp.youtube.com/live2',
            facebook: 'rtmps://live-api-s.facebook.com:443/rtmp',
            twitch: 'rtmps://live.twitch.tv/app',
            tiktok: 'rtmp://live.tiktok.com/live',
            instagram: 'rtmp://live.instagram.com'
        };
        return urls[platform] || '';
    }
    
    async generateStreamKeys() {
        // في الواقع، هذه تحتاج API keys حقيقية
        // هنا محاكاة لتوليد مفاتيح
        this.state.selectedPlatforms.forEach(platform => {
            if (!this.streamKeys[platform]) {
                this.streamKeys[platform] = this.generateRandomKey();
            }
        });
        
        this.saveStreamKeys();
    }
    
    generateRandomKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < 40; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    }
    
    // ========== إدارة المحادثة ==========
    
    startChatSimulation() {
        if (this.chatInterval) clearInterval(this.chatInterval);
        
        this.chatInterval = setInterval(() => {
            if (!this.state.isLive) return;
            
            const messages = this.generateChatMessages();
            messages.forEach(msg => {
                this.addChatMessage(msg);
            });
            
            this.updateChatUI();
        }, 5000); // رسالة كل 5 ثواني
    }
    
    stopChatSimulation() {
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
            this.chatInterval = null;
        }
    }
    
    generateChatMessages() {
        const templates = [
            { user: 'مشاهد', text: 'معلومات رائعة! شكراً 💯' },
            { user: 'متابع', text: 'أحسنت شرح 👏' },
            { user: 'زائر', text: 'هذا مفيد جداً، شكراً لك' },
            { user: 'مشترك', text: 'متى الحلقة القادمة؟' },
            { user: 'داعم', text: 'أكثر الله أمثالك 🌹' },
            { user: 'متخصص', text: 'هل لديك مراجع إضافية؟' },
            { user: 'مبتدئ', text: 'شرح واضح ومبسط، شكراً' },
            { user: 'متفاعل', text: '👍👍👍' },
            { user: 'سائل', text: 'كيف أطبق هذه النصائح؟' },
            { user: 'مشجع', text: 'الله يعطيك العافية' }
        ];
        
        const count = Math.floor(Math.random() * 3) + 1; // 1-3 رسائل
        const messages = [];
        
        for (let i = 0; i < count; i++) {
            const template = templates[Math.floor(Math.random() * templates.length)];
            messages.push({
                id: `msg_${Date.now()}_${i}`,
                user: template.user,
                text: template.text,
                time: new Date().toLocaleTimeString('ar-EG'),
                platform: this.state.selectedPlatforms[0],
                likes: Math.floor(Math.random() * 10)
            });
        }
        
        return messages;
    }
    
    addChatMessage(message) {
        this.state.chatMessages.unshift(message); // إضافة في البداية
        
        // الاحتفاظ بآخر 100 رسالة فقط
        if (this.state.chatMessages.length > 100) {
            this.state.chatMessages = this.state.chatMessages.slice(0, 100);
        }
        
        // تحديث الإحصائيات
        this.state.streamStats.comments++;
    }
    
    // ========== الإحصائيات ==========
    
    startStatsTracker() {
        if (this.statsInterval) clearInterval(this.statsInterval);
        
        this.statsInterval = setInterval(() => {
            if (!this.state.isLive) return;
            
            // محاكاة تغيير الإحصائيات
            this.state.streamStats.viewers += Math.floor(Math.random() * 10) - 3;
            this.state.streamStats.viewers = Math.max(this.state.streamStats.viewers, 1);
            
            this.state.streamStats.likes += Math.floor(Math.random() * 5);
            this.state.streamStats.shares += Math.floor(Math.random() * 2);
            this.state.streamStats.duration++;
            
            this.updateStatsUI();
        }, 3000); // تحديث كل 3 ثواني
    }
    
    stopStatsTracker() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
            this.statsInterval = null;
        }
    }
    
    async getStreamAnalytics() {
        const duration = this.state.streamStats.duration;
        const peakViewers = this.state.streamStats.viewers * 1.5;
        const engagementRate = ((this.state.streamStats.likes + this.state.streamStats.comments) / 
                              this.state.streamStats.viewers * 100).toFixed(1);
        
        return {
            streamId: this.state.currentStream?.id,
            duration: duration,
            totalViewers: this.state.streamStats.viewers,
            peakViewers: peakViewers,
            totalLikes: this.state.streamStats.likes,
            totalComments: this.state.streamStats.comments,
            totalShares: this.state.streamStats.shares,
            engagementRate: `${engagementRate}%`,
            platforms: this.state.selectedPlatforms,
            startTime: this.state.currentStream?.startTime,
            endTime: this.state.currentStream?.endTime
        };
    }
    
    async saveStreamAnalytics() {
        const analytics = await this.getStreamAnalytics();
        
        // حفظ في localStorage
        try {
            const savedAnalytics = JSON.parse(localStorage.getItem('nexus_stream_analytics') || '[]');
            savedAnalytics.push(analytics);
            
            // الاحتفاظ بآخر 50 بث
            if (savedAnalytics.length > 50) {
                savedAnalytics.splice(0, savedAnalytics.length - 50);
            }
            
            localStorage.setItem('nexus_stream_analytics', JSON.stringify(savedAnalytics));
        } catch (error) {
            console.error('Failed to save analytics:', error);
        }
        
        return analytics;
    }
    
    // ========== التسجيل ==========
    
    startRecording() {
        console.log('🎥 بدء تسجيل البث...');
        this.recordingStartTime = Date.now();
        
        // في التطبيق الحقيقي، هنا يتم بدء تسجيل الفيديو
        this.recordingInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            this.updateRecordingTime(elapsed);
        }, 1000);
    }
    
    async stopRecording() {
        console.log('⏹️ إيقاف تسجيل البث...');
        
        if (this.recordingInterval) {
            clearInterval(this.recordingInterval);
            this.recordingInterval = null;
        }
        
        const duration = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        const recordingData = {
            streamId: this.state.currentStream?.id,
            duration: duration,
            size: this.calculateRecordingSize(duration),
            timestamp: new Date().toISOString()
        };
        
        // حفظ معلومات التسجيل
        this.saveRecordingInfo(recordingData);
        
        return recordingData;
    }
    
    calculateRecordingSize(durationInSeconds) {
        // تقدير حجم الملف (بتفرة متوسطة)
        const bitrate = this.config.videoSettings.bitrate + this.config.videoSettings.audioBitrate;
        const sizeInMB = (bitrate * durationInSeconds) / (8 * 1024);
        return `${sizeInMB.toFixed(1)} MB`;
    }
    
    // ========== إدارة المحتوى ==========
    
    async generateStreamContent() {
        if (!window.geminiAI) return null;
        
        const prompt = `🎬 <مهمة: إنشاء محتوى للبث المباشر>
        
        الموضوع: ${this.state.currentStream?.title}
        الجمهور: عربي
        المدة: 60 دقيقة
        
        <المطلوب>
        
        📝 **نقاط الحديث الرئيسية** (10 نقاط):
        - اذكر مع التفاصيل
        
        ❓ **أسئلة التفاعل** (15 سؤال):
        - موزعة على فقرات البث
        
        🎯 **أنشطة تفاعلية** (5 أنشطة):
        - مسابقات
        - استفتاءات
        - تحديات
        
        📊 **عروض تقديمية**:
        - تصميم 5 شرائح
        - المحتوى المناسب
        
        🎁 **عروض خاصة**:
        - خلال البث
        - للجدد
        - للمشتركين
        
        قدم المحتوى بشكل منظم وجاهز للعرض.`;
        
        try {
            return await window.geminiAI.generateContent(prompt);
        } catch (error) {
            console.error('Failed to generate content:', error);
            return null;
        }
    }
    
    // ========== الواجهة ==========
    
    updateUI(state) {
        // تحديث عناصر الواجهة
        const elements = {
            setup: document.querySelectorAll('.setup-phase'),
            ready: document.querySelectorAll('.ready-phase'),
            live: document.querySelectorAll('.live-phase'),
            ended: document.querySelectorAll('.ended-phase'),
            error: document.querySelectorAll('.error-phase')
        };
        
        // إخفاء جميع العناصر أولاً
        Object.values(elements).forEach(group => {
            group?.forEach(el => el.style.display = 'none');
        });
        
        // إظهار العناصر المناسبة
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
            setup: '⚙️ جاري الإعداد...',
            ready: '✅ جاهز للبث',
            live: '🔴 بث مباشر',
            ended: '⏹️ انتهى البث',
            error: '❌ خطأ'
        };
        
        const statusElement = document.getElementById('streamStatus');
        if (statusElement) {
            statusElement.textContent = statusMap[state] || '';
            statusElement.className = `status-${state}`;
        }
    }
    
    updateStatsUI() {
        const stats = this.state.streamStats;
        
        // تحديث العناصر
        const elements = {
            viewers: document.getElementById('liveViewers'),
            likes: document.getElementById('liveLikes'),
            comments: document.getElementById('liveComments'),
            duration: document.getElementById('streamDuration')
        };
        
        if (elements.viewers) elements.viewers.textContent = stats.viewers.toLocaleString();
        if (elements.likes) elements.likes.textContent = stats.likes.toLocaleString();
        if (elements.comments) elements.comments.textContent = stats.comments.toLocaleString();
        
        if (elements.duration) {
            const minutes = Math.floor(stats.duration / 60);
            const seconds = stats.duration % 60;
            elements.duration.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    updateChatUI() {
        const chatContainer = document.getElementById('liveChatMessages');
        if (!chatContainer) return;
        
        // تحديث أول 20 رسالة فقط
        const messagesToShow = this.state.chatMessages.slice(0, 20);
        
        chatContainer.innerHTML = messagesToShow.map(msg => `
            <div class="chat-message">
                <div class="chat-user">
                    <span class="user-name">${msg.user}</span>
                    <span class="user-badge">${msg.platform}</span>
                </div>
                <div class="chat-text">${msg.text}</div>
                <div class="chat-meta">
                    <span class="chat-time">${msg.time}</span>
                    <button class="chat-like" onclick="liveStream.likeMessage('${msg.id}')">
                        <i class="fas fa-heart"></i> ${msg.likes}
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    updateRecordingTime(seconds) {
        const element = document.getElementById('recordingTime');
        if (element) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            element.textContent = `🕒 ${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    setupStreamUI() {
        // تهيئة عناصر واجهة البث
        console.log('🎨 Setting up stream UI...');
        
        // يمكن إضافة منطق إضافي هنا
    }
    
    // ========== أدوات مساعدة ==========
    
    loadStreamKeys() {
        try {
            const saved = localStorage.getItem('nexus_stream_keys');
            if (saved) {
                this.streamKeys = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Cannot load stream keys:', error);
        }
    }
    
    saveStreamKeys() {
        try {
            localStorage.setItem('nexus_stream_keys', JSON.stringify(this.streamKeys));
        } catch (error) {
            console.warn('Cannot save stream keys:', error);
        }
    }
    
    saveRecordingInfo(data) {
        try {
            const recordings = JSON.parse(localStorage.getItem('nexus_recordings') || '[]');
            recordings.push(data);
            localStorage.setItem('nexus_recordings', JSON.stringify(recordings));
        } catch (error) {
            console.error('Failed to save recording info:', error);
        }
    }
    
    getStreamUrl() {
        // في الواقع، هذا يعتمد على المنصة
        return 'https://nexus-studio.vercel.app/live/' + (this.state.currentStream?.id || 'demo');
    }
    
    getDashboardUrl() {
        return 'https://nexus-studio.vercel.app/stream/dashboard/' + (this.state.currentStream?.id || 'demo');
    }
    
    // ========== تفاعل المحادثة ==========
    
    likeMessage(messageId) {
        const message = this.state.chatMessages.find(msg => msg.id === messageId);
        if (message) {
            message.likes++;
            this.updateChatUI();
        }
    }
    
    sendChatMessage(text, user = 'أنت') {
        if (!text.trim() || !this.state.isLive) return;
        
        const message = {
            id: `user_${Date.now()}`,
            user: user,
            text: text,
            time: new Date().toLocaleTimeString('ar-EG'),
            platform: 'user',
            likes: 0
        };
        
        this.addChatMessage(message);
        this.updateChatUI();
    }
    
    // ========== وظائف عامة ==========
    
    selectPlatform(platform, selected) {
        if (selected) {
            if (!this.state.selectedPlatforms.includes(platform)) {
                if (this.state.selectedPlatforms.length >= this.config.streamSettings.simultaneousPlatforms) {
                    throw new Error(`يمكنك اختيار ${this.config.streamSettings.simultaneousPlatforms} منصات كحد أقصى`);
                }
                this.state.selectedPlatforms.push(platform);
            }
        } else {
            this.state.selectedPlatforms = this.state.selectedPlatforms.filter(p => p !== platform);
        }
        
        this.updatePlatformSelectionUI();
    }
    
    updatePlatformSelectionUI() {
        // تحديث واجهة اختيار المنصات
        this.state.selectedPlatforms.forEach(platform => {
            const element = document.querySelector(`.platform-option[data-platform="${platform}"]`);
            if (element) {
                element.classList.add('selected');
            }
        });
    }
    
    setupEventListeners() {
        // إضافة مستمعات الأحداث للواجهة
        console.log('🎧 Setting up live stream event listeners...');
        
        // سيتم استدعاؤها من HTML
    }
    
    getStats() {
        return {
            isLive: this.state.isLive,
            streamId: this.state.currentStream?.id,
            platforms: this.state.selectedPlatforms,
            stats: this.state.streamStats,
            chatCount: this.state.chatMessages.length,
            errors: this.state.errors.length
        };
    }
    
    reset() {
        this.state = {
            isLive: false,
            isSettingUp: false,
            currentStream: null,
            selectedPlatforms: ['youtube'],
            streamStats: {
                viewers: 0,
                likes: 0,
                comments: 0,
                shares: 0,
                duration: 0
            },
            chatMessages: [],
            errors: []
        };
        
        this.updateUI('ready');
    }
}

// ========== التصدير والتشغيل ==========

if (typeof window !== 'undefined') {
    window.LiveStreamManager = LiveStreamManager;
    window.liveStream = new LiveStreamManager();
    
    // وظائف للاستخدام في onclick
    window.setupStream = (options) => window.liveStream.setupStream(options);
    window.startStream = () => window.liveStream.startStream();
    window.stopStream = () => window.liveStream.stopStream();
    window.sendChatMessage = (text) => window.liveStream.sendChatMessage(text);
    window.selectPlatform = (platform, selected) => window.liveStream.selectPlatform(platform, selected);
    
    // تشغيل عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📡 Live Stream Manager Ready');
    });
}

export default LiveStreamManager;