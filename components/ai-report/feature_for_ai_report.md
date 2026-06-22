Dưới đây là chi tiết luồng hoạt động và cấu trúc payload của chức năng **Nhiệm vụ cha** và **Nhiệm vụ con cấp 1**:

---

## 1. Chức năng Nhiệm vụ cha

Công việc cá nhân là các công việc do bản thân người dùng tự tạo và tự thực hiện.

### A. Thêm mới công việc cá nhân
* **API:** `POST /tasks/personal/create`
* **Thunk:** `createPersonalTask`
* **Payload:**
```json
{
  "name": "Tên nhiệm vụ cá nhân",      // string, bắt buộc
  "type_task": 1,                      // number, bắt buộc (ID loại công việc)
  "date_start": "2026-06-20",          // string (YYYY-MM-DD), bắt buộc
  "date_end": "2026-06-30",            // string (YYYY-MM-DD), bắt buộc
  "task_priority": 2,                  // number, bắt buộc (ID độ ưu tiên)
  "projects": [5],                     // array of numbers (mảng ID dự án liên quan), bắt buộc
  "kpi_item_id": 3,                    // number, bắt buộc (ID chỉ tiêu KPI)
  "target_type": 3,                    // number, bắt buộc
  "target_value": 100,                 // number, bắt buộc (Giá trị mục tiêu)
  "min_count_reject": 2,               // number, bắt buộc
  "max_count_reject": 3,               // number, bắt buộc
  "time_repeat": null,                 // string hoặc null (Giờ lặp hằng ngày)
  "companies": [1]                     // array of numbers (mảng ID công ty), bắt buộc
}
```

## 2. Chức năng Nhiệm vụ con cấp 1

Nhiệm vụ con cấp 1 trực thuộc một phân công công việc cụ thể (`task_assignment`).

### A. Xem danh sách nhiệm vụ con Cấp 1
* **API:** `GET /tasks/sub`
* **Thunk:** `getSubTask`
* **Payload (Params):**
```json
{
  "limit": 10,
  "offset": 0,
  "task_assignment_id": 456            // number, bắt buộc (ID của phân công công việc)
}
```

### B. Thêm mới nhiệm vụ con Cấp 1 (Tạo hàng loạt)
* **API:** `POST /tasks/sub/create`
* **Thunk:** `createSubTask`
* **Payload:**
```json
{
  "subtasks": [
    {
      "name": "Tên nhiệm vụ con Cấp 1",    // string, bắt buộc
      "task_id": 123,                      // number, bắt buộc (ID công việc cha)
      "task_assignment_id": 456,           // number, bắt buộc (ID phân công công việc)
      "target_value": 50,                  // number, bắt buộc (Giá trị mục tiêu cần đạt của nhiệm vụ con này)
      "start_date": "2026-06-20",          // string (YYYY-MM-DD), bắt buộc
      "end_date": "2026-06-25",            // string (YYYY-MM-DD), bắt buộc
      "subtask_id": null                   // null (Đánh dấu đây là nhiệm vụ con cấp 1)
    }
  ]
}
```

### C. Cập nhật tiến độ / thực tế đạt được nhiệm vụ con Cấp 1
* **API:** `PUT /tasks/sub/progress/update`
* **Thunk:** `updateProgressSubTask`
* **Payload:**
```json
{
  "id": 789,                           // number, bắt buộc (ID của subtask)
  "value": 30,                         // number hoặc string. Nếu đơn vị tính KPI là "%": truyền giá trị tiến độ mới (ví dụ 30). Nếu là đơn vị khác: truyền giá trị cộng dồn thêm vào thực tế hiện tại.
  "subtask_status": 2                  // number, optional (ID trạng thái cập nhật mới cho subtask)
}
```

