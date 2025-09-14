
import * as React from "react";
import NavigationHandler from "@/components/app/NavigationHandler";
import AppProviders from "@/components/app/AppProviders";
import AppRoutes from "@/components/app/AppRoutes";

const App = () => (
  <AppProviders>
    <NavigationHandler />
    <AppRoutes />
  </AppProviders>
);

export default App;
