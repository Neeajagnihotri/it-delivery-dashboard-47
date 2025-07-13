
from app import db
from app.models.resource import Resource
from app.models.personal_info import PersonalInfo
from sqlalchemy.orm import joinedload
from datetime import datetime

class ResourceService:
    @staticmethod
    def get_all_resources():
        """Get all resources with personal info"""
        return db.session.query(Resource).options(
            joinedload(Resource.personal_info)
        ).all()

    @staticmethod
    def get_resource_by_id(resource_id):
        """Get resource by ID with personal info"""
        return db.session.query(Resource).options(
            joinedload(Resource.personal_info)
        ).filter(Resource.id == resource_id).first()

    @staticmethod
    def get_resource_by_employee_id(employee_id):
        """Get resource by employee ID with personal info"""
        return db.session.query(Resource).options(
            joinedload(Resource.personal_info)
        ).filter(Resource.employee_id == employee_id).first()

    @staticmethod
    def create_resource(employee_id, **kwargs):
        """Create a new resource with all fields"""
        # Check if personal info exists
        personal_info = PersonalInfo.query.filter_by(employee_id=employee_id).first()
        if not personal_info:
            raise ValueError('Personal info must exist before creating resource')

        # Check if resource already exists
        if Resource.query.filter_by(employee_id=employee_id).first():
            raise ValueError('Resource already exists for this employee')

        # Handle date conversions
        date_fields = [
            'last_performance_review_date', 'next_performance_review_date',
            'bench_start_date', 'available_from_date', 'engagement_start_date',
            'engagement_end_date', 'rate_effective_date', 'promotion_eligible_date',
            'internship_start_date', 'internship_end_date'
        ]
        
        for field in date_fields:
            if kwargs.get(field) and isinstance(kwargs[field], str):
                try:
                    kwargs[field] = datetime.strptime(kwargs[field], '%Y-%m-%d').date()
                except ValueError:
                    kwargs[field] = None

        resource = Resource(employee_id=employee_id, **kwargs)
        db.session.add(resource)
        db.session.commit()
        
        return resource

    @staticmethod
    def update_resource(resource_id, **kwargs):
        """Update resource information"""
        resource = Resource.query.get(resource_id)
        if not resource:
            raise ValueError('Resource not found')

        # Handle date conversions
        date_fields = [
            'last_performance_review_date', 'next_performance_review_date',
            'bench_start_date', 'available_from_date', 'engagement_start_date',
            'engagement_end_date', 'rate_effective_date', 'promotion_eligible_date',
            'internship_start_date', 'internship_end_date'
        ]
        
        for field in date_fields:
            if kwargs.get(field) and isinstance(kwargs[field], str):
                try:
                    kwargs[field] = datetime.strptime(kwargs[field], '%Y-%m-%d').date()
                except ValueError:
                    kwargs[field] = None

        for key, value in kwargs.items():
            if hasattr(resource, key):
                setattr(resource, key, value)

        db.session.commit()
        return resource

    @staticmethod
    def delete_resource(resource_id):
        """Delete resource"""
        resource = Resource.query.get(resource_id)
        if not resource:
            raise ValueError('Resource not found')

        db.session.delete(resource)
        db.session.commit()

    @staticmethod
    def get_resources_by_status(status):
        """Get resources by status"""
        return Resource.query.filter_by(status=status).options(
            joinedload(Resource.personal_info)
        ).all()

    @staticmethod
    def get_bench_resources():
        """Get all bench resources"""
        return Resource.query.filter_by(current_bench_status='Yes').options(
            joinedload(Resource.personal_info)
        ).all()

    @staticmethod
    def get_billable_resources():
        """Get all billable resources"""
        return Resource.query.filter_by(resource_type='billable').options(
            joinedload(Resource.personal_info)
        ).all()

    @staticmethod
    def get_intern_resources():
        """Get all intern resources"""
        return Resource.query.filter_by(is_intern=True).options(
            joinedload(Resource.personal_info)
        ).all()

    @staticmethod
    def update_utilization(resource_id, utilization_data):
        """Update resource utilization metrics"""
        resource = Resource.query.get(resource_id)
        if not resource:
            raise ValueError('Resource not found')

        utilization_fields = [
            'current_utilization', 'average_utilization_3m', 'average_utilization_6m',
            'billable_hours_target', 'utilization_target'
        ]

        for field in utilization_fields:
            if field in utilization_data:
                setattr(resource, field, utilization_data[field])

        db.session.commit()
        return resource
