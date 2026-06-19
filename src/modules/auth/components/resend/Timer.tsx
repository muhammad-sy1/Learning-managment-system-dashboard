"use client";

import useTimer from "../../store/timerStore";

export default function Timer() {
  const { duration } = useTimer();

  const minutes = Math.floor(duration / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (duration % 60).toString().padStart(2, "0");

  return (
    <span>
      {minutes}:{seconds}
    </span>
  );
}
