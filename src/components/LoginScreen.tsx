import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, EyeOff, Shield } from 'lucide-react';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('taxpayer@example.com');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo
    if (password.length >= 6) {
      navigate('/welcome');
    }
  };

  const handleAlternativeAuth = () => {
    // For demo purposes, redirect to main flow
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-0 shadow-xl bg-card">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/f8e7318b-4db8-4850-9164-9290ab1fd7a1.png" 
                alt="Intuit Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Enter your TurboTax password
            </h1>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {/* Username Display */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="text-sm font-medium text-foreground">{email}</span>
                <button 
                  type="button"
                  className="text-sm text-primary hover:text-primary-hover underline"
                  onClick={() => setEmail('')}
                >
                  Use a different account
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter any 6+ characters password"
                      variant="tax"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="tax" 
                  size="xl" 
                  className="w-full"
                  disabled={password.length < 6}
                >
                  Continue
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">OR</span>
                </div>
              </div>

              {/* Alternative Authentication */}
              <Button 
                type="button"
                variant="tax-outline"
                size="xl"
                className="w-full"
                onClick={handleAlternativeAuth}
              >
                Text a code to (***) ***-**10
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <button 
                  type="button"
                  className="text-sm text-primary hover:text-primary-hover underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <button className="hover:text-foreground underline">Legal</button>
            <button className="hover:text-foreground underline">Privacy</button>
            <button className="hover:text-foreground underline">Security</button>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              TaxPro, QuickBooks, QB, TurboTax, ProConnect, Credit Karma, and Mailchimp are registered trademarks of TaxPro Inc.
            </p>
            <p>Terms and conditions, features, support, pricing, and service options subject to change without notice.</p>
            <p className="font-medium">© 2025 TaxPro, Inc. All rights reserved.</p>
          </div>

          <div className="pt-2">
            <button className="text-xs text-primary hover:text-primary-hover underline">
              TurboTax Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;