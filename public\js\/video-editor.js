/**
 * Nexus Video Editor
 * محرر الفيديو الاحترافي المتكامل
 * الإصدار: 2.0.0
 */

class VideoEditor {
    constructor() {
        this.config = {
            supportedFormats: {
                video: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
                audio: ['mp3', 'wav', 'm4a', 'ogg'],
                image: ['jpg', 'jpeg', 'png', 'gif', 'webp']
            },
            
            videoSettings: {
                resolutions: [
                    { label: '360p', width: 640, height: 360 },
                    { label: '480p', width: 854, height: 480 },
                    { label: '720p', width: 1280, height: 720 },
                    { label: '1080p', width: 1920, height: 1080 },
                    { label: '4K', width: 3840, height: 2160 }
                ],
                
                fpsOptions: [24, 30, 60],
                
                aspectRatios: [
                    { label: '16:9', value: 16/9 },
                    { label: '1:1', value: 1 },
                    { label: '9:16', value: 9/16 },
                    { label: '4:5', value: 4/5 },
                    { label: '2.35:1', value: 2.35 }
                ]
            },
            
            exportSettings: {
                qualities: [
                    { label: 'منخفض', bitrate: 1500, suffix: '_low' },
                    { label: 'متوسط', bitrate: 4000, suffix: '' },
                    { label: 'عالي', bitrate: 8000, suffix: '_high' },
                    { label: 'متطرف', bitrate: 12000, suffix: '_ultra' }
                ],
                
                formats: [
                    { label: 'MP4', value: 'mp4', codec: 'h264' },
                    { label: 'MOV', value: 'mov', codec: 'prores' },
                    { label: 'WebM', value: 'webm', codec: 'vp9' }
                ]
            }
        };
        
        this.state = {
            currentProject: null,
            projects: [],
            timeline: [],
            selectedClips: [],
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            zoomLevel: 1,
            activeTool: 'select',
            playbackSpeed: 1
        };
        
        this.effectsLibrary = {
            transitions: [
                { id: 'fade', name: 'تدرج', duration: 1 },
                { id: 'slide', name: 'انزلاق', duration: 1 },
                { id: 'zoom', name: 'تكبير', duration: 1.5 },
                { id: 'rotate', name: 'دوران', duration: 2 },
                { id: 'blur', name: 'ضبابية', duration: 0.5 }
            ],
            
            filters: [
                { id: 'vintage', name: 'عتيق', category: 'color' },
                { id: 'dramatic', name: 'درامي', category: 'color' },
                { id: 'cinematic', name: 'سينمائي', category: 'color' },
                { id: 'bw', name: 'أبيض وأسود', category: 'color' },
                { id: 'vibrant', name: 'حيوي', category: 'color' },
                { id: 'glitch', name: 'عطل', category: 'special' },
                { id: 'vhs', name: 'VHS قديم', category: 'special' },
                { id: 'neon', name: 'نيون', category: 'special' }
            ],
            
            textTemplates: [
                { id: 'title', name: 'عنوان رئيسي', defaultText: 'عنوان الفيديو' },
                { id: 'subtitle', name: 'عنوان فرعي', defaultText: 'وصف قصير' },
                { id: 'lowerThird', name: 'ثلث سفلي', defaultText: 'معلومات إضافية' },
                { id: 'caption', name: 'شرح', defaultText: 'نص الشرح' },
                { id: 'watermark', name: 'علامة مائية', defaultText: 'Nexus Studio' }
            ],
            
            audioEffects: [
                { id: 'fadeIn', name: 'تداخل دخول', duration: 2 },
                { id: 'fadeOut', name: 'تداخل خروج', duration: 2 },
                { id: 'echo', name: 'صدى', intensity: 0.5 },
                { id: 'reverb', name: 'رنّة', intensity: 0.3 },
                { id: 'pitch', name: 'تغيير نبرة', pitch: 1.2 }
            ]
        };
        
        this.initialize();
    }
    
    initialize() {
        console.log('🎬 Video Editor Initialized');
        this.loadProjects();
        this.setupEventListeners();
    }
    
    // ========== إدارة المشاريع ==========
    
    async createProject(options = {}) {
        const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const project = {
            id: projectId,
            name: options.name || `مشروع جديد ${this.state.projects.length + 1}`,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            settings: {
                resolution: options.resolution || '1080p',
                fps: options.fps || 30,
                aspectRatio: options.aspectRatio || '16:9',
                duration: 0
            },
            clips: [],
            audioTracks: [],
            textLayers: [],
            effects: [],
            transitions: [],
            markers: [],
            version: 1
        };
        
        this.state.currentProject = project;
        this.state.projects.push(project);
        this.saveProjects();
        
        this.updateProjectUI();
        
        return {
            success: true,
            project: project,
            message: '✅ تم إنشاء المشروع الجديد'
        };
    }
    
    async openProject(projectId) {
        const project = this.state.projects.find(p => p.id === projectId);
        if (!project) {
            throw new Error('المشروع غير موجود');
        }
        
        this.state.currentProject = project;
        this.state.timeline = this.buildTimeline(project);
        this.state.duration = project.settings.duration;
        
        this.updateProjectUI();
        this.updateTimelineUI();
        
        return {
            success: true,
            project: project,
            message: '📂 تم فتح المشروع'
        };
    }
    
    saveProject() {
        if (!this.state.currentProject) return;
        
        this.state.currentProject.modifiedAt = new Date().toISOString();
        this.state.currentProject.version++;
        
        // تحديث المدة
        this.state.currentProject.settings.duration = this.calculateProjectDuration();
        
        this.saveProjects();
        this.updateProjectUI();
        
        return {
            success: true,
            message: '💾 تم حفظ المشروع',
            version: this.state.currentProject.version
        };
    }
    
    async exportProject(options = {}) {
        if (!this.state.currentProject) {
            throw new Error('لا يوجد مشروع مفتوح');
        }
        
        const exportId = `export_${Date.now()}`;
        const exportOptions = {
            format: options.format || 'mp4',
            quality: options.quality || 'متوسط',
            resolution: options.resolution || this.state.currentProject.settings.resolution,
            includeWatermark: options.includeWatermark !== false,
            fileName: options.fileName || this.state.currentProject.name
        };
        
        // محاكاة عملية التصدير
        this.showExportProgress(0);
        
        for (let i = 0; i <= 100; i += 10) {
            await this.delay(300);
            this.showExportProgress(i);
        }
        
        const exportData = {
            id: exportId,
            projectId: this.state.currentProject.id,
            options: exportOptions,
            fileSize: this.calculateExportSize(exportOptions),
            duration: this.state.currentProject.settings.duration,
            createdAt: new Date().toISOString(),
            downloadUrl: this.generateDownloadUrl(exportOptions)
        };
        
        this.saveExport(exportData);
        this.showExportProgress(100);
        
        return {
            success: true,
            export: exportData,
            message: '📤 جاهز للتنزيل'
        };
    }
    
    // ========== إدارة الملفات ==========
    
    async importMedia(files) {
        if (!files || files.length === 0) return;
        
        const importedClips = [];
        
        for (const file of files) {
            try {
                const clip = await this.processMediaFile(file);
                
                if (clip) {
                    this.state.currentProject.clips.push(clip);
                    importedClips.push(clip);
                    
                    // تحديث الخط الزمني
                    this.state.timeline = this.buildTimeline(this.state.currentProject);
                    this.state.duration = this.calculateProjectDuration();
                }
            } catch (error) {
                console.error('Failed to import file:', file.name, error);
            }
        }
        
        this.updateTimelineUI();
        this.saveProject();
        
        return {
            success: true,
            clips: importedClips,
            message: `✅ تم استيراد ${importedClips.length} ملف`
        };
    }
    
    async processMediaFile(file) {
        const fileType = this.getFileType(file);
        const fileUrl = URL.createObjectURL(file);
        
        const clip = {
            id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            type: fileType,
            url: fileUrl,
            duration: await this.getMediaDuration(file, fileType),
            fileSize: file.size,
            format: file.name.split('.').pop().toLowerCase(),
            thumbnail: await this.generateThumbnail(file, fileType),
            createdAt: new Date().toISOString(),
            metadata: {
                width: fileType === 'video' ? 1920 : null,
                height: fileType === 'video' ? 1080 : null,
                hasAudio: fileType === 'video' ? true : null
            },
            position: {
                start: 0,
                end: 0,
                layer: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1
            },
            effects: [],
            audio: {
                volume: 1,
                muted: false,
                fadeIn: 0,
                fadeOut: 0
            }
        };
        
        return clip;
    }
    
    getFileType(file) {
        const videoTypes = ['video', 'avi', 'mov', 'mp4', 'mkv', 'webm'];
        const audioTypes = ['audio', 'mp3', 'wav', 'm4a', 'ogg'];
        const imageTypes = ['image', 'jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (videoTypes.includes(extension) || file.type.startsWith('video/')) {
            return 'video';
        } else if (audioTypes.includes(extension) || file.type.startsWith('audio/')) {
            return 'audio';
        } else if (imageTypes.includes(extension) || file.type.startsWith('image/')) {
            return 'image';
        }
        
        return 'unknown';
    }
    
    async getMediaDuration(file, type) {
        // محاكاة مدة الملف
        if (type === 'video') {
            return 30; // 30 ثانية للفيديو
        } else if (type === 'audio') {
            return 180; // 3 دقائق للصوت
        } else if (type === 'image') {
            return 5; // 5 ثواني للصورة
        }
        
        return 10;
    }
    
    async generateThumbnail(file, type) {
        if (type === 'video') {
            // محاكاة توليد ثامبريل للفيديو
            return 'data:image/svg+xml;base64,' + btoa(`
                <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="120" fill="#4f46e5"/>
                    <rect x="80" y="40" width="40" height="40" fill="white" opacity="0.8"/>
                    <polygon points="90,50 90,70 110,60" fill="#1f2937"/>
                    <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12" fill="white">
                        ${file.name.substring(0, 10)}
                    </text>
                </svg>
            `);
        } else if (type === 'audio') {
            return 'data:image/svg+xml;base64,' + btoa(`
                <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="120" fill="#10b981"/>
                    <circle cx="100" cy="60" r="30" fill="white" opacity="0.8"/>
                    <path d="M85,45 L85,75 M100,40 L100,80 M115,45 L115,75" 
                          stroke="#1f2937" stroke-width="4" stroke-linecap="round"/>
                    <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12" fill="white">
                        ${file.name.substring(0, 10)}
                    </text>
                </svg>
            `);
        } else if (type === 'image') {
            // استخدام صورة مصغرة حقيقية
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }
        
        return '';
    }
    
    // ========== تحرير الفيديو ==========
    
    addClipToTimeline(clipId, position = {}) {
        const clip = this.state.currentProject.clips.find(c => c.id === clipId);
        if (!clip) return;
        
        // حساب الموضع على الخط الزمني
        const timelinePosition = {
            clipId: clip.id,
            startTime: position.startTime || this.findEmptyTimelineSlot(),
            duration: clip.duration,
            layer: position.layer || 1,
            muted: false,
            locked: false
        };
        
        this.state.timeline.push(timelinePosition);
        this.sortTimeline();
        this.updateTimelineUI();
        
        return timelinePosition;
    }
    
    findEmptyTimelineSlot() {
        if (this.state.timeline.length === 0) return 0;
        
        // إيجاد آخر وقت في الخط الزمني
        const lastClip = this.state.timeline.reduce((latest, clip) => 
            Math.max(latest, clip.startTime + clip.duration), 0);
        
        return lastClip;
    }
    
    sortTimeline() {
        this.state.timeline.sort((a, b) => {
            if (a.startTime === b.startTime) {
                return a.layer - b.layer;
            }
            return a.startTime - b.startTime;
        });
    }
    
    removeClipFromTimeline(clipId) {
        this.state.timeline = this.state.timeline.filter(item => item.clipId !== clipId);
        this.updateTimelineUI();
        this.saveProject();
    }
    
    splitClip(clipId, splitTime) {
        const timelineItem = this.state.timeline.find(item => item.clipId === clipId);
        if (!timelineItem) return;
        
        const clip = this.state.currentProject.clips.find(c => c.id === clipId);
        if (!clip || splitTime >= timelineItem.duration) return;
        
        // إنشاء نسخة من الكليب
        const newClip = {
            ...clip,
            id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            duration: timelineItem.duration - splitTime
        };
        
        // تحديث الكليب الأصلي
        timelineItem.duration = splitTime;
        
        // إضافة الكليب الجديد
        const newTimelineItem = {
            clipId: newClip.id,
            startTime: timelineItem.startTime + splitTime,
            duration: newClip.duration,
            layer: timelineItem.layer,
            muted: timelineItem.muted,
            locked: timelineItem.locked
        };
        
        this.state.currentProject.clips.push(newClip);
        this.state.timeline.push(newTimelineItem);
        this.sortTimeline();
        
        this.updateTimelineUI();
        this.saveProject();
        
        return {
            originalClip: timelineItem,
            newClip: newTimelineItem
        };
    }
    
    trimClip(clipId, newStart, newEnd) {
        const timelineItem = this.state.timeline.find(item => item.clipId === clipId);
        if (!timelineItem) return;
        
        const clip = this.state.currentProject.clips.find(c => c.id === clipId);
        if (!clip) return;
        
        // تحديث المدة
        const newDuration = newEnd - newStart;
        timelineItem.startTime += newStart;
        timelineItem.duration = newDuration;
        
        // تحديث موضع الكليب
        clip.position.start = newStart;
        clip.position.end = newEnd;
        
        this.updateTimelineUI();
        this.saveProject();
        
        return timelineItem;
    }
    
    // ========== التأثيرات والانتقالات ==========
    
    async applyEffect(clipId, effectType, parameters = {}) {
        const clip = this.state.currentProject.clips.find(c => c.id === clipId);
        if (!clip) return;
        
        const effect = {
            id: `effect_${Date.now()}`,
            type: effectType,
            parameters: parameters,
            appliedAt: new Date().toISOString(),
            enabled: true
        };
        
        clip.effects.push(effect);
        this.saveProject();
        
        // تحديث المعاينة
        this.updatePreview();
        
        return {
            success: true,
            effect: effect,
            message: `✨ تم تطبيق تأثير ${effectType}`
        };
    }
    
    async addTransition(clip1Id, clip2Id, transitionType = 'fade') {
        const transition = {
            id: `transition_${Date.now()}`,
            type: transitionType,
            fromClip: clip1Id,
            toClip: clip2Id,
            duration: 1, // ثانية واحدة
            appliedAt: new Date().toISOString()
        };
        
        this.state.currentProject.transitions.push(transition);
        this.saveProject();
        
        return {
            success: true,
            transition: transition,
            message: `🔄 تم إضافة انتقال ${transitionType}`
        };
    }
    
    async addTextLayer(options = {}) {
        const textLayer = {
            id: `text_${Date.now()}`,
            type: options.template || 'title',
            text: options.text || 'نص جديد',
            position: {
                x: options.x || 50,
                y: options.y || 50,
                width: options.width || 200,
                height: options.height || 100
            },
            style: {
                fontFamily: options.fontFamily || 'Cairo',
                fontSize: options.fontSize || 32,
                color: options.color || '#ffffff',
                backgroundColor: options.backgroundColor || 'transparent',
                alignment: options.alignment || 'center',
                animation: options.animation || 'none',
                duration: options.duration || 5
            },
            timeline: {
                startTime: options.startTime || 0,
                duration: options.duration || 5
            },
            createdAt: new Date().toISOString()
        };
        
        this.state.currentProject.textLayers.push(textLayer);
        this.updateTimelineUI();
        this.saveProject();
        
        return {
            success: true,
            textLayer: textLayer,
            message: '✏️ تم إضافة نص جديد'
        };
    }
    
    // ========== الذكاء الاصطناعي ==========
    
    async autoEditWithAI() {
        if (!window.geminiAI) {
            throw new Error('Gemini AI غير متاح');
        }
        
        const projectInfo = {
            clipsCount: this.state.currentProject.clips.length,
            totalDuration: this.state.currentProject.settings.duration,
            hasAudio: this.state.currentProject.audioTracks.length > 0,
            hasText: this.state.currentProject.textLayers.length > 0
        };
        
        const prompt = `🎬 <مهمة: تحرير فيديو آلي بالذكاء الاصطناعي>
        
        معلومات المشروع:
        - عدد المقاطع: ${projectInfo.clipsCount}
        - المدة الإجمالية: ${projectInfo.totalDuration} ثانية
        - يحتوي على صوت: ${projectInfo.hasAudio ? 'نعم' : 'لا'}
        - يحتوي على نصوص: ${projectInfo.hasText ? 'نعم' : 'لا'}
        
        <المطلوب>
        
        1. **التقطيع الذكي:**
        - اقترح أماكن القص
        - إزالة المقاطع الزائدة
        - تحديد المشاهد المهمة
        
        2. **الانتقالات:**
        - نوع الانتقال المناسب بين كل مقطعين
        - توقيت الانتقالات
        - تأثيرات مخصصة
        
        3. **التأثيرات البصرية:**
        - تصحيح الألوان
        - تحسين الإضاءة
        - إضافة فلتر مناسب
        
        4. **النصوص والعناوين:**
        - تصميم عناوين جذابة
        - إضافة شروحات
        - توقيت ظهور النصوص
        
        5. **الصوت:**
        - إضافة موسيقى خلفية
        - معادلة الصوت
        - تأثيرات صوتية
        
        6. **التسلسل الزمني:**
        - ترتيب المقاطع
        - توقيت كل مشهد
        - الإيقاع العام
        
        قدم خطة تحرير مفصلة وجاهزة للتنفيذ.`;
        
        try {
            const editPlan = await window.geminiAI.generateContent(prompt);
            
            // تحليل خطة التحرير وتنفيذها
            const executedSteps = await this.executeEditPlan(editPlan);
            
            return {
                success: true,
                plan: editPlan,
                executedSteps: executedSteps,
                message: '🤖 تم التحرير الآلي بنجاح'
            };
            
        } catch (error) {
            console.error('AI editing failed:', error);
            throw new Error('فشل التحرير بالذكاء الاصطناعي: ' + error.message);
        }
    }
    
    async executeEditPlan(plan) {
        // تحليل خطة AI وتنفيذها
        const steps = [];
        
        // هنا يمكن إضافة منطق تحليل الخطة وتنفيذها
        // (هذا مثال مبسط)
        
        steps.push({
            step: 'تحليل الخطة',
            status: 'completed',
            details: 'تم تحليل خطة التحرير بنجاح'
        });
        
        return steps;
    }
    
    async generateThumbnailWithAI() {
        if (!window.geminiAI) {
            throw new Error('Gemini AI غير متاح');
        }
        
        const project = this.state.currentProject;
        
        const prompt = `🎨 <مهمة: تصميم ثامبريل فيديو بالذكاء الاصطناعي>
        
        معلومات الفيديو:
        - العنوان: ${project.name}
        - المدة: ${project.settings.duration} ثانية
        - عدد المقاطع: ${project.clips.length}
        
        <مواصفات التصميم>
        
        1. **العناصر الرئيسية:**
        - الصورة البارزة
        - العنوان الجذاب
        - الشعار
        
        2. **التصميم البصري:**
        - الألوان المناسبة
        - التخطيط الأمثل
        - التأثيرات
        
        3. **الجاذبية:**
        - عناصر التشويق
        - الوضوح على جميع الشاشات
        - الملاءمة للمنصة
        
        4. **النصوص:**
        - الخطوط المناسبة
        - أحجام النصوص
        - أماكن وضع النصوص
        
        قدم تصميمين مختلفين مع شرح مفصل لكل تصميم.`;
        
        try {
            const designs = await window.geminiAI.generateContent(prompt);
            
            return {
                success: true,
                designs: this.parseThumbnailDesigns(designs),
                message: '🎨 تم إنشاء تصاميم الثمبنيلات'
            };
            
        } catch (error) {
            console.error('AI thumbnail generation failed:', error);
            throw new Error('فشل إنشاء الثامبريل: ' + error.message);
        }
    }
    
    // ========== المعاينة والتشغيل ==========
    
    play() {
        if (this.state.isPlaying) return;
        
        this.state.isPlaying = true;
        this.playbackStartTime = Date.now() - this.state.currentTime * 1000;
        
        this.playbackInterval = setInterval(() => {
            const elapsed = (Date.now() - this.playbackStartTime) / 1000;
            this.state.currentTime = Math.min(elapsed, this.state.duration);
            
            this.updatePlayhead();
            this.updatePreview();
            
            if (this.state.currentTime >= this.state.duration) {
                this.pause();
            }
        }, 1000 / 30); // 30 فريم في الثانية
    }
    
    pause() {
        if (!this.state.isPlaying) return;
        
        this.state.isPlaying = false;
        
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
    }
    
    seek(time) {
        this.state.currentTime = Math.max(0, Math.min(time, this.state.duration));
        
        if (this.state.isPlaying) {
            this.playbackStartTime = Date.now() - this.state.currentTime * 1000;
        }
        
        this.updatePlayhead();
        this.updatePreview();
    }
    
    setPlaybackSpeed(speed) {
        this.state.playbackSpeed = speed;
        // في التنفيذ الحقيقي، هنا يتم تعديل سرعة التشغيل
    }
    
    // ========== الواجهة ==========
    
    updateProjectUI() {
        // تحديث معلومات المشروع في الواجهة
        const elements = {
            projectName: document.getElementById('projectName'),
            projectDuration: document.getElementById('projectDuration'),
            projectClips: document.getElementById('projectClips'),
            projectModified: document.getElementById('projectModified')
        };
        
        const project = this.state.currentProject;
        
        if (elements.projectName && project) {
            elements.projectName.textContent = project.name;
        }
        
        if (elements.projectDuration && project) {
            elements.projectDuration.textContent = this.formatTime(project.settings.duration);
        }
        
        if (elements.projectClips && project) {
            elements.projectClips.textContent = project.clips.length;
        }
        
        if (elements.projectModified && project) {
            elements.projectModified.textContent = new Date(project.modifiedAt).toLocaleDateString('ar-EG');
        }
    }
    
    updateTimelineUI() {
        const timelineElement = document.getElementById('videoTimeline');
        if (!timelineElement) return;
        
        // بناء واجهة الخط الزمني
        const timelineHTML = this.state.timeline.map(item => {
            const clip = this.state.currentProject.clips.find(c => c.id === item.clipId);
            if (!clip) return '';
            
            const width = (item.duration / this.state.duration) * 100;
            const left = (item.startTime / this.state.duration) * 100;
            
            return `
                <div class="timeline-clip" 
                     data-clip-id="${item.clipId}"
                     style="width: ${width}%; left: ${left}%; height: 60px;"
                     onclick="videoEditor.selectClip('${item.clipId}')">
                    <div class="clip-thumbnail" style="background-image: url('${clip.thumbnail}')"></div>
                    <div class="clip-info">
                        <div class="clip-name">${clip.name}</div>
                        <div class="clip-duration">${this.formatTime(item.duration)}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        timelineElement.innerHTML = timelineHTML;
        this.updatePlayhead();
    }
    
    updatePlayhead() {
        const playheadElement = document.getElementById('playhead');
        if (!playheadElement) return;
        
        const position = (this.state.currentTime / this.state.duration) * 100;
        playheadElement.style.left = `${position}%`;
        
        // تحديث وقت التشغيل
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = this.formatTime(this.state.currentTime);
        }
    }
    
    updatePreview() {
        const previewElement = document.getElementById('videoPreview');
        if (!previewElement) return;
        
        // العثور على الكليب الحالي
        const currentClip = this.state.timeline.find(item => 
            this.state.currentTime >= item.startTime && 
            this.state.currentTime <= item.startTime + item.duration
        );
        
        if (currentClip) {
            const clip = this.state.currentProject.clips.find(c => c.id === currentClip.clipId);
            if (clip) {
                previewElement.style.backgroundImage = `url('${clip.thumbnail}')`;
                previewElement.innerHTML = `
                    <div class="preview-info">
                        <div class="preview-title">${clip.name}</div>
                        <div class="preview-time">${this.formatTime(this.state.currentTime)} / ${this.formatTime(this.state.duration)}</div>
                    </div>
                `;
            }
        }
    }
    
    showExportProgress(percentage) {
        const progressElement = document.getElementById('exportProgress');
        const progressBar = document.getElementById('exportProgressBar');
        const progressText = document.getElementById('exportProgressText');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `جاري التصدير... ${percentage}%`;
        }
        
        if (progressElement) {
            if (percentage === 100) {
                setTimeout(() => {
                    progressElement.style.display = 'none';
                }, 2000);
            } else {
                progressElement.style.display = 'block';
            }
        }
    }
    
    // ========== أدوات مساعدة ==========
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    calculateProjectDuration() {
        if (this.state.timeline.length === 0) return 0;
        
        return this.state.timeline.reduce((max, item) => {
            const endTime = item.startTime + item.duration;
            return Math.max(max, endTime);
        }, 0);
    }
    
    buildTimeline(project) {
        // بناء الخط الزمني من المشروع
        return project.clips.map((clip, index) => ({
            clipId: clip.id,
            startTime: index * 5, // 5 ثواني بين كل مقطع
            duration: clip.duration,
            layer: 1,
            muted: false,
            locked: false
        }));
    }
    
    calculateExportSize(options) {
        const duration = this.state.currentProject.settings.duration;
        const bitrate = this.config.exportSettings.qualities.find(q => q.label === options.quality)?.bitrate || 4000;
        
        // الحجم بالميجابايت = (البت ريت × المدة) / (8 × 1024)
        const sizeInMB = (bitrate * duration) / (8 * 1024);
        return `${sizeInMB.toFixed(1)} MB`;
    }
    
    generateDownloadUrl(options) {
        // محاكاة رابط التحميل
        return `https://nexus-studio.vercel.app/exports/${this.state.currentProject.id}_${options.quality}.${options.format}`;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    loadProjects() {
        try {
            const saved = localStorage.getItem('nexus_video_projects');
            if (saved) {
                this.state.projects = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Cannot load projects:', error);
        }
    }
    
    saveProjects() {
        try {
            localStorage.setItem('nexus_video_projects', JSON.stringify(this.state.projects));
        } catch (error) {
            console.warn('Cannot save projects:', error);
        }
    }
    
    saveExport(exportData) {
        try {
            const exports = JSON.parse(localStorage.getItem('nexus_video_exports') || '[]');
            exports.push(exportData);
            localStorage.setItem('nexus_video_exports', JSON.stringify(exports));
        } catch (error) {
            console.error('Failed to save export:', error);
        }
    }
    
    setupEventListeners() {
        // إضافة مستمعات الأحداث للواجهة
        console.log('🎧 Setting up video editor event listeners...');
    }
    
    parseThumbnailDesigns(designs) {
        // تحليل تصاميم الثمبنيلات من نص AI
        // (هذا مثال مبسط)
        return [
            {
                title: 'تصميم 1 - احترافي',
                description: 'تصميم أنيق مع ألوان متناسقة',
                colors: ['#2563EB', '#1E40AF', '#FFFFFF'],
                layout: 'صورة كبيرة مع عنوان جانبي'
            },
            {
                title: 'تصميم 2 - جذاب',
                description: 'تصميم مثير مع تأثيرات بصرية',
                colors: ['#DC2626', '#F59E0B', '#000000'],
                layout: 'صورة مركزية مع نص كبير'
            }
        ];
    }
    
    selectClip(clipId) {
        this.state.selectedClips = [clipId];
        
        // تحديث واجهة الخصائص
        const clip = this.state.currentProject.clips.find(c => c.id === clipId);
        if (clip) {
            this.updatePropertiesPanel(clip);
        }
    }
    
    updatePropertiesPanel(clip) {
        const panel = document.getElementById('propertiesPanel');
        if (!panel) return;
        
        panel.innerHTML = `
            <div class="properties-header">
                <h5>خصائص المقطع</h5>
                <div class="clip-name">${clip.name}</div>
            </div>
            
            <div class="properties-section">
                <h6>الموضع</h6>
                <div class="property">
                    <label>المدة:</label>
                    <span>${clip.duration} ثانية</span>
                </div>
                <div class="property">
                    <label>الحجم:</label>
                    <span>${(clip.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
            </div>
            
            <div class="properties-section">
                <h6>التأثيرات</h6>
                ${clip.effects.map(effect => `
                    <div class="effect-item">
                        <span>${effect.type}</span>
                        <button onclick="videoEditor.removeEffect('${clip.id}', '${effect.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
                
                <button class="add-effect-btn" onclick="showEffectsMenu('${clip.id}')">
                    <i class="fas fa-plus"></i> إضافة تأثير
                </button>
            </div>
            
            <div class="properties-section">
                <h6>الصوت</h6>
                <div class="property">
                    <label>مستوى الصوت:</label>
                    <input type="range" min="0" max="2" step="0.1" 
                           value="${clip.audio.volume}" 
                           onchange="videoEditor.updateClipVolume('${clip.id}', this.value)">
                </div>
            </div>
        `;
    }
    
    updateClipVolume(clipId, volume) {
        const clip = this.state.currentProject.clips.find(c => c.id === clipId);
        if (clip) {
            clip.audio.volume = parseFloat(volume);
            this.saveProject();
        }
    }
    
    removeEffect(clipId, effectId) {
        const clip = this.state.currentProject.clips.find(c => c.id === clipId);
        if (clip) {
            clip.effects = clip.effects.filter(e => e.id !== effectId);
            this.saveProject();
            this.updatePropertiesPanel(clip);
        }
    }
    
    getStats() {
        return {
            currentProject: this.state.currentProject?.name,
            clipsCount: this.state.currentProject?.clips.length || 0,
            timelineItems: this.state.timeline.length,
            duration: this.state.duration,
            isPlaying: this.state.isPlaying
        };
    }
}

// ========== التصدير والتشغيل ==========

if (typeof window !== 'undefined') {
    window.VideoEditor = VideoEditor;
    window.videoEditor = new VideoEditor();
    
    // وظائف للاستخدام في onclick
    window.createNewProject = (options) => window.videoEditor.createProject(options);
    window.importMediaFiles = (files) => window.videoEditor.importMedia(files);
    window.playVideo = () => window.videoEditor.play();
    window.pauseVideo = () => window.videoEditor.pause();
    window.exportVideo = (options) => window.videoEditor.exportProject(options);
    window.autoEditVideo = () => window.videoEditor.autoEditWithAI();
    
    // تشغيل عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎬 Video Editor Ready');
    });
}

export default VideoEditor;