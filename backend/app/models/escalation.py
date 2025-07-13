
from app import db
from datetime import datetime
from sqlalchemy import Enum, Text, JSON
import enum

class EscalationType(enum.Enum):
    TECHNICAL = 'technical'
    COMMERCIAL = 'commercial'
    RESOURCE = 'resource'
    TIMELINE = 'timeline'
    QUALITY = 'quality'
    SCOPE = 'scope'

class EscalationCategory(enum.Enum):
    BUG = 'bug'
    FEATURE_REQUEST = 'feature_request'
    PERFORMANCE = 'performance'
    SECURITY = 'security'
    COMPLIANCE = 'compliance'
    PROCESS = 'process'

class EscalationPriority(enum.Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    CRITICAL = 'critical'

class EscalationSeverity(enum.Enum):
    MINOR = 'minor'
    MAJOR = 'major'
    CRITICAL = 'critical'
    BLOCKER = 'blocker'

class EscalationStatus(enum.Enum):
    OPEN = 'open'
    ACKNOWLEDGED = 'acknowledged'
    IN_PROGRESS = 'in_progress'
    PENDING_CLIENT = 'pending_client'
    RESOLVED = 'resolved'
    CLOSED = 'closed'
    CANCELLED = 'cancelled'

class ResolutionStatus(enum.Enum):
    PENDING = 'pending'
    FIXED = 'fixed'
    WORKAROUND = 'workaround'
    WONT_FIX = 'wont_fix'
    DUPLICATE = 'duplicate'

class Escalation(db.Model):
    __tablename__ = 'escalations'
    
    # Primary identifiers
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(Text)
    
    # Project and Stakeholder Information
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    customer = db.Column(db.String(200))
    client_contact_email = db.Column(db.String(255))
    project_owner = db.Column(db.String(100))
    escalation_owner = db.Column(db.String(100))
    escalated_to = db.Column(db.String(100))
    raised_by = db.Column(db.String(100))
    assigned_to = db.Column(db.String(100))
    
    # Classification
    escalation_type = db.Column(Enum(EscalationType))
    category = db.Column(Enum(EscalationCategory))
    priority = db.Column(Enum(EscalationPriority), nullable=False, default=EscalationPriority.MEDIUM)
    severity = db.Column(Enum(EscalationSeverity))
    
    # Status Tracking
    status = db.Column(Enum(EscalationStatus), nullable=False, default=EscalationStatus.OPEN)
    resolution_status = db.Column(Enum(ResolutionStatus), default=ResolutionStatus.PENDING)
    
    # Timeline
    raised_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    date_acknowledged = db.Column(db.DateTime)
    target_resolution_date = db.Column(db.DateTime)
    actual_resolution_date = db.Column(db.DateTime)
    resolved_date = db.Column(db.DateTime)
    date_closed = db.Column(db.DateTime)
    response_time_hours = db.Column(db.Numeric(8, 2))
    resolution_time_hours = db.Column(db.Numeric(8, 2))
    
    # Impact and Business
    business_impact = db.Column(Text)
    financial_impact = db.Column(db.Numeric(12, 2))
    affected_users = db.Column(db.Integer)
    downtime_hours = db.Column(db.Numeric(6, 2))
    
    # Resolution Details
    root_cause = db.Column(Text)
    resolution_summary = db.Column(Text)
    actions_taken = db.Column(Text)
    preventive_measures = db.Column(Text)
    
    # Communication
    client_communication = db.Column(Text)
    internal_notes = db.Column(Text)
    communication_log = db.Column(JSON)  # Array of communication entries
    
    # Approval and Sign-off
    client_signoff_required = db.Column(db.Boolean, default=False)
    client_signoff_date = db.Column(db.DateTime)
    client_satisfaction_rating = db.Column(db.Numeric(3, 1))  # 0.0 to 10.0
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = db.relationship('Project', back_populates='escalations')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'project_id': self.project_id,
            'customer': self.customer,
            'client_contact_email': self.client_contact_email,
            'project_owner': self.project_owner,
            'escalation_owner': self.escalation_owner,
            'escalated_to': self.escalated_to,
            'raised_by': self.raised_by,
            'assigned_to': self.assigned_to,
            'escalation_type': self.escalation_type.value if self.escalation_type else None,
            'category': self.category.value if self.category else None,
            'priority': self.priority.value if self.priority else None,
            'severity': self.severity.value if self.severity else None,
            'status': self.status.value if self.status else None,
            'resolution_status': self.resolution_status.value if self.resolution_status else None,
            'raised_date': self.raised_date.isoformat() if self.raised_date else None,
            'date_acknowledged': self.date_acknowledged.isoformat() if self.date_acknowledged else None,
            'target_resolution_date': self.target_resolution_date.isoformat() if self.target_resolution_date else None,
            'actual_resolution_date': self.actual_resolution_date.isoformat() if self.actual_resolution_date else None,
            'resolved_date': self.resolved_date.isoformat() if self.resolved_date else None,
            'date_closed': self.date_closed.isoformat() if self.date_closed else None,
            'response_time_hours': float(self.response_time_hours) if self.response_time_hours else None,
            'resolution_time_hours': float(self.resolution_time_hours) if self.resolution_time_hours else None,
            'business_impact': self.business_impact,
            'financial_impact': float(self.financial_impact) if self.financial_impact else None,
            'affected_users': self.affected_users,
            'downtime_hours': float(self.downtime_hours) if self.downtime_hours else None,
            'root_cause': self.root_cause,
            'resolution_summary': self.resolution_summary,
            'actions_taken': self.actions_taken,
            'preventive_measures': self.preventive_measures,
            'client_communication': self.client_communication,
            'internal_notes': self.internal_notes,
            'communication_log': self.communication_log,
            'client_signoff_required': self.client_signoff_required,
            'client_signoff_date': self.client_signoff_date.isoformat() if self.client_signoff_date else None,
            'client_satisfaction_rating': float(self.client_satisfaction_rating) if self.client_satisfaction_rating else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<Escalation {self.title}>'
