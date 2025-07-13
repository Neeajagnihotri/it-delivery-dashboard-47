
import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Download, Filter, Users, UserCheck, UserX, Building, MapPin, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useResources, useKPISummary } from "@/hooks/useApiData";

const TotalResourcesKPI = () => {
  const { data: resources } = useResources();
  const { data: kpiData } = useKPISummary();

  const summaryStats = {
    total: kpiData?.total_resources || 0,
    active: (kpiData?.total_resources || 0) - (kpiData?.bench_resources || 0),
    inactive: kpiData?.bench_resources || 0,
    monthlyGrowth: 2.5
  };

  // Process real data for charts
  const departmentData = resources ? 
    Object.entries(
      resources.reduce((acc: any, resource: any) => {
        acc[resource.department] = (acc[resource.department] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, count]) => ({ 
      name, 
      count: count as number, 
      percentage: Math.round(((count as number) / resources.length) * 100 * 10) / 10 
    })) : [];

  const locationData = resources ? 
    Object.entries(
      resources.reduce((acc: any, resource: any) => {
        acc[resource.location] = (acc[resource.location] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, count]) => ({ 
      name, 
      count: count as number, 
      percentage: Math.round(((count as number) / resources.length) * 100 * 10) / 10 
    })) : [];

  const designationData = resources ? 
    Object.entries(
      resources.reduce((acc: any, resource: any) => {
        acc[resource.designation] = (acc[resource.designation] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, count]) => ({ 
      name, 
      count: count as number, 
      percentage: Math.round(((count as number) / resources.length) * 100 * 10) / 10 
    })) : [];

  // Mock monthly growth data - this should come from historical data
  const monthlyGrowthData = [
    { month: "Jan", count: Math.max(0, summaryStats.total - 10) },
    { month: "Feb", count: Math.max(0, summaryStats.total - 8) },
    { month: "Mar", count: Math.max(0, summaryStats.total - 6) },
    { month: "Apr", count: Math.max(0, summaryStats.total - 4) },
    { month: "May", count: Math.max(0, summaryStats.total - 2) },
    { month: "Jun", count: summaryStats.total }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  const handleExportPDF = () => {
    console.log("Exporting PDF...");
  };

  const handleExportCSV = () => {
    console.log("Exporting CSV...");
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Total Resources Analytics</h1>
          <p className="text-gray-600">Comprehensive overview of organizational resource pool</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Resources</p>
                <p className="text-3xl font-bold text-blue-600">{summaryStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Resources</p>
                <p className="text-3xl font-bold text-green-600">{summaryStats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bench Resources</p>
                <p className="text-3xl font-bold text-orange-600">{summaryStats.inactive}</p>
              </div>
              <UserX className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Growth</p>
                <p className="text-3xl font-bold text-purple-600">+{summaryStats.monthlyGrowth}%</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Department-wise Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location-wise Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Growth Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Resource Growth Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentData.map((dept) => (
                  <TableRow key={dept.name}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.count}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{dept.percentage}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Designation Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Designation Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designation</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {designationData.slice(0, 10).map((designation) => (
                  <TableRow key={designation.name}>
                    <TableCell className="font-medium">{designation.name}</TableCell>
                    <TableCell>{designation.count}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{designation.percentage}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TotalResourcesKPI;
