
from flask import request
from app.api import api_bp
from app.models.personal_info import PersonalInfo
from app import db
from app.utils.response import success_response, error_response
from app.utils.validators import validate_required_fields, validate_email
from app.utils.auth import role_required
from datetime import datetime

@api_bp.route('/personal-info', methods=['GET'])
@role_required(['leadership', 'hr'], 'read')
def get_personal_info():
    """Get all personal information records"""
    try:
        personal_info = PersonalInfo.query.all()
        personal_info_data = [info.to_dict() for info in personal_info]
        
        return success_response(personal_info_data, 'Personal information retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve personal information', 500)

@api_bp.route('/personal-info', methods=['POST'])
@role_required(['hr'], 'write')
def create_personal_info():
    """Create personal information record"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['employee_id', 'full_name'])
        
        # Validate email if provided
        if data.get('email') and not validate_email(data['email']):
            return error_response('Invalid email format', 400)
        
        # Check if employee_id already exists
        if PersonalInfo.query.filter_by(employee_id=data['employee_id']).first():
            return error_response('Employee ID already exists', 400)
        
        # Handle date conversion
        joining_date = None
        if data.get('joining_date'):
            try:
                joining_date = datetime.strptime(data['joining_date'], '%Y-%m-%d').date()
            except ValueError:
                return error_response('Invalid date format for joining_date. Use YYYY-MM-DD', 400)
        
        personal_info = PersonalInfo(
            employee_id=data['employee_id'],
            full_name=data['full_name'],
            designation=data.get('designation'),
            department=data.get('department'),
            seniority_level=data.get('seniority_level'),
            experience=data.get('experience'),
            location=data.get('location'),
            joining_date=joining_date,
            employment_type=data.get('employment_type'),
            reporting_manager=data.get('reporting_manager'),
            email=data.get('email'),
            phone=data.get('phone')
        )
        
        db.session.add(personal_info)
        db.session.commit()
        
        return success_response(
            personal_info.to_dict(),
            'Personal information created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Personal information creation failed', 500)

@api_bp.route('/personal-info/<int:info_id>', methods=['PUT'])
@role_required(['hr'], 'write')
def update_personal_info(info_id):
    """Update personal information record"""
    try:
        personal_info = PersonalInfo.query.get(info_id)
        if not personal_info:
            return error_response('Personal information not found', 404)
        
        data = request.get_json()
        if not data:
            return error_response('Request body is required', 400)
        
        # Validate email if provided
        if data.get('email') and not validate_email(data['email']):
            return error_response('Invalid email format', 400)
        
        # Handle date conversion
        if data.get('joining_date'):
            try:
                data['joining_date'] = datetime.strptime(data['joining_date'], '%Y-%m-%d').date()
            except ValueError:
                return error_response('Invalid date format for joining_date. Use YYYY-MM-DD', 400)
        
        # Update fields
        for key, value in data.items():
            if hasattr(personal_info, key):
                setattr(personal_info, key, value)
        
        db.session.commit()
        
        return success_response(
            personal_info.to_dict(),
            'Personal information updated successfully'
        )
        
    except Exception as e:
        return error_response('Personal information update failed', 500)

@api_bp.route('/personal-info/<int:info_id>', methods=['DELETE'])
@role_required(['hr'], 'write')
def delete_personal_info(info_id):
    """Delete personal information record"""
    try:
        personal_info = PersonalInfo.query.get(info_id)
        if not personal_info:
            return error_response('Personal information not found', 404)
        
        db.session.delete(personal_info)
        db.session.commit()
        
        return success_response(None, 'Personal information deleted successfully')
        
    except Exception as e:
        return error_response('Personal information deletion failed', 500)
