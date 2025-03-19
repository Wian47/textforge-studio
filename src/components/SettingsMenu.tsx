
import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppearanceSettings from './settings/AppearanceSettings';
import EditorOptionsSettings from './settings/EditorOptionsSettings';

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Safe close function that ensures we properly update state
  const handleClose = () => {
    setIsOpen(false);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <SettingsIcon size={18} />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 sm:w-96 overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your editor experience
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="appearance">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
            <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>
          
          <TabsContent value="editor">
            <EditorOptionsSettings />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
