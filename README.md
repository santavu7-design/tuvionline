# Tu Vi Application - Ứng dụng Tử Vi với Gemini AI

Ứng dụng web tạo lá số tử vi sử dụng Google Gemini AI để phân tích và tạo nội dung chi tiết.

## Tính năng chính

- **Nhập thông tin sinh**: Thu thập ngày, tháng, năm, giờ sinh của người dùng
- **Tích hợp Gemini AI**: Sử dụng Google Gemini 2.5 Pro để tạo nội dung tử vi
- **Quản lý API Keys**: Hệ thống quản lý và xoay vòng nhiều API keys
- **Model Manager**: Quản lý và chuyển đổi giữa các model Gemini khác nhau
- **Hiển thị lá số**: Giao diện đẹp mắt để hiển thị kết quả tử vi
- **Lưu trữ local**: Sử dụng localStorage để lưu trữ dữ liệu

## Cấu trúc dự án

```
TV_Final/
├── birth_info_form.html      # Form nhập thông tin sinh
├── lasotuvi.html            # Hiển thị lá số tử vi
├── modelManager.js          # Quản lý các model Gemini
├── apiKeyManager.js         # Quản lý API keys
├── tuviGeminiService.js     # Service gọi Gemini API
├── tuvi_processor.js        # Xử lý logic chính
├── js/                      # Thư mục JavaScript
├── styles/                  # CSS styles
└── README.md               # Tài liệu dự án
```

## Cách sử dụng

1. **Mở file `birth_info_form.html`** trong trình duyệt
2. **Nhập thông tin sinh** (ngày, tháng, năm, giờ)
3. **Nhấn "Tạo Lá Số Tử Vi"**
4. **Chờ Gemini AI xử lý** và tạo nội dung
5. **Xem kết quả** trong `lasotuvi.html`

## Cài đặt API Keys

1. Lấy API key từ [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Thêm vào `apiKeyManager.js`:

```javascript
const API_KEYS = [
    'your-api-key-1',
    'your-api-key-2',
    // Thêm nhiều keys để xoay vòng
];
```

## Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **AI Service**: Google Gemini 2.5 Pro API
- **Storage**: LocalStorage
- **UI Framework**: Custom CSS với gradient và animation

## Model Gemini được hỗ trợ

- `gemini-2.5-pro` (chính)
- `gemini-2.0-pro-exp`
- `gemini-2.0-pro`
- `gemini-2.0-flash-exp`
- `gemini-2.0-flash`

## Tính năng kỹ thuật

- **Retry Logic**: Tự động thử lại khi API call thất bại
- **Timeout Management**: Xử lý timeout cho các request
- **Cache Busting**: Đảm bảo load script mới nhất
- **Error Handling**: Xử lý lỗi chi tiết với logging
- **Responsive Design**: Giao diện tương thích mọi thiết bị

## Đóng góp

Để đóng góp vào dự án:

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra Console (F12) để xem lỗi
2. Đảm bảo API keys hợp lệ
3. Kiểm tra kết nối internet
4. Tạo issue trên GitHub

---

**Lưu ý**: Ứng dụng này chỉ mang tính chất tham khảo và giải trí. Kết quả tử vi được tạo bởi AI và không thay thế cho các phương pháp truyền thống.
