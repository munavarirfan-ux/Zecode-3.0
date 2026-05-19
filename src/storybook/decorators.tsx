"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, type ReactNode } from "react";
import type { Decorator } from "@storybook/nextjs";
import { ZeMeetProvider, useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import type { ZeMeetPhase, ZeMeetSession } from "@/lib/zemeet/types";
import { mockZeMeetSession } from "./mocks";

export const dashboardCanvasDecorator: Decorator = (Story) => (
  <div className="min-h-dvh bg-[rgb(var(--app-bg-rgb))] p-6 sm:p-8">
    <div className="mx-auto max-w-6xl">
      <Story />
    </div>
  </div>
);

export const sessionDecorator: Decorator = (Story) => (
  <SessionProvider
    session={{
      user: { name: "Elena Hoffmann", email: "elena@zecode.io" },
      expires: "2099-01-01",
    }}
  >
    <Story />
  </SessionProvider>
);

function ZeMeetPhaseInit({
  phase,
  startLive,
  children,
}: {
  phase: ZeMeetPhase;
  startLive?: boolean;
  children: ReactNode;
}) {
  const { setPhase, startSession, addNote } = useZeMeet();

  useEffect(() => {
    if (startLive) {
      startSession();
      return;
    }
    if (phase === "feedback") {
      addNote("Strong systems thinking on the design review prompt.");
      addNote("Clear communication when walking through tradeoffs.");
    }
    setPhase(phase);
  }, [phase, startLive, setPhase, startSession, addNote]);

  return <>{children}</>;
}

export function zeMeetDecorator(options?: {
  phase?: ZeMeetPhase;
  startLive?: boolean;
  viewerRole?: ZeMeetSession["viewerRole"];
  theme?: "light" | "dark";
}): Decorator {
  const phase = options?.phase ?? "lobby";
  const session = mockZeMeetSession(options?.viewerRole ?? "interviewer");
  const shellClass =
    options?.theme === "light"
      ? "min-h-dvh bg-[rgb(var(--app-bg-rgb))] text-[#18181B]"
      : "min-h-dvh bg-[#0B0F14] text-white";

  return (Story) => (
    <SessionProvider
      session={{
        user: { name: "Elena Hoffmann", email: "elena@zecode.io" },
        expires: "2099-01-01",
      }}
    >
      <ZeMeetProvider session={session}>
        <ZeMeetPhaseInit phase={phase} startLive={options?.startLive}>
          <div className={shellClass}>
            <Story />
          </div>
        </ZeMeetPhaseInit>
      </ZeMeetProvider>
    </SessionProvider>
  );
}
