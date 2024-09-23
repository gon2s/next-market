import React, { ReactNode } from 'react';
import { TabBar } from '@/components';

interface MainTabLayoutProps {
  children: ReactNode;
}

function MainTabLayout({ children }: MainTabLayoutProps) {
  return (
    <div>
      {children}
      <TabBar />
    </div>
  );
}

export default MainTabLayout;
