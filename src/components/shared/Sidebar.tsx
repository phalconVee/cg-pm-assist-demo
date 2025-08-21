import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active states based on current route
  const getActiveStates = () => {
    const pathname = location.pathname;
    
    // Determine which items should be active
    let activeMainItem = '';
    let activeSubItem = '';
    let expandMenu = '';
    
    if (pathname === '/personal-info') {
      activeMainItem = 'my-info';
    } else if (pathname === '/wages-income') {
      activeSubItem = 'Wages & Income';
      expandMenu = 'federal';
    } else if (pathname === '/deductions-credits') {
      activeSubItem = 'Deductions & Credits';
      expandMenu = 'federal';
    } else if (pathname === '/other-tax-situations') {
      activeSubItem = 'Other Tax Situations';
      expandMenu = 'federal';
    } else if (pathname === '/prepare-state') {
      activeSubItem = 'Prepare State';
      expandMenu = 'state-taxes';
    } else if (pathname === '/your-state-returns') {
      activeSubItem = 'Your State Returns';
      expandMenu = 'state-taxes';
    } else if (pathname === '/state-review') {
      activeSubItem = 'State Review';
      expandMenu = 'state-taxes';
    } else if (pathname === '/review') {
      activeMainItem = 'review';
    } else if (pathname === '/file') {
      activeMainItem = 'file';
    }
    // Add more route mappings as needed
    
    return { activeMainItem, activeSubItem, expandMenu };
  };

  const { activeMainItem, activeSubItem, expandMenu } = getActiveStates();

  // Auto-expand menus that contain the active route
  useEffect(() => {
    if (expandMenu) {
      setExpandedMenus(prev => 
        prev.includes(expandMenu) ? prev : [...prev, expandMenu]
      );
    }
  }, [expandMenu]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleSubItemClick = (subItem: string) => {
    switch (subItem) {
      case 'Wages & Income':
        navigate('/wages-income');
        break;
      case 'Deductions & Credits':
        navigate('/deductions-credits');
        break;
      case 'Other Tax Situations':
        navigate('/other-tax-situations');
        break;
      case 'Prepare State':
        navigate('/prepare-state');
        break;
      case 'Your State Returns':
        navigate('/your-state-returns');
        break;
      case 'State Review':
        navigate('/state-review');
        break;
      // Add more cases for other sub-menu items as needed
      default:
        break;
    }
  };

  const handleMainItemClick = (itemId: string) => {
    switch (itemId) {
      case 'my-info':
        navigate('/personal-info');
        break;
      case 'review':
        navigate('/review');
        break;
      case 'file':
        navigate('/file');
        break;
      // Add more cases for other main menu items as needed
      default:
        break;
    }
  };

  const sidebarMenuItems = [
    { id: 'tax-home', title: 'Tax Home', active: false },
    { id: 'documents', title: 'Documents', active: false }
  ];

  const taxMenuItems = [
    { id: 'my-info', title: 'My Info', active: activeMainItem === 'my-info', hasSubMenu: false },
    { 
      id: 'federal', 
      title: 'Federal', 
      active: activeMainItem === 'federal', 
      hasSubMenu: true,
      subItems: [
        'Wages & Income',
        'Deductions & Credits', 
        'Other Tax Situations'
      ]
    },
    { 
      id: 'state-taxes', 
      title: 'State Taxes', 
      active: activeMainItem === 'state-taxes', 
      hasSubMenu: true,
      subItems: [
        'Prepare State',
        'Your State Returns',
        'State Review'
      ]
    },
    { id: 'review', title: 'Review', active: activeMainItem === 'review', hasSubMenu: false },
    { id: 'file', title: 'File', active: activeMainItem === 'file', hasSubMenu: false },
    { 
      id: 'tax-tools', 
      title: 'Tax Tools', 
      active: activeMainItem === 'tax-tools', 
      hasSubMenu: true,
      subItems: [
        'Tools',
        'Print Center'
      ]
    }
  ];

  return (
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
      <nav className="flex-1">
        <div className="space-y-1 mb-6">
          {sidebarMenuItems.map((item) => (
            <Button 
              key={item.id}
              variant="ghost" 
              className={`w-full justify-start ${item.active ? 'relative overflow-hidden mx-0 rounded-none' : 'text-muted-foreground hover:text-foreground mx-4'}`}
              style={item.active ? { backgroundColor: '#dfdfd8' } : {}}
            >
              {item.active && (
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#db334d' }}></div>
              )}
              <span className={`${item.active ? 'text-foreground relative z-10 ml-4' : ''}`}>
                {item.title}
              </span>
            </Button>
          ))}
        </div>

        {/* Separator */}
        <div className="border-t my-4" style={{ borderColor: '#adbac2' }}></div>

        {/* 2024 TAXES Section */}
        <div className="space-y-1">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            2024 TAXES
          </div>
          {taxMenuItems.map((item, itemIndex) => (
            <React.Fragment key={item.id}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${item.active ? 'relative overflow-hidden mx-0 rounded-none' : 'text-muted-foreground hover:text-foreground mx-4'}`}
                style={item.active ? { backgroundColor: '#dfdfd8' } : {}}
                onClick={() => item.hasSubMenu ? toggleMenu(item.id) : handleMainItemClick(item.id)}
              >
                {item.active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#db334d' }}></div>
                )}
                <span className={`${item.active ? 'text-foreground relative z-10 ml-4' : ''}`}>
                  {item.title}
                </span>
                {item.hasSubMenu && (
                  <div className="ml-auto">
                    {expandedMenus.includes(item.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                )}
              </Button>
              
              {/* Sub-menu items */}
              {item.hasSubMenu && expandedMenus.includes(item.id) && (
                <div className="ml-8 mr-4 space-y-1 mb-2 animate-accordion-down overflow-hidden">
                  {item.subItems?.map((subItem, subIndex) => (
                    <Button 
                      key={subIndex}
                      variant="ghost" 
                      className={`w-full justify-start text-sm py-1 h-8 ${
                        activeSubItem === subItem 
                          ? 'relative overflow-hidden mx-0 rounded-none text-foreground font-medium' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      style={activeSubItem === subItem ? { backgroundColor: '#dfdfd8' } : {}}
                      onClick={() => handleSubItemClick(subItem)}
                    >
                      {activeSubItem === subItem && (
                        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#db334d' }}></div>
                      )}
                      <span className={activeSubItem === subItem ? 'relative z-10' : ''}>
                        {subItem}
                      </span>
                    </Button>
                  ))}
                </div>
              )}

              {/* Separator between File and Tax Tools */}
              {item.id === 'file' && (
                <div className="border-t my-2" style={{ borderColor: '#adbac2' }}></div>
              )}
            </React.Fragment>
          ))}
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
            Switch Products
          </button>
          <button className="block hover:text-foreground transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;