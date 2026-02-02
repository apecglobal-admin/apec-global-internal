import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  Users,
  Upload,
  Image,
  FileText
} from 'lucide-react';

interface CautionKPI {
  id: string;
  name: string;
}

interface Employee {
  id: number;
  name: string;
  avatar_url: string | null;
}

interface CreateCautionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedEmployees: number[], selectedKPIItem: string, reason: string, prove: string) => void;
  listCautionKPI: CautionKPI[];
  listEmployeeDepartment: Employee[];
  isCreating: boolean;
  onUploadImage: (file: File) => Promise<string>;
  onUploadFile: (file: File) => Promise<string>;
}

function CreateCautionModal({
  isOpen,
  onClose,
  onSubmit,
  listCautionKPI,
  listEmployeeDepartment,
  isCreating,
  onUploadImage,
  onUploadFile
}: CreateCautionModalProps) {
    
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedKPIItem, setSelectedKPIItem] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reason, setReason] = useState<string>("");
  const [uploadType, setUploadType] = useState<"image" | "document" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedProve, setUploadedProve] = useState<string>("");

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedEmployees([]);
    setSelectedKPIItem("");
    setSearchTerm("");
    setReason("");
    setUploadType(null);
    setSelectedFile(null);
    setFilePreview(null);
    setUploadedProve("");
    onClose();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    try {
      let uploadedUrl = "";
      
      if (uploadType === "image") {
        uploadedUrl = await onUploadImage(selectedFile);
      } else if (uploadType === "document") {
        uploadedUrl = await onUploadFile(selectedFile);
      }
      setUploadedProve(uploadedUrl);
      
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedEmployees, selectedKPIItem, reason, uploadedProve);
    setSelectedEmployees([]);
    setSelectedKPIItem("");
    setSearchTerm("");
    setReason("");
    setUploadType(null);
    setSelectedFile(null);
    setFilePreview(null);
    setUploadedProve("");
  };

  const toggleEmployeeSelection = (employeeId: number) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadedProve("");

      if (uploadType === "image" && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleUploadTypeChange = (type: "image" | "document") => {
    if (uploadType === type) {
      setUploadType(null);
      setSelectedFile(null);
      setFilePreview(null);
      setUploadedProve("");
    } else {
      setUploadType(type);
      setSelectedFile(null);
      setFilePreview(null);
      setUploadedProve("");
    }
  };

  const getAcceptedFileTypes = () => {
    if (uploadType === "image") {
      return "image/*";
    } else if (uploadType === "document") {
      return ".pdf,.doc,.docx,.xls,.xlsx,.txt";
    }
    return "";
  };

  const filteredEmployees = listEmployeeDepartment?.filter((emp: Employee) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-400" size={24} />
            <h2 className="text-xl font-bold text-white">
              Tạo nhắc nhở mới
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Select Caution Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Loại nhắc nhở *
            </label>
            <select
              value={selectedKPIItem}
              onChange={(e) => setSelectedKPIItem(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition"
            >
              <option value="">-- Chọn loại nhắc nhở --</option>
              {listCautionKPI?.map((kpi: CautionKPI) => (
                <option key={kpi.id} value={kpi.id}>
                  {kpi.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reason Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Lý do nhắc nhở
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do nhắc nhở..."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition resize-none"
            />
          </div>

          {/* Upload Section */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Upload size={16} className="text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">
                Minh chứng (tùy chọn)
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Chọn loại minh chứng bạn muốn tải lên:
            </p>

            {/* Upload Type Selection */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleUploadTypeChange("image")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                  uploadType === "image"
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                    : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                <Image size={24} />
                <span className="text-sm font-semibold">Hình ảnh</span>
                <span className="text-xs text-slate-500">JPG, PNG, GIF</span>
              </button>

              <button
                onClick={() => handleUploadTypeChange("document")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                  uploadType === "document"
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                    : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                <FileText size={24} />
                <span className="text-sm font-semibold">Tài liệu</span>
                <span className="text-xs text-slate-500">PDF, DOC, XLS</span>
              </button>
            </div>

            {/* File Upload Input */}
            {uploadType && (
              <div>
                <label className="block w-full cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-750 transition">
                    <Upload size={16} className="text-yellow-400" />
                    <span className="text-sm text-slate-300">
                      {selectedFile
                        ? selectedFile.name
                        : `Chọn ${uploadType === "image" ? "hình ảnh" : "tài liệu"}`}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>

                {/* Image Preview */}
                {filePreview && uploadType === "image" && (
                  <div className="mt-3">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-slate-700"
                    />
                  </div>
                )}

                {/* File Info */}
                {selectedFile && (
                  <div className="mt-3 p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {uploadType === "image" ? (
                          <Image size={16} className="text-yellow-400" />
                        ) : (
                          <FileText size={16} className="text-yellow-400" />
                        )}
                        <span className="text-xs text-slate-300 truncate">
                          {selectedFile.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {selectedFile && !uploadedProve && (
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                  >
                    <Upload size={16} />
                    {isUploading ? "Đang tải lên..." : "Tải lên"}
                  </button>
                )}

                {/* Upload Success Message */}
                {uploadedProve && (
                  <div className="mt-3 p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
                    <p className="text-xs text-green-400 text-center">
                      ✓ Đã tải lên thành công!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Select Employees */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Chọn nhân viên * ({selectedEmployees.length} đã chọn)
            </label>

            {/* Search */}
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 mb-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition"
            />

            {/* Employee List */}
            <div className="max-h-64 overflow-y-auto space-y-2 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              {filteredEmployees?.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  Không tìm thấy nhân viên
                </p>
              ) : (
                filteredEmployees?.map((employee: Employee) => (
                  <label
                    key={employee.id}
                    className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-750 cursor-pointer transition border border-slate-700 hover:border-yellow-500/30"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => toggleEmployeeSelection(employee.id)}
                      className="w-5 h-5 rounded border-slate-600 text-yellow-600 focus:ring-yellow-500 focus:ring-offset-slate-900"
                    />
                    
                    {employee.avatar_url ? (
                      <img
                        src={employee.avatar_url}
                        alt={employee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                        <Users className="text-slate-500" size={20} />
                      </div>
                    )}
                    
                    <span className="text-white font-medium">
                      {employee.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 px-6 py-4 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isCreating || selectedEmployees.length === 0 || !selectedKPIItem}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
          >
            <AlertTriangle size={18} />
            {isCreating ? "Đang xử lý..." : `Nhắc nhở ${selectedEmployees.length} nhân viên`}
          </button>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-semibold rounded-lg transition"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCautionModal;