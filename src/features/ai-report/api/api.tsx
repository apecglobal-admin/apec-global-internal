import axios from "axios";

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
    timestamp: new Date().toISOString(),
  });
};

// Step 2: Save Report (Send confirmed data to n8n to save to Sheet)
export const saveReport = async (data: any, userName: string) => {
  return await axios.post("/api/webhook/save", {
    ...data,
    userName: userName,
    timestamp: new Date().toISOString(),
  });
};
