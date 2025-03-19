
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';

interface EditorOptionsSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditorOptionsSettings({ isOpen, onClose }: EditorOptionsSettingsProps) {
  const [tabSize, setTabSize] = useState(2);
  const [wordWrap, setWordWrap] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [autoClosingBrackets, setAutoClosingBrackets] = useState(true);
  const [autoIndent, setAutoIndent] = useState(true);
  const [formatOnSave, setFormatOnSave] = useState(true);
  const [indentSize, setIndentSize] = useState(2);
  
  const handleIndentSizeChange = (value: number[]) => {
    setIndentSize(value[0]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
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
                checked={wordWrap}
                onCheckedChange={setWordWrap}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="line-numbers">Show Line Numbers</Label>
              <Switch
                id="line-numbers"
                checked={lineNumbers}
                onCheckedChange={setLineNumbers}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-brackets">Auto Closing Brackets</Label>
              <Switch
                id="auto-brackets"
                checked={autoClosingBrackets}
                onCheckedChange={setAutoClosingBrackets}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-indent">Auto Indent</Label>
              <Switch
                id="auto-indent"
                checked={autoIndent}
                onCheckedChange={setAutoIndent}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="format-save">Format on Save</Label>
              <Switch
                id="format-save"
                checked={formatOnSave}
                onCheckedChange={setFormatOnSave}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tab-size">Tab Size: {indentSize}</Label>
              <Slider
                id="tab-size"
                min={1}
                max={8}
                step={1}
                defaultValue={[indentSize]}
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
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button>Save Changes</Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
