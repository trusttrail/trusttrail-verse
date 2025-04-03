
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Toggle 
      aria-label="Toggle theme" 
      className="rounded-full p-2 hover:bg-muted/20 transition-colors relative overflow-hidden group"
      pressed={theme === "dark"}
      onPressedChange={toggleTheme}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-trustpurple-500/10 to-trustblue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
      {theme === "dark" ? (
        <Moon className="h-5 w-5 text-gold-400 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
      ) : (
        <Sun className="h-5 w-5 text-gold-400 relative z-10 transition-transform duration-300 group-hover:scale-110" />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
