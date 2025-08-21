import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, HelpCircle, User } from 'lucide-react';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/tax-progress');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-[200px] bg-sidebar-bg flex flex-col">
        {/* Logo Section */}
        <div className="p-8 flex justify-start">
          <img 
            src="/lovable-uploads/792cb605-74c5-43c0-920c-f403fd17fab8.png" 
            alt="Intuit TurboTax"
            className="h-8 w-auto"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) {
                target.style.display = 'none';
                fallback.style.display = 'flex';
              }
            }}
          />
          <div className="hidden items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-semibold text-foreground">
              TurboTax
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-border shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center h-16">
              {/* Right side navigation */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Search className="h-4 w-4 mr-1" />
                  Search
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Help
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
          <div className="text-center space-y-12">
            {/* Welcome Message */}
            <h1 className="text-4xl font-bold text-foreground mb-8">
              We're glad you're here!
            </h1>

            {/* Illustration */}
            <div className="relative mx-auto w-80 h-64 mb-12">
              <img 
                src="/lovable-uploads/b50b76a7-8816-4780-98d4-c8465d568882.png"
                alt="Friendly customer service representative waving"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Expectations Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-foreground">
                Here's what to expect:
              </h2>
              
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <p className="text-lg text-muted-foreground">
                    Answer simple questions about your year
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg text-muted-foreground">
                    Get quick, personalized answers when you need them
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg text-muted-foreground">
                    Never feel alone with access to real experts
                  </p>
                </div>
              </div>
            </div>

            {/* Get Started Button */}
            <div className="pt-8">
              <div className="w-full h-px bg-border mb-8"></div>
              <Button 
                variant="tax" 
                size="xl" 
                className="px-12"
                onClick={handleGetStarted}
              >
                Got it
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WelcomeScreen;