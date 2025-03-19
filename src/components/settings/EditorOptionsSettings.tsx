
import React from 'react';
import { useEditor } from '@/context/EditorContext';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';

interface EditorOptionsSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditorOptionsSettings({ isOpen, onClose }: EditorOptionsSettingsProps) {
  const { editorSettings, updateEditorSettings } = useEditor();
  
  const handleIndentSizeChange = (value: number[]) => {
    updateEditorSettings({ tabSize: value[0] });
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your editor settings have been updated."
    });
    onClose();
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={() => onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Editor Options</SheetTitle>
          <SheetDescription>
            Configure your editing preferences
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="word-wrap">Word Wrap</Label>
              <Switch
                id="word-wrap"
                checked={editorSettings.wordWrap}
                onCheckedChange={(checked) => updateEditorSettings({ wordWrap: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="line-numbers">Show Line Numbers</Label>
              <Switch
                id="line-numbers"
                checked={editorSettings.lineNumbers}
                onCheckedChange={(checked) => updateEditorSettings({ lineNumbers: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-brackets">Auto Closing Brackets</Label>
              <Switch
                id="auto-brackets"
                checked={editorSettings.autoClosingBrackets}
                onCheckedChange={(checked) => updateEditorSettings({ autoClosingBrackets: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-indent">Auto Indent</Label>
              <Switch
                id="auto-indent"
                checked={editorSettings.autoIndent}
                onCheckedChange={(checked) => updateEditorSettings({ autoIndent: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="format-save">Format on Save</Label>
              <Switch
                id="format-save"
                checked={editorSettings.formatOnSave}
                onCheckedChange={(checked) => updateEditorSettings({ formatOnSave: checked })}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tab-size">Tab Size: {editorSettings.tabSize}</Label>
              <Slider
                id="tab-size"
                min={1}
                max={8}
                step={1}
                value={[editorSettings.tabSize]}
                onValueChange={handleIndentSizeChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keybindings">Keybindings</Label>
              <select
                id="keybindings"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue="vscode"
              >
                <option value="vscode">VS Code</option>
                <option value="vim">Vim</option>
                <option value="emacs">Emacs</option>
                <option value="sublime">Sublime Text</option>
              </select>
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
