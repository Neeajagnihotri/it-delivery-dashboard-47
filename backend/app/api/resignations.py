from flask import request
from app.api import api_bp
from app.services.resignation_service import ResignationService
from app.utils.response import success_response, error_response
from app.utils.validators import validate_required_fields
from app.utils.auth import role_required

@api_bp.route('/resignations', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_resignations():
    """Get all resignations"""
    try:
        resignations = ResignationService.get_all_resignations()
        resignations_data = [resignation.to_dict() for resignation in resignations]
        
        return success_response(resignations_data, 'Resignations retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve resignations', 500)

@api_bp.route('/resignations', methods=['POST'])
@role_required(['resource_manager'], 'write')
def create_resignation():
    """Create new resignation record"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['employee_id', 'emp_name', 'date_of_resignation'])
        
        resignation = ResignationService.create_resignation(**data)
        
        return success_response(
            resignation.to_dict(),
            'Resignation record created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Resignation creation failed', 500)

@api_bp.route('/resignations/<int:resignation_id>', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_resignation(resignation_id):
    """Get resignation by ID"""
    try:
        resignation = ResignationService.get_resignation_by_id(resignation_id)
        
        if not resignation:
            return error_response('Resignation not found', 404)
        
        return success_response(resignation.to_dict(), 'Resignation retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve resignation', 500)

@api_bp.route('/resignations/<int:resignation_id>', methods=['PUT'])
@role_required(['resource_manager'], 'write')
def update_resignation(resignation_id):
    """Update resignation record"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        resignation = ResignationService.update_resignation(resignation_id, **data)
        
        return success_response(
            resignation.to_dict(),
            'Resignation updated successfully'
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Resignation update failed', 500)

@api_bp.route('/resignations/<int:resignation_id>', methods=['DELETE'])
@role_required(['resource_manager'], 'write')
def delete_resignation(resignation_id):
    """Delete resignation record"""
    try:
        ResignationService.delete_resignation(resignation_id)
        
        return success_response(None, 'Resignation deleted successfully')
        
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response('Resignation deletion failed', 500)