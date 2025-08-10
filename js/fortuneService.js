// FortuneService - Service xem tử vi ngày
class FortuneService {
    constructor() {
        this.llmService = window.llmService;
    }

    // Xem tử vi ngày được chọn
    async checkDailyFortune() {
        if (!userDataService.getCurrentData()) {
            alert('❌ Vui lòng tạo lá số tử vi trước!');
            return;
        }

        const fortuneDateDisplay = document.getElementById('fortune_date_display');
        let selectedDate = userDataService.parseDateFromDDMMYYYY(fortuneDateDisplay.value);

        if (!selectedDate) {
            alert('Ngày xem không hợp lệ. Vui lòng nhập theo định dạng dd/mm/yyyy.');
            return;
        }

        // Hiển thị loading
        uiService.showLoading();

        try {
            // Gọi LLM để xem tử vi ngày
            const fortuneResult = await this.getDailyFortuneFromLLM(selectedDate);
            
            // Hiển thị kết quả
            this.displayFortuneResult(selectedDate, fortuneResult);
            
        } catch (error) {
            console.error('Lỗi khi xem tử vi ngày:', error);
            // Fallback về kết quả mẫu
            this.displaySampleFortuneResult(selectedDate);
        } finally {
            uiService.hideLoading();
        }
    }

    // Xem tử vi ngày hôm nay
    checkDailyFortuneToday() {
        const today = new Date();
        document.getElementById('fortune_date_display').value = userDataService.formatDateToDDMMYYYY(today);
        this.checkDailyFortune();
    }

    // Gọi LLM để xem tử vi ngày
    async getDailyFortuneFromLLM(date) {
        if (!this.llmService) {
            throw new Error('LLM Service chưa sẵn sàng');
        }

        const dateStr = userDataService.formatDateToDDMMYYYY(date);
        const canChi = userDataService.calculateCanChi(date);
        const lunar = userDataService.calculateLunarDate(date);
        
        const prompt = `Bạn là chuyên gia tử vi học Việt Nam. Hãy xem tử vi cho ngày ${dateStr} (${lunar.displayText}, Can Chi: ${canChi.fullCanChi}).

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

        try {
            const result = await this.llmService.generateContent(prompt);
            return JSON.parse(result);
        } catch (error) {
            console.error('Lỗi LLM:', error);
            throw error;
        }
    }

    // Hiển thị kết quả tử vi từ LLM
    displayFortuneResult(date, fortuneData) {
        const dateInfo = userDataService.calculateLunarDateInfo(date);
        
        document.getElementById('fortuneResult').style.display = 'block';
        document.getElementById('fortuneContent').innerHTML = `
            <h3>🔮 Kết Quả Xem Ngày ${dateInfo.dateStr}</h3>
            <p><strong>Ngày xem:</strong> ${dateInfo.dateStr}</p>
            <p><strong>Âm lịch:</strong> ${dateInfo.lunarDate}</p>
            <p><strong>Can Chi:</strong> ${dateInfo.canChi}</p>
            <p><strong>Tổng quan:</strong> ${fortuneData.tongQuan}</p>
            <p><strong>Mức độ:</strong> ${fortuneData.diem}/10</p>
            <p><strong>Việc nên làm:</strong> ${fortuneData.nenLam.join(', ')}</p>
            <p><strong>Việc nên tránh:</strong> ${fortuneData.nenTranh.join(', ')}</p>
            <p><strong>Lời khuyên:</strong> ${fortuneData.loiKhuyen}</p>
        `;
    }

    // Hiển thị kết quả tử vi mẫu (fallback)
    displaySampleFortuneResult(date) {
        const dateInfo = userDataService.calculateLunarDateInfo(date);
        
        document.getElementById('fortuneResult').style.display = 'block';
        document.getElementById('fortuneContent').innerHTML = `
            <h3>🔮 Kết Quả Xem Ngày ${dateInfo.dateStr}</h3>
            <p><strong>Ngày xem:</strong> ${dateInfo.dateStr}</p>
            <p><strong>Âm lịch:</strong> ${dateInfo.lunarDate}</p>
            <p><strong>Can Chi:</strong> ${dateInfo.canChi}</p>
            <p><strong>Tổng quan:</strong> Ngày này khá tốt cho việc học tập và giao tiếp.</p>
            <p><strong>Mức độ:</strong> 7/10</p>
            <p><strong>Việc nên làm:</strong> Học tập, giao tiếp, ký kết hợp đồng</p>
            <p><strong>Việc nên tránh:</strong> Đi xa, đầu tư lớn</p>
            <p><strong>Lời khuyên:</strong> Nên tập trung vào việc học tập và giao tiếp trong ngày hôm nay.</p>
        `;
    }

    // Tính toán thông tin ngày (helper method)
    calculateLunarDateInfo(date) {
        const canChi = userDataService.calculateCanChi(date);
        const lunar = userDataService.calculateLunarDate(date);
        
        return {
            dateStr: userDataService.formatDateToDDMMYYYY(date),
            lunarDate: lunar.displayText,
            canChi: `Can Chi: ${canChi.fullCanChi}`
        };
    }
}

// Tạo instance global
const fortuneService = new FortuneService();
