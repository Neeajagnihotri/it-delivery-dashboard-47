import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, TrendingUp, AlertTriangle, CheckCircle, Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { EditProjectModal } from "@/components/dashboard/EditProjectModal";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const projectData = {
    name: "Project Alpha",
    client: "TechCorp Industries", 
    description: "Detailed project delivery insights and metrics",
    status: "Development",
    health: "Healthy",
    progress: 65,
    startDate: "1/15/2024",
    endDate: "6/30/2024",
    projectType: "Fixed Bid",
    duration: "24 weeks",
    currentStage: "Development"
  };

  const teamMembers = [
    { id: "SJ", name: "Sarah Johnson", role: "Delivery Manager", location: "New York", utilization: "100%", status: "active" },
    { id: "MC", name: "Mike Chen", role: "Scrum Master", location: "San Francisco", utilization: "100%", status: "active" },
    { id: "AR", name: "Alex Rodriguez", role: "Tech Lead", location: "Austin", utilization: "100%", status: "active" },
    { id: "ED", name: "Emily Davis", role: "Senior Developer", location: "London", utilization: "100%", status: "active" },
    { id: "JW", name: "James Wilson", role: "Senior Developer", location: "Toronto", utilization: "100%", status: "active" }
  ];

  const upcomingChanges = [
    { id: "TA", name: "Tom Anderson", role: "Senior Developer", date: "7/1/2024", status: "joining" },
    { id: "ET", name: "Emma Thompson", role: "QA Engineer", date: "7/15/2024", status: "joining" },
    { id: "CL", name: "Carlos Lopez", role: "Developer", date: "8/30/2024", status: "leaving" }
  ];

  const milestones = [
    { name: "MVP Release", progress: 100, status: "completed", date: "3/15/2024" },
    { name: "Beta Testing", progress: 75, status: "on track", date: "4/30/2024" },
    { name: "User Acceptance", progress: 45, status: "on track", date: "5/15/2024" },
    { name: "Production Release", progress: 20, status: "at risk", date: "6/30/2024" }
  ];

  const risks = [
    { issue: "Third-party API dependency", owner: "Tech Lead", priority: "high", status: "Active" },
    { issue: "Resource availability", owner: "Delivery Manager", priority: "medium", status: "Mitigated" },
    { issue: "Client approval delays", owner: "CSP", priority: "low", status: "Monitoring" }
  ];

  const roleDistribution = [
    { role: "Development", count: 5, percentage: 42 },
    { role: "QA", count: 2, percentage: 17 },
    { role: "Management", count: 2, percentage: 17 },
    { role: "UX/Design", count: 1, percentage: 8 },
    { role: "DevOps", count: 1, percentage: 8 },
    { role: "Business Analysis", count: 1, percentage: 8 }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Details - {projectData.name}</h1>
          <p className="text-gray-600">{projectData.description}</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Edit Project
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b border-border mb-6">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`pb-2 px-1 border-b-2 font-medium ${
            activeTab === "overview" 
              ? "border-blue-500 text-blue-600" 
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          📋 Project Overview
        </button>
        <button 
          onClick={() => setActiveTab("delivery")}
          className={`pb-2 px-1 border-b-2 font-medium ${
            activeTab === "delivery" 
              ? "border-blue-500 text-blue-600" 
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          📊 Delivery Metrics
        </button>
        <button 
          onClick={() => setActiveTab("engineering")}
          className={`pb-2 px-1 border-b-2 font-medium ${
            activeTab === "engineering" 
              ? "border-blue-500 text-blue-600" 
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          🔧 Engineering
        </button>
        <button 
          onClick={() => setActiveTab("team")}
          className={`pb-2 px-1 border-b-2 font-medium ${
            activeTab === "team" 
              ? "border-blue-500 text-blue-600" 
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          👥 Team
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <>
          {/* Project Overview Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{projectData.name}</h2>
                  <p className="text-gray-600">{projectData.client}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {projectData.status}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {projectData.health}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Project Progress</span>
                  <span className="text-sm font-medium">{projectData.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 bg-blue-500 rounded-full" 
                    style={{ width: `${projectData.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Start: {projectData.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">End: {projectData.endDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Type</span>
                    <span className="font-medium">{projectData.projectType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{projectData.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Stage</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                      {projectData.currentStage}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👥 Key Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.slice(0, 4).map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {member.id}
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-600">{member.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{member.location}</div>
                        <div className="text-xs text-green-600">{member.utilization}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Milestone Status */}
          <Card>
            <CardHeader>
              <CardTitle>📅 Milestone Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{milestone.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                          milestone.status === 'on track' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {milestone.status}
                        </span>
                        <span className="text-sm text-gray-600">{milestone.date}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'on track' ? 'bg-blue-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {milestone.progress}% complete
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Register and Team Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>⚠️ Risk Register (Top 3)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {risks.map((risk, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{risk.issue}</div>
                          <div className="text-sm text-gray-600">Owner: {risk.owner}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            risk.priority === 'high' ? 'bg-red-100 text-red-800' :
                            risk.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.priority}
                          </span>
                          <span className="text-xs text-gray-600">{risk.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Role Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roleDistribution.map((role, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">{role.role}</span>
                        <span className="text-sm font-medium">{role.count} ({role.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full" 
                          style={{ width: `${role.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === "delivery" && (
        <>
          {/* Delivery Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">42</div>
                <div className="text-sm text-gray-600">Sprint Velocity</div>
                <div className="text-xs text-gray-500">story points/sprint</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">87%</div>
                <div className="text-sm text-gray-600">Predictability</div>
                <div className="text-xs text-gray-500">committed vs completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Defect Leakage</div>
                <div className="text-xs text-gray-500">bugs post-release</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">92%</div>
                <div className="text-sm text-gray-600">On-Time Delivery</div>
                <div className="text-xs text-gray-500">milestones met</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Sprint Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Sprint</span>
                    <span className="font-medium">Sprint 15</span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Sprint Progress</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Burndown Rate</span>
                    <span className="font-medium text-green-600">On Track</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Story Points Completed</span>
                    <span className="font-medium">32/42</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📈 Delivery Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Velocity Trend</span>
                    <span className="font-medium text-green-600">↑ Improving</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quality Score</span>
                    <span className="font-medium">8.5/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Feature Completion Rate</span>
                    <span className="font-medium">89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === "engineering" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-900">94%</div>
                <div className="text-sm text-gray-600">Code Coverage</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-900">2.1</div>
                <div className="text-sm text-gray-600">Performance Score</div>
                <div className="text-xs text-gray-500">requests/second</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-900">78%</div>
                <div className="text-sm text-gray-600">Test Coverage</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Technical Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Build Success Rate</span>
                    <span className="font-medium text-green-600">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Deployment Frequency</span>
                    <span className="font-medium">Daily</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lead Time</span>
                    <span className="font-medium">2.3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">MTTR</span>
                    <span className="font-medium">4.2 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔧 Code Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Technical Debt</span>
                    <span className="font-medium text-yellow-600">Medium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Code Maintainability</span>
                    <span className="font-medium text-green-600">A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Security Score</span>
                    <span className="font-medium">95/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dependencies Updated</span>
                    <span className="font-medium text-green-600">Current</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === "team" && (
        <>
          {/* Team Members and Upcoming Changes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👥 Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {member.id}
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-600">{member.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{member.location}</div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {member.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📅 Upcoming Team Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingChanges.map((change) => (
                    <div key={change.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {change.id}
                        </div>
                        <div>
                          <div className="font-medium">{change.name}</div>
                          <div className="text-sm text-gray-600">{change.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{change.date}</div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          change.status === 'joining' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {change.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>🎯 Role Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roleDistribution.map((role, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{role.role}</span>
                      <span className="text-sm font-medium">{role.count} ({role.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${role.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Team Velocity</span>
                    <span className="font-medium">42 pts/sprint</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Retention Rate</span>
                    <span className="font-medium text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Satisfaction Score</span>
                    <span className="font-medium">4.2/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Training Hours</span>
                    <span className="font-medium">120h/quarter</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 Capacity Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Utilization</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Available Capacity</span>
                    <span className="font-medium">13%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Planned Hires</span>
                    <span className="font-medium text-blue-600">3 positions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Skills Gap</span>
                    <span className="font-medium text-orange-600">React, DevOps</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Edit Project Modal */}
      <EditProjectModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectData={projectData}
      />
    </div>
  );
};

export default ProjectDetails;
