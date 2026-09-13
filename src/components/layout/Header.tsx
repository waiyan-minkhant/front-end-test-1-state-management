import { UserMenu } from "@/components/auth/UserMenu";

export function Header() {
  return (
    <header className="border-b bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow-sm"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div>
          <p className="text-sm text-muted-foreground">Roster workspace</p>
          <h1 className="text-lg font-semibold tracking-tight">Team Manager</h1>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
