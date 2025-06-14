
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Toggle 
      aria-label="Toggle theme" 
      className="rounded-full p-2 hover:bg-muted/30 transition-all duration-300 relative overflow-hidden group border border-border/50"
      pressed={theme === "dark"}
      onPressedChange={toggleTheme}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-trustpurple-500/5 to-trustblue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
      {theme === "dark" ? (
        <Moon className="h-4 w-4 text-gold-400 relative z-10 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
      ) : (
        <Sun className="h-4 w-4 text-gold-500 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
