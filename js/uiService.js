// UIService - Service quản lý giao diện và hiển thị
class UIService {
    constructor() {
        this.initializeEventListeners();
    }

    // Khởi tạo event listeners
    initializeEventListeners() {
        // Form submit
        const lasoForm = document.getElementById('lasoForm');
        if (lasoForm) {
            lasoForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    // Xử lý form submit
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            dobDisplay: document.getElementById('dob_display').value,
            time: document.getElementById('time').value,
            gender: document.getElementById('gender').value,
            birthPlace: document.getElementById('birthPlace').value
        };

        // Gọi service xử lý
        await lasoService.handleFormSubmit(formData);
    }

    // Hiển thị màn hình chào mừng
    showWelcomeScreen() {
        const today = new Date();
        const todayInfo = userDataService.getTodayInfo();
        
        // Cập nhật thông tin ngày hôm nay
        document.getElementById('todayDate').textContent = `Dương lịch: ${todayInfo.solarDate}`;
        document.getElementById('todayLunar').textContent = todayInfo.lunarDate;
        document.getElementById('todayCanChi').textContent = todayInfo.canChi;
        
        // Cập nhật thông tin người dùng nếu có
        const userData = userDataService.getUserData();
        if (userData) {
            document.getElementById('userInfo').innerHTML = `
                <h3>Xin chào ${userData.name}!</h3>
                <p>Ngày sinh: ${userDataService.formatDateToDDMMYYYY(userData.dob)} ${userData.time}</p>
                <p>Nơi sinh: ${userData.birthPlace}</p>
            `;
        }
        
        // Hiển thị các section
        this.showSection('welcome');
    }

    // Hiển thị form
    showForm() {
        this.showSection('form');
    }

    // Hiển thị kết quả
    showResult() {
        this.showSection('result');
    }

    // Hiển thị loading
    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    // Ẩn loading
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    // Hiển thị section cụ thể
    showSection(sectionId) {
        const sections = ['welcome', 'form', 'result', 'fortuneResult', 'loading'];
        
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = id === sectionId ? 'block' : 'none';
            }
        });
    }

    // Log function
    log(message, type = 'info') {
        const logDiv = document.getElementById('log');
        if (!logDiv) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}\n`;
        
        logDiv.textContent += logEntry;
        logDiv.style.display = 'block';
        logDiv.scrollTop = logDiv.scrollHeight;
        
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    // Hiển thị thông báo
    showNotification(message, type = 'info') {
        // Tạo notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        // CSS cho các loại notification
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;

        // Thêm vào body
        document.body.appendChild(notification);

        // Tự động xóa sau 3 giây
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Hiển thị modal
    showModal(title, content, buttons = []) {
        // Tạo modal element
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // Title
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        titleElement.style.marginTop = '0';
        modalContent.appendChild(titleElement);

        // Content
        const contentElement = document.createElement('div');
        contentElement.innerHTML = content;
        modalContent.appendChild(contentElement);

        // Buttons
        if (buttons.length > 0) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 20px;
            `;

            buttons.forEach(button => {
                const btn = document.createElement('button');
                btn.textContent = button.text;
                btn.onclick = button.onClick;
                btn.style.cssText = `
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    background: ${button.primary ? '#667eea' : '#6c757d'};
                    color: white;
                `;
                buttonContainer.appendChild(btn);
            });

            modalContent.appendChild(buttonContainer);
        }

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        `;
        closeBtn.onclick = () => this.closeModal(modal);
        modalContent.style.position = 'relative';
        modalContent.appendChild(closeBtn);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close khi click outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        };

        return modal;
    }

    // Đóng modal
    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    // Cập nhật thông tin người dùng trên giao diện
    updateUserInfo() {
        const userData = userDataService.getUserData();
        const userInfoDiv = document.getElementById('userInfo');
        
        if (userData && userInfoDiv) {
            userInfoDiv.innerHTML = `
                <h3>Xin chào ${userData.name}!</h3>
                <p>Ngày sinh: ${userDataService.formatDateToDDMMYYYY(userData.dob)} ${userData.time}</p>
                <p>Nơi sinh: ${userData.birthPlace}</p>
            `;
        }
    }

    // Cập nhật thông tin ngày hôm nay
    updateTodayInfo() {
        const todayInfo = userDataService.getTodayInfo();
        
        const todayDateDiv = document.getElementById('todayDate');
        const todayLunarDiv = document.getElementById('todayLunar');
        const todayCanChiDiv = document.getElementById('todayCanChi');
        
        if (todayDateDiv) todayDateDiv.textContent = `Dương lịch: ${todayInfo.solarDate}`;
        if (todayLunarDiv) todayLunarDiv.textContent = todayInfo.lunarDate;
        if (todayCanChiDiv) todayCanChiDiv.textContent = todayInfo.canChi;
    }

    // Reset form
    resetForm() {
        const form = document.getElementById('lasoForm');
        if (form) {
            form.reset();
        }
    }

    // Hiển thị lỗi
    showError(message) {
        this.showNotification(message, 'error');
        this.log(`❌ ${message}`, 'error');
    }

    // Hiển thị thành công
    showSuccess(message) {
        this.showNotification(message, 'success');
        this.log(`✅ ${message}`, 'success');
    }

    // Hiển thị cảnh báo
    showWarning(message) {
        this.showNotification(message, 'warning');
        this.log(`⚠️ ${message}`, 'warning');
    }

    // Hiển thị thông tin
    showInfo(message) {
        this.showNotification(message, 'info');
        this.log(`ℹ️ ${message}`, 'info');
    }
}

// Tạo instance global
const uiService = new UIService();
window.uiService = uiService; // Để các service khác có thể truy cập
