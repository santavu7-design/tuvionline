@echo off
chcp 65001 >nul
title PDF to TXT Converter

echo.
echo ========================================
echo    PDF to TXT Converter - Enhanced
echo ========================================
echo.

cd /d "%~dp0"

echo 📁 Thư mục hiện tại: %CD%
echo.

echo 🔧 Đang khởi động ứng dụng...
echo.

py start_enhanced.py

echo.
echo ⏸️ Nhấn phím bất kỳ để thoát...
pause >nul
