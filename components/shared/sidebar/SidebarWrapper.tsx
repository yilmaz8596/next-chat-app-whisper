import DesktopNav from "@/components/shared/sidebar/nav/DesktopNav";
import MobileNav from "@/components/shared/sidebar/nav/MobileNav";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function SidebarWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TooltipProvider>
      <div
        className="h-full w-full p-4 flex flex-col lg:flex-row gap-4"
        suppressHydrationWarning
      >
        <MobileNav />
        <DesktopNav />
        <main className="h-[calc(100%-80px)] lg:h-full w-full flex gap-4">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
