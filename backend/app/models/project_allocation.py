
from app import db
from datetime import datetime
from sqlalchemy import Enum
import enum

class AllocationStatus(enum.Enum):
    PLANNED = 'planned'
    ACTIVE = 'active'
    PAUSED = 'paused'
    COMPLETED = 'completed'
    RELEASED = 'released'
    CANCELLED = 'cancelled'

class ProjectAllocation(db.Model):
    __tablename__ = 'project_allocations'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'), nullable=False)
    allocation_percentage = db.Column(db.Decimal(5, 2), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    planned_end_date = db.Column(db.Date)
    role_in_project = db.Column(db.String(100))
    responsibilities = db.Column(db.Text)
    status = db.Column(Enum(AllocationStatus), default=AllocationStatus.PLANNED)
    billing_rate = db.Column(db.Decimal(10, 2))
    cost_rate = db.Column(db.Decimal(10, 2))
    daily_hours = db.Column(db.Decimal(4, 2), default=8.00)
    weekly_hours = db.Column(db.Decimal(4, 2), default=40.00)
    overtime_hours = db.Column(db.Decimal(6, 2), default=0.00)
    utilization_efficiency = db.Column(db.Decimal(5, 2))
    skill_match_percentage = db.Column(db.Decimal(5, 2))
    performance_rating = db.Column(db.Decimal(3, 2))
    allocation_notes = db.Column(db.Text)
    created_by = db.Column(db.Integer)
    approved_by = db.Column(db.Integer)
    approval_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = db.relationship('Project', back_populates='allocations')
    resource = db.relationship('Resource', back_populates='allocations')

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'project_id': self.project_id,
            'resource_id': self.resource_id,
            'allocation_percentage': float(self.allocation_percentage) if self.allocation_percentage else None,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'planned_end_date': self.planned_end_date.isoformat() if self.planned_end_date else None,
            'role_in_project': self.role_in_project,
            'responsibilities': self.responsibilities,
            'status': self.status.value if self.status else None,
            'billing_rate': float(self.billing_rate) if self.billing_rate else None,
            'cost_rate': float(self.cost_rate) if self.cost_rate else None,
            'daily_hours': float(self.daily_hours) if self.daily_hours else None,
            'weekly_hours': float(self.weekly_hours) if self.weekly_hours else None,
            'overtime_hours': float(self.overtime_hours) if self.overtime_hours else None,
            'utilization_efficiency': float(self.utilization_efficiency) if self.utilization_efficiency else None,
            'skill_match_percentage': float(self.skill_match_percentage) if self.skill_match_percentage else None,
            'performance_rating': float(self.performance_rating) if self.performance_rating else None,
            'allocation_notes': self.allocation_notes,
            'created_by': self.created_by,
            'approved_by': self.approved_by,
            'approval_date': self.approval_date.isoformat() if self.approval_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<ProjectAllocation Project:{self.project_id} Resource:{self.resource_id}>'
