import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function PhoneShell({
  children,
  showNav = true,
}: {
  children: ReactNode;
  showNav?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-muted/40 md:py-10">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-background md:min-h-[860px] md:rounded-[2.75rem] md:border md:border-border md:shadow-card">
        <div className="relative flex-1 overflow-y-auto pb-32 no-scrollbar">
          {children}
        </div>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
