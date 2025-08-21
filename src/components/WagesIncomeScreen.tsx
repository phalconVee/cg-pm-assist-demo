import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import HeaderNav from './shared/HeaderNav';
import Sidebar from './shared/Sidebar';
import MilestoneProgress from './MilestoneProgress';

const WagesIncomeScreen = () => {
  const navigate = useNavigate();

  const handleAddIncome = () => {
    // Navigate to next step or show income form
    console.log('Add income clicked');
  };

  const handleSkip = () => {
    // Skip to next section
    console.log('Skip clicked');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderNav />

        {/* Progress Bar */}
        <MilestoneProgress />

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 lg:px-8 py-8 w-full">
          <div className="text-center space-y-6">
            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-foreground">
                Let's talk about your income next
              </h1>
              <p className="text-lg text-muted-foreground">
                If you earned it, we cover it--from W-2s to winning the lottery!
              </p>
            </div>

            {/* Info link */}
            <div className="pt-4">
              <button className="text-primary hover:underline">
                What's new with income tax rates this year?
              </button>
            </div>

            {/* Illustration area */}
            <div className="py-12 flex justify-center">
              <div className="w-80 h-60 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full"></div>
                <div className="absolute top-8 right-8 w-12 h-12 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-4 left-8 w-6 h-6 bg-white/25 rounded-full"></div>
                
                {/* Central illustration placeholder */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <div className="text-emerald-700 font-medium">Income Sources</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4 pt-8">
              <Button 
                variant="outline" 
                onClick={handleSkip}
                className="px-8 py-3"
              >
                Skip (PreProd)
              </Button>
              <Button 
                onClick={handleAddIncome}
                className="px-8 py-3 bg-primary hover:bg-primary/90"
              >
                Add my income
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WagesIncomeScreen;