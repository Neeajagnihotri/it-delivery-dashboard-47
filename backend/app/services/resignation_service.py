from app import db
from app.models.resource_resignation import ResourceResignation
from datetime import datetime

class ResignationService:
    @staticmethod
    def get_all_resignations():
        """Get all resignations"""
        return ResourceResignation.query.order_by(ResourceResignation.date_of_resignation.desc()).all()

    @staticmethod
    def get_resignation_by_id(resignation_id):
        """Get resignation by ID"""
        return ResourceResignation.query.get(resignation_id)

    @staticmethod
    def create_resignation(employee_id, emp_name, date_of_resignation, **kwargs):
        """Create a new resignation record"""
        # Handle date conversion
        if isinstance(date_of_resignation, str):
            try:
                date_of_resignation = datetime.strptime(date_of_resignation, '%Y-%m-%d').date()
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD format.')

        resignation = ResourceResignation(
            employee_id=employee_id,
            emp_name=emp_name,
            date_of_resignation=date_of_resignation,
            **kwargs
        )
        
        db.session.add(resignation)
        db.session.commit()
        
        return resignation

    @staticmethod
    def update_resignation(resignation_id, **kwargs):
        """Update resignation information"""
        resignation = ResourceResignation.query.get(resignation_id)
        if not resignation:
            raise ValueError('Resignation not found')

        # Handle date conversion
        if 'date_of_resignation' in kwargs and isinstance(kwargs['date_of_resignation'], str):
            try:
                kwargs['date_of_resignation'] = datetime.strptime(kwargs['date_of_resignation'], '%Y-%m-%d').date()
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD format.')

        for key, value in kwargs.items():
            if hasattr(resignation, key):
                setattr(resignation, key, value)

        resignation.updated_at = datetime.utcnow()
        db.session.commit()
        return resignation

    @staticmethod
    def delete_resignation(resignation_id):
        """Delete resignation"""
        resignation = ResourceResignation.query.get(resignation_id)
        if not resignation:
            raise ValueError('Resignation not found')

        db.session.delete(resignation)
        db.session.commit()

    @staticmethod
    def get_resignations_by_status(status):
        """Get resignations by status"""
        return ResourceResignation.query.filter_by(status=status).order_by(ResourceResignation.date_of_resignation.desc()).all()

    @staticmethod
    def get_resignations_by_date_range(start_date, end_date):
        """Get resignations within date range"""
        return ResourceResignation.query.filter(
            ResourceResignation.date_of_resignation.between(start_date, end_date)
        ).order_by(ResourceResignation.date_of_resignation.desc()).all()