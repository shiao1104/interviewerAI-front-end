"use client";
import { useState, useRef } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onPlay?: () => void;
  onPause?: () => void;
}

export default function VideoPlayer({ videoUrl, title, onPlay, onPause }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      // 模擬播放功能 - 因為沒有實際影片檔案
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsPlaying(true);
        onPlay?.();
        // 模擬播放進度
        simulatePlayback();
      }, 1000);
    }
  };

  const simulatePlayback = () => {
    const simulatedDuration = 120; // 2分鐘的模擬影片
    setDuration(simulatedDuration);
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= simulatedDuration) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    // 模擬下載功能
    alert(`下載功能：${title} - ${videoUrl}`);
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Video Display Area */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ display: 'none' }} // 隱藏因為沒有實際影片
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading ? (
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <div className="text-sm">載入中...</div>
            </div>
          ) : (
            <div className="text-white text-center">
              <div className="text-6xl mb-4">
                {isPlaying ? "⏸️" : "▶️"}
              </div>
              <div className="text-lg font-medium">{title}</div>
              <div className="text-sm text-gray-300 mt-2">
                模擬影片播放器
              </div>
              {isPlaying && (
                <div className="mt-4 text-green-400">
                  ● 播放中 {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Play/Pause Overlay Button */}
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 w-full h-full bg-black bg-opacity-0 hover:bg-opacity-20 transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 space-y-3">
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-white text-sm w-12">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #6b7280 ${(currentTime / duration) * 100}%, #6b7280 100%)`
            }}
          />
          <span className="text-white text-sm w-12">
            {formatTime(duration)}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  載入中
                </>
              ) : isPlaying ? (
                <>⏸️ 暫停</>
              ) : (
                <>▶️ 播放</>
              )}
            </button>
            
            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="text-white hover:text-gray-300 px-2 py-2"
            >
              ⏹️
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="text-white hover:text-gray-300 px-2 py-2 border border-gray-600 rounded"
            >
              📥 下載
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}