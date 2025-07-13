
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Building, User, Calendar, Clock, FileText, AlertCircle } from "lucide-react";
import dashboardData from "@/data/dashboardData.json";

interface Escalation {
  id: string;
  title: string;
  customer: string;
  project: string;
  owner: string;
  priority: string;
  status: string;
  dateRaised: string;
  resolutionETA: string;
  description?: string;
}

const EscalationDetails = () => {
  const { id } = useParams();
  const [escalation, setEscalation] = useState<Escalation | null>(null);

  useEffect(() => {
    const foundEscalation = dashboardData.escalations.find(esc => esc.id === id);
    setEscalation(foundEscalation || null);
  }, [id]);

  if (!escalation) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground">Escalation not found</h2>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header Card */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-xl">Escalation Details</CardTitle>
            </div>
            <Badge className={`${getPriorityColor(escalation.priority)} border`}>
              {escalation.priority} Priority
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold text-primary mb-4">{escalation.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{escalation.customer}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date Raised</p>
                  <p className="font-medium">{escalation.dateRaised}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Project Owner</p>
                  <p className="font-medium">{escalation.owner}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Resolution ETA</p>
                  <p className="font-medium">{escalation.resolutionETA}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Escalation Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Title</h3>
            <p className="text-muted-foreground">{escalation.title}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {escalation.description || "Critical performance degradation in API response times affecting customer operations. Response times have increased by 300% over the past 48 hours, causing timeout issues for end users. Immediate investigation and resolution required."}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Impact Assessment</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Customer operations severely impacted</li>
              <li>SLA breach imminent if not resolved within 24 hours</li>
              <li>Potential revenue loss of £50K per day</li>
              <li>Customer satisfaction at risk</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Actions Taken</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Infrastructure team notified and investigating</li>
              <li>Database performance analysis initiated</li>
              <li>Customer informed of ongoing investigation</li>
              <li>Backup systems activated to mitigate impact</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscalationDetails;
