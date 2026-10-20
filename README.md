# HCM-UTE · Giao Thức An Ninh 11

Mini-game ôn tập Bài 11: Những vấn đề cơ bản về bảo vệ an ninh quốc gia và giữ gìn trật tự, an toàn xã hội.

**Chơi:** https://thaibasongvinh.github.io/hcmute-sp11/

## Chỉnh sửa nội dung

- Câu hỏi, đáp án và giải thích: **data/questions.json**
- Danh sách lớp: **data/students.json**
- Tên trường, tiêu đề, số lượt trả lời và điểm: **data/settings.json**

Hướng dẫn chi tiết và ví dụ nằm trong [docs/EDITING-CONTENT.md](docs/EDITING-CONTENT.md). Các tệp giao diện nằm trong thư mục **src/**.

Dự án dùng HTML, CSS và JavaScript module thuần; không cần cài thư viện. Để xem trên máy:

    npm start

Máy cần có Node.js. Máy chủ chạy tại http://localhost:4173.

## Dữ liệu khi chơi

Lịch sử người đã được gọi và kỷ lục được lưu trong trình duyệt của từng người chơi bằng localStorage. Danh sách lớp và câu hỏi là dữ liệu tĩnh trong repo.
