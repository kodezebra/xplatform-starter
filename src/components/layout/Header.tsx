import { Menu, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context/AppContext";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  onMenuClick?: () => void;
}

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useApp();
  const ThemeIcon = icons[theme];

  const cycleTheme = () => {
    const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            title={`Theme: ${theme}`}
          >
            <ThemeIcon className="size-4" />
          </Button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
