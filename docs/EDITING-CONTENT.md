# Hướng dẫn chỉnh sửa nội dung

Nội dung trò chơi được lưu trong hai tệp JSON. Sửa các tệp này, lưu lại rồi tải lại trang để xem thay đổi.

## Câu hỏi và đáp án

Sửa `data/questions.json`. Mỗi phần tử là một câu hỏi. Ví dụ:

```json
{
  "id": 1,
  "sector": "KHÁI NIỆM",
  "question": "Câu hỏi hiển thị ở đây?",
  "options": [
    "Phương án A",
    "Phương án B",
    "Phương án C",
    "Phương án D",
    "Phương án E",
    "Phương án F"
  ],
  "correctIndex": 0,
  "explanation": "Giải thích đáp án đúng.",
  "sourcePage": "Trang 1"
}
```

- `id` là mã số riêng của câu hỏi.
- `sector` là nhãn chủ đề.
- `options` chứa các phương án theo thứ tự hiển thị.
- `correctIndex` đếm từ 0: `0` là phương án A, `1` là B, đến `5` là F.
- `explanation` là phần giải thích đáp án.
- `sourcePage` ghi trang tài liệu tham khảo.

Giữ `correctIndex` khớp với phương án đúng sau khi sắp xếp `options`. Có thể thêm, xóa hoặc sửa câu; số câu được lấy từ danh sách này.

## Danh sách sinh viên

Sửa `data/students.json`. Mỗi sinh viên có dạng:

```json
{
  "id": "nguyen-van-an",
  "last": "Nguyễn Văn",
  "first": "An",
  "squad": 1
}
```

`id` phải duy nhất; `last` và `first` được ghép thành họ tên hiển thị; `squad` là số tiểu đội.

## Áp dụng lên website

Khi chạy thử tại máy, khởi động máy chủ bằng `npm start` rồi mở `http://localhost:4173`. Khi cập nhật website GitHub Pages, commit thay đổi JSON lên nhánh đang xuất bản và chờ Pages cập nhật.

Mã nguồn ban đầu của giao diện không có trong repo dưới dạng dự án có thể chỉnh sửa. Vì vậy, giao diện và cách chơi đang được giữ từ bản build cũ; hướng dẫn này chỉ áp dụng cho câu hỏi, đáp án, giải thích và danh sách sinh viên.
