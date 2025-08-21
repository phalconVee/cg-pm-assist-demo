import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MilestoneProgress from '@/components/MilestoneProgress';
import HeaderNav from '@/components/shared/HeaderNav';
import Sidebar from '@/components/shared/Sidebar';
import { Info } from 'lucide-react';

const PersonalInfoForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    occupation: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    console.log('Personal info form data:', formData);
    // Navigate to next step
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
        <main className="flex-1 max-w-2xl mx-auto px-4 lg:px-8 py-8 w-full">
          <div className="space-y-8">
            {/* Form Title */}
            <h1 className="text-3xl font-bold text-foreground text-center">
              Let's get to know you better
            </h1>

            {/* Form */}
            <div className="space-y-6">
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    variant="tax"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleInitial" className="text-sm font-medium text-muted-foreground">
                    Middle initial (optional)
                  </Label>
                  <Input
                    id="middleInitial"
                    type="text"
                    value={formData.middleInitial}
                    onChange={(e) => handleInputChange('middleInitial', e.target.value)}
                    variant="tax"
                    className="w-full"
                    maxLength={1}
                  />
                </div>
              </div>

              {/* Last Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    variant="tax"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suffix" className="text-sm font-medium text-muted-foreground">
                    Jr, Sr, etc. (optional)
                  </Label>
                  <Input
                    id="suffix"
                    type="text"
                    value={formData.suffix}
                    onChange={(e) => handleInputChange('suffix', e.target.value)}
                    variant="tax"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                  Date of birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="text"
                  placeholder="mm/dd/yyyy"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  variant="tax"
                  className="w-full max-w-xs"
                />
              </div>

              {/* Occupation */}
              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-sm font-medium flex items-center space-x-1">
                  <span>Occupation or job title</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Label>
                <Input
                  id="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  variant="tax"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Example: Designer, Dentist, Retired
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-border mt-8 pt-8">
              {/* Continue Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleContinue}
                  className="px-8"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalInfoForm;