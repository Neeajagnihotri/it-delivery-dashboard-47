
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Clock, User } from "lucide-react";

// Import the ReleaseResource type from useResourceData to avoid conflicts
import type { ReleaseResource } from "@/hooks/useResourceData";

interface ResourceReleaseSectionProps {
  resources: ReleaseResource[];
}

export const ResourceReleaseSection = ({ resources }: ResourceReleaseSectionProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "tentative": return "bg-yellow-100 text-yellow-800";
      case "at-risk": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Resource Releases (Next 2 Months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No resources scheduled for release in the next 2 months.</p>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
                      {resource.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium">{resource.name}</h4>
                      <p className="text-sm text-muted-foreground">{resource.role} • {resource.experience}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(resource.status)}>
                    {resource.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Release Date</p>
                      <p className="font-medium">{formatDate(resource.releaseDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Current Project</p>
                      <p className="font-medium">{resource.currentProject}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Utilization</p>
                    <p className="font-medium">{resource.utilizationPercentage}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.skillset.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link to={`/resource-details/${resource.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/project-allocation?resourceId=${resource.id}`}>
                    <Button size="sm">
                      Allocate to Project
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
