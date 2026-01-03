import React from "react";
import ReportHeader from "./ReportHeader";
import StorySection from "./StorySection";
import CustomerSection from "./CustomerSection";
import CategorySection from "./CategorySection";
import ProductSection from "./ProductSection";
import BasketSection from "./BasketSection";
import WeeklySection from "./WeeklySection";
import GapsSection from "./GapsSection";
import ErosionSection from "./ErosionSection";
import PartnershipSection from "./PartnershipSection";

export default function ReportTab({ selected, brands = [] }) {
  if (!selected) return null;

  return (
    <div className="space-y-6">
      <ReportHeader selected={selected} brands={brands} />
      <div className="grid grid-cols-2 gap-6">
        <StorySection selected={selected} />
        <CustomerSection selected={selected} />
      </div>
      <CategorySection selected={selected} />
      <ProductSection selected={selected} />
      <div className="grid grid-cols-2 gap-6">
        <GapsSection selected={selected} />
        <ErosionSection selected={selected} />
      </div>
      <BasketSection selected={selected} />
      <WeeklySection selected={selected} />
      <PartnershipSection selected={selected} />
    </div>
  );
}
