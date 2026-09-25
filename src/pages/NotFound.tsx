import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Brand";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6">
        <Logo />
      </header>
      <main className="grid flex-1 place-items-center px-6 pb-24 text-center">
        <div>
          <div className="font-display text-[120px] leading-none text-vermilion sm:text-[180px]">404</div>
          <h1 className="font-display text-4xl">Nothing priced here.</h1>
          <p className="mx-auto mt-3 max-w-sm text-mute">The page you're after doesn't exist — but your next rate card could.</p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild>
              <Link to="/app">Open RateCraft</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
