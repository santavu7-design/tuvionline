@echo off
chcp 65001 >nul
title PDF to TXT Converter - Vietnamese Font Fix

echo.
echo ========================================
echo   PDF to TXT Converter - Vietnamese Fix
echo ========================================
echo.
echo 🚀 Khởi động ứng dụng với hỗ trợ font tiếng Việt...
echo.

REM Check if Python is available (try both python and py commands)
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
    goto :python_found
)

py --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=py
    goto :python_found
)

echo ❌ Không tìm thấy Python
echo 💡 Hãy cài đặt Python từ: https://python.org
pause
exit /b 1

:python_found
echo ✅ Python đã được tìm thấy (%PYTHON_CMD%)
echo.

REM Chạy script khởi động
%PYTHON_CMD% start_enhanced_fixed.py

if errorlevel 1 (
    echo.
    echo ❌ Có lỗi xảy ra khi khởi động ứng dụng
    echo 💡 Kiểm tra lại cài đặt Tesseract và Poppler
    pause
)

echo.
echo 👋 Tạm biệt!
pause
