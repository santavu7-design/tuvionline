/**
 * API Key Manager - Quản lý và xoay vòng các API key
 */
class ApiKeyManager {
    constructor() {
        // Danh sách các API key Gemini Pro
        this.apiKeys = [
            'AIzaSyCGXvkFqyxNG6NurcsJ7HyAF0V_5iXqwl0', // Key chính - Gemini 2.5 Pro
            // Thêm các key backup ở đây nếu cần
            // 'AIzaSyAnotherKey1234567890',
            // 'AIzaSyBackupKey0987654321',
        ];
        
        // Index của key hiện tại
        this.currentKeyIndex = 0;
        
        // Thống kê sử dụng
        this.keyStats = {};
        
        // Khởi tạo stats cho tất cả key
        this.initializeStats();
        
        // Load thống kê từ localStorage
        this.loadStats();
    }

    /**
     * Khởi tạo thống kê cho tất cả key
     */
    initializeStats() {
        this.apiKeys.forEach((key, index) => {
            const keyId = this.getKeyId(key);
            if (!this.keyStats[keyId]) {
                this.keyStats[keyId] = {
                    index: index,
                    calls: 0,
                    errors: 0,
                    lastUsed: null,
                    isActive: true,
                    dailyUsage: 0,
                    lastResetDate: new Date().toDateString()
                };
            }
        });
    }

    /**
     * Lấy ID ngắn của key (4 ký tự cuối)
     * @param {string} key - API key
     * @returns {string} Key ID
     */
    getKeyId(key) {
        return key.slice(-8); // Lấy 8 ký tự cuối
    }

    /**
     * Lấy key hiện tại
     * @returns {string} API key hiện tại
     */
    getCurrentKey() {
        return this.apiKeys[this.currentKeyIndex];
    }

    /**
     * Lấy key tiếp theo (round-robin)
     * @returns {string} API key tiếp theo
     */
    getNextKey() {
        // Tìm key active tiếp theo
        let attempts = 0;
        while (attempts < this.apiKeys.length) {
            this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
            const currentKey = this.apiKeys[this.currentKeyIndex];
            const keyId = this.getKeyId(currentKey);
            
            if (this.keyStats[keyId].isActive) {
                return currentKey;
            }
            attempts++;
        }
        
        // Nếu không có key nào active, trả về key đầu tiên
        this.currentKeyIndex = 0;
        return this.apiKeys[0];
    }

    /**
     * Lấy key ngẫu nhiên
     * @returns {string} API key ngẫu nhiên
     */
    getRandomKey() {
        const activeKeys = this.apiKeys.filter((key, index) => {
            const keyId = this.getKeyId(key);
            return this.keyStats[keyId].isActive;
        });
        
        if (activeKeys.length === 0) {
            return this.apiKeys[0]; // Fallback
        }
        
        const randomIndex = Math.floor(Math.random() * activeKeys.length);
        const selectedKey = activeKeys[randomIndex];
        
        // Cập nhật currentKeyIndex
        this.currentKeyIndex = this.apiKeys.indexOf(selectedKey);
        
        return selectedKey;
    }

    /**
     * Lấy key ít được sử dụng nhất
     * @returns {string} API key ít được sử dụng nhất
     */
    getLeastUsedKey() {
        const activeKeys = this.apiKeys.filter((key, index) => {
            const keyId = this.getKeyId(key);
            return this.keyStats[keyId].isActive;
        });
        
        if (activeKeys.length === 0) {
            return this.apiKeys[0]; // Fallback
        }
        
        let leastUsedKey = activeKeys[0];
        let minCalls = this.keyStats[this.getKeyId(leastUsedKey)].calls;
        
        activeKeys.forEach(key => {
            const keyId = this.getKeyId(key);
            if (this.keyStats[keyId].calls < minCalls) {
                minCalls = this.keyStats[keyId].calls;
                leastUsedKey = key;
            }
        });
        
        // Cập nhật currentKeyIndex
        this.currentKeyIndex = this.apiKeys.indexOf(leastUsedKey);
        
        return leastUsedKey;
    }

    /**
     * Ghi nhận việc sử dụng key
     * @param {string} key - API key đã sử dụng
     * @param {boolean} success - Có thành công không
     */
    recordUsage(key, success = true) {
        const keyId = this.getKeyId(key);
        
        if (this.keyStats[keyId]) {
            this.keyStats[keyId].calls++;
            this.keyStats[keyId].lastUsed = new Date().toISOString();
            
            // Reset daily usage nếu qua ngày mới
            const today = new Date().toDateString();
            if (this.keyStats[keyId].lastResetDate !== today) {
                this.keyStats[keyId].dailyUsage = 0;
                this.keyStats[keyId].lastResetDate = today;
            }
            
            this.keyStats[keyId].dailyUsage++;
            
            if (!success) {
                this.keyStats[keyId].errors++;
                
                // Tự động disable key nếu có quá nhiều lỗi
                if (this.keyStats[keyId].errors >= 5) {
                    this.keyStats[keyId].isActive = false;
                    console.warn(`Key ${keyId} đã bị vô hiệu hóa do quá nhiều lỗi`);
                }
            }
            
            // Lưu thống kê
            this.saveStats();
        }
    }

    /**
     * Kích hoạt/vô hiệu hóa key
     * @param {string} key - API key
     * @param {boolean} active - Trạng thái active
     */
    setKeyActive(key, active) {
        const keyId = this.getKeyId(key);
        if (this.keyStats[keyId]) {
            this.keyStats[keyId].isActive = active;
            this.saveStats();
        }
    }

    /**
     * Thêm key mới
     * @param {string} newKey - API key mới
     */
    addKey(newKey) {
        if (!this.apiKeys.includes(newKey)) {
            this.apiKeys.push(newKey);
            const keyId = this.getKeyId(newKey);
            this.keyStats[keyId] = {
                index: this.apiKeys.length - 1,
                calls: 0,
                errors: 0,
                lastUsed: null,
                isActive: true,
                dailyUsage: 0,
                lastResetDate: new Date().toDateString()
            };
            this.saveStats();
            console.log(`Đã thêm key mới: ${keyId}`);
        }
    }

    /**
     * Xóa key
     * @param {string} keyToRemove - API key cần xóa
     */
    removeKey(keyToRemove) {
        const index = this.apiKeys.indexOf(keyToRemove);
        if (index > -1 && this.apiKeys.length > 1) { // Không xóa nếu chỉ còn 1 key
            this.apiKeys.splice(index, 1);
            const keyId = this.getKeyId(keyToRemove);
            delete this.keyStats[keyId];
            
            // Điều chỉnh currentKeyIndex
            if (this.currentKeyIndex >= index) {
                this.currentKeyIndex = Math.max(0, this.currentKeyIndex - 1);
            }
            
            this.saveStats();
            console.log(`Đã xóa key: ${keyId}`);
        }
    }

    /**
     * Lấy thống kê tất cả key
     * @returns {Object} Thống kê chi tiết
     */
    getStats() {
        return {
            totalKeys: this.apiKeys.length,
            activeKeys: this.apiKeys.filter(key => {
                const keyId = this.getKeyId(key);
                return this.keyStats[keyId].isActive;
            }).length,
            currentKey: this.getKeyId(this.getCurrentKey()),
            keyDetails: this.keyStats
        };
    }

    /**
     * Reset thống kê
     */
    resetStats() {
        Object.keys(this.keyStats).forEach(keyId => {
            this.keyStats[keyId].calls = 0;
            this.keyStats[keyId].errors = 0;
            this.keyStats[keyId].dailyUsage = 0;
            this.keyStats[keyId].lastResetDate = new Date().toDateString();
        });
        this.saveStats();
    }

    /**
     * Lưu thống kê vào localStorage
     */
    saveStats() {
        try {
            localStorage.setItem('api_key_stats', JSON.stringify({
                currentKeyIndex: this.currentKeyIndex,
                keyStats: this.keyStats
            }));
        } catch (error) {
            console.error('Lỗi khi lưu thống kê API key:', error);
        }
    }

    /**
     * Load thống kê từ localStorage
     */
    loadStats() {
        try {
            const saved = localStorage.getItem('api_key_stats');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentKeyIndex = data.currentKeyIndex || 0;
                
                // Merge với stats hiện tại
                Object.keys(data.keyStats || {}).forEach(keyId => {
                    if (this.keyStats[keyId]) {
                        this.keyStats[keyId] = {
                            ...this.keyStats[keyId],
                            ...data.keyStats[keyId]
                        };
                    }
                });
            }
        } catch (error) {
            console.error('Lỗi khi load thống kê API key:', error);
        }
    }

    /**
     * Hiển thị thống kê dạng bảng
     */
    printStats() {
        console.table(
            Object.keys(this.keyStats).map(keyId => ({
                'Key ID': keyId,
                'Calls': this.keyStats[keyId].calls,
                'Errors': this.keyStats[keyId].errors,
                'Daily Usage': this.keyStats[keyId].dailyUsage,
                'Active': this.keyStats[keyId].isActive ? '✅' : '❌',
                'Last Used': this.keyStats[keyId].lastUsed ? 
                    new Date(this.keyStats[keyId].lastUsed).toLocaleString() : 'Never'
            }))
        );
    }
}

// Export để sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiKeyManager;
}

// Tạo instance global
if (typeof window !== 'undefined') {
    window.ApiKeyManager = ApiKeyManager;
    window.apiKeyManager = new ApiKeyManager();
}
