"use client";

import { useEffect, useState } from "react";

type Props = {
  startDate: string;
  endDate: string;
};

export default function AuctionCountdown({
  startDate,
  endDate,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = Date.now();

      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      if (now < start) {
        setTimeLeft(start - now);
      } else if (now < end) {
        setTimeLeft(end - now);
      } else {
        setTimeLeft(0);
      }
    };

    update();

    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  const now = Date.now();

  const start = new Date(startDate).getTime();

  const end = new Date(endDate).getTime();

  const hasStarted = now >= start;

  const hasEnded = now >= end;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (timeLeft % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (timeLeft % (1000 * 60)) /
    1000
  );

  if (hasEnded) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
        <h2 className="font-bold text-red-600 text-xl">
          Auction Closed
        </h2>

        <p className="text-gray-600 mt-2">
          Bidding has ended.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white rounded-xl p-6 text-center">

      <p className="text-gray-300 uppercase tracking-wider text-sm">
        {hasStarted
          ? "Auction Ends In"
          : "Auction Starts In"}
      </p>

      <div className="grid grid-cols-4 gap-3 mt-5 sm:gap-1">

        <TimeCard
          label="Days"
          value={days}
        />

        <TimeCard
          label="Hours"
          value={hours}
        />

        <TimeCard
          label="Minutes"
          value={minutes}
        />

        <TimeCard
          label="Seconds"
          value={seconds}
        />

      </div>

    </div>
  );
}

function TimeCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-gray-900 rounded-xl py-5">

      <div className="text-3xl font-bold">
        {String(value).padStart(2, "0")}
      </div>

      <div className="text-gray-400 text-sm">
        {label}
      </div>

    </div>
  );
}