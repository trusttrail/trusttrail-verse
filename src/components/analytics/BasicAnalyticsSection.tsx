
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

/**
 * Sample mock data for analytics, in a real app these would come from backend/db queries.
 */
const reviewsByCategory = [
  { category: "DeFi", value: 134 },
  { category: "Exchanges", value: 92 },
  { category: "NFT", value: 61 },
  { category: "Gaming", value: 53 },
  { category: "Social", value: 28 }
];

const trendingCompanies = [
  { name: "Farcaster", reviews: 25 },
  { name: "Kaito", reviews: 19 },
  { name: "EtherFi", reviews: 17 },
  { name: "Friend.tech", reviews: 15 },
  { name: "OpenSea", reviews: 13 }
];

const verifiedVsFake = [
  { name: "Verified", value: 252 },
  { name: "Fake/Suspicious", value: 14 }
];

const COLORS = ["#3B82F6", "#F59E42"];

const BasicAnalyticsSection = () => {
  return (
    <div className="space-y-8 py-4">
      <h2 className="text-2xl font-semibold mb-2">Platform Insights</h2>
      
      {/* 1. Reviews by Category */}
      <div className="rounded-lg border bg-card p-6 mb-4">
        <h3 className="text-lg font-medium mb-3">Reviews by Industry/Category</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={reviewsByCategory}>
            <XAxis dataKey="category" className="text-xs" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#7E51D7" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* 2. Trending Companies */}
      <div className="rounded-lg border bg-card p-6 mb-4">
        <h3 className="text-lg font-medium mb-3">Trending Companies</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={trendingCompanies} layout="vertical">
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={100} fontSize={12} />
            <Tooltip />
            <Bar dataKey="reviews" fill="#06B6D4" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* 3. Verified vs. Fake Reviews Pie */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-medium mb-3">Review Authenticity Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={verifiedVsFake}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {verifiedVsFake.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BasicAnalyticsSection;
