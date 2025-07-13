import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { QueryClient } from "@/components/providers/query-client";

// Import all pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import Resources from "@/pages/Resources";
import ResourceManagement from "@/pages/ResourceManagement";
import ResourceDetails from "@/pages/ResourceDetails";
import ResourceView from "@/pages/ResourceView";
import ResourceOverview from "@/pages/ResourceOverview";
import ProjectManagement from "@/pages/ProjectManagement";
import ProjectDetails from "@/pages/ProjectDetails";
import ProjectAllocation from "@/pages/ProjectAllocation";
import FinancialDepartment from "@/pages/FinancialDepartment";
import Escalations from "@/pages/Escalations";
import EscalationDetails from "@/pages/EscalationDetails";
import AddProject from "@/pages/AddProject";
import AddResource from "@/pages/AddResource";
import TotalResourcesKPI from "@/pages/TotalResourcesKPI";
import BillableResourcesKPI from "@/pages/BillableResourcesKPI";
import NonBillableResourcesKPI from "@/pages/NonBillableResourcesKPI";
import InternsKPI from "@/pages/InternsKPI";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resource-management"
                element={
                  <ProtectedRoute>
                    <ResourceManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resource-management/:id"
                element={
                  <ProtectedRoute>
                    <ResourceDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resource-view/:id"
                element={
                  <ProtectedRoute>
                    <ResourceView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resource-overview"
                element={
                  <ProtectedRoute>
                    <ResourceOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-management"
                element={
                  <ProtectedRoute>
                    <ProjectManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-details/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-allocation"
                element={
                  <ProtectedRoute>
                    <ProjectAllocation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/financial-department"
                element={
                  <ProtectedRoute>
                    <FinancialDepartment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/escalations"
                element={
                  <ProtectedRoute>
                    <Escalations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/escalations/:id"
                element={
                  <ProtectedRoute>
                    <EscalationDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-project"
                element={
                  <ProtectedRoute>
                    <AddProject />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-resource"
                element={
                  <ProtectedRoute>
                    <AddResource />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/total-resources-kpi"
                element={
                  <ProtectedRoute>
                    <TotalResourcesKPI />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billable-resources-kpi"
                element={
                  <ProtectedRoute>
                    <BillableResourcesKPI />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/non-billable-resources-kpi"
                element={
                  <ProtectedRoute>
                    <NonBillableResourcesKPI />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interns-kpi"
                element={
                  <ProtectedRoute>
                    <InternsKPI />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
