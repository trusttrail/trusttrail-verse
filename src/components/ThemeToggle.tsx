
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Toggle 
      aria-label="Toggle theme" 
      className="rounded-full p-2 hover:bg-muted/20 transition-colors"
      pressed={theme === "dark"}
      onPressedChange={toggleTheme}
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 text-gold-400" />
      ) : (
        <Sun className="h-5 w-5 text-gold-400" />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
