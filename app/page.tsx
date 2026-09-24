import { Assistant } from "@/components/assistant";
import { Home } from "@/components/home";
import { HomeProvider } from "@/hooks/use-home";

/**
 * The whole app. Two panels: the floorplan on the left, the assistant on the right.
 * Both read and change the same devices through HomeProvider (hooks/use-home.tsx).
 */
export default function Page() {
  return (
    <HomeProvider>
      <div className="flex h-dvh flex-col lg:flex-row">
        {/* The home takes whatever the assistant leaves; the plan inside caps its own width. */}
        <div className="min-w-0 shrink-0 border-b border-border lg:min-h-0 lg:flex-1 lg:border-r lg:border-b-0">
          <Home />
        </div>
        <div className="min-h-0 flex-1 lg:w-md lg:flex-none">
          <Assistant />
        </div>
      </div>
    </HomeProvider>
  );
}
