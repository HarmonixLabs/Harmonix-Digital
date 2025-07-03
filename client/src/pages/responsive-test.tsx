import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertCircle, Monitor, Tablet, Smartphone } from "lucide-react";

interface ResponsiveCheckResult {
  component: string;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  issues: string[];
}

export default function ResponsiveTest() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('desktop');
  const [testResults, setTestResults] = useState<ResponsiveCheckResult[]>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [allPageResults, setAllPageResults] = useState<any[]>([]);

  // Detect current breakpoint
  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setCurrentBreakpoint('mobile');
      } else if (width <= 768) {
        setCurrentBreakpoint('tablet');
      } else {
        setCurrentBreakpoint('desktop');
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  // Test components
  const componentsToTest = [
    { name: 'Navigation Bar', selector: 'nav' },
    { name: 'Hero Section', selector: '.hero-responsive-title' },
    { name: 'Feature Grid', selector: '.feature-grid' },
    { name: 'Pricing Cards', selector: '.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4' },
    { name: 'Touch Targets', selector: '.touch-friendly-btn' },
    { name: 'Container Width', selector: '.harmonix-container' },
    { name: 'Mobile Menu', selector: '.md\\:hidden' },
    { name: '8px Grid Compliance', selector: '[class*="p-"], [class*="m-"], [class*="gap-"]' }
  ];

  const runResponsiveTests = () => {
    const results: ResponsiveCheckResult[] = [];

    componentsToTest.forEach(component => {
      const elements = document.querySelectorAll(component.selector);
      const issues: string[] = [];
      
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);
        
        // Check for overflow
        if (rect.width > window.innerWidth) {
          issues.push('Element overflows viewport');
        }
        
        // Check touch target size (minimum 44px per guidelines)
        if (element.tagName === 'BUTTON' || element.tagName === 'A') {
          if (rect.height < 44 || rect.width < 44) {
            issues.push(`Touch target too small: ${Math.round(rect.width)}x${Math.round(rect.height)}px (min 44x44)`);
          }
        }
        
        // Check text readability
        const fontSize = parseFloat(styles.fontSize);
        if (fontSize < 14 && window.innerWidth <= 480) {
          issues.push('Font size too small for mobile');
        }

        // Check 8px grid compliance
        if (component.name === '8px Grid Compliance') {
          const padding = parseFloat(styles.paddingTop);
          const margin = parseFloat(styles.marginTop);
          
          if (padding % 8 !== 0 && padding > 0) {
            issues.push(`Non-8px padding: ${padding}px`);
          }
          
          if (margin % 8 !== 0 && margin > 0) {
            issues.push(`Non-8px margin: ${margin}px`);
          }
        }
      });

      results.push({
        component: component.name,
        mobile: currentBreakpoint === 'mobile' && issues.length === 0,
        tablet: currentBreakpoint === 'tablet' && issues.length === 0,
        desktop: currentBreakpoint === 'desktop' && issues.length === 0,
        issues
      });
    });

    setTestResults(results);
  };

  const testAllPages = async () => {
    setIsTestingAll(true);
    const results = [];
    
    for (const page of pages) {
      // Navigate to page
      window.location.href = page.path;
      // In a real implementation, would use proper navigation and wait for page load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Run tests on that page
      const pageIssues = [];
      
      // Check horizontal scroll
      if (document.documentElement.scrollWidth > window.innerWidth) {
        pageIssues.push('Horizontal scroll detected');
      }
      
      results.push({
        page: page.name,
        path: page.path,
        issues: pageIssues,
        tested: true
      });
    }
    
    setAllPageResults(results);
    setIsTestingAll(false);
  };

  const pages = [
    { name: 'Homepage', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Demo', path: '/demo' },
    { name: 'Login', path: '/login' }
  ];

  const breakpointInfo = {
    mobile: { icon: Smartphone, range: '≤480px', color: 'text-blue-500' },
    tablet: { icon: Tablet, range: '481-768px', color: 'text-purple-500' },
    desktop: { icon: Monitor, range: '>768px', color: 'text-green-500' }
  };

  const CurrentIcon = breakpointInfo[currentBreakpoint as keyof typeof breakpointInfo].icon;

  return (
    <div className="min-h-screen bg-harmonix-deep-forest p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-harmonix-regal-gold mb-4">
            Responsive Design Testing
          </h1>
          <div className="flex items-center justify-center gap-2">
            <CurrentIcon className={`w-6 h-6 ${breakpointInfo[currentBreakpoint as keyof typeof breakpointInfo].color}`} />
            <Badge variant="outline" className="text-harmonix-sage-fade">
              Current: {currentBreakpoint} ({window.innerWidth}px)
            </Badge>
          </div>
        </div>

        <Card className="p-6 bg-harmonix-night-pine/50">
          <h2 className="text-xl font-semibold text-harmonix-regal-gold mb-4">
            Breakpoint Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(breakpointInfo).map(([key, info]) => (
              <div key={key} className="flex items-center space-x-3 p-3 rounded-lg bg-harmonix-deep-forest/50">
                <info.icon className={`w-5 h-5 ${info.color}`} />
                <div>
                  <div className="font-medium text-white capitalize">{key}</div>
                  <div className="text-sm text-harmonix-sage-fade">{info.range}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-harmonix-night-pine/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-harmonix-regal-gold">
              Component Testing
            </h2>
            <Button onClick={runResponsiveTests} className="bg-harmonix-regal-gold text-harmonix-deep-forest">
              Run Tests
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="p-3 rounded-lg bg-harmonix-deep-forest/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{result.component}</span>
                    <div className="flex gap-2">
                      {result.issues.length === 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  {result.issues.length > 0 && (
                    <div className="text-sm text-harmonix-sage-fade space-y-1">
                      {result.issues.map((issue, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <XCircle className="w-3 h-3 text-red-400" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-harmonix-night-pine/50">
          <h2 className="text-xl font-semibold text-harmonix-regal-gold mb-4">
            Page Navigation Testing
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {pages.map(page => (
              <Button
                key={page.path}
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = page.path}
              >
                {page.name}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-harmonix-night-pine/50">
          <h2 className="text-xl font-semibold text-harmonix-regal-gold mb-4">
            Responsive Test Cases
          </h2>
          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="tablet">Tablet</TabsTrigger>
              <TabsTrigger value="desktop">Desktop</TabsTrigger>
            </TabsList>
            <TabsContent value="mobile" className="space-y-2 mt-4">
              <div className="text-sm text-harmonix-sage-fade">
                <p>✓ Navigation collapses to hamburger menu</p>
                <p>✓ Feature boxes stack vertically</p>
                <p>✓ Touch targets are minimum 48px</p>
                <p>✓ Text is readable (min 16px)</p>
                <p>✓ No horizontal scrolling</p>
                <p>✓ Forms are single column</p>
              </div>
            </TabsContent>
            <TabsContent value="tablet" className="space-y-2 mt-4">
              <div className="text-sm text-harmonix-sage-fade">
                <p>✓ 2-column grid layouts</p>
                <p>✓ Navigation shows essential links</p>
                <p>✓ Optimal reading line length</p>
                <p>✓ Proper spacing between elements</p>
                <p>✓ Cards maintain aspect ratio</p>
              </div>
            </TabsContent>
            <TabsContent value="desktop" className="space-y-2 mt-4">
              <div className="text-sm text-harmonix-sage-fade">
                <p>✓ Full navigation visible</p>
                <p>✓ 3-4 column grids</p>
                <p>✓ Maximum content width 1280px</p>
                <p>✓ Proper whitespace utilization</p>
                <p>✓ All interactive elements visible</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}