
from flask import request
from app.api import api_bp
from app.models.project import Project, ProjectMilestone
from app.services.project_service import ProjectService
from app import db
from app.utils.response import success_response, error_response
from app.utils.validators import validate_required_fields
from app.utils.auth import role_required
from datetime import datetime

@api_bp.route('/projects', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_projects():
    """Get all projects"""
    try:
        projects = ProjectService.get_all_projects()
        projects_data = [project.to_dict() for project in projects]
        
        return success_response(projects_data, 'Projects retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve projects', 500)

@api_bp.route('/projects', methods=['POST'])
@role_required(['resource_manager'], 'write')
def create_project():
    """Create new project"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['project_code', 'project_name', 'client_name', 'start_date', 'sow_value'])
        
        project = ProjectService.create_project(**data)
        
        return success_response(
            project.to_dict(),
            'Project created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Project creation failed', 500)

@api_bp.route('/projects/<int:project_id>', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_project(project_id):
    """Get project by ID"""
    try:
        project = ProjectService.get_project_by_id(project_id)
        
        if not project:
            return error_response('Project not found', 404)
        
        project_dict = project.to_dict()
        
        # Add milestones and allocations
        project_dict['milestones'] = [milestone.to_dict() for milestone in project.milestones]
        project_dict['allocations'] = [allocation.to_dict() for allocation in project.allocations]
        
        return success_response(project_dict, 'Project retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve project', 500)

@api_bp.route('/projects/<int:project_id>', methods=['PUT'])
@role_required(['resource_manager'], 'write')
def update_project(project_id):
    """Update project"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        project = ProjectService.update_project(project_id, **data)
        
        return success_response(
            project.to_dict(),
            'Project updated successfully'
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Project update failed', 500)

@api_bp.route('/projects/<int:project_id>', methods=['DELETE'])
@role_required(['resource_manager'], 'write')
def delete_project(project_id):
    """Delete project (soft delete)"""
    try:
        project = ProjectService.delete_project(project_id)
        
        return success_response(
            project.to_dict(),
            'Project deleted successfully'
        )
        
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response('Project deletion failed', 500)

@api_bp.route('/projects/<int:project_id>/milestones', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_project_milestones(project_id):
    """Get milestones for a project"""
    try:
        milestones = ProjectService.get_project_milestones(project_id)
        milestones_data = [milestone.to_dict() for milestone in milestones]
        
        return success_response(milestones_data, 'Project milestones retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve project milestones', 500)

@api_bp.route('/projects/<int:project_id>/milestones', methods=['POST'])
@role_required(['resource_manager'], 'write')
def create_project_milestone(project_id):
    """Create project milestone"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['milestone_name', 'planned_date'])
        
        milestone = ProjectService.create_milestone(project_id, **data)
        
        return success_response(
            milestone.to_dict(),
            'Project milestone created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Project milestone creation failed', 500)

@api_bp.route('/projects/<int:project_id>/allocations', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_project_allocations(project_id):
    """Get allocations for a project"""
    try:
        allocations = ProjectService.get_project_allocations(project_id)
        allocations_data = []
        
        for allocation in allocations:
            allocation_dict = allocation.to_dict()
            if allocation.resource and allocation.resource.personal_info:
                allocation_dict['resource_name'] = allocation.resource.personal_info.full_name
                allocation_dict['resource_employee_id'] = allocation.resource.employee_id
            allocations_data.append(allocation_dict)
        
        return success_response(allocations_data, 'Project allocations retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve project allocations', 500)

@api_bp.route('/projects/<int:project_id>/allocations', methods=['POST'])
@role_required(['resource_manager'], 'write')
def create_project_allocation(project_id):
    """Create project allocation"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['resource_id', 'allocation_percentage', 'start_date'])
        
        allocation = ProjectService.create_allocation(project_id, **data)
        
        return success_response(
            allocation.to_dict(),
            'Project allocation created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Project allocation creation failed', 500)
