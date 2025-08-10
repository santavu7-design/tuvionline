/**
 * TuVi Processor - Logic trung gian xử lý thông tin tử vi
 * Chỉ làm 2 việc: Lưu database + Gửi model tạo file MD
 */

class TuViProcessor {
    constructor() {
        if (!window.modelManager) {
            throw new Error('ModelManager chưa được load. Kiểm tra thứ tự load script files.');
        }
        this.modelManager = window.modelManager;
        // Lazy instantiate để tránh race condition
        this._tuviService = null;
        this._database = null;
    }
    
    // Getter cho tuviService - lazy instantiate
    get tuviService() {
        if (!this._tuviService) {
            if (!window.TuViGeminiService) {
                throw new Error('TuViGeminiService chưa được load. Kiểm tra thứ tự load script files.');
            }
            this._tuviService = new TuViGeminiService();
        }
        return this._tuviService;
    }
    
    // Getter cho database - lazy instantiate
    get database() {
        if (!this._database) {
            this._database = new TuViDatabase();
        }
        return this._database;
    }

    /**
     * Xử lý thông tin sinh nhật - Logic chính
     * @param {Object} birthInfo - Thông tin sinh nhật từ form
     * @returns {Promise<Object>} Kết quả xử lý
     */
    async processBirthInfo(birthInfo) {
        console.log('🔄 TuVi Processor bắt đầu xử lý...');
        
        try {
            // Step 1: Lưu vào database
            console.log('📊 Step 1: Lưu thông tin vào database...');
            const savedRecord = await this.database.saveBirthInfo(birthInfo);
            console.log(`✅ Đã lưu record ID: ${savedRecord.id}`);

            // Step 2: Gửi tới model và tạo file MD
            console.log('🤖 Step 2: Gửi tới Gemini model...');
            const modelResult = await this.tuviService.callGeminiAPI(birthInfo);
            
            if (!modelResult.success) {
                throw new Error(`Model call failed: ${modelResult.error}`);
            }

            console.log(`✅ Model thành công: ${modelResult.usedModel || 'default'}`);

            // Step 3: Tạo file MD
            console.log('📄 Step 3: Tạo file markdown...');
            const filename = await this.createMarkdownFile(modelResult.markdown, birthInfo);
            console.log(`✅ Đã tạo file: ${filename}`);

            // Step 4: Cập nhật database với file path
            await this.database.updateRecordWithFile(savedRecord.id, filename);
            console.log(`✅ Đã cập nhật database với file path`);

            return {
                success: true,
                recordId: savedRecord.id,
                filename: filename,
                usedModel: modelResult.usedModel,
                usedKey: modelResult.usedKey,
                markdownLength: modelResult.markdown.length
            };

        } catch (error) {
            console.error('❌ TuVi Processor lỗi:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Tạo file markdown từ kết quả model
     * @param {string} markdownContent - Nội dung markdown từ model
     * @param {Object} birthInfo - Thông tin sinh để đặt tên file
     * @returns {Promise<string>} Tên file đã tạo
     */
    async createMarkdownFile(markdownContent, birthInfo) {
        // Tạo tên file từ thông tin sinh
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const nameSlug = this.createSlug(birthInfo.fullName);
        const filename = `tuvi_${nameSlug}_${timestamp}.md`;

        try {
            // Tạo header cho file MD
            const header = this.createMarkdownHeader(birthInfo);
            const fullContent = header + '\n\n' + markdownContent;

            // Lưu file (simulate - browser không thể ghi file trực tiếp)
            this.downloadMarkdownFile(fullContent, filename);
            
            return filename;
        } catch (error) {
            console.error('Lỗi tạo file markdown:', error);
            throw error;
        }
    }

    /**
     * Tạo header cho file markdown
     * @param {Object} birthInfo - Thông tin sinh
     * @returns {string} Header markdown
     */
    createMarkdownHeader(birthInfo) {
        const createdTime = new Date().toLocaleString('vi-VN');
        
        return `# Lá Số Tử Vi - ${birthInfo.fullName}

---

**Thông tin cơ bản:**
- Họ và tên: ${birthInfo.fullName}
- Giới tính: ${birthInfo.gender}
- Ngày sinh: ${birthInfo.birthDate} ${birthInfo.birthTime}
- Nơi sinh: ${birthInfo.birthplace}
- Thời gian tạo: ${createdTime}

---

## Lá Số Tử Vi Chi Tiết`;
    }

    /**
     * Tạo slug từ tên người dùng
     * @param {string} name - Tên người dùng
     * @returns {string} Slug
     */
    createSlug(name) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    }

    /**
     * Download file markdown (browser compatibility)
     * @param {string} content - Nội dung file
     * @param {string} filename - Tên file
     */
    downloadMarkdownFile(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        console.log(`📁 File ${filename} đã được tạo và download`);
    }
}

/**
 * TuVi Database - Quản lý lưu trữ thông tin
 */
class TuViDatabase {
    constructor() {
        this.storageKey = 'tuvi_database';
        this.initialize();
    }

    /**
     * Khởi tạo database
     */
    initialize() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialDB = {
                records: [],
                nextId: 1,
                created: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialDB));
            console.log('📊 Database initialized');
        }
    }

    /**
     * Lưu thông tin sinh nhật
     * @param {Object} birthInfo - Thông tin sinh nhật
     * @returns {Promise<Object>} Record đã lưu
     */
    async saveBirthInfo(birthInfo) {
        const db = this.getDatabase();
        
        const record = {
            id: db.nextId++,
            ...birthInfo,
            created: new Date().toISOString(),
            status: 'processing',
            filename: null,
            modelUsed: null
        };

        db.records.push(record);
        this.saveDatabase(db);
        
        console.log(`💾 Saved record ID ${record.id} to database`);
        return record;
    }

    /**
     * Cập nhật record với thông tin file
     * @param {number} recordId - ID của record
     * @param {string} filename - Tên file đã tạo
     * @param {string} modelUsed - Model đã sử dụng
     */
    async updateRecordWithFile(recordId, filename, modelUsed = null) {
        const db = this.getDatabase();
        const record = db.records.find(r => r.id === recordId);
        
        if (record) {
            record.filename = filename;
            record.modelUsed = modelUsed;
            record.status = 'completed';
            record.completed = new Date().toISOString();
            
            this.saveDatabase(db);
            console.log(`💾 Updated record ID ${recordId} with file info`);
        }
    }

    /**
     * Lấy tất cả records
     * @returns {Array} Danh sách records
     */
    getAllRecords() {
        const db = this.getDatabase();
        return db.records;
    }

    /**
     * Lấy record theo ID
     * @param {number} recordId - ID của record
     * @returns {Object|null} Record hoặc null
     */
    getRecord(recordId) {
        const db = this.getDatabase();
        return db.records.find(r => r.id === recordId) || null;
    }

    /**
     * Xóa record
     * @param {number} recordId - ID của record
     * @returns {boolean} Thành công hay không
     */
    deleteRecord(recordId) {
        const db = this.getDatabase();
        const index = db.records.findIndex(r => r.id === recordId);
        
        if (index !== -1) {
            db.records.splice(index, 1);
            this.saveDatabase(db);
            console.log(`🗑️ Deleted record ID ${recordId}`);
            return true;
        }
        
        return false;
    }

    /**
     * Lấy database từ localStorage
     * @returns {Object} Database object
     */
    getDatabase() {
        const dbString = localStorage.getItem(this.storageKey);
        return dbString ? JSON.parse(dbString) : { records: [], nextId: 1 };
    }

    /**
     * Lưu database vào localStorage
     * @param {Object} db - Database object
     */
    saveDatabase(db) {
        localStorage.setItem(this.storageKey, JSON.stringify(db));
    }

    /**
     * Xuất database
     * @returns {Object} Database object
     */
    exportDatabase() {
        return this.getDatabase();
    }

    /**
     * Xóa toàn bộ database
     */
    clearDatabase() {
        localStorage.removeItem(this.storageKey);
        this.initialize();
        console.log('🗑️ Database cleared');
    }

    /**
     * Lấy thống kê database
     * @returns {Object} Thống kê
     */
    getStats() {
        const db = this.getDatabase();
        const total = db.records.length;
        const completed = db.records.filter(r => r.status === 'completed').length;
        const processing = db.records.filter(r => r.status === 'processing').length;
        
        return {
            total,
            completed,
            processing,
            successRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }
}

// Export cho browser
if (typeof window !== 'undefined') {
    window.TuViProcessor = TuViProcessor;
    window.TuViDatabase = TuViDatabase;
}

// Export cho Node.js nếu cần
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TuViProcessor, TuViDatabase };
}
