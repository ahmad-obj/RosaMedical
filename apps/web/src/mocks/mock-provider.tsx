"use client";

import { useEffect, useState } from "react";

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_API_MOCKING !== "enabled");

  useEffect(() => {
    if (ready) return;
    import("./browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true));
    });
  }, [ready]);

  if (!ready) return null;
  return <>{children}</>;
}
