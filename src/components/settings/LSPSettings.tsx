
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
import { Input } from '@/components/ui/input';
import { Brain, Code, FileCode, Languages, Settings2 } from 'lucide-react';

interface LSPSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LSPSettings({ isOpen, onClose }: LSPSettingsProps) {
  const [enableLSP, setEnableLSP] = useState(true);
  const [autoComplete, setAutoComplete] = useState(true);
  const [diagnostics, setDiagnostics] = useState(true);
  const [codeActions, setCodeActions] = useState(true);
  const [formatOnSave, setFormatOnSave] = useState(true);
  
  const languageServers = [
    { id: 'typescript', name: 'TypeScript/JavaScript', installed: true, version: 'v0.19.2' },
    { id: 'python', name: 'Python (Pyright)', installed: true, version: 'v1.1.301' },
    { id: 'rust', name: 'Rust Analyzer', installed: false, version: '' },
    { id: 'golang', name: 'Go Language Server', installed: false, version: '' },
    { id: 'html', name: 'HTML/CSS/JSON', installed: true, version: 'v1.6.1' }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Language Server Protocol</SheetTitle>
          <SheetDescription>
            Configure IntelliSense and language server settings
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-lsp">Enable LSP</Label>
              <div className="text-xs text-muted-foreground">
                Provides intelligent code completion, diagnostics, and more
              </div>
            </div>
            <Switch
              id="enable-lsp"
              checked={enableLSP}
              onCheckedChange={setEnableLSP}
            />
          </div>
          
          <Separator />
          
          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Settings2 className="mr-2 h-4 w-4" />
              <span>Features</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-complete">IntelliSense Completions</Label>
                <Switch
                  id="auto-complete"
                  checked={autoComplete}
                  onCheckedChange={setAutoComplete}
                  disabled={!enableLSP}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="diagnostics">Error Diagnostics</Label>
                <Switch
                  id="diagnostics"
                  checked={diagnostics}
                  onCheckedChange={setDiagnostics}
                  disabled={!enableLSP}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="code-actions">Code Actions & Refactoring</Label>
                <Switch
                  id="code-actions"
                  checked={codeActions}
                  onCheckedChange={setCodeActions}
                  disabled={!enableLSP}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="format-save-lsp">Format on Save</Label>
                <Switch
                  id="format-save-lsp"
                  checked={formatOnSave}
                  onCheckedChange={setFormatOnSave}
                  disabled={!enableLSP}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Language Servers */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Languages className="mr-2 h-4 w-4" />
              <span>Language Servers</span>
            </h3>
            
            <div className="space-y-4">
              {languageServers.map((server) => (
                <div key={server.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{server.name}</p>
                      {server.installed && (
                        <p className="text-xs text-muted-foreground">{server.version}</p>
                      )}
                    </div>
                  </div>
                  
                  {server.installed ? (
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Configured
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Install
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button variant="secondary" size="sm" className="w-full mt-2">
              <Code className="mr-2 h-4 w-4" />
              Add Custom Language Server
            </Button>
          </div>
          
          <Separator />
          
          {/* Advanced */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center">
              <Brain className="mr-2 h-4 w-4" />
              <span>Advanced Settings</span>
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="lsp-timeout">Request Timeout (ms)</Label>
              <Input
                id="lsp-timeout"
                type="number"
                defaultValue="3000"
                disabled={!enableLSP}
              />
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
