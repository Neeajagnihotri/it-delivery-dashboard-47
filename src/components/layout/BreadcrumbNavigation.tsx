
import { Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/resource-management": "Resource Management",
  "/resource-management/total-resources": "Total Resources",
  "/resource-management/billable-resources": "Billable Resources", 
  "/resource-management/non-billable-resources": "Non-Billable Resources",
  "/resource-management/interns": "Interns",
  "/resource-details": "Resource Details",
  "/add-resource": "Add Resource",
  "/add-project": "Add Project",
  "/project-allocation": "Project Allocation",
  "/project-management": "Project Management",
  "/financial-department": "Financial Department",
  "/settings": "Settings",
  "/resources": "All Resources",
  "/resource-overview": "Resource Overview",
  "/escalations": "Escalations",
  "/login": "Login"
};

// Define hierarchical routes that should show parent breadcrumbs
const hierarchicalRoutes: Record<string, string[]> = {
  "/add-project": ["/", "/resource-management"],
  "/project-allocation": ["/", "/resource-management"],
  "/resource-management/total-resources": ["/", "/resource-management"],
  "/resource-management/billable-resources": ["/", "/resource-management"],
  "/resource-management/non-billable-resources": ["/", "/resource-management"],
  "/resource-management/interns": ["/", "/resource-management"],
  "/add-resource": ["/", "/resource-management"],
  "/resources": ["/", "/resource-management"],
  "/resource-details/billable": ["/", "/resource-management"],
  "/resource-details/non-billable": ["/", "/resource-management"],
  "/resource-details/interns": ["/", "/resource-management"],
  "/resource-details/total": ["/", "/resource-management"],
  "/resource-overview": ["/", "/resource-management"],
  "/financial-department": ["/"],
  "/escalations": ["/"],
  "/settings": ["/"]
};

export const BreadcrumbNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Handle project details pages - Dashboard > Project Management > Project Details
  if (currentPath.startsWith('/project-details')) {
    return (
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/project-management">Project Management</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Project Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Handle resource view pages - Dashboard > Resource Details
  if (currentPath.startsWith('/resource-view')) {
    return (
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Resource Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Handle escalation details pages
  if (currentPath.startsWith('/escalations/') && currentPath !== '/escalations') {
    return (
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/escalations">Escalations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Escalation Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Check if current path has defined hierarchical structure
  const parentPaths = hierarchicalRoutes[currentPath];
  
  if (parentPaths) {
    const breadcrumbs = [
      ...parentPaths.map(path => ({
        label: routeLabels[path] || "Unknown",
        path
      })),
      {
        label: routeLabels[currentPath] || currentPath.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        path: currentPath
      }
    ];

    return (
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.path} className="contents">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === 0 ? (
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.path} className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      {breadcrumb.label}
                    </Link>
                  </BreadcrumbLink>
                ) : index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Default breadcrumb generation for other routes
  const pathSegments = currentPath.split("/").filter(Boolean);

  // If we're on the dashboard, don't show breadcrumbs
  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbs = [
    { label: "Dashboard", path: "/" },
    ...pathSegments.map((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/");
      let label = routeLabels[path];
      
      if (!label) {
        label = segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      }
      
      return { label, path };
    })
  ];

  // Remove duplicate dashboard entries
  const uniqueBreadcrumbs = breadcrumbs.filter((breadcrumb, index, array) => 
    index === 0 || breadcrumb.path !== array[0].path
  );

  if (uniqueBreadcrumbs.length <= 1) return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {uniqueBreadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.path} className="contents">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === 0 ? (
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.path} className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    {breadcrumb.label}
                  </Link>
                </BreadcrumbLink>
              ) : index === uniqueBreadcrumbs.length - 1 ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
