// TaxProgressScreen component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, User, FileText, DollarSign, CreditCard, AlertCircle, MapPin, Eye, Upload, ExternalLink } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import HeaderNav from '@/components/shared/HeaderNav';

const TaxProgressScreen = () => {
  const navigate = useNavigate();
  
  const milestones = [
    {
      id: 'personal-info',
      title: 'Personal Info',
      icon: User,
      status: 'completed',
      description: "You've already worked on this section. Let us know if you want to review your info or make any changes."
    },
    {
      id: 'wages-income',
      title: 'Wages & Income',
      icon: DollarSign,
      status: 'current',
      description: ''
    },
    {
      id: 'deductions-credits',
      title: 'Deductions & Credits',
      icon: CreditCard,
      status: 'pending',
      description: ''
    },
    {
      id: 'other-situations',
      title: 'Other Tax Situations',
      icon: AlertCircle,
      status: 'pending',
      description: ''
    },
    {
      id: 'state-taxes',
      title: 'State Taxes',
      icon: MapPin,
      status: 'pending',
      description: ''
    },
    {
      id: 'review',
      title: 'Review',
      icon: Eye,
      status: 'pending',
      description: ''
    },
    {
      id: 'finish-file',
      title: 'Finish & File',
      icon: Upload,
      status: 'pending',
      description: ''
    }
  ];

  const getStatusIcon = (status: string, index: number) => {
    if (status === 'completed') {
      return (
        <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center flex-shrink-0 relative z-10 border-2 border-background">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      );
    } else if (status === 'current') {
      return (
        <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center flex-shrink-0 relative z-10 border-2 border-background">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      );
    } else {
      return (
        <div className="w-4 h-4 border-2 border-muted-foreground rounded-full flex-shrink-0 relative z-10 bg-background"></div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex w-[200px] bg-sidebar-bg flex-col">
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

        {/* Navigation Menu */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start relative overflow-hidden" style={{ backgroundColor: '#dfdfd8' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#db334d' }}></div>
              <span className="text-foreground relative z-10">Tax Home</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              Documents
            </Button>
          </div>
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-border/50">
          <div className="space-y-1 text-sm text-muted-foreground">
            <button className="block hover:text-foreground transition-colors">
              Refer and Earn
            </button>
            <button className="block hover:text-foreground transition-colors">
              Intuit Account
            </button>
            <button className="block hover:text-foreground transition-colors">
              Cambiar a español
            </button>
            <button className="block hover:text-foreground transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderNav />

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
          <div className="space-y-8">
            {/* Welcome Message */}
            <h1 className="text-3xl font-bold text-foreground text-center">
              Hi, let's keep working on your taxes!
            </h1>

            {/* Progress Timeline */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-2 top-8 bottom-8 w-0.5 bg-success"></div>
                
                <div className="space-y-6">
                  {milestones.map((milestone, index) => {
                    const Icon = milestone.icon;
                    const isExpanded = milestone.status === 'completed';
                    
                    return (
                      <div key={milestone.id} className="relative flex items-start space-x-4">
                        {getStatusIcon(milestone.status, index)}
                        
                        <div className="flex-1 bg-white border border-border rounded-lg">
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-3">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium text-foreground">{milestone.title}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-border">
                              <p className="text-sm text-muted-foreground mt-3 mb-4">
                                {milestone.description}
                              </p>
                              <Button 
                                variant="default" 
                                className="w-full"
                                onClick={() => navigate('/personal-info')}
                              >
                                Review/Edit
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Accordions */}
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible>
                <AccordionItem value="account">
                  <AccordionTrigger className="flex items-center space-x-3 py-4">
                    <ExternalLink className="h-4 w-4" />
                    <span>Your account</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    Account details and settings will be displayed here.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="documents">
                  <AccordionTrigger className="flex items-center space-x-3 py-4">
                    <FileText className="h-4 w-4" />
                    <span>Your tax returns & documents</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    Tax documents and returns will be displayed here.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaxProgressScreen;