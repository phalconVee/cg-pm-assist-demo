import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';

const MilestoneProgress = () => {
  const location = useLocation();
  const [showProgress, setShowProgress] = useState(true);
  
  const milestones = [
    { id: 'my-info', label: 'My Info', routes: ['/personal-info', '/get-to-know-me'] },
    { id: 'federal', label: 'Federal', routes: ['/wages-income', '/deductions-credits', '/other-situations', '/federal-review'] },
    { id: 'state', label: 'State', routes: ['/state-taxes'] },
    { id: 'review', label: 'Review', routes: ['/final-review', '/finish-file'] }
  ];

  // Determine current milestone index based on route
  const getCurrentMilestoneIndex = () => {
    for (let i = 0; i < milestones.length; i++) {
      if (milestones[i].routes.includes(location.pathname)) {
        return i;
      }
    }
    return 0; // Default to first milestone
  };

  const currentIndex = getCurrentMilestoneIndex();

  return (
    <div className="w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        <div className="relative">
          {/* Desktop View */}
          <div className="hidden md:flex items-center justify-between mb-4">
            {/* Toggle Switch - Always visible */}
            <div className="mr-8">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                {!showProgress && <span>Show progress</span>}
                <Switch
                  checked={showProgress}
                  onCheckedChange={setShowProgress}
                  className="data-[state=checked]:bg-black data-[state=unchecked]:bg-toggle-off data-[state=unchecked]:border-toggle-off data-[state=checked]:border-black"
                />
              </label>
            </div>
            
            {/* Progress indicators - Only show when toggled on */}
            {showProgress && (
              <div className="flex items-center justify-between flex-1">
                {milestones.map((milestone, index) => (
                  <React.Fragment key={milestone.id}>
                    {/* Milestone Circle and Label */}
                    <div className="flex flex-col items-center relative z-10">
                      <div 
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-progress-active border-progress-active shadow-md' 
                            : index < currentIndex 
                            ? 'bg-progress-active border-progress-active' 
                            : 'bg-background border-muted-foreground/30'
                        }`}
                      />
                      <span 
                        className={`text-sm mt-2 font-medium transition-colors duration-300 ${
                          index === currentIndex 
                            ? 'text-progress-active' 
                            : index < currentIndex 
                            ? 'text-progress-active' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        {milestone.label}
                      </span>
                    </div>
                    
                    {/* Progress Line (don't show after last milestone) */}
                    {index < milestones.length - 1 && (
                      <div className="flex-1 h-0.5 mx-4 bg-muted-foreground/20 relative">
                        <div 
                          className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                            index < currentIndex ? 'bg-progress-active w-full' : 'bg-progress-active w-0'
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              {showProgress && (
                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm font-medium text-progress-active">
                    {milestones[currentIndex]?.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currentIndex + 1} of {milestones.length}
                  </span>
                </div>
              )}
              
              {/* Toggle Switch - Mobile */}
              <div className={showProgress ? "ml-4" : "ml-auto"}>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  {!showProgress && <span>Show progress</span>}
                  <Switch
                    checked={showProgress}
                    onCheckedChange={setShowProgress}
                    className="data-[state=checked]:bg-black data-[state=unchecked]:bg-toggle-off data-[state=unchecked]:border-toggle-off data-[state=checked]:border-black"
                  />
                </label>
              </div>
            </div>
            
            {/* Mobile Progress Bar */}
            {showProgress && (
              <>
                <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                  <div 
                    className="bg-progress-active h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentIndex + 1) / milestones.length) * 100}%` }}
                  />
                </div>
                
                {/* Mobile Milestone Indicators */}
                <div className="flex justify-between mt-2">
                  {milestones.map((milestone, index) => (
                    <div 
                      key={milestone.id}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index <= currentIndex ? 'bg-progress-active' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgress;