
from app import db
from app.models.project import Project, ProjectMilestone
from app.models.project_allocation import ProjectAllocation
from sqlalchemy.orm import joinedload
from datetime import datetime

class ProjectService:
    @staticmethod
    def get_all_projects():
        """Get all projects"""
        return Project.query.all()

    @staticmethod
    def get_project_by_id(project_id):
        """Get project by ID with relationships"""
        return db.session.query(Project).options(
            joinedload(Project.milestones),
            joinedload(Project.allocations)
        ).filter(Project.id == project_id).first()

    @staticmethod
    def create_project(project_code, project_name, **kwargs):
        """Create a new project with all fields"""
        # Check if project code already exists
        if Project.query.filter_by(project_code=project_code).first():
            raise ValueError('Project code already exists')

        # Handle date conversions
        date_fields = [
            'start_date', 'end_date', 'actual_start_date', 'actual_end_date',
            'last_client_feedback_date'
        ]
        
        for field in date_fields:
            if kwargs.get(field) and isinstance(kwargs[field], str):
                try:
                    kwargs[field] = datetime.strptime(kwargs[field], '%Y-%m-%d').date()
                except ValueError:
                    kwargs[field] = None

        project = Project(
            project_code=project_code,
            project_name=project_name,
            **kwargs
        )
        
        db.session.add(project)
        db.session.commit()
        
        return project

    @staticmethod
    def update_project(project_id, **kwargs):
        """Update project information"""
        project = Project.query.get(project_id)
        if not project:
            raise ValueError('Project not found')

        # Handle date conversions
        date_fields = [
            'start_date', 'end_date', 'actual_start_date', 'actual_end_date',
            'last_client_feedback_date'
        ]
        
        for field in date_fields:
            if kwargs.get(field) and isinstance(kwargs[field], str):
                try:
                    kwargs[field] = datetime.strptime(kwargs[field], '%Y-%m-%d').date()
                except ValueError:
                    kwargs[field] = None

        for key, value in kwargs.items():
            if hasattr(project, key):
                setattr(project, key, value)

        db.session.commit()
        return project

    @staticmethod
    def delete_project(project_id):
        """Delete project (soft delete by changing status)"""
        project = Project.query.get(project_id)
        if not project:
            raise ValueError('Project not found')

        project.status = 'cancelled'
        db.session.commit()
        return project

    @staticmethod
    def get_projects_by_status(status):
        """Get projects by status"""
        return Project.query.filter_by(status=status).all()

    @staticmethod
    def get_active_projects():
        """Get all active projects"""
        return ProjectService.get_projects_by_status('active')

    @staticmethod
    def get_project_milestones(project_id=None):
        """Get project milestones, optionally filtered by project_id"""
        query = ProjectMilestone.query
        
        if project_id:
            query = query.filter_by(project_id=project_id)
        
        return query.options(joinedload(ProjectMilestone.project)).all()

    @staticmethod
    def create_milestone(project_id, milestone_name, **kwargs):
        """Create a project milestone"""
        # Verify project exists
        project = Project.query.get(project_id)
        if not project:
            raise ValueError('Project not found')

        # Handle date conversions
        date_fields = ['planned_date', 'baseline_date', 'actual_date']
        
        for field in date_fields:
            if kwargs.get(field) and isinstance(kwargs[field], str):
                try:
                    kwargs[field] = datetime.strptime(kwargs[field], '%Y-%m-%d').date()
                except ValueError:
                    kwargs[field] = None

        milestone = ProjectMilestone(
            project_id=project_id,
            milestone_name=milestone_name,
            **kwargs
        )
        
        db.session.add(milestone)
        db.session.commit()
        
        return milestone

    @staticmethod
    def update_milestone(milestone_id, **kwargs):
        """Update project milestone"""
        milestone = ProjectMilestone.query.get(milestone_id)
        if not milestone:
            raise ValueError('Milestone not found')

        # Handle date conversions
        date_fields = ['planned_date', 'baseline_date', 'actual_date']
        
        for field in date_fields:
            if kwargs.get(field) and isinstance(kwargs[field], str):
                try:
                    kwargs[field] = datetime.strptime(kwargs[field], '%Y-%m-%d').date()
                except ValueError:
                    kwargs[field] = None

        for key, value in kwargs.items():
            if hasattr(milestone, key):
                setattr(milestone, key, value)

        db.session.commit()
        return milestone

    @staticmethod
    def get_project_allocations(project_id=None):
        """Get project allocations, optionally filtered by project_id"""
        query = ProjectAllocation.query
        
        if project_id:
            query = query.filter_by(project_id=project_id)
        
        return query.options(
            joinedload(ProjectAllocation.project),
            joinedload(ProjectAllocation.resource)
        ).all()

    @staticmethod
    def create_allocation(project_id, resource_id, allocation_percentage, start_date, **kwargs):
        """Create a project allocation"""
        # Verify project and resource exist
        project = Project.query.get(project_id)
        if not project:
            raise ValueError('Project not found')

        from app.models.resource import Resource
        resource = Resource.query.get(resource_id)
        if not resource:
            raise ValueError('Resource not found')

        # Handle date conversions
        date_fields = ['start_date', 'end_date', 'planned_end_date', 'approval_date']
        
        for field in date_fields:
            if kwargs.get(field) and isinstance(kwargs[field], str):
                try:
                    kwargs[field] = datetime.strptime(kwargs[field], '%Y-%m-%d').date()
                except ValueError:
                    kwargs[field] = None

        # Handle start_date specifically
        if isinstance(start_date, str):
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            except ValueError:
                raise ValueError('Invalid start_date format. Use YYYY-MM-DD')

        allocation = ProjectAllocation(
            project_id=project_id,
            resource_id=resource_id,
            allocation_percentage=allocation_percentage,
            start_date=start_date,
            **kwargs
        )
        
        db.session.add(allocation)
        db.session.commit()
        
        return allocation

    @staticmethod
    def update_allocation(allocation_id, **kwargs):
        """Update project allocation"""
        allocation = ProjectAllocation.query.get(allocation_id)
        if not allocation:
            raise ValueError('Allocation not found')

        # Handle date conversions
        date_fields = ['start_date', 'end_date', 'planned_end_date', 'approval_date']
        
        for field in date_fields:
            if kwargs.get(field) and isinstance(kwargs[field], str):
                try:
                    kwargs[field] = datetime.strptime(kwargs[field], '%Y-%m-%d').date()
                except ValueError:
                    kwargs[field] = None

        for key, value in kwargs.items():
            if hasattr(allocation, key):
                setattr(allocation, key, value)

        db.session.commit()
        return allocation
