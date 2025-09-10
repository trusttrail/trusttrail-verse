import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
  MessageSquare,
  Eye,
  ThumbsUp,
  RefreshCw,
} from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const RealTimeAnalyticsDashboard = () => {
  const { overview, categoryData, dailyData, companyData, loading, refreshData } = useAnalyticsData();

  // Chart configs for different chart types
  const lineChartConfig = {
    reviews: {
      label: "Reviews",
      color: "#7b58f6",
    },
    rating: {
      label: "Avg Rating",
      color: "#2c9fff",
    },
  };

  // Dynamic config for pie chart based on actual category data
  const pieChartConfig = categoryData.reduce((config, item) => {
    config[item.category] = {
      label: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      color: item.color,
    };
    return config;
  }, {} as any);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-4 shadow-lg max-w-xs">
          <p className="font-medium text-foreground mb-2">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium">{entry.name}:</span>
              </div>
              <span className="text-sm font-bold" style={{ color: entry.color }}>
                {entry.name === 'Avg Rating' ? `${entry.value}/5 ⭐` : `${entry.value} reviews`}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
            {payload.length > 1 ? 'Daily metrics from blockchain data' : 'Verified review data'}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="font-medium capitalize">{data.payload.category}</span>
          </div>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">{data.value}</span> reviews ({Math.round((data.value / overview.totalReviews) * 100)}%)</p>
            <p>Average Rating: <span className="font-medium">{data.payload.avgRating}/5 ⭐</span></p>
          </div>
          <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
            Web3 sector classification
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-trustpurple-500" />
          <p className="text-muted-foreground">Loading real-time analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Live Analytics Dashboard</h2>
          <p className="text-muted-foreground mt-2">
            Real-time metrics from blockchain transactions and submitted reviews
          </p>
        </div>
        <Button variant="outline" onClick={refreshData} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
            <MessageSquare className="h-5 w-5 text-trustpurple-500" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-foreground">{overview.totalReviews}</div>
            <p className="text-xs text-muted-foreground mt-2">
              ✅ Blockchain-verified reviews only
            </p>
            <Badge variant="outline" className="text-xs mt-1">Live Data</Badge>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center gap-1">
              <span className="text-3xl font-bold text-foreground">{overview.avgRating}</span>
              <span className="text-lg text-yellow-500">⭐</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              📊 Calculated from all verified reviews
            </p>
            <Badge variant="outline" className="text-xs mt-1">Out of 5</Badge>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Companies</CardTitle>
            <Activity className="h-5 w-5 text-trustblue-500" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-foreground">{overview.totalCompanies}</div>
            <p className="text-xs text-muted-foreground mt-2">
              🏢 Unique companies with reviews
            </p>
            <Badge variant="outline" className="text-xs mt-1">Web3 Projects</Badge>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-foreground">{overview.totalCategories}</div>
            <p className="text-xs text-muted-foreground mt-2">
              🎯 Different Web3 sectors covered
            </p>
            <Badge variant="outline" className="text-xs mt-1">Categories</Badge>
          </CardContent>
        </Card>
      </div>

      {/* No Data State */}
      {overview.totalReviews === 0 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Reviews Found</h3>
            <p className="text-muted-foreground mb-4">
              Analytics will appear here once reviews are submitted via smart contracts.
            </p>
            <Badge variant="outline">
              Only blockchain-verified reviews are shown
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Charts Section - Only show if we have data */}
      {overview.totalReviews > 0 && (
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-muted/50 backdrop-blur-sm border border-border/50 p-1 rounded-lg">
            <TabsTrigger value="trends" className="px-4 py-2 text-sm">Trends</TabsTrigger>
            <TabsTrigger value="categories" className="px-4 py-2 text-sm">Categories</TabsTrigger>
            <TabsTrigger value="companies" className="px-4 py-2 text-sm">Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            {dailyData.length > 0 ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    📈 Review Activity Over Time
                  </CardTitle>
                  <CardDescription className="space-y-1">
                    <p>Daily review submissions and average ratings from blockchain transactions</p>
                    <div className="flex items-center gap-4 text-sm mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-[#7b58f6]"></div>
                        <span>Purple bars = Review Count (left axis)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-[#2c9fff]"></div>
                        <span>Blue line = Average Rating (right axis)</span>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={lineChartConfig} className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                          label={{ value: 'Review Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right" 
                          className="text-xs fill-muted-foreground"
                          tick={{ fontSize: 12 }}
                          domain={[0, 5]}
                          label={{ value: 'Average Rating (0-5)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
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
            ) : (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">More reviews needed to show trend data</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    🥧 Reviews by Category
                  </CardTitle>
                  <CardDescription className="space-y-1">
                    <p>Distribution of reviews across different Web3 sectors</p>
                    <div className="text-sm text-muted-foreground mt-2">
                      💡 <strong>Hover over chart segments</strong> to see detailed breakdown including percentages and ratings
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 1 ? (
                    <ChartContainer config={pieChartConfig} className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={140}
                            paddingAngle={2}
                            dataKey="reviewCount"
                            stroke="#fff"
                            strokeWidth={2}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomPieTooltip />} />
                          <Legend 
                            verticalAlign="bottom" 
                            height={80}
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value, entry) => {
                              const categoryItem = categoryData.find(c => c.category === value);
                              const percentage = categoryItem ? Math.round((categoryItem.reviewCount / overview.totalReviews) * 100) : 0;
                              return (
                                <span style={{ color: entry.color || '#666', fontWeight: '500' }}>
                                  {value.charAt(0).toUpperCase() + value.slice(1)} ({percentage}%)
                                </span>
                              );
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <div className="text-lg font-medium mb-2">Not enough categories</div>
                        <p className="text-sm">Need at least 2 categories to display pie chart</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    📊 Category Breakdown
                  </CardTitle>
                  <CardDescription className="space-y-1">
                    <p>Detailed metrics for each Web3 sector with review counts, ratings, and percentages</p>
                    <div className="text-sm text-muted-foreground mt-2">
                      🏷️ <strong>Color dots</strong> match the pie chart • <strong>Reviews</strong> = total count • <strong>Stars</strong> = average rating • <strong>%</strong> = share of total
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium capitalize">{category.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {category.reviewCount} reviews
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {category.avgRating}★
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((category.reviewCount / overview.totalReviews) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  🏆 Top Reviewed Companies
                </CardTitle>
                <CardDescription className="space-y-1">
                  <p>Companies ranked by number of verified blockchain reviews</p>
                  <div className="text-sm text-muted-foreground mt-2">
                    🥇 <strong>Ranking</strong> by review count • ⭐ <strong>Star ratings</strong> show average scores • 💬 <strong>Review count</strong> from smart contracts
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyData.slice(0, 10).map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs font-mono">#{index + 1}</Badge>
                        <div>
                          <h4 className="font-semibold">{company.companyName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={`${
                                    i < Math.round(company.avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{company.avgRating}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare size={14} />
                          <span>{company.reviewCount} reviews</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default RealTimeAnalyticsDashboard;