# 🚀 Gemini Models Guide - Tên Models Chính Xác

## 📋 Danh Sách Models Hiện Có (Đã Xác Nhận)

### ✅ **Models Hoạt Động - Gemini 2.5 (Mới):**
```javascript
const GEMINI_2_5_MODELS = [
    'gemini-2.5-pro',        // ✅ Enhanced thinking và reasoning, multimodal
    'gemini-2.5-flash',      // ✅ Adaptive thinking, cost efficiency
    'gemini-2.5-flash-lite'  // ✅ Most cost-efficient, high throughput
];
```

### ✅ **Models Hoạt Động - Gemini 1.5:**
```javascript
const GEMINI_1_5_MODELS = [
    'gemini-1.5-pro',    // ✅ Model cao cấp, khả năng cao
    'gemini-1.5-flash'   // ✅ Model nhanh, ổn định
];
```

### ✅ **Models Hoạt Động - Gemini Cơ Bản:**
```javascript
const GEMINI_BASIC_MODELS = [
    'gemini-pro'         // ✅ Model cơ bản, fallback
];
```

### ❌ **Models KHÔNG TỒN TẠI:**
```javascript
const NON_EXISTENT_MODELS = [
    'gemini-1.0-pro',        // ❌ Không tồn tại
    'gemini-1.0-flash',      // ❌ Không tồn tại
    'gemini-ultra',          // ❌ Không tồn tại
    'gemini-ultra-pro'       // ❌ Không tồn tại
];
```

## 🔍 **Thông Tin Chi Tiết Models 2.5:**

### **gemini-2.5-pro:**
- **Khả năng:** Audio, images, videos, text, and PDF
- **Đặc điểm:** Enhanced thinking and reasoning, multimodal understanding, advanced coding
- **Ứng dụng:** Tác vụ phức tạp, phân tích đa phương tiện

### **gemini-2.5-flash:**
- **Khả năng:** Audio, images, videos, and text
- **Đặc điểm:** Adaptive thinking, cost efficiency
- **Ứng dụng:** Tác vụ cân bằng giữa hiệu suất và chi phí

### **gemini-2.5-flash-lite:**
- **Khả năng:** Text, image, video, audio
- **Đặc điểm:** Most cost-efficient model supporting high throughput
- **Ứng dụng:** Tác vụ đơn giản, tiết kiệm chi phí

## 🔍 **Lỗi Thường Gặp:**

### **404 Not Found:**
```
{
  "error": {
    "code": 404,
    "message": "Model 'gemini-1.0-pro' not found",
    "status": "NOT_FOUND"
  }
}
```

### **403 Forbidden (Cần quyền đặc biệt):**
```
{
  "error": {
    "code": 403,
    "message": "Permission denied for model 'gemini-2.5-pro'",
    "status": "PERMISSION_DENIED"
  }
}
```

### **402 Payment Required (Cần billing):**
```
{
  "error": {
    "code": 402,
    "message": "Billing required for model 'gemini-2.5-pro'",
    "status": "PAYMENT_REQUIRED"
  }
}
```

## 🎯 **Cấu Hình Tối Ưu:**

### **Temperature Settings:**
```javascript
function getModelTemperature(model) {
    switch (model) {
        case 'gemini-2.5-pro': return 0.1;        // Chính xác cao
        case 'gemini-2.5-flash': return 0.2;      // Cân bằng
        case 'gemini-2.5-flash-lite': return 0.3; // Linh hoạt
        case 'gemini-1.5-pro': return 0.1;        // Chính xác
        case 'gemini-1.5-flash': return 0.3;      // Linh hoạt
        case 'gemini-pro': return 0.3;            // Linh hoạt
        default: return 0.3;
    }
}
```

### **TopK Settings:**
```javascript
function getModelTopK(model) {
    switch (model) {
        case 'gemini-2.5-pro': return 20;        // Tập trung cao
        case 'gemini-2.5-flash': return 30;      // Cân bằng
        case 'gemini-2.5-flash-lite': return 40; // Linh hoạt
        case 'gemini-1.5-pro': return 20;        // Tập trung
        case 'gemini-1.5-flash': return 40;      // Cân bằng
        case 'gemini-pro': return 40;            // Cân bằng
        default: return 40;
    }
}
```

### **TopP Settings:**
```javascript
function getModelTopP(model) {
    switch (model) {
        case 'gemini-2.5-pro': return 0.8;        // Tập trung cao
        case 'gemini-2.5-flash': return 0.9;      // Cân bằng
        case 'gemini-2.5-flash-lite': return 0.95; // Linh hoạt
        case 'gemini-1.5-pro': return 0.8;        // Tập trung
        case 'gemini-1.5-flash': return 0.95;      // Cân bằng
        case 'gemini-pro': return 0.95;            // Cân bằng
        default: return 0.95;
    }
}
```

## 📊 **So Sánh Models:**

| Model | Khả Năng | Tốc Độ | Độ Chính Xác | Chi Phí | Đặc Điểm |
|-------|----------|--------|--------------|---------|----------|
| `gemini-2.5-pro` | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $$$$ | Enhanced thinking, multimodal |
| `gemini-2.5-flash` | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $$$ | Adaptive thinking, cost efficient |
| `gemini-2.5-flash-lite` | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | $$ | Most cost-efficient, high throughput |
| `gemini-1.5-pro` | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | $$$ | High capability |
| `gemini-1.5-flash` | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | $$ | Fast and stable |
| `gemini-pro` | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | $ | Basic, reliable |

## 🛠️ **Cách Sử Dụng:**

### **1. Cấu Hình Models (Ưu Tiên):**
```javascript
const GEMINI_MODELS = [
    'gemini-2.5-pro',        // Thử trước - cao cấp nhất
    'gemini-2.5-flash',      // Thử thứ 2 - cân bằng
    'gemini-2.5-flash-lite', // Thử thứ 3 - tiết kiệm
    'gemini-1.5-pro',        // Fallback 1
    'gemini-1.5-flash',      // Fallback 2
    'gemini-pro'             // Fallback cuối cùng
];
```

### **2. Logic Thử Models:**
```javascript
async function generateWithModels(prompt) {
    for (const model of GEMINI_MODELS) {
        try {
            const result = await callGeminiAPI(model, apiKey, prompt);
            if (validateResponse(result)) {
                return result;
            }
        } catch (error) {
            console.log(`Model ${model} failed: ${error.message}`);
            continue;
        }
    }
    throw new Error('Tất cả models đều thất bại');
}
```

## ⚠️ **Lưu Ý Quan Trọng:**

1. **Models 2.5 có thể cần quyền đặc biệt** - một số cần API key premium
2. **Kiểm tra billing** - models 2.5 có thể cần thanh toán
3. **Theo dõi quota** - mỗi model có giới hạn khác nhau
4. **Test trước khi deploy** - luôn test với models thực tế
5. **Fallback strategy** - luôn có plan B với models cũ hơn

## 🔗 **Tài Liệu Tham Khảo:**

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Available Models List](https://ai.google.dev/models/gemini)
- [API Reference](https://ai.google.dev/api/generativelanguage)
- [Gemini 2.5 Announcement](https://ai.google.dev/gemini-2-5)

---

**📝 Ghi chú:** Models Gemini 2.5 là phiên bản mới nhất với khả năng nâng cao. Luôn kiểm tra quyền truy cập và billing trước khi sử dụng.
