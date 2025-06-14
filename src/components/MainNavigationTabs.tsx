
import React from 'react';

const MainNavigationTabs: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-muted/30 to-muted/20 border-b border-border pt-20 pb-2 shadow-sm hidden md:block">
      <div className="container mx-auto">
        {/* Tabs mimic - Home, Categories, Businesses, Staking, more */}
        <div className="flex items-center gap-5">
          <span className="py-2 px-4 font-semibold rounded hover:bg-muted/50 cursor-pointer transition-colors text-primary">
            Home
          </span>
          <span className="py-2 px-4 rounded hover:bg-muted/50 cursor-pointer transition-colors text-foreground/70">
            Categories
          </span>
          <span className="py-2 px-4 rounded hover:bg-muted/50 cursor-pointer transition-colors text-foreground/70">
            Businesses
          </span>
          <span className="py-2 px-4 rounded hover:bg-muted/50 cursor-pointer transition-colors text-foreground/70">
            Staking
          </span>
          <span className="py-2 px-4 rounded hover:bg-muted/50 cursor-pointer transition-colors text-foreground/70">
            Analytics
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainNavigationTabs;
