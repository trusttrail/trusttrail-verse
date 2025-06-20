
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Star,
  Users,
  Activity,
  Award,
  Eye,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

const InteractiveAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");

  const mockData = useMemo(() => ({
    overview: {
      totalReviews: 47,
      avgRating: 4.2,
      totalViews: 1243,
      engagementRate: 12.4,
    },
    reviewsOverTime: [
      { date: "2024-01-01", reviews: 12, rating: 4.1 },
      { date: "2024-01-02", reviews: 19, rating: 4.3 },
      { date: "2024-01-03", reviews: 8, rating: 3.9 },
      { date: "2024-01-04", reviews: 15, rating: 4.5 },
      { date: "2024-01-05", reviews: 22, rating: 4.2 },
      { date: "2024-01-06", reviews: 11, rating: 4.0 },
      { date: "2024-01-07", reviews: 16, rating: 4.4 },
    ],
    categoryBreakdown: [
      { category: "DeFi", reviews: 18, color: "#7b58f6" },
      { category: "NFT", reviews: 12, color: "#2c9fff" },
      { category: "Gaming", reviews: 9, color: "#f0b003" },
      { category: "Exchanges", reviews: 8, color: "#54baff" },
    ],
    topReviews: [
      { company: "Uniswap", rating: 5, views: 234, engagement: 18 },
      { company: "OpenSea", rating: 4, views: 189, engagement: 15 },
      { company: "Polygon", rating: 5, views: 156, engagement: 22 },
    ],
  }), []);

  const chartConfig = {
    reviews: {
      label: "Reviews",
      color: "#7b58f6",
    },
    rating: {
      label: "Avg Rating",
      color: "#2c9fff",
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
            <MessageSquare className="h-5 w-5 text-trustpurple-500" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-foreground">{mockData.overview.totalReviews}</div>
            <p className="text-xs text-green-600 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-foreground">{mockData.overview.avgRating}</div>
            <p className="text-xs text-green-600 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            <Eye className="h-5 w-5 text-trustblue-500" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-foreground">{mockData.overview.totalViews.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
            <Activity className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-foreground">{mockData.overview.engagementRate}%</div>
            <p className="text-xs text-green-600 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="bg-muted/50 backdrop-blur-sm border border-border/50 p-1 rounded-lg">
            <TabsTrigger value="trends" className="px-4 py-2 text-sm">Trends</TabsTrigger>
            <TabsTrigger value="categories" className="px-4 py-2 text-sm">Categories</TabsTrigger>
            <TabsTrigger value="performance" className="px-4 py-2 text-sm">Performance</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("7d")}
              className="text-xs"
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("30d")}
              className="text-xs"
            >
              30 Days
            </Button>
          </div>
        </div>

        <TabsContent value="trends" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Review Activity Over Time</CardTitle>
              <CardDescription>
                Daily review submissions and average ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mockData.reviewsOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs fill-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      yAxisId="left" 
                      className="text-xs fill-muted-foreground"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      className="text-xs fill-muted-foreground"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="reviews" fill="var(--color-reviews)" name="Reviews" radius={[4, 4, 0, 0]} />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="rating" 
                      stroke="var(--color-rating)" 
                      strokeWidth={3}
                      dot={{ fill: "var(--color-rating)", r: 4 }}
                      name="Avg Rating"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Reviews by Category</CardTitle>
                <CardDescription>Distribution of your reviews across different Web3 categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockData.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="reviews"
                      >
                        {mockData.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Category Breakdown</CardTitle>
                <CardDescription>Detailed view of review distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.categoryBreakdown.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {category.reviews} reviews
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((category.reviews / mockData.overview.totalReviews) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Top Performing Reviews</CardTitle>
              <CardDescription>Your most viewed and engaged reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.topReviews.map((review, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-xs font-mono">#{index + 1}</Badge>
                      <div>
                        <h4 className="font-semibold">{review.company}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{review.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={14} />
                        <span>{review.engagement}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveAnalyticsDashboard;
