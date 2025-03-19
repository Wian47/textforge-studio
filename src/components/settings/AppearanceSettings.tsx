import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppearanceSettings() {
  const { theme, toggleTheme } = useEditor();
  const { toast } = useToast();
  
  const handleThemeChange = (value: string) => {
    toggleTheme(value as 'light' | 'dark' | 'system');
    toast({
      title: "Theme updated",
      description: `Theme set to ${value} mode`,
      duration: 2000,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Theme</h3>
        
        <RadioGroup 
          value={theme} 
          onValueChange={handleThemeChange}
          className="grid grid-cols-3 gap-2"
        >
          <Label
            htmlFor="theme-light"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground",
              theme === "light" ? "border-primary" : "border-muted"
            )}
          >
            <RadioGroupItem value="light" id="theme-light" className="sr-only" />
            <Sun size={18} className="mb-3 text-yellow-500" />
            <span className="text-xs font-medium">Light</span>
          </Label>
          
          <Label
            htmlFor="theme-dark"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground",
              theme === "dark" ? "border-primary" : "border-muted"
            )}
          >
            <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
            <Moon size={18} className="mb-3 text-blue-400" />
            <span className="text-xs font-medium">Dark</span>
          </Label>
          
          <Label
            htmlFor="theme-system"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground",
              theme === "system" ? "border-primary" : "border-muted"
            )}
          >
            <RadioGroupItem value="system" id="theme-system" className="sr-only" />
            <Monitor size={18} className="mb-3 text-green-400" />
            <span className="text-xs font-medium">System</span>
          </Label>
        </RadioGroup>
      </div>
    </div>
  );
}
