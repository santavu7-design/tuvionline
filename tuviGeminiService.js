/**
 * TuVi Gemini Service
 * Xử lý việc gửi thông tin sinh đến Gemini Pro và lấy về thông tin tử vi
 */

class TuViGeminiService {
    constructor() {
        // Lazy instantiate để tránh race condition
        this._modelManager = null;
        this._keyManager = null;
        
        // Getter cho modelManager - lazy instantiate
        Object.defineProperty(this, 'modelManager', {
            get: function() {
                if (!this._modelManager) {
                    if (!window.modelManager) {
                        throw new Error('ModelManager chưa được load. Kiểm tra thứ tự load script files.');
                    }
                    this._modelManager = window.modelManager;
                }
                return this._modelManager;
            }
        });
        
        // Getter cho keyManager - lazy instantiate
        Object.defineProperty(this, 'keyManager', {
            get: function() {
                if (!this._keyManager) {
                    if (!window.apiKeyManager) {
                        throw new Error('ApiKeyManager chưa được load. Kiểm tra thứ tự load script files.');
                    }
                    this._keyManager = window.apiKeyManager;
                }
                return this._keyManager;
            }
        });
        
        // Prompt template cho Gemini
        this.PROMPT_TEMPLATE = `Bạn là một chuyên gia tử vi học Việt Nam có kinh nghiệm sâu rộng. Hãy tạo một lá số tử vi chi tiết và chính xác cho người dùng dựa trên thông tin sau:

Họ và Tên: {fullName}
Giới Tính: {gender}
Ngày Sinh Dương Lịch: {birthDate} {birthTime}
Nơi Sinh: {birthplace}

**Lưu ý quan trọng:** Đây là một bài tập mô phỏng để học hỏi về tử vi học. Bạn hãy tạo một lá số tử vi hoàn chỉnh với dữ liệu mô phỏng dựa trên kiến thức tử vi của bạn. Không cần phải chính xác 100% về mặt tính toán, chỉ cần tạo ra một lá số hợp lý và đầy đủ.

Hãy trả về CHÍNH XÁC theo định dạng sau, KHÔNG THÊM TEXT GIẢI THÍCH KHÁC:

ho_ten: {fullName}
gioi_tinh: {gender}
duong_lich: {birthDate} {birthTime}
am_lich: [Tạo ngày âm lịch mô phỏng]
noi_sinh: {birthplace}
ban_menh: [Tạo bản mệnh mô phỏng]
cuc: [Tạo cục mô phỏng]
am_duong: {amDuong}
chu_menh: [Tạo chủ mệnh mô phỏng]
chu_than: [Tạo chủ thân mô phỏng]

## MỆNH
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## PHỤ MẪU
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## PHÚC ĐỨC
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## ĐIỀN TRẠCH
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## QUAN LỘC
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## NÔ BỘC
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## THIÊN DI
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## TẬT ÁCH
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## TÀI BẠCH
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## TỬ TỨC
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## THÊ THIẾP
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## HUYNH ĐỆ
dia_chi: [Tạo địa chi mô phỏng]
chinh_tinh: [Tạo chính tinh mô phỏng]
phu_tinh_tot: [Tạo phụ tinh tốt mô phỏng]
phu_tinh_xau: [Tạo phụ tinh xấu mô phỏng]
phu_tinh_trung_binh: [Tạo phụ tinh trung bình mô phỏng]
vong_trang_sinh: [Tạo vòng tràng sinh mô phỏng]
is_than: false

## CHÚ GIẢI
content: [Tạo nội dung giải thích mô phỏng về lá số tử vi này]`;
    }

    /**
     * Lưu thông tin sinh vào localStorage
     * @param {Object} birthInfo - Thông tin sinh
     */
    saveBirthInfo(birthInfo) {
        try {
            // Thêm timestamp
            const dataToSave = {
                ...birthInfo,
                timestamp: new Date().toISOString(),
                id: this.generateId()
            };
            
            // Lấy danh sách cũ
            let savedBirthInfos = this.getSavedBirthInfos();
            
            // Thêm mới vào đầu danh sách
            savedBirthInfos.unshift(dataToSave);
            
            // Giữ tối đa 10 bản ghi
            if (savedBirthInfos.length > 10) {
                savedBirthInfos = savedBirthInfos.slice(0, 10);
            }
            
            // Lưu vào localStorage
            localStorage.setItem('tuvi_birth_infos', JSON.stringify(savedBirthInfos));
            
            console.log('Đã lưu thông tin sinh:', dataToSave);
            return dataToSave;
            
        } catch (error) {
            console.error('Lỗi khi lưu thông tin sinh:', error);
            throw error;
        }
    }

    /**
     * Lấy danh sách thông tin sinh đã lưu
     * @returns {Array} Danh sách thông tin sinh
     */
    getSavedBirthInfos() {
        try {
            const saved = localStorage.getItem('tuvi_birth_infos');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Lỗi khi lấy thông tin sinh:', error);
            return [];
        }
    }

    /**
     * Lấy thông tin sinh theo ID
     * @param {string} id - ID của thông tin sinh
     * @returns {Object|null} Thông tin sinh hoặc null
     */
    getBirthInfoById(id) {
        const savedInfos = this.getSavedBirthInfos();
        return savedInfos.find(info => info.id === id) || null;
    }

    /**
     * Tạo ID duy nhất
     * @returns {string} ID duy nhất
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Chuẩn bị prompt cho Gemini
     * @param {Object} birthInfo - Thông tin sinh
     * @returns {string} Prompt đã được format
     */
    preparePrompt(birthInfo) {
        const { fullName, gender, birthDate, birthTime, birthplace } = birthInfo;
        
        // Xác định âm dương
        const amDuong = gender === 'Nam' ? 'Dương' : 'Âm';
        
        // Format ngày sinh
        const formattedDate = this.formatDate(birthDate);
        
        // Thay thế các placeholder trong template
        return this.PROMPT_TEMPLATE
            .replace(/{fullName}/g, fullName)
            .replace(/{gender}/g, gender)
            .replace(/{birthDate}/g, formattedDate)
            .replace(/{birthTime}/g, birthTime)
            .replace(/{birthplace}/g, birthplace || 'Không xác định')
            .replace(/{amDuong}/g, amDuong);
    }

    /**
     * Format ngày sinh
     * @param {string} dateString - Chuỗi ngày
     * @returns {string} Ngày đã format
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    /**
     * Gọi Gemini Pro API và lưu kết quả markdown vào localStorage
     * @param {Object} birthInfo - Thông tin sinh nhật
     * @param {string} apiKey - Gemini Pro API key (tùy chọn, sẽ dùng key manager nếu không có)
     * @returns {Promise<Object>} - Kết quả API call
     */
    async callGeminiAPI(birthInfo, apiKey = null) {
        try {
            const prompt = this.preparePrompt(birthInfo);
            
            // Sử dụng ModelManager để gọi API với auto-retry
            const result = await this.modelManager.callAPIWithRetry(prompt);
            
            if (result.success) {
                // Lưu kết quả markdown vào localStorage
                localStorage.setItem('current_tuvi_result', result.text);
                
                return {
                    success: true,
                    markdown: result.text,
                    usedKey: result.usedKey || 'ModelManager',
                    usedModel: result.usedModel || result.model
                };
            } else {
                return {
                    success: false,
                    error: result.error,
                    attempts: result.attempts
                };
            }
        } catch (error) {
            console.error('Lỗi trong TuViGeminiService.callGeminiAPI:', error);
            return {
                success: false,
                error: error.message,
                attempts: 1
            };
        }
    }

    // Fallback method sử dụng key manager cũ (để backward compatibility)
    async callGeminiAPILegacy(birthInfo, apiKey = null) {
        let currentKey = apiKey;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            try {
                // Sử dụng key được cung cấp hoặc lấy từ key manager
                if (!currentKey) {
                    currentKey = this.keyManager.getLeastUsedKey();
                }
                
                const prompt = this.preparePrompt(birthInfo);
                
                const requestBody = {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                                    generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 32768, // Gemini 2.5 Pro hỗ trợ lên đến 65,536 tokens
                }
                };
                
                // Tạo AbortController để quản lý timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 giây timeout cho tử vi (phức tạp hơn)
                
                const response = await fetch(`${this.API_URL}?key=${currentKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
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
                
                // Ghi nhận việc sử dụng key thành công
                this.keyManager.recordUsage(currentKey, true);
                
                // Lưu kết quả markdown vào localStorage
                localStorage.setItem('current_tuvi_result', generatedText);
                
                return {
                    success: true,
                    markdown: generatedText,
                    usedKey: this.keyManager.getKeyId(currentKey)
                };
                
            } catch (error) {
                // Xử lý lỗi timeout riêng cho tử vi
                if (error.name === 'AbortError') {
                    console.error(`⏰ Timeout với API key ${this.keyManager.getKeyId(currentKey)} (90s) - Prompt tử vi quá phức tạp`);
                } else {
                    console.error(`❌ API call error (attempt ${attempts + 1}):`, error);
                }
                
                // Ghi nhận lỗi
                if (currentKey) {
                    this.keyManager.recordUsage(currentKey, false);
                }
                
                attempts++;
                
                // Nếu không phải lần thử cuối, thử key khác
                if (attempts < maxAttempts && !apiKey) {
                    currentKey = this.keyManager.getNextKey();
                    console.log(`Thử lại với key khác (${this.keyManager.getKeyId(currentKey)})...`);
                    continue;
                }
                
                // Lần thử cuối hoặc dùng key cố định
                return {
                    success: false,
                    error: error.message,
                    attempts: attempts
                };
            }
        }
        
        return {
            success: false,
            error: 'Đã thử tất cả key có sẵn nhưng không thành công',
            attempts: attempts
        };
    }

    /**
     * Xử lý toàn bộ quy trình: lưu thông tin + gọi Gemini
     * @param {Object} birthInfo - Thông tin sinh
     * @returns {Promise<Object>} Kết quả hoàn chỉnh
     */
    async processBirthInfo(birthInfo) {
        try {
            // 1. Lưu thông tin sinh
            const savedInfo = this.saveBirthInfo(birthInfo);
            
            // 2. Chuẩn bị prompt
            const prompt = this.preparePrompt(birthInfo);
            
            // 3. Gọi Gemini API
            const geminiResult = await this.callGeminiAPI(birthInfo, this.API_KEY); // Pass this.API_KEY
            
            // 4. Trả về kết quả
            return {
                success: true,
                birthInfo: savedInfo,
                prompt: prompt,
                geminiResult: geminiResult,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Lỗi trong quy trình xử lý:', error);
            return {
                success: false,
                error: error.message,
                birthInfo: birthInfo
            };
        }
    }

    /**
     * Parse kết quả từ Gemini thành object có cấu trúc
     * @param {string} geminiText - Text từ Gemini
     * @returns {Object} Object đã được parse
     */
    parseGeminiResult(geminiText) {
        try {
            const result = {};
            const lines = geminiText.split('\n');
            
            let currentSection = '';
            
            // Map tên cung từ lowercase sang uppercase
            const palaceNameMap = {
                'mệnh': 'MỆNH',
                'phụ mẫu': 'PHỤ MẪU',
                'phúc đức': 'PHÚC ĐỨC',
                'điền trạch': 'ĐIỀN TRẠCH',
                'quan lộc': 'QUAN LỘC',
                'nô bộc': 'NÔ BỘC',
                'thiên di': 'THIÊN DI',
                'tật ách': 'TẬT ÁCH',
                'tài bạch': 'TÀI BẠCH',
                'tử tức': 'TỬ TỨC',
                'thê thiếp': 'THÊ THIẾP',
                'huynh đệ': 'HUYNH ĐỆ'
            };
            
            // Map keys từ snake_case sang camelCase
            const keyMap = {
                'ho_ten': 'hoTen',
                'gioi_tinh': 'gioiTinh',
                'duong_lich': 'duongLich',
                'am_lich': 'amLich',
                'noi_sinh': 'noiSinh',
                'ban_menh': 'banMenh',
                'cuc': 'cuc',
                'am_duong': 'amDuong',
                'chu_menh': 'chuMenh',
                'chu_than': 'chuThan',
                'dia_chi': 'diaChi',
                'chinh_tinh': 'chinhTinh',
                'phu_tinh_tot': 'phuTinhTot',
                'phu_tinh_xau': 'phuTinhXau',
                'phu_tinh_trung_binh': 'phuTinhTrungBinh',
                'vong_trang_sinh': 'vongTrangSinh',
                'is_than': 'than'
            };
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                
                if (trimmedLine.startsWith('##')) {
                    // Section header
                    const sectionName = trimmedLine.replace('##', '').trim().toLowerCase();
                    const mappedSectionName = palaceNameMap[sectionName] || sectionName;
                    currentSection = mappedSectionName;
                    
                    if (palaceNameMap[sectionName]) {
                        // Đây là một cung tử vi
                        if (!result.cungTuVi) {
                            result.cungTuVi = {};
                        }
                        result.cungTuVi[mappedSectionName] = {};
                    } else {
                        // Đây là section khác
                        result[mappedSectionName] = {};
                    }
                } else if (trimmedLine.includes(':')) {
                    // Key-value pair
                    const [key, ...valueParts] = trimmedLine.split(':');
                    const originalKey = key.trim();
                    const value = valueParts.join(':').trim();
                    const mappedKey = keyMap[originalKey] || originalKey;
                    
                    if (currentSection && palaceNameMap[currentSection.toLowerCase()]) {
                        // Trong cung tử vi
                        if (!result.cungTuVi) {
                            result.cungTuVi = {};
                        }
                        if (!result.cungTuVi[currentSection]) {
                            result.cungTuVi[currentSection] = {};
                        }
                        result.cungTuVi[currentSection][mappedKey] = value;
                    } else if (currentSection) {
                        // Trong section khác
                        if (!result[currentSection]) {
                            result[currentSection] = {};
                        }
                        result[currentSection][mappedKey] = value;
                    } else {
                        // Ở ngoài section
                        result[mappedKey] = value;
                    }
                }
            }
            
            // Chuyển đổi các giá trị cơ bản sang camelCase
            const basicInfoMap = {
                'hoTen': result.hoTen || result.ho_ten,
                'gioiTinh': result.gioiTinh || result.gioi_tinh,
                'duongLich': result.duongLich || result.duong_lich,
                'amLich': result.amLich || result.am_lich,
                'noiSinh': result.noiSinh || result.noi_sinh,
                'banMenh': result.banMenh || result.ban_menh,
                'cuc': result.cuc,
                'amDuong': result.amDuong || result.am_duong,
                'chuMenh': result.chuMenh || result.chu_menh,
                'chuThan': result.chuThan || result.chu_than
            };
            
            // Tạo kết quả cuối cùng
            const finalResult = {
                ...basicInfoMap,
                cungTuVi: result.cungTuVi || {}
            };
            
            // Thêm chú giải nếu có
            if (result.chu_giai || result.chuGiai) {
                finalResult.chuGiai = result.chu_giai || result.chuGiai;
            }
            
            return finalResult;
            
        } catch (error) {
            console.error('Lỗi khi parse kết quả Gemini:', error);
            return { rawText: geminiText };
        }
    }

    /**
     * Xóa thông tin sinh theo ID
     * @param {string} id - ID cần xóa
     * @returns {boolean} True nếu xóa thành công
     */
    deleteBirthInfo(id) {
        try {
            let savedInfos = this.getSavedBirthInfos();
            const initialLength = savedInfos.length;
            
            savedInfos = savedInfos.filter(info => info.id !== id);
            
            if (savedInfos.length !== initialLength) {
                localStorage.setItem('tuvi_birth_infos', JSON.stringify(savedInfos));
                console.log(`Đã xóa thông tin sinh với ID: ${id}`);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Lỗi khi xóa thông tin sinh:', error);
            return false;
        }
    }

    /**
     * Xóa tất cả thông tin sinh đã lưu
     * @returns {boolean} True nếu xóa thành công
     */
    clearAllBirthInfos() {
        try {
            localStorage.removeItem('tuvi_birth_infos');
            console.log('Đã xóa tất cả thông tin sinh');
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa tất cả thông tin sinh:', error);
            return false;
        }
    }

    /**
     * Lấy kết quả markdown từ localStorage
     * @returns {string|null} - Nội dung markdown hoặc null nếu không có
     */
    getMarkdownResult() {
        return localStorage.getItem('current_tuvi_result');
    }

    /**
     * Xóa kết quả markdown từ localStorage
     */
    clearMarkdownResult() {
        localStorage.removeItem('current_tuvi_result');
    }
}

// Export để sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TuViGeminiService;
} else if (typeof window !== 'undefined') {
    window.TuViGeminiService = TuViGeminiService;
}

// KHÔNG tạo instance ngay lập tức - để tránh lỗi dependencies
// Instance sẽ được tạo khi cần thiết trong TuViProcessor
