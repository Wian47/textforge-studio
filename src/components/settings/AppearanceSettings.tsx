
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
          className="grid grid-cols-1 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="theme-light" />
            <Label htmlFor="theme-light">Light</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="theme-dark" />
            <Label htmlFor="theme-dark">Dark</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="theme-system" />
            <Label htmlFor="theme-system">System</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
