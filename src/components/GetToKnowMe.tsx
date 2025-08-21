import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, User, Home, DollarSign } from 'lucide-react';

const GetToKnowMe = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const situations = [
    {
      id: 'employee',
      title: 'I received a W-2',
      description: 'I worked as an employee and received a W-2 form',
      icon: User,
      category: 'Employment'
    },
    {
      id: 'contractor',
      title: 'I worked as a contractor',
      description: 'I received 1099-NEC or other contractor payments',
      icon: DollarSign,
      category: 'Self-Employment'
    },
    {
      id: 'homeowner',
      title: 'I own a home',
      description: 'I own my primary residence',
      icon: Home,
      category: 'Property'
    },
    {
      id: 'student',
      title: 'I paid for education',
      description: 'I paid tuition or student loan interest',
      icon: User,
      category: 'Education'
    },
    {
      id: 'charity',
      title: 'I donated to charity',
      description: 'I made charitable contributions',
      icon: User,
      category: 'Deductions'
    },
    {
      id: 'investments',
      title: 'I have investments',
      description: 'I received dividends, sold stocks, or have investment income',
      icon: DollarSign,
      category: 'Investments'
    }
  ];

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleContinue = () => {
    // Navigate to next step - Personal Info
    console.log('Selected situations:', selectedOptions);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-foreground">
              Let's get to know you
            </h1>
            <div className="text-sm text-muted-foreground">
              Step 1 of 10
            </div>
          </div>
          <Progress value={10} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Tell us about your tax situation
            </h2>
            <p className="text-muted-foreground text-lg">
              Select all that apply to your 2024 tax year. This helps us customize your tax preparation experience.
            </p>
          </div>

          {/* Situation Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {situations.map((situation) => {
              const IconComponent = situation.icon;
              const isSelected = selectedOptions.includes(situation.id);
              
              return (
                <Card 
                  key={situation.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                      : 'hover:border-muted-foreground/20'
                  }`}
                  onClick={() => handleOptionToggle(situation.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">
                            {situation.title}
                          </h3>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {situation.description}
                        </p>
                        <div className="text-xs text-primary font-medium">
                          {situation.category}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Continue Section */}
          <div className="text-center space-y-4 pt-8">
            <p className="text-sm text-muted-foreground">
              Don't worry if you're not sure about something - you can always add or remove items later.
            </p>
            
            <Button 
              variant="tax" 
              size="xl" 
              className="px-12"
              onClick={handleContinue}
              disabled={selectedOptions.length === 0}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="text-xs text-muted-foreground">
              Selected {selectedOptions.length} item{selectedOptions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetToKnowMe;