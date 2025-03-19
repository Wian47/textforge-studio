
import React from 'react';
import { EditorProvider } from '@/context/EditorContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MonacoEditor from '@/components/Editor';
import StatusBar from '@/components/StatusBar';

const Index = () => {
  return (
    <EditorProvider>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <MonacoEditor />
          </div>
        </div>
        <StatusBar />
      </div>
    </EditorProvider>
  );
};

export default Index;
