import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// 動態導入組件，禁用 SSR
const VideoRecorderComponent = dynamic(
  () => import("../../components/common/VideoRecorderComponent"),
  {
    ssr: false,
  }
);

export default function Record() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>載入中...</div>;
  }

  return (
    <>
      <VideoRecorderComponent />
    </>
  );
}
