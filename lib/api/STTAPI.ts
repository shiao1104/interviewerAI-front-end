export const transcribeAudio = async (audioFile: File) => {
  const formData = new FormData();
  formData.append("audio", audioFile);
  const token = sessionStorage.getItem("token");
  console.log("👉 使用的 token:", token);

  const response = await fetch("http://127.0.0.1:8000/STT/transcribe/", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("上傳失敗");
  }

  return await response.json();  // ✅ 正確寫法
};
