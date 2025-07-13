
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, GraduationCap, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InternData {
  name: string;
  startDate: string;
  endDate: string;
  department: string;
  assignedProject: string;
  status: "Active" | "Completed" | "Upcoming";
  mentor: string;
  education: string;
  stipend: number;
  conversionPotential: "High" | "Medium" | "Low";
}

interface InternsSectionProps {
  interns: InternData[];
  totalStipendCost: number;
}

export const InternsSection = ({ interns, totalStipendCost }: InternsSectionProps) => {
  const navigate = useNavigate();
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      case "Upcoming": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConversionColor = (potential: string) => {
    switch (potential) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewIntern = (internName: string) => {
    // Navigate to intern details page or show detailed modal
    navigate(`/resource-details/interns`, { state: { filter: internName } });
  };

  const handleViewAllInterns = () => {
    navigate('/resource-details/interns');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-indigo-500" />
          Interns Management
          <Badge variant="outline" className="ml-auto">
            Total Monthly Cost: {formatCurrency(totalStipendCost)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Active Interns</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {interns.filter(i => i.status === "Active").length}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">High Conversion Potential</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {interns.filter(i => i.conversionPotential === "High").length}
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Ending Soon</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {interns.filter(i => {
                const endDate = new Date(i.endDate);
                const twoWeeksFromNow = new Date();
                twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
                return endDate <= twoWeeksFromNow;
              }).length}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Current Interns</h3>
          <Button onClick={handleViewAllInterns}>
            <Eye className="h-4 w-4 mr-2" />
            View All Interns
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Mentor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Conversion</TableHead>
              <TableHead>Stipend</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interns.map((intern, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div>
                    <div className="font-medium">{intern.name}</div>
                    <div className="text-sm text-muted-foreground">{intern.education}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{intern.startDate}</div>
                    <div className="text-muted-foreground">to {intern.endDate}</div>
                  </div>
                </TableCell>
                <TableCell>{intern.department}</TableCell>
                <TableCell>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    {intern.assignedProject}
                  </Button>
                </TableCell>
                <TableCell>{intern.mentor}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(intern.status)}>
                    {intern.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getConversionColor(intern.conversionPotential)}>
                    {intern.conversionPotential}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(intern.stipend)}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewIntern(intern.name)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
