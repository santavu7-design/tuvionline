# 🎯 Tử Vi Fortune App - Files Chính

## 📁 **Files Còn Lại (Tối Ưu):**

### **🎮 Ứng Dụng Chính:**
- **`laso_tuvi_main.html`** - **File chính** của ứng dụng tử vi (đã cập nhật với Gemini 2.5)

### **🧪 Testing:**
- **`test_2_5_pro_updated.html`** - Test Gemini 2.5 models với prompt đầy đủ và tính token

### **📚 Tài Liệu:**
- **`GEMINI_MODELS_GUIDE.md`** - Hướng dẫn sử dụng Gemini models
- **`sample_laso_data.md`** - Dữ liệu mẫu lá số tử vi

### **📦 Thư Mục:**
- **`TuViFortuneApp/`** - Ứng dụng React Native
- **`PDF-to-TXT-Converter/`** - Công cụ chuyển đổi PDF
- **`src/`** - Source code React Native (screens, services, contexts)
- **`node_modules/`** - Dependencies

## 🚀 **Cách Sử Dụng:**

### **1. Chạy Ứng Dụng Web:**
```bash
# Mở file chính
start laso_tuvi_main.html

# Hoặc test models
start test_2_5_pro_updated.html
```

### **2. Chạy React Native App:**
```bash
cd TuViFortuneApp
npm install
npx react-native run-android
# hoặc
npx react-native run-ios
```

### **3. Chạy PDF Converter:**
```bash
cd PDF-to-TXT-Converter
START_VIETNAMESE_FIX.bat
```

## 🎯 **Models Gemini Được Hỗ Trợ:**

### **✅ Models 2.5 (Mới):**
- `gemini-2.5-pro` - Enhanced thinking, multimodal
- `gemini-2.5-flash` - Adaptive thinking, cost efficient  
- `gemini-2.5-flash-lite` - Most cost-efficient

### **✅ Models 1.5 (Fallback):**
- `gemini-1.5-pro` - High capability
- `gemini-1.5-flash` - Fast and stable

### **✅ Models Cơ Bản:**
- `gemini-pro` - Basic, reliable

## 📊 **Tính Năng Chính:**

1. **🎲 Tạo Lá Số Tử Vi** - Sử dụng Gemini AI
2. **📱 Giao Diện Đẹp** - Responsive design
3. **🔄 Fallback Logic** - Tự động chuyển model
4. **📊 Token Tracking** - Theo dõi sử dụng
5. **💾 Local Storage** - Lưu dữ liệu
6. **📄 PDF Processing** - Chuyển đổi tài liệu

## 🔧 **Cấu Hình API:**

```javascript
const API_KEYS = [
    'AIzaSyAlst5yeNQebSyfxUMRY6yDK7lvwKMUzLM',
    'AIzaSyCnj2qJX2fX2AjGRMLzXI5kFak8-SdTe6Q',
    'AIzaSyAxs5Y8I2wBENa3ZaE45iK5jxdvWpn-Pjs'
];

const GEMINI_MODELS = [
    'gemini-2.5-pro',        // Cao cấp nhất
    'gemini-2.5-flash',      // Cân bằng
    'gemini-2.5-flash-lite', // Tiết kiệm
    'gemini-1.5-pro',        // Fallback 1
    'gemini-1.5-flash',      // Fallback 2
    'gemini-pro'             // Fallback cuối
];
```

## 📝 **Ghi Chú:**

- **File chính:** `laso_tuvi_main.html` (đã cập nhật Gemini 2.5)
- **Test models:** `test_2_5_pro_updated.html`
- **React Native:** Thư mục `TuViFortuneApp/` và `src/`
- **PDF Tool:** Thư mục `PDF-to-TXT-Converter/`

---

**🎉 Dự án đã được dọn dẹp tối ưu - chỉ còn lại những file thực sự cần thiết!**
