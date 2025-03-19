
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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { GitBranch, GitCommit, GitMerge, GitPullRequest, User } from 'lucide-react';

interface GitSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GitSettings({ isOpen, onClose }: GitSettingsProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [autoFetch, setAutoFetch] = useState(true);
  const [autoCommit, setAutoCommit] = useState(false);
  const [useSSH, setUseSSH] = useState(false);
  
  // Simulated repository state
  const [currentBranch, setCurrentBranch] = useState('main');
  const [repoStatus, setRepoStatus] = useState({
    added: 0,
    modified: 2,
    deleted: 0
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Git Integration</SheetTitle>
          <SheetDescription>
            Configure Git settings and view repository status
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Repository Status */}
          <div className="space-y-4">
            <h3 className="font-medium">Current Repository</h3>
            
            <div className="bg-secondary/50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <GitBranch className="mr-2 h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{currentBranch}</span>
              </div>
              
              <div className="text-sm text-muted-foreground grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Added: {repoStatus.added}</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  <span>Modified: {repoStatus.modified}</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <span>Deleted: {repoStatus.deleted}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <GitCommit className="h-3.5 w-3.5" />
                <span>Commit</span>
              </Button>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <GitBranch className="h-3.5 w-3.5" />
                <span>Branch</span>
              </Button>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <GitPullRequest className="h-3.5 w-3.5" />
                <span>Pull</span>
              </Button>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <GitMerge className="h-3.5 w-3.5" />
                <span>Merge</span>
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Git User Configuration */}
          <div className="space-y-4">
            <h3 className="font-medium">User Configuration</h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="git-username">Username</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    id="git-username"
                    placeholder="Your Git username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="git-email">Email</Label>
                <Input
                  id="git-email"
                  type="email"
                  placeholder="Your Git email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Git Preferences */}
          <div className="space-y-4">
            <h3 className="font-medium">Preferences</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-fetch">Auto fetch every 5 minutes</Label>
                <Switch
                  id="auto-fetch"
                  checked={autoFetch}
                  onCheckedChange={setAutoFetch}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-commit">Auto commit on save</Label>
                <Switch
                  id="auto-commit"
                  checked={autoCommit}
                  onCheckedChange={setAutoCommit}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="use-ssh">Use SSH for authentication</Label>
                <Switch
                  id="use-ssh"
                  checked={useSSH}
                  onCheckedChange={setUseSSH}
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
