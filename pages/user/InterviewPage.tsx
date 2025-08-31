import { useRef } from 'react';
import VideoRecorder, { VideoRecorderRef } from '@/components/common/user/VideoRecorder';
import AnalyzeAPI from '@/lib/api/AnalyzeAPI';

export default function InterviewPage() {
  const recorderRef = useRef<VideoRecorderRef>(null);

  const handleRecordingComplete = async (blobs: Blob[]) => {
    if (!blobs || blobs.length === 0) return;

    const recordedBlob = new Blob(blobs, { type: 'video/webm' });

    const formData = new FormData();
    formData.append('video', recordedBlob, 'interview.webm');

    try {
      const res = await AnalyzeAPI.uploadMedia(formData);

      console.log('上傳成功:', res);
    } catch (error) {
      console.error('上傳錯誤:', error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">模擬面試錄影</h1>

      <VideoRecorder
        ref={recorderRef}
        onRecordingComplete={handleRecordingComplete}
        width="640"
        height="auto"
        autoStartPreview={true}
        mirrored={true}
        aspectRatio="16:9"
      />

      <div className="flex gap-4 mt-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => recorderRef.current?.startPreview()}
        >
          開始預覽
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => recorderRef.current?.startRecording()}
        >
          開始錄製
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => recorderRef.current?.stopRecording()}
        >
          停止錄製並上傳
        </button>
      </div>
    </div>
  );
}
