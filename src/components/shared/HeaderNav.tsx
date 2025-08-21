import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, HelpCircle, Search, Menu, X, ChevronDown, ChevronRight, ShoppingCart, Clock } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import RightHandPane from './RightHandPane';

const HeaderNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isRightPaneOpen, setIsRightPaneOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleBadgeClick = (badgeText: string) => {
    if (!selectedChips.includes(badgeText)) {
      setSelectedChips(prev => [...prev, badgeText]);
    }
    // Focus the input after setting the chip
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const removeChip = (chipToRemove: string) => {
    setSelectedChips(prev => prev.filter(chip => chip !== chipToRemove));
  };

  const handleSearchSubmit = () => {
    const fullQuery = [...selectedChips, searchValue].filter(Boolean).join(' ');
    if (fullQuery.trim()) {
      setInitialSearchQuery(fullQuery.trim());
      setIsRightPaneOpen(true);
      setIsCommandOpen(false);
      setSearchValue('');
      setSelectedChips([]);
    }
  };

  const handleSearchItemClick = (searchText: string) => {
    setInitialSearchQuery(searchText);
    setIsRightPaneOpen(true);
    setIsCommandOpen(false);
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mobile Sidebar Component
  const MobileSidebar = () => {
    const [mobileExpandedMenus, setMobileExpandedMenus] = useState<string[]>([]);

    const toggleMobileMenu = (menuId: string) => {
      setMobileExpandedMenus(prev => 
        prev.includes(menuId) 
          ? prev.filter(id => id !== menuId)
          : [...prev, menuId]
      );
    };

    return (
      <div className="w-full bg-sidebar-bg flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 flex justify-start border-b border-border/20">
          <img 
            src="/lovable-uploads/792cb605-74c5-43c0-920c-f403fd17fab8.png" 
            alt="Intuit TurboTax"
            className="h-6 w-auto"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4">
          <div className="space-y-1 mb-6">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              Tax Home
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              Documents
            </Button>
          </div>

          {/* Separator */}
          <div className="border-t my-4 -mx-4" style={{ borderColor: '#adbac2' }}></div>

          {/* 2024 TAXES Section */}
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              2024 TAXES
            </div>
            <Button variant="ghost" className="w-full justify-start relative overflow-hidden" style={{ backgroundColor: '#dfdfd8' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#db334d' }}></div>
              <span className="text-foreground relative z-10">My Info</span>
            </Button>
            
            {/* Federal Menu */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => toggleMobileMenu('federal')}
            >
              Federal
              {mobileExpandedMenus.includes('federal') ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
            {mobileExpandedMenus.includes('federal') && (
              <div className="ml-4 space-y-1 mb-2 animate-accordion-down overflow-hidden">
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground py-1 h-8">
                  Wages & Income
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground py-1 h-8">
                  Deductions & Credits
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground py-1 h-8">
                  Other Tax Situations
                </Button>
              </div>
            )}
            
            {/* State Taxes Menu */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => toggleMobileMenu('state-taxes')}
            >
              State Taxes
              {mobileExpandedMenus.includes('state-taxes') ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
            {mobileExpandedMenus.includes('state-taxes') && (
              <div className="ml-4 space-y-1 mb-2 animate-accordion-down overflow-hidden">
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground py-1 h-8">
                  Prepare State
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground py-1 h-8">
                  Your State Returns
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground py-1 h-8">
                  State Review
                </Button>
              </div>
            )}
            
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              Review
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              File
            </Button>
            <div className="border-t my-2 -mx-4" style={{ borderColor: '#adbac2' }}></div>
            
            {/* Tax Tools Menu */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => toggleMobileMenu('tax-tools')}
            >
              Tax Tools
              {mobileExpandedMenus.includes('tax-tools') ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
            {mobileExpandedMenus.includes('tax-tools') && (
              <div className="ml-4 space-y-1 mb-2 animate-accordion-down overflow-hidden">
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground py-1 h-8">
                  Tools
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground py-1 h-8">
                  Print Center
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    );
  };

  return (
    <header className="bg-white border-b border-border shadow-sm relative">
      <div className="px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16 relative">
          {/* Mobile Menu Button & Logo */}
          <div className="lg:hidden flex items-center space-x-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <MobileSidebar />
              </SheetContent>
            </Sheet>
            <img 
              src="/lovable-uploads/792cb605-74c5-43c0-920c-f403fd17fab8.png" 
              alt="Intuit TurboTax"
              className="h-6 w-auto"
            />
          </div>

          {/* Left side - Federal refund info (Desktop) */}
          <div className="hidden lg:flex w-48 items-center space-x-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Federal refund</span>
              <div className="text-2xl font-bold text-nav-refund">$0</div>
            </div>
          </div>
          
          {/* Center - Search Bar */}
          <div className={`flex-1 max-w-2xl mx-4 relative transition-all duration-300 ${isRightPaneOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* Desktop Search Bar */}
            <div 
              className={`hidden lg:block relative cursor-pointer transition-opacity duration-200 ${isCommandOpen ? 'opacity-0' : 'opacity-100'}`}
              onClick={() => setIsCommandOpen(true)}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search"
                className="pl-10 pr-20 bg-transparent border border-border rounded-full h-10 cursor-pointer"
                readOnly
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  CTRL
                </kbd>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  K
                </kbd>
              </div>
            </div>

            {/* Expanded Search Dialog */}
            {isCommandOpen && (
              <div className="fixed lg:absolute top-0 left-0 right-0 lg:left-0 lg:right-0 z-50 bg-white border border-border lg:rounded-lg shadow-lg w-full lg:w-auto">
                <Command className="w-full">
                  <div className="flex items-center border-b relative">
                    <div className="flex items-center flex-1 px-3 py-2 min-h-[44px] flex-wrap gap-1">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      {/* Selected Chips */}
                      {selectedChips.map((chip, index) => (
                        <Badge 
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 text-xs"
                          style={{ backgroundColor: '#ebebeb', color: '#333' }}
                        >
                          {chip}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:opacity-70" 
                            onClick={() => removeChip(chip)}
                          />
                        </Badge>
                      ))}
                      <input
                        ref={inputRef}
                        placeholder={selectedChips.length > 0 ? "" : "Search..."}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearchSubmit();
                          }
                        }}
                        className="flex-1 min-w-[100px] h-7 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        autoFocus
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCommandOpen(false)}
                      className="mr-3 h-8 w-8 p-0 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Search Categories */}
                  <div className="flex flex-wrap gap-2 p-3">
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: '#ebebeb', color: '#333' }}
                      onClick={() => handleBadgeClick('W-2')}
                    >
                      W-2
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: '#ebebeb', color: '#333' }}
                      onClick={() => handleBadgeClick('Form 1040')}
                    >
                      Form 1040
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: '#ebebeb', color: '#333' }}
                      onClick={() => handleBadgeClick('Federal Taxes')}
                    >
                      Federal Taxes
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: '#ebebeb', color: '#333' }}
                      onClick={() => handleBadgeClick('State Taxes')}
                    >
                      State Taxes
                    </Badge>
                  </div>

                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggested searches">
                      <CommandItem className="cursor-pointer" onSelect={() => handleSearchItemClick('Can you explain Form 1040?')}>
                        <Search className="mr-2 h-4 w-4" />
                        <span>Can you explain Form 1040?</span>
                      </CommandItem>
                      <CommandItem className="cursor-pointer" onSelect={() => handleSearchItemClick('How can I file an extension for my state taxes?')}>
                        <Search className="mr-2 h-4 w-4" />
                        <span>How can I file an extension for my state taxes?</span>
                      </CommandItem>
                      <CommandItem className="cursor-pointer" onSelect={() => handleSearchItemClick('How do I file an IRS tax extension?')}>
                        <Search className="mr-2 h-4 w-4" />
                        <span>How do I file an IRS tax extension?</span>
                      </CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Recent searches">
                      <CommandItem onSelect={() => handleSearchItemClick('I have three kids, two in college, one lives with their dad')}>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>I have three kids, two in college, one lives with their dad</span>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}

            {/* Backdrop to close search */}
            {isCommandOpen && (
              <div 
                className="fixed inset-0 z-40 bg-black/20"
                onClick={() => setIsCommandOpen(false)}
              />
            )}
          </div>
          
          {/* Right side navigation */}
          <div className={`flex items-center space-x-1 lg:space-x-2 justify-end transition-all duration-300 ${isRightPaneOpen ? 'lg:w-20 lg:mr-96' : 'lg:w-48'}`}>
            {/* Mobile - Icons only */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden text-muted-foreground hover:text-foreground p-2"
              onClick={() => setIsCommandOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden text-muted-foreground hover:text-foreground p-2"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden text-muted-foreground hover:text-foreground p-2"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden text-muted-foreground hover:text-foreground p-2"
              onClick={() => setIsRightPaneOpen(true)}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            {/* Desktop - Full Navigation */}
            <Button variant="ghost" size="sm" className="hidden lg:flex text-muted-foreground hover:text-foreground items-center space-x-1">
              <Bell className="h-4 w-4" />
              <span className={`text-xs transition-all duration-300 ${isRightPaneOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Notifications</span>
            </Button>
            <Button variant="ghost" size="sm" className="hidden lg:flex text-muted-foreground hover:text-foreground items-center space-x-1">
              <ShoppingCart className="h-4 w-4" />
              <span className={`text-xs transition-all duration-300 ${isRightPaneOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Price preview</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden lg:flex text-muted-foreground hover:text-foreground items-center space-x-1"
              onClick={() => setIsRightPaneOpen(true)}
            >
              <HelpCircle className="h-4 w-4" />
              <span className={`text-xs transition-all duration-300 ${isRightPaneOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Help</span>
            </Button>
            <Button variant="outline" size="sm" className="hidden lg:flex text-primary border-primary text-xs">
              Live tax advice
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right Hand Pane */}
        <RightHandPane 
          isOpen={isRightPaneOpen} 
          onClose={() => setIsRightPaneOpen(false)} 
          initialSearchQuery={initialSearchQuery}
        />
    </header>
  );
};

export default HeaderNav;