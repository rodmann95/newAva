"use client";

import { useEffect, useState } from "react";

export function CurrentDate() {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    setDate(new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' }));
  }, []);

  if (!date) return <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />;

  return <span>{date}</span>;
}
