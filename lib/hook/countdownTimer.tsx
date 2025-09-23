import { useState, useEffect } from "react";
import { Chip } from "@mui/material";
import { TimerOutlined } from "@mui/icons-material";

interface CountdownTimerProps {
  timeAllowed?: number;
  onTimeUp?: () => void;
  onCanSkip?: (canSkip: boolean) => void;
}

function CountdownTimer({ timeAllowed = 60, onTimeUp, onCanSkip }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeAllowed);

  useEffect(() => {
    setTimeLeft(timeAllowed);
  }, [timeAllowed]);

  useEffect(() => {
    if (onCanSkip) {
      const canSkip = timeLeft <= (timeAllowed - 20);
      onCanSkip(canSkip);
    }
  }, [timeLeft, timeAllowed, onCanSkip]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <Chip
      icon={<TimerOutlined />}
      label={`剩餘 ${timeLeft} 秒`}
      color={timeLeft <= 10 ? "error" : "primary"}
      variant="outlined"
    />
  );
}

export default CountdownTimer;
