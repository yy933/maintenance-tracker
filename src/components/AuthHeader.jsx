import { Wrench } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
export default function AuthHeader() {
  return (
    <div className="flex items-center justify-between gap-2">
      <a href="/" className="flex items-center gap-2 font-medium">
        <div className="flex shrink-0 size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Wrench className="size-4" />
        </div>
        Maintenance Tracker
      </a>
      <div className="shrink-0">
        <ModeToggle />
      </div>
    </div>
  );
}
