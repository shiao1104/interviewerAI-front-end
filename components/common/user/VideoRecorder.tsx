// VideoRecorder.tsx
'use client';

import { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';

export interface VideoRecorderRef {
  startRecording: () => void;
  stopRecording: () => void;
  getRecordedData: () => Blob[] | null;
  startPreview: () => void;
  stopPreview: () => void;
}

interface VideoRecorderProps {
  onRecordingComplete?: (blobs: Blob[]) => void;
  width?: string | number;
  height?: string | number;
  autoStartPreview?: boolean; // 自動開始預覽
  mirrored?: boolean; // 是否鏡像反轉
  aspectRatio?: string; // 影片比例，例如 "16:9" 或 "4:3"
}

const VideoRecorder = forwardRef<VideoRecorderRef, VideoRecorderProps>(
  ({ 
    onRecordingComplete, 
    width = '100%', 
    height = '480px', 
    autoStartPreview = true, 
    mirrored = true, // 預設開啟鏡像反轉
    aspectRatio = "16:9" // 預設使用 16:9 比例
  }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [isPreviewActive, setIsPreviewActive] = useState(false);

    // 計算適當的高度以保持指定的寬高比例
    const calculateDimensions = () => {
      // 從 aspectRatio 中提取數值
      const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
      
      // 如果容器是固定寬度，則根據比例調整高度
      if (typeof width === 'string' && width.endsWith('%')) {
        // 如果寬度是百分比，則無法確定實際寬高比
        // 返回用戶指定的高度
        return {
          width: width,
          height: height
        };
      } else {
        // 如果是數值寬度，則可以計算對應的高度
        const numericWidth = typeof width === 'number' ? width : parseInt(width);
        const calculatedHeight = (numericWidth / widthRatio) * heightRatio;
        
        return {
          width: width,
          height: calculatedHeight + 'px'
        };
      }
    };

    const { width: finalWidth, height: finalHeight } = calculateDimensions();

    // 自動開始預覽
    useEffect(() => {
      if (autoStartPreview) {
        startPreview();
      }
      
      // 清理函數：組件卸載時停止所有媒體流
      return () => {
        stopAllMedia();
      };
    }, [autoStartPreview]);

    // 停止所有媒體相關的操作
    const stopAllMedia = () => {
      // 停止錄製（如果正在錄製）
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      // 關閉所有媒體流
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // 清除視頻元素的源
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsPreviewActive(false);
    };

    // 開始預覽（不錄製）
    const startPreview = async () => {
      // 如果已經在預覽或錄製中，則不執行任何操作
      if (isPreviewActive || (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording')) {
        return;
      }
      
      try {
        // 嘗試設置最佳的视频配置
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user" // 使用前置攝像頭
          },
          audio: true
        };
        
        // 獲取媒體流
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        streamRef.current = stream;
        
        // 將流設置到視頻元素
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setIsPreviewActive(true);
      } catch (error) {
        console.error('Error accessing media devices for preview:', error);
      }
    };

    // 停止預覽
    const stopPreview = () => {
      // 只停止預覽，不關閉正在錄製的流
      if (isPreviewActive && (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording')) {
        stopAllMedia();
      }
    };

    // 開始錄製
    const startRecording = async () => {
      // 重置錄製的數據塊
      chunksRef.current = [];
      
      try {
        // 如果沒有活躍的預覽，則先啟動媒體流
        if (!streamRef.current || !isPreviewActive) {
          // 使用與預覽相同的配置
          const constraints = {
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user"
            },
            audio: true
          };
          
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          streamRef.current = stream;
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          
          setIsPreviewActive(true);
        }
        
        // 確保我們有有效的流
        if (!streamRef.current) {
          throw new Error('No active media stream');
        }
        
        // 創建媒體錄製器
        const mediaRecorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = mediaRecorder;
        
        // 設置數據可用事件處理程序
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };
        
        // 設置停止事件處理程序
        mediaRecorder.onstop = () => {
          if (onRecordingComplete) {
            onRecordingComplete(chunksRef.current);
          }
          
          // 注意：這裡不關閉流和預覽，允許繼續查看預覽
          // 預覽將會繼續，直到明確調用 stopPreview 或組件卸載
        };
        
        // 開始錄製，每秒獲取一個數據片段
        mediaRecorder.start(1000);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    };
    
    // 停止錄製
    const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
    
    // 獲取錄製的數據
    const getRecordedData = () => {
      return chunksRef.current.length > 0 ? chunksRef.current : null;
    };
    
    // 向父組件暴露方法
    useImperativeHandle(ref, () => ({
      startRecording,
      stopRecording,
      getRecordedData,
      startPreview,
      stopPreview
    }));
    
    return (
      <div style={{ 
        width: finalWidth, 
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ 
            width: '100%', 
            height: finalHeight, 
            backgroundColor: '#000',
            objectFit: 'cover',
            transform: mirrored ? 'scaleX(-1)' : 'none' // 如果啟用鏡像，則水平翻轉
          }}
        />
      </div>
    );
  }
);

VideoRecorder.displayName = 'VideoRecorder';

export default VideoRecorder;