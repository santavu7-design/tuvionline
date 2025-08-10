// LasoService - Service quản lý lá số tử vi
class LasoService {
    constructor() {
        this.llmService = window.llmService;
    }

    // Hiển thị lá số của tôi
    showMyLaso() {
        const currentData = userDataService.getCurrentData();
        if (!currentData) {
            alert('Chưa có lá số tử vi. Vui lòng tạo lá số trước!');
            return;
        }
        
        uiService.showResult();
        this.displayLasoData(currentData.rawMarkdown);
    }

    // Tạo lá số tử vi mới
    async generateLaso(userData) {
        uiService.showLoading();
        uiService.log('🔮 Bắt đầu tạo lá số tử vi...', 'info');
        uiService.log('🔍 Yêu cầu LLM kiểm tra thật kỹ từng chi tiết...', 'info');

        try {
            const result = await this.generateLasoWithLLM(userData);
            
            const data = {
                rawMarkdown: result,
                userData: userData,
                createdAt: new Date().toISOString()
            };
            
            userDataService.saveCurrentData(data);
            userDataService.saveUserData(userData);
            
            uiService.hideLoading();
            uiService.showWelcomeScreen();
            uiService.log('✅ Đã tạo lá số tử vi thành công!', 'success');
            alert('✅ Đã tạo lá số tử vi thành công!');
            
            return result;
        } catch (error) {
            uiService.hideLoading();
            uiService.log(`❌ Lỗi: ${error.message}`, 'error');
            alert(`❌ Lỗi: ${error.message}`);
            throw error;
        }
    }

    // Tạo lá số với LLM
    async generateLasoWithLLM(userData) {
        if (!this.llmService) {
            throw new Error('LLM Service chưa sẵn sàng');
        }

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

        try {
            const result = await this.llmService.generateContent(prompt);
            return result;
        } catch (error) {
            console.error('Lỗi LLM:', error);
            throw error;
        }
    }

    // Tạo dữ liệu giả (mock data)
    generateMockData() {
        try {
            const userData = {
                name: document.getElementById('name').value,
                gender: document.getElementById('gender').value,
                dob: userDataService.parseDateFromDDMMYYYY(document.getElementById('dob_display').value),
                time: document.getElementById('time').value,
                birthPlace: document.getElementById('birthPlace').value
            };

            const mockData = userDataService.generateSampleLasoData(userData);

            const data = {
                rawMarkdown: mockData,
                userData: userData,
                createdAt: new Date().toISOString()
            };

            userDataService.saveCurrentData(data);
            userDataService.saveUserData(userData);

            uiService.showWelcomeScreen();
            uiService.log('✅ Đã tạo dữ liệu giả thành công!', 'success');
            alert('✅ Đã tạo dữ liệu giả thành công!');
        } catch (error) {
            uiService.log(`❌ Lỗi: ${error.message}`, 'error');
            alert(`❌ Lỗi: ${error.message}`);
        }
    }

    // Hiển thị dữ liệu lá số
    displayLasoData(markdownData) {
        const lines = markdownData.split('\n');
        let html = '<h2>📊 Lá Số Tử Vi</h2>';
        
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('##')) {
                html += `<h3>${line.substring(2).trim()}</h3>`;
            } else if (line.includes(':')) {
                const [key, value] = line.split(':', 2);
                if (key && value) {
                    html += `<p><strong>${key.trim()}:</strong> ${value.trim()}</p>`;
                }
            }
        }
        
        document.getElementById('content').innerHTML = html;
    }

    // Xử lý form submit
    async handleFormSubmit(formData) {
        const userData = {
            name: formData.name.trim(),
            dob: userDataService.parseDateFromDDMMYYYY(formData.dobDisplay),
            time: formData.time.trim(),
            gender: formData.gender,
            birthPlace: formData.birthPlace.trim()
        };

        if (!userData.name || !userData.dob || !userData.time || !userData.gender || !userData.birthPlace) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            await this.generateLaso(userData);
        } catch (error) {
            console.error('Lỗi khi tạo lá số:', error);
        }
    }
}

// Tạo instance global
const lasoService = new LasoService();
