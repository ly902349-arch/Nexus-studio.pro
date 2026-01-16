/**
 * Nexus Assistant - النسخة المبسطة
 * للمساعد الذكي الأساسي
 */

class NexusAssistant {
    constructor() {
        this.state = {
            isInitialized: false,
            currentMode: 'chat',
            isProcessing: false,
            chatHistory: []
        };
        
        this.initialize();
    }
    
    initialize() {
        console.log('🎯 Nexus Assistant Initializing...');
        
        // تحميل السجل
        this.loadHistory();
        
        // إعداد الواجهة
        this.setupUI();
        
        this.state.isInitialized = true;
        console.log('✅ Nexus Assistant Ready!');
        
        return true;
    }
    
    setupUI() {
        // سيتم استدعاؤها من المكون
        console.log('🎨 Setting up assistant UI...');
    }
    
    // إرسال رسالة
    async sendMessage() {
        const input = document.getElementById('aiInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message || this.state.isProcessing) return;
        
        // إضافة رسالة المستخدم
        this.addMessage('user', message);
        
        // مسح الحقل
        input.value = '';
        this.adjustTextareaHeight(input);
        
        // تعطيل الإرسال
        this.state.isProcessing = true;
        this.updateSendButton();
        
        try {
            // الحصول على الرد
            const response = await this.processMessage(message);
            
            // إضافة رد المساعد
            this.addMessage('ai', response);
            
            // حفظ في السجل
            this.saveToHistory(message, response);
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('ai', '⚠️ حدث خطأ. حاول مرة أخرى.');
        } finally {
            this.state.isProcessing = false;
            this.updateSendButton();
        }
    }
    
    async processMessage(message) {
        if (!window.geminiAI) {
            return 'Gemini AI غير متاح. تأكد من تحميل الملفات.';
        }
        
        const mode = this.state.currentMode;
        
        switch(mode) {
            case 'script':
                return await window.geminiAI.generateScript(message);
            case 'ideas':
                return await window.geminiAI.generateVideoIdeas([message]);
            case 'analysis':
                return await window.geminiAI.analyzePerformance({ topic: message });
            case 'design':
                return await window.geminiAI.generateThumbnailPrompt(message);
            default:
                return await window.geminiAI.generateContent(message);
        }
    }
    
    addMessage(sender, content) {
        const chatWindow = document.getElementById('aiChatWindow');
        if (!chatWindow) return;
        
        const messageId = `msg_${Date.now()}`;
        const timestamp = new Date().toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const messageDiv = document.createElement('div');
        messageDiv.id = messageId;
        messageDiv.className = `message ${sender}`;
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        const senderName = sender === 'user' ? 'أنت' : 'مساعد Nexus';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">${senderName}</span>
                    <span class="message-time">${timestamp}</span>
                </div>
                <div class="message-body">${this.formatMessage(content)}</div>
            </div>
        `;
        
        chatWindow.appendChild(messageDiv);
        
        // تأثير الظهور
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
            messageDiv.style.transition = 'opacity 0.3s, transform 0.3s';
        }, 10);
        
        // التمرير للأسفل
        this.scrollToBottom();
    }
    
    formatMessage(content) {
        if (!content) return '';
        
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        
        return formatted;
    }
    
    adjustTextareaHeight(textarea) {
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    }
    
    scrollToBottom() {
        const chatWindow = document.getElementById('aiChatWindow');
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }
    
    updateSendButton() {
        const sendBtn = document.getElementById('sendBtn');
        if (!sendBtn) return;
        
        if (this.state.isProcessing) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        } else {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }
    }
    
    changeMode(mode) {
        this.state.currentMode = mode;
        
        const modeNames = {
            'chat': 'المحادثة العامة',
            'script': 'كتابة السيناريو',
            'ideas': 'توليد الأفكار',
            'analysis': 'تحليل الأداء',
            'design': 'التصميم الجرافيكي'
        };
        
        this.showNotification(`✅ تم التبديل إلى: ${modeNames[mode] || mode}`);
    }
    
    showNotification(message) {
        // إنشاء إشعار بسيط
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    clearChat() {
        const chatWindow = document.getElementById('aiChatWindow');
        if (chatWindow) {
            chatWindow.innerHTML = `
                <div class="message ai">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <div class="message-sender">مساعد Nexus</div>
                        <div class="message-body">
                            مرحباً! 👋 أنا المساعد الذكي لـ Nexus Studio.<br>
                            كيف يمكنني مساعدتك اليوم؟
                        </div>
                    </div>
                </div>
            `;
            
            this.state.chatHistory = [];
            localStorage.removeItem('nexus_chat_history');
            
            this.showNotification('تم مسح المحادثة');
        }
    }
    
    loadHistory() {
        try {
            const saved = localStorage.getItem('nexus_chat_history');
            if (saved) {
                this.state.chatHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Cannot load chat history:', error);
        }
    }
    
    saveToHistory(userMessage, aiResponse) {
        this.state.chatHistory.push({
            user: userMessage,
            ai: aiResponse,
            mode: this.state.currentMode,
            timestamp: new Date().toISOString()
        });
        
        // حفظ في localStorage
        try {
            localStorage.setItem('nexus_chat_history', 
                JSON.stringify(this.state.chatHistory));
        } catch (error) {
            console.warn('Cannot save chat history:', error);
        }
    }
    
    getStats() {
        return {
            totalMessages: this.state.chatHistory.length,
            currentMode: this.state.currentMode,
            isProcessing: this.state.isProcessing
        };
    }
}

// التصدير
if (typeof window !== 'undefined') {
    window.NexusAssistant = NexusAssistant;
    window.nexusAssistant = new NexusAssistant();
    
    // وظائف عامة
    window.sendMessageToAI = () => window.nexusAssistant?.sendMessage();
    window.clearAIchat = () => window.nexusAssistant?.clearChat();
    window.changeAIMode = (mode) => window.nexusAssistant?.changeMode(mode);
    
    // التهيئة التلقائية
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎯 Nexus Assistant Functions Loaded');
    });
}

export default NexusAssistant;