# Cách chạy ứng dụng Tử Vi

## Vấn đề với file `lasotuvi.html` gốc

File `lasotuvi.html` cần fetch file `sample_gemini_response.md` từ local, nhưng browser chặn việc này do security policy khi mở file từ `file:///` protocol.

## Giải pháp

### Phương án 1: Sử dụng file embedded (KHUYẾN NGHỊ)
Sử dụng file `lasotuvi_embedded.html` - file này có dữ liệu được nhúng trực tiếp, không cần HTTP server.

**Cách dùng:**
1. Mở trực tiếp file `lasotuvi_embedded.html` trong browser
2. File sẽ hoạt động ngay lập tức

### Phương án 2: Chạy HTTP Server (cho file gốc)

#### Option A: Sử dụng Python (nếu có cài đặt)
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

#### Option B: Sử dụng Node.js serve
Nếu gặp lỗi execution policy:
```powershell
# Bật execution policy tạm thời
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npx serve . -p 8080
```

#### Option C: Sử dụng Live Server (VS Code Extension)
1. Cài đặt extension "Live Server" trong VS Code
2. Right-click vào file `lasotuvi.html` 
3. Chọn "Open with Live Server"

#### Option D: Sử dụng browser từ local file
Một số browser cho phép disable security cho local files:

**Chrome:**
```bash
chrome.exe --allow-file-access-from-files --disable-web-security
```

## Cấu trúc project hiện tại

```
├── birth_info_form.html          # Form nhập thông tin (gọi controller)
├── lasotuvi.html                 # Hiển thị kết quả (cần HTTP server)
├── lasotuvi_embedded.html        # Hiển thị kết quả (không cần server) ⭐
├── call_gemini_api_simple.html   # Test API (gọi controller)
├── sample_gemini_response.md     # Dữ liệu mẫu
├── apiKeyManager.js              # Quản lý API key
├── tuviGeminiService.js          # Service xử lý API và parse
├── tuViController.js             # Controller logic nghiệp vụ
└── HOW_TO_RUN.md                # File này
```

## Kiến trúc đã được tách theo yêu cầu

✅ **Giao diện chỉ gọi API đơn giản:**
- `birth_info_form.html`: Thu thập dữ liệu → gọi `tuViController.handleBirthInfoSubmit()`
- `lasotuvi_embedded.html`: Đọc dữ liệu local → hiển thị
- `call_gemini_api_simple.html`: Test API → gọi `tuViController.handleCustomApiCall()`

✅ **Logic phức tạp được tách ra:**
- `tuViController.js`: Xử lý tất cả logic nghiệp vụ
- `tuviGeminiService.js`: API calls và data parsing
- `apiKeyManager.js`: Quản lý key và retry logic

## Khuyến nghị

Sử dụng `lasotuvi_embedded.html` để test ngay lập tức, không cần cài đặt HTTP server.
