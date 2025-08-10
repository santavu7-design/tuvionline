/**
 * Model Manager - Quản lý các model Gemini với cấu hình mặc định
 * Chỉ cần gọi đơn giản, không cần điều chỉnh thêm
 */
class ModelManager {
    constructor() {
        // Cấu hình các model mặc định - CHỈ DÙNG DÒNG 2.5 VÀ 2.0
        this.models = {
            // Model chính - tốt nhất cho tử vi
            'primary': {
                name: 'gemini-2.5-pro',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
                config: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 32768
                },
                description: 'Model chính - Enhanced thinking and reasoning, multimodal understanding',
                priority: 1
            },
            
            // Model nhanh - backup
            'fast': {
                name: 'gemini-2.5-flash',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
                config: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192
                },
                description: 'Model nhanh - Adaptive thinking, cost efficiency',
                priority: 2
            },
            
            // Model lite - backup 2
            'lite': {
                name: 'gemini-2.5-flash-lite',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
                config: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 4096
                },
                description: 'Model lite - Text, image, video, audio',
                priority: 3
            },
            
            // Model thế hệ mới - experimental
            'experimental': {
                name: 'gemini-2.0-flash',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
                config: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192
                },
                description: 'Model 2.0 - Next generation features, speed, and realtime streaming',
                priority: 4
            },
            
            // Model 2.0 lite - backup cuối
            'experimental_lite': {
                name: 'gemini-2.0-flash-lite',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent',
                config: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 4096
                },
                description: 'Model 2.0 lite - Cost efficiency and low latency',
                priority: 5
            }
        };
        
        // Model đang sử dụng
        this.currentModel = 'primary';
        
        // API keys (chính và dự phòng)
        this.apiKeys = [
            'AIzaSyCGXvkFqyxNG6NurcsJ7HyAF0V_5iXqwl0', // Key chính
            'AIzaSyAxs5Y8I2wBENa3ZaE45iK5jxdvWpn-Pjs', // Key dự phòng 1
            'AIzaSyCzB4vP8A3sT5zzs-qtiacf8RLJAb15gEo', // Key dự phòng 2
            'AIzaSyDqBUT3Ps8tBIrb0fv0hixaX23F9m8qO3U'  // Key dự phòng 3
        ];
        this.currentKeyIndex = 0;
    }

    /**
     * Lấy cấu hình model hiện tại
     * @returns {Object} Cấu hình model
     */
    getCurrentModel() {
        return this.models[this.currentModel];
    }

    /**
     * Lấy endpoint cho model hiện tại
     * @returns {string} URL endpoint
     */
    getEndpoint() {
        return this.getCurrentModel().endpoint;
    }

    /**
     * Lấy cấu hình generation cho model hiện tại
     * @returns {Object} Generation config
     */
    getGenerationConfig() {
        return this.getCurrentModel().config;
    }

    /**
     * Lấy API key hiện tại
     * @returns {string} API key
     */
    getApiKey() {
        return this.apiKeys[this.currentKeyIndex];
    }

    /**
     * Lấy API key tiếp theo (khi gặp lỗi)
     * @returns {string} API key tiếp theo
     */
    getNextApiKey() {
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
        return this.getApiKey();
    }

    /**
     * Gọi API với model hiện tại
     * @param {string} prompt - Prompt để gửi
     * @returns {Promise<Object>} Kết quả API
     */
    async callAPI(prompt) {
        const model = this.getCurrentModel();
        let attempts = 0;
        const maxAttempts = this.apiKeys.length;
        
        while (attempts < maxAttempts) {
            try {
                const currentKey = this.getApiKey();
                console.log(`Thử API key: ${currentKey.substring(0, 10)}... (attempt ${attempts + 1})`);
                
                // Tạo AbortController để quản lý timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 giây timeout
                
                const response = await fetch(`${model.endpoint}?key=${currentKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: model.config
                    }),
                    signal: controller.signal // Thêm signal để hỗ trợ timeout
                });
                
                clearTimeout(timeoutId); // Clear timeout nếu request thành công

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
                }

                const data = await response.json();
                const generatedText = data.candidates[0]?.content?.parts[0]?.text;

                if (!generatedText) {
                    throw new Error('Không nhận được nội dung từ API');
                }

                return {
                    success: true,
                    text: generatedText,
                    model: model.name,
                    usedKey: currentKey.substring(0, 10) + '...',
                    attempt: attempts + 1
                };

            } catch (error) {
                // Xử lý lỗi timeout riêng
                if (error.name === 'AbortError') {
                    console.error(`⏰ Timeout với API key ${this.getApiKey().substring(0, 10)}... (60s)`);
                } else {
                    console.error(`❌ Lỗi với API key ${this.getApiKey().substring(0, 10)}...:`, error);
                }
                attempts++;
                
                if (attempts < maxAttempts) {
                    // Thử key tiếp theo
                    this.getNextApiKey();
                    continue;
                } else {
                    // Hết key để thử
                    return {
                        success: false,
                        error: error.message,
                        model: model.name,
                        attempts: attempts
                    };
                }
            }
        }
    }

    /**
     * Gọi API với auto-retry (thử các model khác nếu lỗi)
     * @param {string} prompt - Prompt để gửi
     * @returns {Promise<Object>} Kết quả API
     */
    async callAPIWithRetry(prompt) {
        const modelOrder = ['primary', 'fast', 'lite', 'experimental', 'experimental_lite'];
        
        for (const modelType of modelOrder) {
            // Đổi model tạm thời
            const originalModel = this.currentModel;
            this.currentModel = modelType;
            
            console.log(`Thử model: ${this.models[modelType].name}`);
            
            const result = await this.callAPI(prompt);
            
            if (result.success) {
                // Giữ model thành công làm default
                console.log(`✅ Thành công với model: ${result.model}`);
                return {
                    ...result,
                    usedModel: modelType
                };
            } else {
                console.log(`❌ Lỗi với model ${result.model}: ${result.error}`);
                // Khôi phục model gốc nếu thất bại
                this.currentModel = originalModel;
            }
        }
        
        // Tất cả model đều lỗi
        return {
            success: false,
            error: 'Tất cả model đều không khả dụng',
            attempts: modelOrder.length
        };
    }

    /**
     * Đặt model mặc định
     * @param {string} modelType - Loại model ('primary', 'fast', 'experimental')
     */
    setDefaultModel(modelType) {
        if (this.models[modelType]) {
            this.currentModel = modelType;
            console.log(`Đã đặt model mặc định: ${this.models[modelType].name}`);
        }
    }

    /**
     * Lấy thông tin tất cả model
     * @returns {Object} Thông tin model
     */
    getModelInfo() {
        return Object.keys(this.models).map(key => ({
            type: key,
            name: this.models[key].name,
            description: this.models[key].description,
            priority: this.models[key].priority,
            isCurrent: key === this.currentModel
        }));
    }

    /**
     * Test model nào khả dụng
     * @returns {Promise<Array>} Danh sách model khả dụng
     */
    async testAvailableModels() {
        const results = [];
        const testPrompt = "Xin chào! Hãy trả lời ngắn: Bạn là model nào?";
        
        for (const [type, model] of Object.entries(this.models)) {
            const originalModel = this.currentModel;
            this.currentModel = type;
            
            const result = await this.callAPI(testPrompt);
            
            results.push({
                type: type,
                name: model.name,
                available: result.success,
                response: result.success ? result.text : result.error,
                description: model.description
            });
            
            this.currentModel = originalModel;
        }
        
        return results;
    }
}

// Export và khởi tạo global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModelManager;
}

// Tạo instance global
if (typeof window !== 'undefined') {
    window.ModelManager = ModelManager;
    window.modelManager = new ModelManager();
}
