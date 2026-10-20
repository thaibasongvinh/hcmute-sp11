# Hướng dẫn chỉnh sửa nội dung

## Câu hỏi

Mở **data/questions.json**. Mỗi phần tử trong danh sách là một câu. Ví dụ:

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

**correctIndex** đếm từ 0: 0 là phương án A, 1 là B, …, 5 là F. Giữ options và correctIndex trong cùng một câu để đáp án không bị lệch khi sắp xếp. Có thể thêm, xóa hoặc sửa câu hỏi; số câu trên giao diện tự cập nhật.

## Danh sách lớp

Mở **data/students.json**. Mỗi người có mã định danh duy nhất, họ, tên và số tiểu đội:

    {
      "id": "nguyen-van-an",
      "last": "Nguyễn Văn",
      "first": "An",
      "squad": 1
    }

ID không nên trùng nhau. Số tiểu đội dùng để chia nhóm khi rút thăm.

## Thông tin hiển thị và luật chơi

Mở **data/settings.json** để sửa tên trường, tiêu đề, mô tả, số cơ hội cho mỗi câu và điểm tối đa của câu đúng.

## Cách áp dụng thay đổi

Lưu các tệp JSON rồi tải lại trang. Khi chạy trên GitHub Pages, commit các thay đổi lên nhánh đang dùng để website nhận nội dung mới. Không cần sửa **src/main.js** khi chỉ đổi câu hỏi, đáp án, giải thích, danh sách lớp hoặc thông tin trong settings.json.
