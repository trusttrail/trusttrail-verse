
import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ReviewPortal from "@/pages/ReviewPortal";
import TestnetFaucet from "@/pages/TestnetFaucet";
import AdminDashboard from "@/pages/AdminDashboard";
import Auth from "@/pages/Auth";
import CompanyReviews from "@/pages/CompanyReviews";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/review-portal" element={<ReviewPortal />} />
      <Route path="/company/:companyId/reviews" element={<CompanyReviews />} />
      <Route path="/testnet-faucet" element={<TestnetFaucet />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/auth" element={<Auth />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
