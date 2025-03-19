
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { Sun, Moon, Monitor as DisplayIcon } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

interface AppearanceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppearanceSettings({ isOpen, onClose }: AppearanceSettingsProps) {
  const { theme, toggleTheme, editorSettings, updateEditorSettings } = useEditor();
  
  const handleFontSizeChange = (value: number[]) => {
    updateEditorSettings({ fontSize: value[0] });
  };
  
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateEditorSettings({ fontFamily: e.target.value });
  };
  
  const handleMinimapToggle = (checked: boolean) => {
    updateEditorSettings({ minimap: checked });
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your appearance settings have been updated."
    });
    onClose();
  };
  
  // Prevent event propagation to avoid issues with event bubbling
  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Appearance Settings</SheetTitle>
          <SheetDescription>
            Customize the look and feel of your editor
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Theme</h4>
            <RadioGroup defaultValue={theme} className="grid grid-cols-3 gap-4" onValueChange={(value) => toggleTheme(value as 'light' | 'dark' | 'system')}>
              <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Sun className="mb-3 h-6 w-6" />
                  <span className="text-xs">Light</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Moon className="mb-3 h-6 w-6" />
                  <span className="text-xs">Dark</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <DisplayIcon className="mb-3 h-6 w-6" />
                  <span className="text-xs">System</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size: {editorSettings.fontSize}px</Label>
              <Slider
                id="font-size"
                min={10}
                max={24}
                step={1}
                value={[editorSettings.fontSize]}
                onValueChange={handleFontSizeChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <select
                id="font-family"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editorSettings.fontFamily.split(',')[0]}
                onChange={handleFontFamilyChange}
              >
                <option value="SF Mono">SF Mono</option>
                <option value="Menlo">Menlo</option>
                <option value="Monaco">Monaco</option>
                <option value="Consolas">Consolas</option>
                <option value="Fira Code">Fira Code</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="show-minimap">Show Minimap</Label>
              <Switch
                id="show-minimap"
                checked={editorSettings.minimap}
                onCheckedChange={handleMinimapToggle}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} type="button">
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
