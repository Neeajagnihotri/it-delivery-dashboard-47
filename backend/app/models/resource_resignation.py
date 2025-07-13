from app import db
from datetime import datetime

class ResourceResignation(db.Model):
    __tablename__ = 'resource_resignations'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), nullable=False, index=True)
    emp_name = db.Column(db.String(200), nullable=False)
    date_of_resignation = db.Column(db.Date, nullable=False)
    skill = db.Column(db.String(500), nullable=True)
    client = db.Column(db.String(200), nullable=True)
    project_name = db.Column(db.String(200), nullable=True)
    replacement_plans_needed = db.Column(db.Text, nullable=True)
    customer_feedback = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='pending')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'emp_name': self.emp_name,
            'date_of_resignation': self.date_of_resignation.isoformat() if self.date_of_resignation else None,
            'skill': self.skill,
            'client': self.client,
            'project_name': self.project_name,
            'replacement_plans_needed': self.replacement_plans_needed,
            'customer_feedback': self.customer_feedback,
            'status': self.status,
            'created_by': self.created_by,
            'updated_by': self.updated_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<ResourceResignation {self.employee_id}: {self.emp_name}>'