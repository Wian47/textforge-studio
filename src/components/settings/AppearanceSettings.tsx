
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function AppearanceSettings() {
  const { theme, toggleTheme } = useEditor();
  const { toast } = useToast();
  
  const handleThemeChange = (value: string) => {
    toggleTheme(value as 'light' | 'dark' | 'system');
    toast({
      title: "Theme updated",
      description: `Theme set to ${value} mode`,
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
          <div className={cn(
            "flex flex-col items-center space-y-2 border rounded-md p-3 transition-all",
            theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}>
            <RadioGroupItem value="light" id="theme-light" className="sr-only" />
            <Sun size={18} className="text-yellow-500" />
            <Label htmlFor="theme-light" className="text-xs font-medium">Light</Label>
          </div>
          
          <div className={cn(
            "flex flex-col items-center space-y-2 border rounded-md p-3 transition-all",
            theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}>
            <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
            <Moon size={18} className="text-blue-400" />
            <Label htmlFor="theme-dark" className="text-xs font-medium">Dark</Label>
          </div>
          
          <div className={cn(
            "flex flex-col items-center space-y-2 border rounded-md p-3 transition-all",
            theme === "system" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}>
            <RadioGroupItem value="system" id="theme-system" className="sr-only" />
            <Monitor size={18} className="text-green-400" />
            <Label htmlFor="theme-system" className="text-xs font-medium">System</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
