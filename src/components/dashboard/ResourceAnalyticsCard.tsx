
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";

interface SeniorityData {
  level: string;
  count: number;
  percentage: number;
  monthlyCost: number;
  ytdCost: number;
}

interface SkillData {
  category: string;
  count: number;
  monthlyCost: number;
}

interface AgingData {
  bucket: string;
  count: number;
  monthlyCost: number;
  avgDailyCost: number;
  riskLevel: "low" | "medium" | "high";
}

interface EngagementData {
  type: string;
  count: number;
  monthlyCost: number;
  startDate: string;
  endDate: string;
  notes: string;
}

interface ResourceAnalyticsProps {
  seniorityData: SeniorityData[];
  skillData: SkillData[];
  agingData: AgingData[];
  engagementData: EngagementData[];
}

export const ResourceAnalyticsCard = ({
  seniorityData,
  skillData,
  agingData,
  engagementData
}: ResourceAnalyticsProps) => {
  const navigate = useNavigate();
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getRiskColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Prepare radar chart data
  const radarData = skillData.map(skill => ({
    skill: skill.category,
    count: skill.count,
    cost: skill.monthlyCost / 1000 // Scale down for better visualization
  }));

  const handleViewDetails = (type: string, filter?: string) => {
    navigate(`/resource-details/${type}`, { state: { filter } });
  };

  return (
    <div className="space-y-6">
      {/* Charts Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seniority Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Seniority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={seniorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Count']} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skills Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis />
                <Radar name="Resource Count" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Aging Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bench Aging Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ bucket, percentage }) => `${bucket}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {agingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={120} />
                <Tooltip formatter={(value) => [value, 'Count']} />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables Section */}
      {/* Seniority Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Non-Billable Resources by Seniority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seniority Level</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>% of Non-Billable</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>YTD Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seniorityData.map((item) => (
                <TableRow key={item.level}>
                  <TableCell className="font-medium">{item.level}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{item.percentage}%</TableCell>
                  <TableCell>{formatCurrency(item.monthlyCost)}</TableCell>
                  <TableCell>{formatCurrency(item.ytdCost)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails('seniority', item.level)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Skill Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Non-Billable Resources by Skill Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Category</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillData.map((item) => (
                <TableRow key={item.category}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{formatCurrency(item.monthlyCost)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails('skill', item.category)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Resources
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Aging Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-500" />
            Bench Aging Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aging Bucket</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Avg Daily Cost</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agingData.map((item) => (
                <TableRow key={item.bucket}>
                  <TableCell className="font-medium">{item.bucket}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{formatCurrency(item.monthlyCost)}</TableCell>
                  <TableCell>{formatCurrency(item.avgDailyCost)}</TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(item.riskLevel)}>
                      {item.riskLevel.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails('aging', item.bucket)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Engagement Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Non-Billable by Engagement Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Engagement Type</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {engagementData.map((item) => (
                <TableRow key={item.type}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{formatCurrency(item.monthlyCost)}</TableCell>
                  <TableCell>{item.startDate}</TableCell>
                  <TableCell>{item.endDate}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.notes}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails('engagement', item.type)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
