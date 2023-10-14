import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const Countdown = ({ targetDate }: { targetDate: string }) => {
  function calculateTimeLeft() {
    const now = dayjs();
    const target = dayjs(targetDate);
    const difference = target.diff(now);

    if (difference <= 0) {
      return null;
    }

    const formattedDuration = dayjs.duration(difference);

    return {
      hours: formattedDuration.hours().toString().padStart(2, '0'),
      minutes: formattedDuration.minutes().toString().padStart(2, '0'),
      seconds: formattedDuration.seconds().toString().padStart(2, '0'),
    };
  }
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {timeLeft ? (
        <>
          {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
        </>
      ) : (
        '00:00:00'
      )}
    </div>
  );
};

export default Countdown;
