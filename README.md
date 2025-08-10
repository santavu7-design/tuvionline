# TV_Final - Ứng dụng Tử Vi sử dụng Gemini Pro

## Mô tả
Ứng dụng web Tử Vi Việt Nam sử dụng AI Gemini Pro để phân tích và hiển thị lá số tử vi dựa trên thông tin sinh nhật của người dùng.

## Cấu trúc dự án

### File chính
- `birth_info_form.html` - Giao diện nhập thông tin sinh nhật với thiết kế huyền bí
- `tuviGeminiService.js` - Service xử lý API Gemini Pro và quản lý dữ liệu
- `lasotuvi.html` - Trang hiển thị kết quả tử vi với biểu đồ vòng cung và 12 cung chi tiết
- `call_gemini_api.html` - Trang test riêng biệt để gọi Gemini Pro API

### Thư mục Old/
Chứa các file cũ không còn sử dụng để tham khảo.

## Tính năng chính

### 1. Nhập thông tin sinh nhật (`birth_info_form.html`)
- Giao diện huyền bí với hiệu ứng ngôi sao
- Thu thập: họ tên, giới tính, ngày giờ sinh, nơi sinh
- Tự động gọi Gemini Pro API và lưu kết quả
- Chuyển hướng tự động đến trang kết quả

### 2. Service Gemini Pro (`tuviGeminiService.js`)
- **API Integration**: Gọi Gemini Pro API với prompt được tối ưu
- **Data Management**: Lưu/đọc/xóa thông tin sinh nhật và kết quả API
- **Response Parsing**: Chuyển đổi text response thành cấu trúc dữ liệu JavaScript
- **localStorage Integration**: Lưu trữ kết quả markdown để các component khác sử dụng

#### Các method chính:
- `callGeminiAPI(birthInfo, apiKey)` - Gọi API và lưu kết quả
- `parseGeminiResult(markdownText)` - Parse response từ Gemini Pro
- `getMarkdownResult()` - Lấy kết quả từ localStorage
- `saveBirthInfo(birthInfo)` - Lưu thông tin sinh nhật

### 3. Hiển thị kết quả (`lasotuvi.html`)
- **Biểu đồ vòng cung**: Hiển thị 12 cung tử vi theo hình tròn
- **Grid 12 cung**: Hiển thị chi tiết từng cung theo layout 3x4
- **Responsive Design**: Tối ưu cho mobile và desktop
- **Data Source**: Đọc dữ liệu từ localStorage (kết quả Gemini Pro API)

### 4. Test API (`call_gemini_api.html`)
- Giao diện độc lập để test Gemini Pro API
- Lưu kết quả markdown vào localStorage
- Tải xuống file .md để kiểm tra

## Quy trình hoạt động

1. **Nhập thông tin**: Người dùng nhập thông tin sinh nhật tại `birth_info_form.html`
2. **Gọi API**: Service tự động gọi Gemini Pro API với prompt được tối ưu
3. **Lưu kết quả**: Response markdown được lưu vào localStorage
4. **Hiển thị**: `lasotuvi.html` đọc dữ liệu từ localStorage và hiển thị kết quả
5. **Tương tác**: Người dùng có thể xem chi tiết từng cung và biểu đồ vòng cung

## Cài đặt và sử dụng

### 1. Cài đặt API Key
Cập nhật `API_KEY` trong `tuviGeminiService.js`:
```javascript
this.API_KEY = 'YOUR_GEMINI_PRO_API_KEY_HERE';
```

### 2. Chạy ứng dụng
- Mở `birth_info_form.html` trong trình duyệt
- Nhập thông tin sinh nhật
- Hệ thống sẽ tự động gọi API và chuyển đến trang kết quả

### 3. Test API riêng biệt
- Mở `call_gemini_api.html` để test API độc lập
- Kết quả được lưu vào localStorage để `lasotuvi.html` sử dụng

## Cấu trúc dữ liệu

### Input (birthInfo)
```javascript
{
    fullName: "Nguyễn Văn A",
    gender: "Nam",
    birthDate: "1990-01-01",
    birthTime: "12:00",
    birthplace: "Hà Nội"
}
```

### Output (Gemini Pro Response)
- Thông tin cơ bản: họ tên, giới tính, ngày sinh, nơi sinh
- 12 cung tử vi: mệnh, phụ mẫu, phúc đức, điền trạch, quan lộc, nô bộc, thiên di, tật ách, tài bạch, tử tức, thê thiếp, huynh đệ
- Mỗi cung chứa: địa chi, chính tinh, phụ tinh, vòng tràng sinh, trạng thái thân

## Công nghệ sử dụng
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **API**: Google Gemini Pro (Generative AI)
- **Storage**: localStorage (client-side)
- **Design**: Responsive design với CSS Grid và Flexbox
- **Animation**: CSS transitions và hover effects

## Lưu ý
- API key Gemini Pro cần được cấu hình trước khi sử dụng
- Dữ liệu được lưu trong localStorage của trình duyệt
- Ứng dụng hoạt động offline sau khi có dữ liệu từ API
- Prompt được tối ưu để tạo ra dữ liệu tử vi mô phỏng hợp lý
