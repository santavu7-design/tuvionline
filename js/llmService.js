// LLMService - Service gọi sang LLM
class LLMService {
    constructor() {
        this.apiKeys = [
            'AIzaSyAlst5yeNQebSyfxUMRY6yDK7lvwKMUzLM',
            'AIzaSyAxs5Y8I2wBENa3ZaE45iK5jxdvWpn-Pjs'
        ];

        this.models = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro'
        ];

        this.currentKeyIndex = 0;
        this.currentModelIndex = 0;
    }

    // Tạo nội dung với LLM
    async generateContent(prompt, options = {}) {
        const defaultOptions = {
            temperature: 0.3,
            maxOutputTokens: 2000,
            retryCount: 3
        };

        const config = { ...defaultOptions, ...options };
        let lastError = null;

        // Thử với tất cả các model và key
        for (let attempt = 0; attempt < config.retryCount; attempt++) {
            for (const model of this.models) {
                for (let keyIndex = 0; keyIndex < this.apiKeys.length; keyIndex++) {
                    try {
                        const result = await this.callGeminiAPI(model, this.apiKeys[keyIndex], prompt, config);
                        if (result) {
                            this.log(`✅ Thành công với model ${model} - key ${keyIndex + 1}`, 'success');
                            return result;
                        }
                    } catch (error) {
                        lastError = error;
                        this.log(`❌ Lỗi ${model} key ${keyIndex + 1}: ${error.message}`, 'error');
                        
                        // Nếu là lỗi quota, thử key khác
                        if (error.message.includes('quota') || error.message.includes('429')) {
                            continue;
                        }
                    }
                }
            }
            
            // Nếu tất cả đều thất bại, đợi một chút rồi thử lại
            if (attempt < config.retryCount - 1) {
                this.log(`🔄 Thử lại lần ${attempt + 2}...`, 'warning');
                await this.delay(1000 * (attempt + 1)); // Tăng thời gian chờ mỗi lần thử
            }
        }

        throw new Error(`Không thể tạo nội dung sau ${config.retryCount} lần thử. Lỗi cuối: ${lastError?.message || 'Unknown error'}`);
    }

    // Gọi Gemini API
    async callGeminiAPI(model, apiKey, prompt, config) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const requestBody = {
            contents: [{ 
                parts: [{ text: prompt }] 
            }],
            generationConfig: {
                temperature: config.temperature,
                maxOutputTokens: config.maxOutputTokens
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `HTTP ${response.status}`;
            
            try {
                const errorData = JSON.parse(errorText);
                if (errorData.error && errorData.error.message) {
                    errorMessage = errorData.error.message;
                }
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        }
        
        throw new Error('Không nhận được nội dung hợp lệ từ API');
    }

    // Tạo lá số tử vi
    async generateLaso(userData) {
        const dob = userData.dob;
        const day = String(dob.getDate()).padStart(2, '0');
        const month = String(dob.getMonth() + 1).padStart(2, '0');
        const year = dob.getFullYear();
        
        const prompt = `Bạn là một chuyên gia tử vi học Việt Nam với kiến thức sâu rộng về thuật tử vi cổ truyền. Hãy tạo một lá số tử vi chi tiết và huyền bí cho người dùng dựa trên thông tin sau:

Họ và Tên: ${userData.name}
Giới Tính: ${userData.gender}
Ngày Sinh Dương Lịch: ${day}/${month}/${year} ${userData.time}
Nơi Sinh: ${userData.birthPlace}

**YÊU CẦU ĐẶC BIỆT QUAN TRỌNG:**
1. Hãy KIỂM TRA THẬT KỸ từng thông tin trước khi tạo lá số
2. Viết với giọng điệu huyền bí, khoa học tử vi, sử dụng ngôn ngữ trang trọng và chi tiết như một thầy tử vi chuyên nghiệp
3. Mỗi phần tử vi cần được phân tích sâu sắc với các yếu tố phong thủy, âm dương ngũ hành, và các sao chiếu mệnh
4. Đảm bảo tính nhất quán giữa các cung và thông tin cá nhân
5. Kiểm tra lại toàn bộ lá số trước khi trả về kết quả

**LƯU Ý:** Hãy dành thời gian để kiểm tra kỹ lưỡng từng chi tiết, đảm bảo tính chính xác và logic của lá số tử vi.

Hãy trả về CHÍNH XÁC theo định dạng sau, KHÔNG THÊM TEXT GIẢI THÍCH KHÁC:

ho_ten: ${userData.name}
gioi_tinh: ${userData.gender}
duong_lich: ${day}/${month}/${year} ${userData.time}
am_lich: [Tạo ngày âm lịch mô phỏng]
noi_sinh: ${userData.birthPlace}
ban_menh: [Tạo bản mệnh mô phỏng]
cuc: [Tạo cục mô phỏng]
am_duong: ${userData.gender === 'Nam' ? 'Dương' : 'Âm'}
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

## CHÚ GIẢI
content: Dựa trên lá số tử vi của ${userData.name}, sinh ngày ${day}/${month}/${year} ${userData.time} tại ${userData.birthPlace}, đây là phân tích chi tiết về vận mệnh...`;

        return await this.generateContent(prompt, {
            temperature: 0.2, // Thấp hơn để đảm bảo tính nhất quán
            maxOutputTokens: 3000
        });
    }

    // Xem tử vi ngày
    async generateDailyFortune(date, canChi, lunar) {
        const dateStr = this.formatDateToDDMMYYYY(date);
        
        const prompt = `Bạn là chuyên gia tử vi học Việt Nam. Hãy xem tử vi cho ngày ${dateStr} (${lunar}, Can Chi: ${canChi}).

Hãy phân tích:
1. Tổng quan ngày này tốt hay xấu (điểm từ 1-10)
2. Việc nên làm trong ngày
3. Việc nên tránh trong ngày
4. Lời khuyên cụ thể

Trả về theo định dạng JSON:
{
    "tongQuan": "Mô tả tổng quan",
    "diem": 7,
    "nenLam": ["Việc 1", "Việc 2"],
    "nenTranh": ["Việc 1", "Việc 2"],
    "loiKhuyen": "Lời khuyên cụ thể"
}`;

        return await this.generateContent(prompt, {
            temperature: 0.3,
            maxOutputTokens: 1000
        });
    }

    // Helper methods
    formatDateToDDMMYYYY(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    log(message, type = 'info') {
        if (window.uiService && window.uiService.log) {
            window.uiService.log(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Kiểm tra trạng thái API
    async checkAPIStatus() {
        try {
            const result = await this.generateContent('Test', { maxOutputTokens: 10 });
            return result ? 'OK' : 'ERROR';
        } catch (error) {
            return `ERROR: ${error.message}`;
        }
    }
}

// Tạo instance global
const llmService = new LLMService();
window.llmService = llmService; // Để các service khác có thể truy cập
