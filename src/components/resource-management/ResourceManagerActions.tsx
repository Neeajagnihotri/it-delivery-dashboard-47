
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, FolderPlus, Plus } from "lucide-react";

export const ResourceManagerActions = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Manager Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/add-resource">
          <Button className="w-full h-24 flex flex-col gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200" variant="outline">
            <UserPlus size={24} />
            <span>Add Resource</span>
          </Button>
        </Link>
        <Link to="/add-project">
          <Button className="w-full h-24 flex flex-col gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200" variant="outline">
            <FolderPlus size={24} />
            <span>Add Project</span>
          </Button>
        </Link>
        <Link to="/project-allocation">
          <Button className="w-full h-24 flex flex-col gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200" variant="outline">
            <Plus size={24} />
            <span>Project Allocation</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
