
from flask import request
from app.api import api_bp
from app.services.resource_service import ResourceService
from app.utils.response import success_response, error_response
from app.utils.validators import validate_required_fields
from app.utils.auth import role_required

@api_bp.route('/resources', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_resources():
    """Get all resources"""
    try:
        resources = ResourceService.get_all_resources()
        resources_data = []
        
        for resource in resources:
            resource_dict = resource.to_dict()
            if resource.personal_info:
                resource_dict.update({
                    'full_name': resource.personal_info.full_name,
                    'first_name': resource.personal_info.first_name,
                    'last_name': resource.personal_info.last_name,
                    'designation': resource.personal_info.designation,
                    'department': resource.personal_info.department,
                    'seniority_level': resource.personal_info.seniority_level,
                    'experience_years': resource.personal_info.experience_years,
                    'experience_months': resource.personal_info.experience_months,
                    'location': resource.personal_info.location,
                    'work_location': resource.personal_info.work_location,
                    'joining_date': resource.personal_info.joining_date.isoformat() if resource.personal_info.joining_date else None,
                    'employment_type': resource.personal_info.employment_type,
                    'employment_status': resource.personal_info.employment_status,
                    'reporting_manager': resource.personal_info.reporting_manager,
                    'email': resource.personal_info.email,
                    'phone': resource.personal_info.phone
                })
            resources_data.append(resource_dict)
        
        return success_response(resources_data, 'Resources retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve resources', 500)

@api_bp.route('/resources', methods=['POST'])
@role_required(['resource_manager'], 'write')
def create_resource():
    """Create new resource"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['employee_id'])
        
        resource = ResourceService.create_resource(**data)
        
        return success_response(
            resource.to_dict(),
            'Resource created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Resource creation failed', 500)

@api_bp.route('/resources/<int:resource_id>', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_resource(resource_id):
    """Get resource by ID"""
    try:
        resource = ResourceService.get_resource_by_id(resource_id)
        
        if not resource:
            return error_response('Resource not found', 404)
        
        resource_dict = resource.to_dict()
        if resource.personal_info:
            resource_dict.update({
                'full_name': resource.personal_info.full_name,
                'designation': resource.personal_info.designation,
                'department': resource.personal_info.department,
                'seniority_level': resource.personal_info.seniority_level,
                'experience_years': resource.personal_info.experience_years,
                'location': resource.personal_info.location,
                'joining_date': resource.personal_info.joining_date.isoformat() if resource.personal_info.joining_date else None,
                'employment_type': resource.personal_info.employment_type,
                'reporting_manager': resource.personal_info.reporting_manager,
                'email': resource.personal_info.email,
                'phone': resource.personal_info.phone
            })
        
        return success_response(resource_dict, 'Resource retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve resource', 500)

@api_bp.route('/resources/employee/<string:employee_id>', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_resource_by_employee_id(employee_id):
    """Get resource by employee ID"""
    try:
        resource = ResourceService.get_resource_by_employee_id(employee_id)
        
        if not resource:
            return error_response('Resource not found', 404)
        
        resource_dict = resource.to_dict()
        if resource.personal_info:
            resource_dict.update({
                'full_name': resource.personal_info.full_name,
                'designation': resource.personal_info.designation,
                'department': resource.personal_info.department
            })
        
        return success_response(resource_dict, 'Resource retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve resource', 500)

@api_bp.route('/resources/<int:resource_id>', methods=['PUT'])
@role_required(['resource_manager'], 'write')
def update_resource(resource_id):
    """Update resource"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        resource = ResourceService.update_resource(resource_id, **data)
        
        return success_response(
            resource.to_dict(),
            'Resource updated successfully'
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Resource update failed', 500)

@api_bp.route('/resources/<int:resource_id>', methods=['DELETE'])
@role_required(['resource_manager'], 'write')
def delete_resource(resource_id):
    """Delete resource"""
    try:
        ResourceService.delete_resource(resource_id)
        
        return success_response(None, 'Resource deleted successfully')
        
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response('Resource deletion failed', 500)

@api_bp.route('/resources/bench', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_bench_resources():
    """Get all bench resources"""
    try:
        resources = ResourceService.get_bench_resources()
        resources_data = []
        
        for resource in resources:
            resource_dict = resource.to_dict()
            if resource.personal_info:
                resource_dict.update({
                    'full_name': resource.personal_info.full_name,
                    'designation': resource.personal_info.designation,
                    'department': resource.personal_info.department
                })
            resources_data.append(resource_dict)
        
        return success_response(resources_data, 'Bench resources retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve bench resources', 500)

@api_bp.route('/resources/billable', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_billable_resources():
    """Get all billable resources"""
    try:
        resources = ResourceService.get_billable_resources()
        resources_data = []
        
        for resource in resources:
            resource_dict = resource.to_dict()
            if resource.personal_info:
                resource_dict.update({
                    'full_name': resource.personal_info.full_name,
                    'designation': resource.personal_info.designation,
                    'department': resource.personal_info.department
                })
            resources_data.append(resource_dict)
        
        return success_response(resources_data, 'Billable resources retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve billable resources', 500)

@api_bp.route('/resources/interns', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_intern_resources():
    """Get all intern resources"""
    try:
        resources = ResourceService.get_intern_resources()
        resources_data = []
        
        for resource in resources:
            resource_dict = resource.to_dict()
            if resource.personal_info:
                resource_dict.update({
                    'full_name': resource.personal_info.full_name,
                    'designation': resource.personal_info.designation,
                    'department': resource.personal_info.department
                })
            resources_data.append(resource_dict)
        
        return success_response(resources_data, 'Intern resources retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve intern resources', 500)

@api_bp.route('/resources/<int:resource_id>/utilization', methods=['PUT'])
@role_required(['resource_manager'], 'write')
def update_resource_utilization(resource_id):
    """Update resource utilization metrics"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        resource = ResourceService.update_utilization(resource_id, data)
        
        return success_response(
            resource.to_dict(),
            'Resource utilization updated successfully'
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Resource utilization update failed', 500)
