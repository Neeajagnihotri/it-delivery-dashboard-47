
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Mail, Phone, Calendar, User, MapPin, Building, Clock, Star } from "lucide-react";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import employeeData from "@/data/employeeData.json";

interface ResourceViewData {
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  location: string;
  experience: string;
  email: string;
  phone: string;
  joinedDate: string;
  billableStatus: boolean;
  utilizationRate: number;
  projectSuccessRate: number;
  performanceRating: number;
  skills: string[];
  upcomingEngagements: {
    title: string;
    role: string;
    client: string;
    duration: string;
    status: string;
  }[];
  currentProjects: {
    title: string;
    role: string;
    client: string;
    started: string;
    status: string;
  }[];
  performanceFeedback: {
    reviewer: string;
    date: string;
    rating: number;
    comment: string;
    strengths: string[];
    improvements: string[];
    goals: string[];
  };
}

const ResourceView = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resourceData, setResourceData] = useState<ResourceViewData | null>(null);

  useEffect(() => {
    // Find employee data from JSON file
    const employee = employeeData.employees.find(emp => emp.employeeId === resourceId);
    if (employee) {
      setResourceData(employee);
    }
  }, [resourceId]);

  if (!resourceData) {
    return (
      <div className="space-y-6">
        <BreadcrumbNavigation />
        <div className="text-center">Employee not found</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                {getInitials(resourceData.fullName)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{resourceData.fullName}</h1>
                <p className="text-gray-600">{resourceData.designation}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {resourceData.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {resourceData.department}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {resourceData.experience}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={resourceData.billableStatus ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {resourceData.billableStatus ? "Billable" : "Non-Billable"}
              </Badge>
              <span className="text-sm text-gray-500">Active Status</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{resourceData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{resourceData.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <span>Employee ID: {resourceData.employeeId}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Joined: {resourceData.joinedDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Utilization Rate</span>
                <span className="font-medium">{resourceData.utilizationRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${resourceData.utilizationRate}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Project Success Rate</span>
                <span className="font-medium">{resourceData.projectSuccessRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${resourceData.projectSuccessRate}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Performance Rating</span>
                <div className="flex items-center gap-1">
                  {renderStars(resourceData.performanceRating)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills & Expertise */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {resourceData.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-blue-700 border-blue-200">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Engagements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Engagements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resourceData.upcomingEngagements.map((engagement, index) => (
            <div key={index} className="border rounded-lg p-4 bg-red-50 border-red-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{engagement.title}</h4>
                <Badge className="bg-green-100 text-green-800">{engagement.status}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">{engagement.role}</p>
              <p className="text-sm text-gray-500">Client: {engagement.client}</p>
              <p className="text-sm text-gray-500">Duration: {engagement.duration}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Current Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Current Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {resourceData.currentProjects.map((project, index) => (
            <div key={index} className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{project.title}</h4>
                <Badge className="bg-green-100 text-green-800">{project.status}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">{project.role}</p>
              <p className="text-sm text-gray-500">Started: {project.started}</p>
              <p className="text-sm text-gray-500">Client: {project.client}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Performance Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{resourceData.performanceFeedback.reviewer}</h4>
                <p className="text-sm text-gray-500">{resourceData.performanceFeedback.date}</p>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(resourceData.performanceFeedback.rating)}
              </div>
            </div>
            
            <p className="text-gray-700">{resourceData.performanceFeedback.comment}</p>
            
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-2">Strengths:</h5>
              <div className="flex flex-wrap gap-1">
                {resourceData.performanceFeedback.strengths.map((strength, index) => (
                  <Badge key={index} variant="outline" className="text-green-700 border-green-200">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-2">Areas for Improvement:</h5>
              <div className="flex flex-wrap gap-1">
                {resourceData.performanceFeedback.improvements.map((improvement, index) => (
                  <Badge key={index} variant="outline" className="text-orange-700 border-orange-200">
                    {improvement}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-2">Goals:</h5>
              <div className="flex flex-wrap gap-1">
                {resourceData.performanceFeedback.goals.map((goal, index) => (
                  <Badge key={index} variant="outline" className="text-blue-700 border-blue-200">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceView;
