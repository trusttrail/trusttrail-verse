
import * as React from "react";
import RecentActivityOverlay from "@/components/RecentActivityOverlay";
import NavigationHandler from "@/components/app/NavigationHandler";
import DemoActivityInjector from "@/components/app/DemoActivityInjector";
import AppProviders from "@/components/app/AppProviders";
import AppRoutes from "@/components/app/AppRoutes";

const App = () => (
  <AppProviders>
    <RecentActivityOverlay />
    <DemoActivityInjector />
    <NavigationHandler />
    <AppRoutes />
  </AppProviders>
);

export default App;
