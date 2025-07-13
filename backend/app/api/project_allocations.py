
from flask import request
from app.api import api_bp
from app.models.project_allocation import ProjectAllocation
from app.services.project_service import ProjectService
from app import db
from app.utils.response import success_response, error_response
from app.utils.validators import validate_required_fields
from app.utils.auth import role_required
from datetime import datetime

@api_bp.route('/allocations', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_all_allocations():
    """Get all project allocations with filters"""
    try:
        # Get query parameters for filtering
        project_id = request.args.get('project_id', type=int)
        resource_id = request.args.get('resource_id', type=int)
        status = request.args.get('status')
        
        query = ProjectAllocation.query
        
        if project_id:
            query = query.filter_by(project_id=project_id)
        if resource_id:
            query = query.filter_by(resource_id=resource_id)
        if status:
            query = query.filter_by(status=status)
        
        allocations = query.all()
        allocations_data = []
        
        for allocation in allocations:
            allocation_dict = allocation.to_dict()
            
            # Add project information
            if allocation.project:
                allocation_dict['project_name'] = allocation.project.project_name
                allocation_dict['project_code'] = allocation.project.project_code
                allocation_dict['client_name'] = allocation.project.client_name
            
            # Add resource information
            if allocation.resource:
                allocation_dict['resource_employee_id'] = allocation.resource.employee_id
                if allocation.resource.personal_info:
                    allocation_dict['resource_name'] = allocation.resource.personal_info.full_name
                    allocation_dict['resource_designation'] = allocation.resource.personal_info.designation
                    allocation_dict['resource_department'] = allocation.resource.personal_info.department
            
            allocations_data.append(allocation_dict)
        
        return success_response(allocations_data, 'Project allocations retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve project allocations', 500)

@api_bp.route('/allocations', methods=['POST'])
@role_required(['resource_manager'], 'write')
def create_allocation_detailed():
    """Create detailed project allocation"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['project_id', 'resource_id', 'allocation_percentage', 'start_date'])
        
        # Validate allocation percentage
        allocation_percentage = float(data['allocation_percentage'])
        if allocation_percentage <= 0 or allocation_percentage > 100:
            return error_response('Allocation percentage must be between 0 and 100', 400)
        
        # Handle date conversions
        date_fields = ['start_date', 'end_date', 'planned_end_date']
        for field in date_fields:
            if data.get(field) and isinstance(data[field], str):
                try:
                    data[field] = datetime.strptime(data[field], '%Y-%m-%d').date()
                except ValueError:
                    return error_response(f'Invalid date format for {field}. Use YYYY-MM-DD', 400)
        
        allocation = ProjectAllocation(
            project_id=data['project_id'],
            resource_id=data['resource_id'],
            allocation_percentage=allocation_percentage,
            start_date=data['start_date'],
            end_date=data.get('end_date'),
            planned_end_date=data.get('planned_end_date'),
            role_in_project=data.get('role_in_project'),
            responsibilities=data.get('responsibilities'),
            status=data.get('status', 'planned'),
            billing_rate=data.get('billing_rate'),
            cost_rate=data.get('cost_rate'),
            daily_hours=data.get('daily_hours', 8.00),
            weekly_hours=data.get('weekly_hours', 40.00),
            overtime_hours=data.get('overtime_hours', 0.00),
            utilization_efficiency=data.get('utilization_efficiency'),
            skill_match_percentage=data.get('skill_match_percentage'),
            performance_rating=data.get('performance_rating'),
            allocation_notes=data.get('allocation_notes'),
            created_by=data.get('created_by'),
            approved_by=data.get('approved_by')
        )
        
        if data.get('approval_date'):
            try:
                allocation.approval_date = datetime.strptime(data['approval_date'], '%Y-%m-%d').date()
            except ValueError:
                return error_response('Invalid date format for approval_date. Use YYYY-MM-DD', 400)
        
        db.session.add(allocation)
        db.session.commit()
        
        return success_response(
            allocation.to_dict(),
            'Project allocation created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Project allocation creation failed', 500)

@api_bp.route('/allocations/<int:allocation_id>', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_allocation_by_id(allocation_id):
    """Get allocation by ID with full details"""
    try:
        allocation = ProjectAllocation.query.get(allocation_id)
        if not allocation:
            return error_response('Project allocation not found', 404)
        
        allocation_dict = allocation.to_dict()
        
        # Add project information
        if allocation.project:
            allocation_dict['project_details'] = allocation.project.to_dict()
        
        # Add resource information
        if allocation.resource:
            resource_dict = allocation.resource.to_dict()
            if allocation.resource.personal_info:
                resource_dict.update({
                    'full_name': allocation.resource.personal_info.full_name,
                    'designation': allocation.resource.personal_info.designation,
                    'department': allocation.resource.personal_info.department
                })
            allocation_dict['resource_details'] = resource_dict
        
        return success_response(allocation_dict, 'Project allocation retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve project allocation', 500)

@api_bp.route('/allocations/<int:allocation_id>', methods=['PUT'])
@role_required(['resource_manager'], 'write')
def update_allocation_detailed(allocation_id):
    """Update detailed project allocation"""
    try:
        allocation = ProjectAllocation.query.get(allocation_id)
        if not allocation:
            return error_response('Project allocation not found', 404)
        
        data = request.get_json()
        if not data:
            return error_response('Request body is required', 400)
        
        # Validate allocation percentage if provided
        if 'allocation_percentage' in data:
            allocation_percentage = float(data['allocation_percentage'])
            if allocation_percentage <= 0 or allocation_percentage > 100:
                return error_response('Allocation percentage must be between 0 and 100', 400)
        
        # Handle date conversions
        date_fields = ['start_date', 'end_date', 'planned_end_date', 'approval_date']
        for field in date_fields:
            if data.get(field) and isinstance(data[field], str):
                try:
                    data[field] = datetime.strptime(data[field], '%Y-%m-%d').date()
                except ValueError:
                    return error_response(f'Invalid date format for {field}. Use YYYY-MM-DD', 400)
        
        # Update fields
        for key, value in data.items():
            if hasattr(allocation, key):
                setattr(allocation, key, value)
        
        db.session.commit()
        
        return success_response(
            allocation.to_dict(),
            'Project allocation updated successfully'
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Project allocation update failed', 500)

@api_bp.route('/allocations/<int:allocation_id>', methods=['DELETE'])
@role_required(['resource_manager'], 'write')
def delete_allocation(allocation_id):
    """Delete project allocation"""
    try:
        allocation = ProjectAllocation.query.get(allocation_id)
        if not allocation:
            return error_response('Project allocation not found', 404)
        
        db.session.delete(allocation)
        db.session.commit()
        
        return success_response(None, 'Project allocation deleted successfully')
        
    except Exception as e:
        return error_response('Project allocation deletion failed', 500)

@api_bp.route('/allocations/resource/<int:resource_id>', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_resource_allocations(resource_id):
    """Get all allocations for a specific resource"""
    try:
        allocations = ProjectAllocation.query.filter_by(resource_id=resource_id).all()
        allocations_data = []
        
        for allocation in allocations:
            allocation_dict = allocation.to_dict()
            if allocation.project:
                allocation_dict['project_name'] = allocation.project.project_name
                allocation_dict['project_code'] = allocation.project.project_code
                allocation_dict['client_name'] = allocation.project.client_name
                allocation_dict['project_status'] = allocation.project.status
            allocations_data.append(allocation_dict)
        
        return success_response(allocations_data, 'Resource allocations retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve resource allocations', 500)

@api_bp.route('/allocations/project/<int:project_id>', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_project_allocations_detailed(project_id):
    """Get all allocations for a specific project"""
    try:
        allocations = ProjectAllocation.query.filter_by(project_id=project_id).all()
        allocations_data = []
        
        for allocation in allocations:
            allocation_dict = allocation.to_dict()
            if allocation.resource:
                allocation_dict['resource_employee_id'] = allocation.resource.employee_id
                if allocation.resource.personal_info:
                    allocation_dict['resource_name'] = allocation.resource.personal_info.full_name
                    allocation_dict['resource_designation'] = allocation.resource.personal_info.designation
                    allocation_dict['resource_department'] = allocation.resource.personal_info.department
            allocations_data.append(allocation_dict)
        
        return success_response(allocations_data, 'Project allocations retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve project allocations', 500)

@api_bp.route('/allocations/active', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_active_allocations():
    """Get all active allocations"""
    try:
        allocations = ProjectAllocation.query.filter_by(status='active').all()
        allocations_data = []
        
        for allocation in allocations:
            allocation_dict = allocation.to_dict()
            
            # Add project information
            if allocation.project:
                allocation_dict['project_name'] = allocation.project.project_name
                allocation_dict['project_code'] = allocation.project.project_code
                allocation_dict['client_name'] = allocation.project.client_name
            
            # Add resource information
            if allocation.resource and allocation.resource.personal_info:
                allocation_dict['resource_name'] = allocation.resource.personal_info.full_name
                allocation_dict['resource_employee_id'] = allocation.resource.employee_id
                allocation_dict['resource_designation'] = allocation.resource.personal_info.designation
            
            allocations_data.append(allocation_dict)
        
        return success_response(allocations_data, 'Active allocations retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve active allocations', 500)
