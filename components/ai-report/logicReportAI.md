# Logic AI Report

## Phân luồng

- Báo cáo có cụm `Nam Thiên Long`, hoặc đồng thời có `khu vực` và `quân số`, tiếp tục dùng luồng webhook Nam Thiên Long hiện tại.
- Các yêu cầu Nhiệm vụ cha và Nhiệm vụ con cấp 1 được gửi tới `POST /api/ai-report` và phân tích bằng Gemini.
- Gemini phân tích report dùng `GEMINI_AI_REPORT_API_KEY`, tách biệt với `GEMINI_API_KEY` dùng phiên âm voice.

## Ngữ cảnh Gemini

Route AI Report chỉ tải Nhiệm vụ cha và Nhiệm vụ con cấp 1 đang thực hiện (`status=2`) và chuẩn hóa:

- Task chỉ gồm ID, task assignment ID, tên, dự án và đơn vị tính.
- Nhiệm vụ con cấp 1 chỉ gồm ID và tên.
- Các danh sách lựa chọn không được đưa vào prompt Gemini. Client chỉ tải chúng khi hiển thị kết quả review.

Token chỉ dùng để gọi backend. Token không được đưa vào prompt Gemini.

## Thao tác hỗ trợ

### Nhiệm vụ cha

- Tạo mới.
- Cập nhật tiến độ, kết quả và trạng thái.

### Nhiệm vụ con cấp 1

- Tạo một hoặc nhiều subtask.
- Cập nhật tiến độ, kết quả và trạng thái.

Mỗi hành động độc lập được trả về thành một phần tử trong `reports`.

## Quy tắc an toàn

- Gemini chỉ được sử dụng ID có trong ngữ cảnh backend.
- Gemini ưu tiên Nhiệm vụ con cấp 1; trường nào không phân tích được sẽ là `null` để user nhập trong bước review.
- JSON từ Gemini phải qua Zod validation trước khi trả về client.
- Thao tác chỉ được gọi API sau khi user xem trước và bấm `Lưu lại`.
- Mỗi lỗi API phải được ghi log kèm loại thao tác và trả kết quả thất bại rõ ràng.

## Trạng thái và tiến độ

- `2`: Đang thực hiện.
- `3`: Tạm dừng.
- `4`: Hoàn thành.
- `5`: Hủy.
- Hoàn thành luôn đồng bộ `progress=100`.
- `progress=100` luôn đồng bộ `status=4`.
- Nếu KPI có đơn vị `%`, API nhận tiến độ mới.
- Nếu KPI có đơn vị khác `%`, API nhận giá trị user vừa báo để cộng dồn.

## Tạo Nhiệm vụ cha

- Gemini sinh tên, ngày, giá trị mục tiêu và tiến độ khi yêu cầu có nêu rõ.
- Trường không phân tích được được khởi tạo là `null`.
- User chọn các trường bắt buộc trong màn review trước khi lưu.
- Các hằng số backend còn thiếu được áp dụng khi gửi request tạo task.
