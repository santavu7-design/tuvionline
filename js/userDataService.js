// UserDataService - Service xử lý dữ liệu người dùng
class UserDataService {
    constructor() {
        this.storageKeys = {
            userData: 'laso_user_data',
            chartData: 'laso_chart_data',
            markdownData: 'laso_markdown_data'
        };
    }

    // Lưu dữ liệu người dùng
    saveUserData(userData) {
        try {
            localStorage.setItem(this.storageKeys.userData, JSON.stringify(userData));
            console.log('💾 Đã lưu dữ liệu người dùng:', userData);
            return true;
        } catch (error) {
            console.error('❌ Lỗi khi lưu dữ liệu người dùng:', error);
            return false;
        }
    }

    // Lưu dữ liệu lá số
    saveChartData(chartData) {
        try {
            localStorage.setItem(this.storageKeys.chartData, JSON.stringify(chartData));
            console.log('💾 Đã lưu dữ liệu lá số:', chartData);
            return true;
        } catch (error) {
            console.error('❌ Lỗi khi lưu dữ liệu lá số:', error);
            return false;
        }
    }

    // Lưu dữ liệu markdown
    saveMarkdownData(markdownData) {
        try {
            localStorage.setItem(this.storageKeys.markdownData, markdownData);
            console.log('💾 Đã lưu dữ liệu markdown');
            return true;
        } catch (error) {
            console.error('❌ Lỗi khi lưu dữ liệu markdown:', error);
            return false;
        }
    }

    // Lưu tất cả dữ liệu
    saveAllData(userData, chartData, markdownData) {
        const userSaved = this.saveUserData(userData);
        const chartSaved = this.saveChartData(chartData);
        const markdownSaved = this.saveMarkdownData(markdownData);
        
        return userSaved && chartSaved && markdownSaved;
    }

    // Tải dữ liệu người dùng
    loadUserData() {
        try {
            const data = localStorage.getItem(this.storageKeys.userData);
            if (data) {
                const userData = JSON.parse(data);
                console.log('📂 Đã tải dữ liệu người dùng:', userData);
                return userData;
            }
            return null;
        } catch (error) {
            console.error('❌ Lỗi khi tải dữ liệu người dùng:', error);
            return null;
        }
    }

    // Tải dữ liệu lá số
    loadChartData() {
        try {
            const data = localStorage.getItem(this.storageKeys.chartData);
            if (data) {
                const chartData = JSON.parse(data);
                console.log('📂 Đã tải dữ liệu lá số:', chartData);
                return chartData;
            }
            return null;
        } catch (error) {
            console.error('❌ Lỗi khi tải dữ liệu lá số:', error);
            return null;
        }
    }

    // Tải dữ liệu markdown
    loadMarkdownData() {
        try {
            const data = localStorage.getItem(this.storageKeys.markdownData);
            if (data) {
                console.log('📂 Đã tải dữ liệu markdown');
                return data;
            }
            return null;
        } catch (error) {
            console.error('❌ Lỗi khi tải dữ liệu markdown:', error);
            return null;
        }
    }

    // Tải tất cả dữ liệu
    loadAllData() {
        const userData = this.loadUserData();
        const chartData = this.loadChartData();
        const markdownData = this.loadMarkdownData();
        
        return {
            userData,
            chartData,
            markdownData,
            hasData: !!(userData && chartData && markdownData)
        };
    }

    // Kiểm tra xem có dữ liệu đã lưu không
    hasSavedData() {
        return this.loadAllData().hasData;
    }

    // Xóa tất cả dữ liệu
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKeys.userData);
            localStorage.removeItem(this.storageKeys.chartData);
            localStorage.removeItem(this.storageKeys.markdownData);
            console.log('🗑️ Đã xóa tất cả dữ liệu');
            return true;
        } catch (error) {
            console.error('❌ Lỗi khi xóa dữ liệu:', error);
            return false;
        }
    }

    // Xóa dữ liệu cụ thể
    clearData(type) {
        try {
            if (this.storageKeys[type]) {
                localStorage.removeItem(this.storageKeys[type]);
                console.log(`🗑️ Đã xóa dữ liệu ${type}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`❌ Lỗi khi xóa dữ liệu ${type}:`, error);
            return false;
        }
    }

    // Lấy thông tin về dữ liệu đã lưu
    getStorageInfo() {
        const info = {};
        for (const [key, storageKey] of Object.entries(this.storageKeys)) {
            try {
                const data = localStorage.getItem(storageKey);
                info[key] = {
                    exists: !!data,
                    size: data ? new Blob([data]).size : 0,
                    lastModified: data ? new Date().toISOString() : null
                };
            } catch (error) {
                info[key] = {
                    exists: false,
                    size: 0,
                    lastModified: null,
                    error: error.message
                };
            }
        }
        return info;
    }

    // Xuất dữ liệu ra file
    exportData(filename = null) {
        try {
            const allData = this.loadAllData();
            if (!allData.hasData) {
                throw new Error('Không có dữ liệu để xuất');
            }

            const exportData = {
                exportDate: new Date().toISOString(),
                version: '1.0',
                ...allData
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || `laso_tuvi_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('📤 Đã xuất dữ liệu thành công');
            return true;
        } catch (error) {
            console.error('❌ Lỗi khi xuất dữ liệu:', error);
            return false;
        }
    }

    // Nhập dữ liệu từ file
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate dữ liệu
                    if (!data.userData || !data.chartData || !data.markdownData) {
                        throw new Error('Dữ liệu không đúng định dạng');
                    }

                    // Lưu dữ liệu
                    const saved = this.saveAllData(data.userData, data.chartData, data.markdownData);
                    
                    if (saved) {
                        console.log('📥 Đã nhập dữ liệu thành công');
                        resolve(data);
                    } else {
                        reject(new Error('Không thể lưu dữ liệu đã nhập'));
                    }
                } catch (error) {
                    reject(new Error(`Lỗi khi xử lý file: ${error.message}`));
                }
            };

            reader.onerror = () => {
                reject(new Error('Không thể đọc file'));
            };

            reader.readAsText(file);
        });
    }

    // Tạo dữ liệu mẫu
    createSampleData() {
        const sampleUserData = {
            name: 'Nguyễn Văn A',
            gender: 'Nam',
            birthdate: '15/06/90',
            birthtime: 'Tý (23:00-01:00)',
            birthplace: 'Hà Nội'
        };

        const sampleChartData = {
            ho_ten: 'Nguyễn Văn A',
            gioi_tinh: 'Nam',
            duong_lich: '15/06/1990 Tý (23:00-01:00)',
            am_lich: '23/05/Canh Ngọ',
            noi_sinh: 'Hà Nội',
            ban_menh: 'Thổ',
            cuc: 'Thủy Nhị Cục',
            am_duong: 'Dương',
            chu_menh: 'Canh',
            chu_than: 'Ngọ',
            cung: {
                'MỆNH': {
                    dia_chi: 'Tý',
                    chinh_tinh: 'Tử Vi (Đ)',
                    phu_tinh_tot: 'Thiên Phúc, Thiên Quan',
                    phu_tinh_xau: 'Thiên Hình',
                    phu_tinh_trung_binh: 'Thiên Không, Địa Kiếp',
                    vong_trang_sinh: 'Trường Sinh',
                    is_than: 'true'
                }
            },
            chu_giai: [
                {
                    title: 'Tử Vi',
                    content: 'Tử Vi là chủ tinh của mệnh, đại diện cho quyền lực, danh vọng và sự thành công.'
                }
            ]
        };

        const sampleMarkdownData = `ho_ten: Nguyễn Văn A
gioi_tinh: Nam
duong_lich: 15/06/1990 Tý (23:00-01:00)
am_lich: 23/05/Canh Ngọ
noi_sinh: Hà Nội
ban_menh: Thổ
cuc: Thủy Nhị Cục
am_duong: Dương
chu_menh: Canh
chu_than: Ngọ

## MỆNH
dia_chi: Tý
chinh_tinh: Tử Vi (Đ)
phu_tinh_tot: Thiên Phúc, Thiên Quan
phu_tinh_xau: Thiên Hình
phu_tinh_trung_binh: Thiên Không, Địa Kiếp
vong_trang_sinh: Trường Sinh
is_than: true

## CHU_GIAI
- title: Tử Vi
content: Tử Vi là chủ tinh của mệnh, đại diện cho quyền lực, danh vọng và sự thành công.`;

        return {
            userData: sampleUserData,
            chartData: sampleChartData,
            markdownData: sampleMarkdownData
        };
    }

    // Validate dữ liệu người dùng
    validateUserData(userData) {
        const errors = [];

        if (!userData.name || userData.name.trim().length < 2) {
            errors.push('Tên phải có ít nhất 2 ký tự');
        }

        if (!userData.gender || !['Nam', 'Nữ'].includes(userData.gender)) {
            errors.push('Giới tính không hợp lệ');
        }

        if (!userData.birthdate || !this.validateDateFormat(userData.birthdate)) {
            errors.push('Định dạng ngày sinh không hợp lệ (dd/mm/yy)');
        }

        if (!userData.birthtime) {
            errors.push('Vui lòng chọn giờ sinh');
        }

        if (!userData.birthplace || userData.birthplace.trim().length < 2) {
            errors.push('Nơi sinh phải có ít nhất 2 ký tự');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Validate định dạng ngày
    validateDateFormat(dateString) {
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/;
        const match = dateString.match(dateRegex);
        
        if (!match) return false;
        
        const day = parseInt(match[1]);
        const month = parseInt(match[2]);
        const year = parseInt(match[3]);
        
        if (day < 1 || day > 31) return false;
        if (month < 1 || month > 12) return false;
        if (year < 0 || year > 99) return false;
        
        return true;
    }

    // Chuyển đổi định dạng ngày từ dd/mm/yy sang dd/mm/yy
    convertDateFormat(dateString) {
        if (!this.validateDateFormat(dateString)) {
            return null;
        }
        return dateString; // Giữ nguyên định dạng dd/mm/yy
    }
}

// Tạo instance global
window.userDataService = new UserDataService();
