
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

export default function EditorOptionsSettings() {
  const { editorSettings, updateEditorSettings } = useEditor();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your editor settings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Display</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="font-size" className="flex-1">Font Size: {editorSettings.fontSize}px</Label>
            <div className="w-32">
              <Slider
                id="font-size"
                defaultValue={[editorSettings.fontSize]}
                min={10}
                max={24}
                step={1}
                onValueChange={(value) => {
                  updateEditorSettings({ fontSize: value[0] });
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="minimap" className="flex-1">Show Minimap</Label>
            <Switch
              id="minimap"
              checked={editorSettings.minimap}
              onCheckedChange={(checked) => {
                updateEditorSettings({ minimap: checked });
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="line-numbers" className="flex-1">Show Line Numbers</Label>
            <Switch
              id="line-numbers"
              checked={editorSettings.lineNumbers}
              onCheckedChange={(checked) => {
                updateEditorSettings({ lineNumbers: checked });
              }}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Editor Behavior</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="word-wrap" className="flex-1">Word Wrap</Label>
            <Switch
              id="word-wrap"
              checked={editorSettings.wordWrap}
              onCheckedChange={(checked) => {
                updateEditorSettings({ wordWrap: checked });
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-brackets" className="flex-1">Auto Close Brackets</Label>
            <Switch
              id="auto-brackets"
              checked={editorSettings.autoClosingBrackets}
              onCheckedChange={(checked) => {
                updateEditorSettings({ autoClosingBrackets: checked });
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-indent" className="flex-1">Auto Indent</Label>
            <Switch
              id="auto-indent"
              checked={editorSettings.autoIndent}
              onCheckedChange={(checked) => {
                updateEditorSettings({ autoIndent: checked });
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="tab-size" className="flex-1">Tab Size: {editorSettings.tabSize}</Label>
            <div className="w-32">
              <Slider
                id="tab-size"
                defaultValue={[editorSettings.tabSize]}
                min={2}
                max={8}
                step={2}
                onValueChange={(value) => {
                  updateEditorSettings({ tabSize: value[0] });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end">
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
