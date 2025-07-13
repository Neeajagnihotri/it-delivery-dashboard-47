
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import { ArrowLeft, Download, Filter } from "lucide-react";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";

interface DetailedResource {
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  seniorityLevel: string;
  skillCategory: string;
  billableStatus: boolean;
  currentEngagement: string;
  agingInNonBillable: number;
  monthlySalaryCost: number;
  monthlyRevenueGenerated: number;
}

export const ResourceDetailedView = () => {
  const { type } = useParams();
  const location = useLocation();
  const [resources, setResources] = useState<DetailedResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<DetailedResource[]>([]);
  
  const filter = location.state?.filter;

  // Sample detailed resources data
  useEffect(() => {
    const sampleResources: DetailedResource[] = [
      {
        employeeId: "EMP001",
        fullName: "John Smith",
        designation: "Senior Developer",
        department: "Engineering",
        seniorityLevel: "Senior (6+ yrs)",
        skillCategory: "Application Development",
        billableStatus: false,
        currentEngagement: "In Training",
        agingInNonBillable: 45,
        monthlySalaryCost: 12000,
        monthlyRevenueGenerated: 0,
      },
      {
        employeeId: "EMP002",
        fullName: "Sarah Wilson",
        designation: "QA Engineer",
        department: "Quality Assurance",
        seniorityLevel: "Mid-Senior (3-6 yrs)",
        skillCategory: "QA",
        billableStatus: false,
        currentEngagement: "Shadowing",
        agingInNonBillable: 30,
        monthlySalaryCost: 8000,
        monthlyRevenueGenerated: 0,
      },
      {
        employeeId: "EMP003",
        fullName: "Mike Johnson",
        designation: "DevOps Engineer",
        department: "DevOps",
        seniorityLevel: "Senior (6+ yrs)",
        skillCategory: "DevOps",
        billableStatus: false,
        currentEngagement: "Internal Project",
        agingInNonBillable: 60,
        monthlySalaryCost: 10000,
        monthlyRevenueGenerated: 0,
      },
      // Add more sample data as needed
    ];

    setResources(sampleResources);

    // Apply filtering based on type and filter
    let filtered = sampleResources;
    
    if (type === 'seniority' && filter) {
      filtered = sampleResources.filter(r => r.seniorityLevel === filter);
    } else if (type === 'skill' && filter) {
      filtered = sampleResources.filter(r => r.skillCategory === filter);
    } else if (type === 'aging' && filter) {
      // Filter by aging bucket
      filtered = sampleResources.filter(r => {
        const aging = r.agingInNonBillable;
        switch (filter) {
          case "< 30 days": return aging < 30;
          case "30-59 days": return aging >= 30 && aging < 60;
          case "60-89 days": return aging >= 60 && aging < 90;
          case "≥ 90 days": return aging >= 90;
          default: return true;
        }
      });
    } else if (type === 'engagement' && filter) {
      filtered = sampleResources.filter(r => r.currentEngagement === filter);
    } else if (type === 'interns') {
      // For interns, we might need different data structure
      filtered = sampleResources.filter(r => r.designation.includes('Intern'));
    }

    setFilteredResources(filtered);
  }, [type, filter]);

  const getTypeTitle = () => {
    switch (type) {
      case 'seniority': return 'Resources by Seniority';
      case 'skill': return 'Resources by Skill Category';
      case 'aging': return 'Resources by Aging';
      case 'engagement': return 'Resources by Engagement Type';
      case 'interns': return 'Intern Resources';
      default: return 'Resource Details';
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getTypeTitle()}</h1>
          {filter && (
            <p className="text-gray-600">Filtered by: <Badge variant="outline">{filter}</Badge></p>
          )}
          <p className="text-gray-600 mt-1">
            Showing {filteredResources.length} resources
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Resource Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Seniority</TableHead>
                <TableHead>Skill Category</TableHead>
                <TableHead>Current Engagement</TableHead>
                <TableHead>Aging (Days)</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.employeeId}>
                  <TableCell className="font-medium">{resource.employeeId}</TableCell>
                  <TableCell>{resource.fullName}</TableCell>
                  <TableCell>{resource.designation}</TableCell>
                  <TableCell>{resource.department}</TableCell>
                  <TableCell>{resource.seniorityLevel}</TableCell>
                  <TableCell>{resource.skillCategory}</TableCell>
                  <TableCell>{resource.currentEngagement}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={resource.agingInNonBillable > 60 ? "destructive" : 
                             resource.agingInNonBillable > 30 ? "outline" : "secondary"}
                    >
                      {resource.agingInNonBillable}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(resource.monthlySalaryCost)}</TableCell>
                  <TableCell>
                    <Badge variant={resource.billableStatus ? "default" : "secondary"}>
                      {resource.billableStatus ? "Billable" : "Non-Billable"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No resources found matching the current filter criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
