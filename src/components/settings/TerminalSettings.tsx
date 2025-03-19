
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Terminal, TerminalSquare, Zap } from 'lucide-react';

interface TerminalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TerminalSettings({ isOpen, onClose }: TerminalSettingsProps) {
  const [shell, setShell] = useState('bash');
  const [terminalFont, setTerminalFont] = useState('SF Mono');
  const [cursorStyle, setCursorStyle] = useState('block');
  const [cursorBlink, setCursorBlink] = useState(true);
  const [scrollbackLimit, setScrollbackLimit] = useState(1000);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Terminal Settings</SheetTitle>
          <SheetDescription>
            Configure your integrated terminal
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Shell Selection */}
          <div className="space-y-3">
            <h3 className="font-medium">Shell Configuration</h3>
            
            <RadioGroup
              defaultValue={shell}
              onValueChange={setShell}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bash" id="bash" />
                <Label htmlFor="bash" className="flex items-center">
                  <Terminal className="mr-2 h-4 w-4" />
                  <span>Bash</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zsh" id="zsh" />
                <Label htmlFor="zsh" className="flex items-center">
                  <Terminal className="mr-2 h-4 w-4" />
                  <span>Zsh</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="powershell" id="powershell" />
                <Label htmlFor="powershell" className="flex items-center">
                  <TerminalSquare className="mr-2 h-4 w-4" />
                  <span>PowerShell</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cmd" id="cmd" />
                <Label htmlFor="cmd" className="flex items-center">
                  <TerminalSquare className="mr-2 h-4 w-4" />
                  <span>Command Prompt</span>
                </Label>
              </div>
            </RadioGroup>
            
            <div className="pt-2">
              <Label htmlFor="custom-shell" className="text-sm">Custom Shell Path (optional)</Label>
              <Input 
                id="custom-shell" 
                placeholder="/usr/local/bin/fish" 
                className="mt-1"
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="font-medium">Appearance</h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="terminal-font">Font Family</Label>
                <select
                  id="terminal-font"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={terminalFont}
                  onChange={(e) => setTerminalFont(e.target.value)}
                >
                  <option value="SF Mono">SF Mono</option>
                  <option value="Menlo">Menlo</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Consolas">Consolas</option>
                  <option value="Fira Code">Fira Code</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cursor-style">Cursor Style</Label>
                <select
                  id="cursor-style"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={cursorStyle}
                  onChange={(e) => setCursorStyle(e.target.value)}
                >
                  <option value="block">Block</option>
                  <option value="underline">Underline</option>
                  <option value="bar">Bar</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="cursor-blink">Cursor Blink</Label>
                <Switch
                  id="cursor-blink"
                  checked={cursorBlink}
                  onCheckedChange={setCursorBlink}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Performance */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Zap className="mr-2 h-4 w-4" />
              <span>Performance</span>
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="scrollback-limit">
                  Scrollback Limit: {scrollbackLimit} lines
                </Label>
                <Input
                  id="scrollback-limit"
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={scrollbackLimit}
                  onChange={(e) => setScrollbackLimit(parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="gpu-accel">GPU Acceleration</Label>
                <Switch
                  id="gpu-accel"
                  defaultChecked={true}
                />
              </div>
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
