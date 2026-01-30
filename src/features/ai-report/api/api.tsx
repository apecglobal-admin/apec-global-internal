import axios from "axios";
import { formatDateTime } from "@/src/utils/formatDate";

export const sendAudioToGemini = async (audioBlob: Blob, context: string) => {
  const formData = new FormData();
  formData.append("audio", audioBlob);
  formData.append("context", context);

  const response = await axios.post("/api/gemini", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Step 1: Format Report (Send to n8n for analysis)
export const formatReport = async (text: string, userName: string) => {
  return await axios.post("/api/webhook", {
    text: text,
    userName: userName,
    timestamp: formatDateTime(new Date()),
  });
};

// Step 2: Save Report (Send confirmed data to n8n to save to Sheet)
export const saveReport = async (
  data: any,
  userName: string,
  email: string,
  department: string,
  position: string
) => {
  return await axios.post("/api/webhook/save", {
    reports: data,
    userName,
    email,
    department,
    position,
    timestamp: formatDateTime(new Date()),
  });
};
