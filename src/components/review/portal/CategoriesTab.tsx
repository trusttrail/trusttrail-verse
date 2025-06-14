
import React from "react";
import CategoriesView from "@/components/review/CategoriesView";

interface CategoriesTabProps {
  categories: any[];
}

const CategoriesTab = ({ categories }: CategoriesTabProps) => (
  <CategoriesView categories={categories} />
);

export default CategoriesTab;
