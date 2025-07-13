from app import db
from app.models.skills_master import SkillsMaster
from app.models.resource_skills import ResourceSkills
from app.models.resource import Resource
from app.models.personal_info import PersonalInfo
from sqlalchemy.orm import joinedload
from collections import defaultdict

class SkillsService:
    @staticmethod
    def get_all_skills():
        """Get all active skills"""
        return SkillsMaster.query.filter_by(is_active=True).order_by(SkillsMaster.skill_category, SkillsMaster.skill_name).all()

    @staticmethod
    def get_skills_grouped():
        """Get skills grouped by category and group"""
        skills = SkillsService.get_all_skills()
        grouped = defaultdict(lambda: defaultdict(list))
        
        for skill in skills:
            grouped[skill.skill_category][skill.skill_group].append(skill.to_dict())
        
        # Convert to regular dict for JSON serialization
        result = {}
        for category, groups in grouped.items():
            result[category] = dict(groups)
        
        return result

    @staticmethod
    def create_skill(skill_name, skill_category, skill_group, **kwargs):
        """Create a new skill"""
        # Check if skill already exists
        existing_skill = SkillsMaster.query.filter_by(skill_name=skill_name).first()
        if existing_skill:
            raise ValueError('Skill already exists')

        skill = SkillsMaster(
            skill_name=skill_name,
            skill_category=skill_category,
            skill_group=skill_group,
            **kwargs
        )
        
        db.session.add(skill)
        db.session.commit()
        
        return skill

    @staticmethod
    def get_resource_skills(employee_id):
        """Get all skills for a specific resource"""
        return db.session.query(ResourceSkills).options(
            joinedload(ResourceSkills.skill)
        ).filter(ResourceSkills.employee_id == employee_id).all()

    @staticmethod
    def add_resource_skill(employee_id, skill_id, skill_type, **kwargs):
        """Add skill to resource"""
        # Check if skill assignment already exists
        existing = ResourceSkills.query.filter_by(
            employee_id=employee_id,
            skill_id=skill_id,
            skill_type=skill_type
        ).first()
        
        if existing:
            raise ValueError('Skill already assigned to resource with this type')

        # Verify skill exists
        skill = SkillsMaster.query.get(skill_id)
        if not skill:
            raise ValueError('Skill not found')

        resource_skill = ResourceSkills(
            employee_id=employee_id,
            skill_id=skill_id,
            skill_type=skill_type,
            **kwargs
        )
        
        db.session.add(resource_skill)
        db.session.commit()
        
        return resource_skill

    @staticmethod
    def update_resource_skill(resource_skill_id, **kwargs):
        """Update resource skill"""
        resource_skill = ResourceSkills.query.get(resource_skill_id)
        if not resource_skill:
            raise ValueError('Resource skill not found')

        for key, value in kwargs.items():
            if hasattr(resource_skill, key):
                setattr(resource_skill, key, value)

        db.session.commit()
        return resource_skill

    @staticmethod
    def delete_resource_skill(resource_skill_id):
        """Delete resource skill"""
        resource_skill = ResourceSkills.query.get(resource_skill_id)
        if not resource_skill:
            raise ValueError('Resource skill not found')

        db.session.delete(resource_skill)
        db.session.commit()

    @staticmethod
    def find_resources_by_skills(skill_criteria):
        """Find resources matching skill criteria"""
        # skill_criteria should be a list of dicts with skill_id and optional min_experience
        if not skill_criteria:
            return []

        skill_ids = [criteria.get('skill_id') for criteria in skill_criteria if criteria.get('skill_id')]
        
        if not skill_ids:
            return []

        # Get resources that have any of these skills
        resource_skills = db.session.query(ResourceSkills).options(
            joinedload(ResourceSkills.skill)
        ).filter(ResourceSkills.skill_id.in_(skill_ids)).all()

        # Group by employee_id
        employee_skills = defaultdict(list)
        for rs in resource_skills:
            employee_skills[rs.employee_id].append(rs)

        # Get resource details
        employee_ids = list(employee_skills.keys())
        resources = db.session.query(Resource).options(
            joinedload(Resource.personal_info)
        ).filter(Resource.employee_id.in_(employee_ids)).all()

        # Build result
        result = []
        for resource in resources:
            resource_dict = resource.to_dict()
            if resource.personal_info:
                resource_dict.update({
                    'full_name': resource.personal_info.full_name,
                    'designation': resource.personal_info.designation,
                    'department': resource.personal_info.department
                })
            
            # Add matching skills
            matching_skills = []
            for skill in employee_skills[resource.employee_id]:
                matching_skills.append({
                    'skill_name': skill.skill.skill_name,
                    'skill_category': skill.skill.skill_category,
                    'skill_type': skill.skill_type,
                    'experience_years': skill.experience_years,
                    'experience_months': skill.experience_months,
                    'proficiency_level': skill.proficiency_level
                })
            
            resource_dict['matching_skills'] = matching_skills
            result.append(resource_dict)

        return result

    @staticmethod
    def get_skills_by_category(category):
        """Get skills by category"""
        return SkillsMaster.query.filter_by(
            skill_category=category, 
            is_active=True
        ).order_by(SkillsMaster.skill_name).all()

    @staticmethod
    def get_skills_by_group(skill_group):
        """Get skills by group"""
        return SkillsMaster.query.filter_by(
            skill_group=skill_group, 
            is_active=True
        ).order_by(SkillsMaster.skill_name).all()