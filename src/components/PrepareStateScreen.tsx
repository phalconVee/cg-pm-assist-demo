import React from 'react';
import HeaderNav from './shared/HeaderNav';
import Sidebar from './shared/Sidebar';

const PrepareStateScreen = () => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderNav />

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              Prepare State
            </h1>
            <p className="text-muted-foreground">
              This screen is under construction.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrepareStateScreen;