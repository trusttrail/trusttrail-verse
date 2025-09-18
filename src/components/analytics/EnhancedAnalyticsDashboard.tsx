import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  AreaChart,
  Area,
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
  Brain,
  Target,
  Zap,
  Award,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const EnhancedAnalyticsDashboard = () => {
  const { overview, categoryData, networkData, companyData, loading, refreshData } = useAnalyticsData();
  const [activeInsight, setActiveInsight] = useState<string>("overview");

  // AI-driven insights generation
  const generateInsights = () => {
    // Return empty array if data is still loading or undefined
    if (!overview || !categoryData || loading) {
      return [];
    }

    const insights = [];
    
    if (overview.totalReviews === 0) {
      return [{
        type: "empty",
        title: "🚀 Ready to Launch",
        message: "Your analytics dashboard is ready! Once users start submitting reviews via blockchain transactions, you'll see powerful insights here.",
        action: "encourage_reviews"
      }];
    }

    // Quality insights
    if (overview.avgRating >= 4.5) {
      insights.push({
        type: "positive",
        title: "🌟 Exceptional Quality",
        message: `Outstanding ${overview.avgRating}/5 average rating indicates high user satisfaction across ${overview.totalReviews} reviews.`,
        action: "maintain_quality"
      });
    } else if (overview.avgRating < 3.5) {
      insights.push({
        type: "warning",
        title: "⚠️ Quality Alert",
        message: `Average rating of ${overview.avgRating}/5 suggests areas for improvement. Focus on top-rated categories for best practices.`,
        action: "improve_quality"
      });
    }

    // Category insights
    if (categoryData && categoryData.length > 0) {
      const topCategory = categoryData[0];
      const categoryPercentage = Math.round((topCategory.reviewCount / overview.totalReviews) * 100);
      
      if (categoryPercentage > 40) {
        insights.push({
          type: "trend",
          title: "📈 Category Dominance",
          message: `${topCategory.category} leads with ${categoryPercentage}% of reviews (${topCategory.reviewCount} reviews, ${topCategory.avgRating}/5 rating).`,
          action: "diversify_categories"
        });
      }
    }

    return insights.length > 0 ? insights : [{
      type: "neutral",
      title: "📊 Steady Progress", 
      message: "Your platform is building momentum with consistent review submissions and user engagement.",
      action: "maintain_momentum"
    }];
  };

  const aiInsights = loading || !overview || !categoryData ? [] : generateInsights();

  // Enhanced chart configs
  const trendChartConfig = {
    reviews: { label: "Reviews", color: "#7b58f6" },
    rating: { label: "Avg Rating", color: "#2c9fff" },
    cumulative: { label: "Total Reviews", color: "#22c55e" },
  };

  const pieChartConfig = (categoryData || []).reduce((config, item) => {
    const categoryName = String(item.category || '');
    config[item.category] = {
      label: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
      color: item.color,
    };
    return config;
  }, {} as any);

  // Enhanced tooltips with more context
  const EnhancedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl max-w-xs">
          <p className="font-semibold text-foreground mb-3">{date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-1 mb-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium">{entry.name}:</span>
              </div>
              <span className="text-sm font-bold ml-2" style={{ color: entry.color }}>
                {entry.name === 'Avg Rating' ? `${entry.value}/5 ⭐` : `${entry.value}`}
              </span>
            </div>
          ))}
          <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Blockchain-verified data
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && overview) {
      const data = payload[0];
      const percentage = Math.round((data.value / overview.totalReviews) * 100);
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-4 h-4 rounded-full shadow-sm" 
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="font-semibold capitalize text-lg">{data.payload.category}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Reviews:</span>
              <span className="font-bold">{data.value} ({percentage}%)</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Rating:</span>
              <span className="font-bold">{data.payload.avgRating}/5 ⭐</span>
            </div>
            <div className="flex justify-between">
              <span>Quality Score:</span>
              <span className="font-bold">
                {data.payload.avgRating >= 4.5 ? "Excellent" : 
                 data.payload.avgRating >= 4.0 ? "Very Good" :
                 data.payload.avgRating >= 3.5 ? "Good" : "Needs Improvement"}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
            Web3 sector classification • Real-time data
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="relative">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto text-trustpurple-500" />
            <div className="absolute inset-0 h-12 w-12 border-2 border-trustpurple-200 rounded-full animate-pulse"></div>
          </div>
          <div>
            <p className="text-lg font-semibold mb-2">Loading Analytics...</p>
            <p className="text-muted-foreground">Fetching real-time blockchain data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with AI Insights */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-trustpurple-500" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-trustpurple-600 to-trustblue-500 bg-clip-text text-transparent">
              AI-Powered Analytics
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Real-time insights from blockchain-verified reviews with AI-driven analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            <Zap className="h-4 w-4 mr-1" />
            Live Data
          </Badge>
          <Button variant="outline" onClick={refreshData} size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* AI Insights Panel */}
      <Card className="border-trustpurple-200 bg-gradient-to-r from-trustpurple-50/50 to-trustblue-50/50 dark:from-trustpurple-950/20 dark:to-trustblue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-trustpurple-500" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription>
            Intelligent analysis of your review data patterns and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <Alert key={index} className={`border-l-4 ${
                insight.type === 'positive' ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20' :
                insight.type === 'warning' ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20' :
                insight.type === 'growth' ? 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20' :
                'border-l-gray-500 bg-gray-50/50 dark:bg-gray-950/20'
              }`}>
                <AlertDescription>
                  <div className="font-semibold mb-1">{insight.title}</div>
                  <div className="text-sm text-muted-foreground">{insight.message}</div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-trustpurple-50/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
            <div className="p-2 bg-trustpurple-100 dark:bg-trustpurple-900 rounded-lg">
              <MessageSquare className="h-5 w-5 text-trustpurple-600 dark:text-trustpurple-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-foreground mb-2">{overview.totalReviews.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Blockchain Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Immutable smart contract records
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-yellow-50/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quality Score</CardTitle>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-foreground">{overview.avgRating}</span>
              <div className="flex">
                {[1,2,3,4,5].map(star => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${star <= Math.round(overview.avgRating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {overview.avgRating >= 4.5 ? "Excellent" : 
               overview.avgRating >= 4.0 ? "Very Good" :
               overview.avgRating >= 3.5 ? "Good" : "Needs Improvement"}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Average across all categories
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-trustblue-50/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects Reviewed</CardTitle>
            <div className="p-2 bg-trustblue-100 dark:bg-trustblue-900 rounded-lg">
              <Activity className="h-5 w-5 text-trustblue-600 dark:text-trustblue-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-foreground mb-2">{overview.totalCompanies}</div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary">Web3 Projects</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Unique companies with reviews
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-green-50/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sectors Covered</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-foreground mb-2">{categoryData.length}</div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary">Web3 Sectors</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Different categories reviewed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts Section */}
      {overview.totalReviews > 0 ? (
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-muted/50 backdrop-blur-sm border border-border/50 p-1 rounded-lg">
            <TabsTrigger value="trends" className="px-6 py-2 text-sm gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends & Growth
            </TabsTrigger>
            <TabsTrigger value="categories" className="px-6 py-2 text-sm gap-2">
              <BarChart3 className="h-4 w-4" />
              Category Analysis
            </TabsTrigger>
            <TabsTrigger value="companies" className="px-6 py-2 text-sm gap-2">
              <Award className="h-4 w-4" />
              Top Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Network Performance Analytics</h3>
                <p className="text-muted-foreground">Tracking review submissions across Optimism and Polygon networks</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    🥧 Category Distribution
                  </CardTitle>
                  <CardDescription className="space-y-2">
                    <p className="text-base">Visual breakdown of reviews across Web3 sectors</p>
                    <div className="text-sm text-muted-foreground mt-3">
                      <strong>Interactive:</strong> Hover over segments for detailed metrics including percentages and quality scores
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 1 ? (
                    <ChartContainer config={pieChartConfig} className="h-[450px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={160}
                            paddingAngle={3}
                            dataKey="reviewCount"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth={3}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CategoryTooltip />} />
                          <Legend 
                            verticalAlign="bottom" 
                            height={100}
                            wrapperStyle={{ paddingTop: '30px' }}
                            formatter={(value, entry) => {
                              const categoryItem = categoryData.find(c => c.category === value);
                              const percentage = categoryItem ? Math.round((categoryItem.reviewCount / overview.totalReviews) * 100) : 0;
                              const displayValue = String(value || '');
                              return (
                                <span style={{ color: entry.color || '#666', fontWeight: '600', fontSize: '14px' }}>
                                  {displayValue.charAt(0).toUpperCase() + displayValue.slice(1)} ({percentage}%)
                                </span>
                              );
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="h-[450px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center space-y-3">
                        <BarChart3 className="h-16 w-16 mx-auto" />
                        <div className="text-xl font-semibold">Need More Categories</div>
                        <p className="text-sm max-w-xs">At least 2 different categories needed for meaningful distribution analysis</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    📊 Category Performance
                  </CardTitle>
                  <CardDescription className="space-y-2">
                    <p className="text-base">Detailed performance metrics for each Web3 sector</p>
                    <div className="text-sm text-muted-foreground mt-3">
                      Color indicators match pie chart • Review counts • Quality ratings • Market share
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryData.length > 0 ? categoryData.map((category, index) => {
                    const percentage = Math.round((category.reviewCount / overview.totalReviews) * 100);
                    const isTopCategory = index === 0;
                    
                    return (
                      <div key={index} className={`p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                        isTopCategory 
                          ? 'bg-gradient-to-r from-trustpurple-50/80 to-trustblue-50/80 dark:from-trustpurple-950/40 dark:to-trustblue-950/40 border-2 border-trustpurple-200' 
                          : 'bg-muted/40 hover:bg-muted/60'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-5 h-5 rounded-full shadow-sm border-2 border-white"
                              style={{ backgroundColor: category.color }}
                            />
                            <div>
                              <span className="font-semibold text-lg capitalize">{category.category}</span>
                              {isTopCategory && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  <Award className="h-3 w-3 mr-1" />
                                  Top Sector
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{percentage}%</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {category.reviewCount} reviews
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Star className="h-3 w-3" />
                              {category.avgRating}/5
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {category.avgRating >= 4.5 ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 font-medium">Excellent</span>
                              </>
                            ) : category.avgRating >= 4.0 ? (
                              <>
                                <ThumbsUp className="h-4 w-4 text-blue-500" />
                                <span className="text-blue-600 font-medium">Very Good</span>
                              </>
                            ) : category.avgRating >= 3.5 ? (
                              <>
                                <Eye className="h-4 w-4 text-yellow-500" />
                                <span className="text-yellow-600 font-medium">Good</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-red-600 font-medium">Needs Improvement</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 bg-muted/30 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full transition-all duration-700 ease-out"
                            style={{ 
                              width: `${percentage}%`, 
                              backgroundColor: category.color,
                              boxShadow: `0 0 10px ${category.color}40`
                            }}
                          />
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">No category data available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl flex items-center gap-3">
                  🏆 Top Reviewed Projects
                </CardTitle>
                <CardDescription className="space-y-2">
                  <p className="text-base">Leading Web3 projects ranked by review volume and quality</p>
                  <div className="text-sm text-muted-foreground mt-3">
                    Projects are ranked by total reviews • Quality ratings show user satisfaction • Market position indicates review share
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {companyData.length > 0 ? (
                  <div className="space-y-4">
                    {companyData.slice(0, 10).map((company, index) => {
                      const percentage = Math.round((company.reviewCount / overview.totalReviews) * 100);
                      const isTopCompany = index < 3;
                      
                      return (
                        <div key={index} className={`p-5 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                          isTopCompany 
                            ? 'bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-950/30 dark:to-orange-950/30 border-2 border-yellow-200' 
                            : 'bg-muted/40 hover:bg-muted/60'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                                index === 0 ? 'bg-yellow-500 text-white' :
                                index === 1 ? 'bg-gray-400 text-white' :
                                index === 2 ? 'bg-amber-600 text-white' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-semibold text-xl">{company.companyName}</h3>
                                {isTopCompany && (
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    <Award className="h-3 w-3 mr-1" />
                                    Top {index + 1}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-trustpurple-500" />
                              <span className="text-sm text-muted-foreground">Reviews:</span>
                              <Badge variant="outline" className="font-semibold">
                                {company.reviewCount}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-muted-foreground">Rating:</span>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="font-semibold">
                                  {company.avgRating}/5
                                </Badge>
                                <div className="flex ml-1">
                                  {[1,2,3,4,5].map(star => (
                                    <Star 
                                      key={star} 
                                      className={`h-3 w-3 ${star <= Math.round(company.avgRating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-trustblue-500" />
                              <span className="text-sm text-muted-foreground">Share:</span>
                              <Badge variant="outline" className="font-semibold">
                                {percentage}%
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="bg-muted/30 rounded-full h-3 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500 transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${percentage}%`,
                                boxShadow: '0 0 15px rgba(123, 88, 246, 0.3)'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Company Rankings Yet</h3>
                    <p className="text-muted-foreground">Company leaderboard will appear as reviews are submitted</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Enhanced Empty State
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-trustpurple-50/20 backdrop-blur-sm">
          <CardContent className="text-center py-16">
            <div className="space-y-6">
              <div className="relative">
                <MessageSquare className="h-24 w-24 mx-auto text-muted-foreground/50" />
                <div className="absolute -top-2 -right-2 bg-trustpurple-100 dark:bg-trustpurple-900 rounded-full p-2">
                  <Brain className="h-6 w-6 text-trustpurple-600 dark:text-trustpurple-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Analytics Dashboard Ready</h3>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Your AI-powered analytics will come alive once users start submitting blockchain-verified reviews.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                <div className="p-4 rounded-lg bg-muted/30">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-trustpurple-500" />
                  <h4 className="font-semibold mb-1">Growth Trends</h4>
                  <p className="text-sm text-muted-foreground">Track review volume and quality over time</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <Target className="h-8 w-8 mx-auto mb-2 text-trustblue-500" />
                  <h4 className="font-semibold mb-1">Category Insights</h4>
                  <p className="text-sm text-muted-foreground">Analyze performance across Web3 sectors</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h4 className="font-semibold mb-1">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground">Get intelligent insights and recommendations</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Badge variant="outline" className="px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Only blockchain-verified reviews will be displayed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedAnalyticsDashboard;