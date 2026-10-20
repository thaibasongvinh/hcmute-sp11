# HCM-UTE · Giao Thức An Ninh 11

Mini-game ôn tập Bài 11: Những vấn đề cơ bản về bảo vệ an ninh quốc gia và giữ gìn trật tự, an toàn xã hội.

**Chơi:** https://thaibasongvinh.github.io/hcmute-sp11/

## Chỉnh sửa nội dung

- Câu hỏi, đáp án và giải thích: **data/questions.json**
- Danh sách lớp: **data/students.json**

Hướng dẫn chi tiết và ví dụ nằm trong [docs/EDITING-CONTENT.md](docs/EDITING-CONTENT.md).

Giao diện và cách chơi dùng lại bản game cũ. Repo hiện không có mã nguồn gốc dạng dự án để chỉnh phần giao diện; các nội dung có thể thay đổi được tách riêng thành hai tệp JSON ở trên.

Để xem trên máy, cần cài Node.js rồi chạy:

    npm start

Mở http://localhost:4173 sau khi máy chủ khởi động.

## Dữ liệu khi chơi

Lịch sử người đã được gọi, cài đặt âm thanh và kỷ lục tiếp tục được lưu trong trình duyệt của từng người chơi. Việc chỉnh câu hỏi hoặc danh sách lớp không xóa dữ liệu đã lưu.
