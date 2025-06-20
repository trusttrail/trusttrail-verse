import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, Users, Star, Activity } from "lucide-react";
import ScatterPlotChart from "./charts/ScatterPlotChart";
import DonutChart from "./charts/DonutChart";
import CustomLineChart from "./charts/LineChart";
import CustomBarChart from "./charts/BarChart";
import CustomAreaChart from "./charts/AreaChart";
import HeatMapChart from "./charts/HeatMapChart";
import { sampleCompanies } from "@/data/companyData";

const AdvancedAnalyticsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isQueryActive, setIsQueryActive] = useState(false);

  // Define consistent color palette for all charts
  const colorPalette = [
    "#7b58f6", // Purple
    "#2c9fff", // Blue
    "#22c55e", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
    "#ec4899", // Pink
    "#6366f1", // Indigo
    "#10b981"  // Emerald
  ];

  // Generate analytics data from existing company data
  const analyticsData = useMemo(() => {
    const scatterData = sampleCompanies.map(company => ({
      rating: company.rating,
      reviewCount: company.reviewCount,
      company: company.name,
      category: company.category,
      trustScore: company.rating * 20
    }));

    const categoryData = sampleCompanies.reduce((acc, company) => {
      const existing = acc.find(item => item.name === company.category);
      if (existing) {
        existing.value += company.reviewCount;
      } else {
        acc.push({
          name: company.category,
          value: company.reviewCount,
          color: colorPalette[acc.length % colorPalette.length]
        });
      }
      return acc;
    }, [] as Array<{ name: string; value: number; color: string }>);

    const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        reviews: Math.floor(Math.random() * 50) + 10,
        rating: 3.5 + Math.random() * 1.5,
        engagement: Math.floor(Math.random() * 30) + 10
      };
    });

    const topCompaniesData = sampleCompanies
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 10)
      .map(company => ({
        name: company.name,
        value: company.reviewCount
      }));

    const ratingDistributionData = [
      { name: "5 Stars", value: sampleCompanies.filter(c => c.rating >= 4.5).length, color: "#22c55e" },
      { name: "4-4.5 Stars", value: sampleCompanies.filter(c => c.rating >= 4 && c.rating < 4.5).length, color: "#84cc16" },
      { name: "3-4 Stars", value: sampleCompanies.filter(c => c.rating >= 3 && c.rating < 4).length, color: "#f59e0b" },
      { name: "2-3 Stars", value: sampleCompanies.filter(c => c.rating >= 2 && c.rating < 3).length, color: "#f97316" },
      { name: "Below 2 Stars", value: sampleCompanies.filter(c => c.rating < 2).length, color: "#ef4444" }
    ];

    const heatMapData = [];
    const categories = [...new Set(sampleCompanies.map(c => c.category))].slice(0, 6);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    categories.forEach(category => {
      days.forEach(day => {
        heatMapData.push({
          category,
          day,
          value: Math.floor(Math.random() * 20) + 1
        });
      });
    });

    const stackedAreaData = timeSeriesData.map(item => ({
      ...item,
      dex: Math.floor(Math.random() * 15) + 5,
      lending: Math.floor(Math.random() * 12) + 3,
      nft: Math.floor(Math.random() * 10) + 2,
      gaming: Math.floor(Math.random() * 8) + 1
    }));

    // New Category Trust Score Analysis with proper type definition
    const categoryTrustData = sampleCompanies.reduce((acc, company) => {
      const existing = acc.find(item => item.category === company.category);
      if (existing) {
        existing.totalRating += company.rating;
        existing.count += 1;
        existing.totalReviews += company.reviewCount;
      } else {
        acc.push({
          category: company.category,
          totalRating: company.rating,
          count: 1,
          totalReviews: company.reviewCount,
          avgRating: 0,
          trustScore: 0,
          color: ""
        });
      }
      return acc;
    }, [] as Array<{ 
      category: string; 
      totalRating: number; 
      count: number; 
      totalReviews: number; 
      avgRating: number; 
      trustScore: number; 
      color: string; 
    }>);

    // Calculate averages and trust scores
    categoryTrustData.forEach((item, index) => {
      item.avgRating = item.totalRating / item.count;
      item.trustScore = (item.avgRating * 20) + (Math.log(item.totalReviews + 1) * 5); // Custom trust score formula
      item.color = colorPalette[index % colorPalette.length];
    });

    return {
      scatterData,
      categoryData,
      timeSeriesData,
      topCompaniesData,
      ratingDistributionData,
      heatMapData,
      stackedAreaData,
      categoryTrustData
    };
  }, []);

  // Filter data based on search query
  const filteredAnalyticsData = useMemo(() => {
    if (!isQueryActive || !searchQuery.trim()) {
      return analyticsData;
    }

    const query = searchQuery.toLowerCase();
    
    // Simple query processing
    if (query.includes("defi") || query.includes("decentralized finance")) {
      const defiData = analyticsData.scatterData.filter(item => 
        item.category.toLowerCase().includes("defi") || 
        item.category.toLowerCase().includes("dex") ||
        item.category.toLowerCase().includes("lending")
      );
      return {
        ...analyticsData,
        scatterData: defiData,
        categoryData: analyticsData.categoryData.filter(item => 
          item.name.toLowerCase().includes("defi") ||
          item.name.toLowerCase().includes("dex") ||
          item.name.toLowerCase().includes("lending")
        )
      };
    }

    if (query.includes("rating") && query.includes("4.5")) {
      const highRatedData = analyticsData.scatterData.filter(item => item.rating >= 4.5);
      return {
        ...analyticsData,
        scatterData: highRatedData,
        topCompaniesData: analyticsData.topCompaniesData.filter((_, index) => index < 5)
      };
    }

    if (query.includes("gaming")) {
      const gamingData = analyticsData.scatterData.filter(item => 
        item.category.toLowerCase().includes("gaming")
      );
      return {
        ...analyticsData,
        scatterData: gamingData,
        categoryData: analyticsData.categoryData.filter(item => 
          item.name.toLowerCase().includes("gaming")
        )
      };
    }

    return analyticsData;
  }, [analyticsData, searchQuery, isQueryActive]);

  const kpiData = useMemo(() => {
    const totalReviews = sampleCompanies.reduce((sum, company) => sum + company.reviewCount, 0);
    const avgRating = sampleCompanies.reduce((sum, company) => sum + company.rating, 0) / sampleCompanies.length;
    const totalCompanies = sampleCompanies.length;
    const activeCategories = new Set(sampleCompanies.map(c => c.category)).size;

    return {
      totalReviews,
      avgRating: avgRating.toFixed(1),
      totalCompanies,
      activeCategories
    };
  }, []);

  const handleSearch = () => {
    setIsQueryActive(true);
  };

  const handlePresetQuery = (query: string) => {
    setSearchQuery(query);
    setIsQueryActive(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsQueryActive(false);
  };

  return (
    <div className="space-y-8">
      {/* Natural Language Query Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Search className="h-6 w-6 text-trustpurple-500" />
            Analytics Query Interface
          </CardTitle>
          <CardDescription>
            Ask questions in plain English about your Web3 review data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="e.g., 'Show me DeFi projects with rating above 4.5' or 'Which categories have the most reviews?'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearSearch}>
                <Filter className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Button size="sm" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-1" />
                Analyze
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-trustpurple-500/20"
              onClick={() => handlePresetQuery("Show me DeFi projects with rating above 4.5")}
            >
              Top rated DeFi platforms
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-trustpurple-500/20"
              onClick={() => handlePresetQuery("Gaming projects by review count")}
            >
              Gaming projects by review count
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-trustpurple-500/20"
              onClick={() => handlePresetQuery("Rating trends over time")}
            >
              Rating trends over time
            </Badge>
          </div>
          {isQueryActive && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Active Query:</span> "{searchQuery}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Showing filtered results based on your query. Click "Clear" to see all data.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
            <Users className="h-5 w-5 text-trustpurple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpiData.totalReviews.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpiData.avgRating}</div>
            <p className="text-xs text-green-600 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Companies</CardTitle>
            <Activity className="h-5 w-5 text-trustblue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpiData.totalCompanies}</div>
            <p className="text-xs text-green-600 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5 new this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            <Filter className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpiData.activeCategories}</div>
            <p className="text-xs text-green-600 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Covering all Web3 sectors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="bg-muted/50 backdrop-blur-sm border border-border/50 p-1 rounded-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScatterPlotChart
              data={filteredAnalyticsData.scatterData}
              title="Company Rating vs Review Volume"
              description="Relationship between company ratings and total review count"
            />
            <DonutChart
              data={filteredAnalyticsData.categoryData}
              title="Reviews by Web3 Category"
              description="Distribution of reviews across different Web3 sectors"
            />
          </div>
          <HeatMapChart
            data={filteredAnalyticsData.heatMapData}
            title="Review Activity Heatmap"
            description="Review activity patterns by category and day of week"
          />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutChart
              data={filteredAnalyticsData.ratingDistributionData}
              title="Rating Distribution Analysis"
              description="Breakdown of companies by star rating ranges"
            />
            <CustomBarChart
              data={filteredAnalyticsData.topCompaniesData}
              title="Top Companies by Review Count"
              description="Most reviewed Web3 companies on the platform"
              orientation="horizontal"
              color="#2c9fff"
            />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <CustomLineChart
            data={filteredAnalyticsData.timeSeriesData}
            title="Review Trends Over Time"
            description="Daily review submissions and average ratings"
            lines={[
              { dataKey: "reviews", stroke: "#7b58f6", name: "Reviews" },
              { dataKey: "rating", stroke: "#2c9fff", name: "Avg Rating" }
            ]}
          />
          <CustomAreaChart
            data={filteredAnalyticsData.stackedAreaData}
            title="Category Review Trends"
            description="Stacked area chart showing review trends by Web3 category"
            areas={[
              { dataKey: "dex", stackId: "1", fill: "#7b58f6", name: "DEX" },
              { dataKey: "lending", stackId: "1", fill: "#2c9fff", name: "DeFi Lending" },
              { dataKey: "nft", stackId: "1", fill: "#f59e0b", name: "NFT" },
              { dataKey: "gaming", stackId: "1", fill: "#22c55e", name: "Gaming" }
            ]}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Web3 Category Trust Score Analysis</CardTitle>
                <CardDescription>
                  Trust scores calculated based on average ratings and review volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAnalyticsData.categoryTrustData
                    .sort((a, b) => b.trustScore - a.trustScore)
                    .slice(0, 8)
                    .map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium text-sm">{category.category}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Avg: {category.avgRating.toFixed(1)}⭐</span>
                          <span>{category.totalReviews} reviews</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={category.trustScore >= 80 ? "default" : category.trustScore >= 60 ? "secondary" : "outline"}
                          className="text-xs font-mono"
                        >
                          Trust: {category.trustScore.toFixed(0)}
                        </Badge>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all"
                            style={{ width: `${Math.min(category.trustScore, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <ScatterPlotChart
              data={filteredAnalyticsData.scatterData.filter(d => d.rating >= 4.0)}
              title="High-Performing Companies"
              description="Companies with ratings above 4.0 stars"
            />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Web3 Industry Insights</CardTitle>
              <CardDescription>
                Key findings and trends in the Web3 review ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h4 className="font-semibold text-lg mb-2 text-trustpurple-600">🔥 Trending</h4>
                  <p className="text-sm text-muted-foreground mb-2">DeFi protocols dominate reviews</p>
                  <p className="text-xs text-muted-foreground">
                    Decentralized exchanges and lending protocols represent 60% of all reviews
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h4 className="font-semibold text-lg mb-2 text-green-600">⭐ Quality</h4>
                  <p className="text-sm text-muted-foreground mb-2">Layer 1 blockchains lead ratings</p>
                  <p className="text-xs text-muted-foreground">
                    Ethereum and Solana maintain highest average ratings at 4.8+
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h4 className="font-semibold text-lg mb-2 text-trustblue-600">📈 Growth</h4>
                  <p className="text-sm text-muted-foreground mb-2">Gaming sector expanding</p>
                  <p className="text-xs text-muted-foreground">
                    Web3 gaming reviews increased 40% this quarter
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
