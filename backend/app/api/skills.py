from flask import request
from app.api import api_bp
from app.services.skills_service import SkillsService
from app.utils.response import success_response, error_response
from app.utils.validators import validate_required_fields
from app.utils.auth import role_required

@api_bp.route('/skills', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_skills():
    """Get all skills"""
    try:
        skills = SkillsService.get_all_skills()
        skills_data = [skill.to_dict() for skill in skills]
        
        return success_response(skills_data, 'Skills retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve skills', 500)

@api_bp.route('/skills/grouped', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_skills_grouped():
    """Get skills grouped by category and group"""
    try:
        grouped_skills = SkillsService.get_skills_grouped()
        
        return success_response(grouped_skills, 'Grouped skills retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve grouped skills', 500)

@api_bp.route('/skills', methods=['POST'])
@role_required(['resource_manager'], 'write')
def create_skill():
    """Create new skill"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['skill_name', 'skill_category', 'skill_group'])
        
        skill = SkillsService.create_skill(**data)
        
        return success_response(
            skill.to_dict(),
            'Skill created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Skill creation failed', 500)

@api_bp.route('/resource-skills/<string:employee_id>', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read')
def get_resource_skills(employee_id):
    """Get skills for a specific resource"""
    try:
        resource_skills = SkillsService.get_resource_skills(employee_id)
        skills_data = [skill.to_dict() for skill in resource_skills]
        
        return success_response(skills_data, 'Resource skills retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve resource skills', 500)

@api_bp.route('/resource-skills', methods=['POST'])
@role_required(['resource_manager'], 'write')
def add_resource_skill():
    """Add skill to resource"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['employee_id', 'skill_id', 'skill_type'])
        
        resource_skill = SkillsService.add_resource_skill(**data)
        
        return success_response(
            resource_skill.to_dict(),
            'Skill added to resource successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Failed to add skill to resource', 500)

@api_bp.route('/resource-skills/<int:resource_skill_id>', methods=['PUT'])
@role_required(['resource_manager'], 'write')
def update_resource_skill(resource_skill_id):
    """Update resource skill"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        resource_skill = SkillsService.update_resource_skill(resource_skill_id, **data)
        
        return success_response(
            resource_skill.to_dict(),
            'Resource skill updated successfully'
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Resource skill update failed', 500)

@api_bp.route('/resource-skills/<int:resource_skill_id>', methods=['DELETE'])
@role_required(['resource_manager'], 'write')
def delete_resource_skill(resource_skill_id):
    """Delete resource skill"""
    try:
        SkillsService.delete_resource_skill(resource_skill_id)
        
        return success_response(None, 'Resource skill deleted successfully')
        
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response('Resource skill deletion failed', 500)

@api_bp.route('/resources/by-skills', methods=['POST'])
@role_required(['leadership', 'resource_manager'], 'read')
def find_resources_by_skills():
    """Find resources by skill criteria"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        skill_criteria = data.get('skills', [])
        resources = SkillsService.find_resources_by_skills(skill_criteria)
        
        return success_response(resources, 'Resources matching skills retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to find resources by skills', 500)