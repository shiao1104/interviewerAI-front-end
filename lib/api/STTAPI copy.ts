import API from "./api";

export const transcribeAudio = async (audioFile: File) => {
  const formData = new FormData();
  formData.append("audio", audioFile);

  const res = await API.post("/STT/transcribe/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res;
};
