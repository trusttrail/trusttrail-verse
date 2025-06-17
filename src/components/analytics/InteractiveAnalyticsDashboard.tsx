
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, RadialBarChart, RadialBar
} from "recharts";
import { TrendingUp, TrendingDown, Users, Star, Award, Shield, Activity } from "lucide-react";

// Enhanced mock data that simulates real review data
const generateReviewData = () => {
  const categories = ["DeFi", "Exchanges", "NFT", "Gaming", "Social", "Infrastructure", "Staking"];
  const companies = ["Uniswap", "OpenSea", "Axie Infinity", "Compound", "QuickSwap", "Binance", "Coinbase"];
  
  return {
    totalReviews: 1247,
    approvedReviews: 1089,
    rejectedReviews: 158,
    pendingReviews: 23,
    verifiedUsers: 892,
    totalRewards: 24567.89,
    avgRating: 4.2,
    categoryData: categories.map(cat => ({
      category: cat,
      reviews: Math.floor(Math.random() * 200) + 50,
      avgRating: (Math.random() * 2 + 3).toFixed(1),
      growth: Math.floor(Math.random() * 40) - 10
    })),
    trendingCompanies: companies.map(company => ({
      name: company,
      reviews: Math.floor(Math.random() * 150) + 20,
      rating: (Math.random() * 2 + 3).toFixed(1),
      change: Math.floor(Math.random() * 20) - 5
    })),
    monthlyTrend: Array.from({length: 12}, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      reviews: Math.floor(Math.random() * 100) + 50,
      rewards: Math.floor(Math.random() * 2000) + 1000
    })),
    qualityMetrics: [
      { name: "Verified Reviews", value: 87, color: "#22C55E" },
      { name: "Suspicious/Fake", value: 13, color: "#EF4444" }
    ],
    userEngagement: [
      { metric: "Daily Active Users", value: 234, change: 12 },
      { metric: "Review Completion Rate", value: 89, change: 5 },
      { metric: "User Retention", value: 76, change: -2 },
      { metric: "Avg. Session Time", value: 8.5, change: 15 }
    ]
  };
};

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899'];

const InteractiveAnalyticsDashboard = () => {
  const [data, setData] = useState(generateReviewData());
  const [activeMetric, setActiveMetric] = useState('reviews');
  const [timeRange, setTimeRange] = useState('30d');

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateReviewData());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const reviewAccuracy = ((data.approvedReviews / data.totalReviews) * 100).toFixed(1);
  const rejectionRate = ((data.rejectedReviews / data.totalReviews) * 100).toFixed(1);

  return (
    <div className="space-y-6 p-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold text-purple-600">{data.totalReviews.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="text-green-500" size={16} />
                  <span className="text-sm text-green-600 ml-1">+12% this month</span>
                </div>
              </div>
              <Activity className="text-purple-500" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Review Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{reviewAccuracy}%</p>
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                  {data.approvedReviews} approved
                </Badge>
              </div>
              <Shield className="text-green-500" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">$NOCAP Distributed</p>
                <p className="text-2xl font-bold text-blue-600">{data.totalRewards.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="text-green-500" size={16} />
                  <span className="text-sm text-green-600 ml-1">+8% this week</span>
                </div>
              </div>
              <Award className="text-blue-500" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified Users</p>
                <p className="text-2xl font-bold text-orange-600">{data.verifiedUsers}</p>
                <div className="flex items-center mt-1">
                  <Star className="text-yellow-500" size={16} />
                  <span className="text-sm text-muted-foreground ml-1">Avg: {data.avgRating}/5</span>
                </div>
              </div>
              <Users className="text-orange-500" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Review Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Review Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Approved', value: data.approvedReviews, color: '#22C55E' },
                        { name: 'Rejected', value: data.rejectedReviews, color: '#EF4444' },
                        { name: 'Pending', value: data.pendingReviews, color: '#F59E0B' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {[
                        { name: 'Approved', value: data.approvedReviews, color: '#22C55E' },
                        { name: 'Rejected', value: data.rejectedReviews, color: '#EF4444' },
                        { name: 'Pending', value: data.pendingReviews, color: '#F59E0B' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Trending Companies */}
            <Card>
              <CardHeader>
                <CardTitle>Top Reviewed Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.trendingCompanies.slice(0, 5)}>
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="reviews" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reviews by Category</CardTitle>
            </CardHeader>  
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.categoryData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reviews" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Quality Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Verified Reviews</span>
                      <span className="font-semibold">{reviewAccuracy}%</span>
                    </div>
                    <Progress value={parseFloat(reviewAccuracy)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Rejection Rate</span>  
                      <span className="font-semibold text-red-600">{rejectionRate}%</span>
                    </div>
                    <Progress value={parseFloat(rejectionRate)} className="h-2 bg-red-100" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.userEngagement.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{metric.value}{metric.metric.includes('Time') ? 'min' : metric.metric.includes('Rate') || metric.metric.includes('Retention') ? '%' : ''}</span>
                        <div className={`flex items-center ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span className="text-xs ml-1">{Math.abs(metric.change)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Review & Reward Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.monthlyTrend}>
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="reviews" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  <Line yAxisId="right" type="monotone" dataKey="rewards" stroke="#F59E0B" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveAnalyticsDashboard;
