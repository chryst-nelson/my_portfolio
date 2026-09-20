"use client";

import { useEffect, useState } from "react";

interface LocalTimeProps {
  timeZone: string;
  label: string;
}

/** Live clock for the owner's timezone. Rendered after mount to avoid hydration mismatch. */
export default function LocalTime({ timeZone, label }: LocalTimeProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());

    setTime(format());
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span className="tabular-nums">
      {time || "--:--"} {label}
    </span>
  );
}
