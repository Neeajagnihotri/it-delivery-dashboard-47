
from app import db
from datetime import datetime
from sqlalchemy import Enum, Text, JSON
import enum

class ProjectStatus(enum.Enum):
    PLANNING = 'planning'
    ACTIVE = 'active'
    ON_HOLD = 'on_hold'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'
    DELAYED = 'delayed'
    AT_RISK = 'at_risk'

class ProjectType(enum.Enum):
    DEVELOPMENT = 'development'
    MAINTENANCE = 'maintenance'
    CONSULTING = 'consulting'
    SUPPORT = 'support'
    TRAINING = 'training'
    RESEARCH = 'research'
    FIXED_PRICE = 'fixed_price'
    TIME_MATERIAL = 'time_material'
    RETAINER = 'retainer'
    INTERNAL = 'internal'

class HealthStatus(enum.Enum):
    GREEN = 'green'
    YELLOW = 'yellow'
    AMBER = 'amber'
    RED = 'red'
    UNKNOWN = 'unknown'

class RiskLevel(enum.Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    CRITICAL = 'critical'

class ProjectPriority(enum.Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    CRITICAL = 'critical'

class Methodology(enum.Enum):
    AGILE = 'agile'
    WATERFALL = 'waterfall'
    HYBRID = 'hybrid'
    KANBAN = 'kanban'
    SCRUM = 'scrum'

class BillingType(enum.Enum):
    FIXED_PRICE = 'fixed_price'
    TIME_MATERIAL = 'time_material'
    RETAINER = 'retainer'
    OUTCOME_BASED = 'outcome_based'

class Project(db.Model):
    __tablename__ = 'projects'
    
    # Primary identifiers
    id = db.Column(db.Integer, primary_key=True)
    project_code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    project_name = db.Column(db.String(255), nullable=False)
    
    # Client Information
    client_name = db.Column(db.String(255), nullable=False)
    client_contact_email = db.Column(db.String(255))
    client_contact_phone = db.Column(db.String(20))
    
    # Team Information
    project_manager = db.Column(db.String(255))
    project_manager_id = db.Column(db.Integer)
    technical_lead = db.Column(db.String(255))
    technical_lead_id = db.Column(db.Integer)
    delivery_owner = db.Column(db.String(255))
    delivery_owner_id = db.Column(db.Integer)
    
    # Project Classification
    status = db.Column(Enum(ProjectStatus), nullable=False, default=ProjectStatus.PLANNING)
    project_type = db.Column(Enum(ProjectType), nullable=False, default=ProjectType.DEVELOPMENT)
    health_status = db.Column(Enum(HealthStatus), nullable=False, default=HealthStatus.GREEN)
    risk_level = db.Column(Enum(RiskLevel), default=RiskLevel.LOW)
    project_priority = db.Column(Enum(ProjectPriority), default=ProjectPriority.MEDIUM)
    methodology = db.Column(Enum(Methodology), default=Methodology.AGILE)
    billing_type = db.Column(Enum(BillingType), default=BillingType.TIME_MATERIAL)
    
    # Timeline
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    planned_end_date = db.Column(db.Date)
    actual_start_date = db.Column(db.Date)
    actual_end_date = db.Column(db.Date)
    estimated_hours = db.Column(db.Integer)
    actual_hours = db.Column(db.Integer, default=0)
    
    # Financial Information
    sow_value = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    budget_allocated = db.Column(db.Numeric(15, 2))
    actual_cost = db.Column(db.Numeric(15, 2), default=0)
    revenue = db.Column(db.Numeric(15, 2), default=0)
    profit_margin = db.Column(db.Numeric(15, 2), default=0)
    monthly_burn_rate = db.Column(db.Numeric(10, 2), default=0)
    currency = db.Column(db.String(10), default='USD')
    
    # Performance Metrics
    on_time_percentage = db.Column(db.Numeric(5, 2), default=100.0)
    utilization_rate = db.Column(db.Numeric(5, 2), default=0.0)
    completion_percentage = db.Column(db.Numeric(5, 2), default=0.0)
    scope_change_requests = db.Column(db.Integer, default=0)
    change_request_value = db.Column(db.Numeric(15, 2), default=0.0)
    
    # Quality Metrics
    defect_count = db.Column(db.Integer, default=0)
    critical_defects = db.Column(db.Integer, default=0)
    code_coverage_percentage = db.Column(db.Numeric(5, 2))
    
    # Client Satisfaction
    client_satisfaction_score = db.Column(db.Numeric(3, 1))  # 0.0 to 10.0
    last_client_feedback_date = db.Column(db.Date)
    
    # Resource allocation counts
    billable_resources_count = db.Column(db.Integer, default=0)
    non_billable_resources_count = db.Column(db.Integer, default=0)
    shadow_resources_count = db.Column(db.Integer, default=0)
    
    # Project Details
    description = db.Column(Text)
    objectives = db.Column(Text)
    deliverables = db.Column(Text)
    success_criteria = db.Column(Text)
    constraints = db.Column(Text)
    assumptions = db.Column(Text)
    technology_stack = db.Column(JSON)  # Array of technologies
    current_milestone = db.Column(db.String(255))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    milestones = db.relationship('ProjectMilestone', back_populates='project', cascade='all, delete-orphan')
    allocations = db.relationship('ProjectAllocation', back_populates='project', cascade='all, delete-orphan')
    financials = db.relationship('Financials', back_populates='project', cascade='all, delete-orphan')
    escalations = db.relationship('Escalation', back_populates='project', cascade='all, delete-orphan')
    risks = db.relationship('ProjectRisk', back_populates='project', cascade='all, delete-orphan')
    deliverables_list = db.relationship('ProjectDeliverable', back_populates='project', cascade='all, delete-orphan')
    client_feedback = db.relationship('ClientFeedback', back_populates='project', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_code': self.project_code,
            'project_name': self.project_name,
            'client_name': self.client_name,
            'client_contact_email': self.client_contact_email,
            'client_contact_phone': self.client_contact_phone,
            'project_manager': self.project_manager,
            'project_manager_id': self.project_manager_id,
            'technical_lead': self.technical_lead,
            'technical_lead_id': self.technical_lead_id,
            'delivery_owner': self.delivery_owner,
            'delivery_owner_id': self.delivery_owner_id,
            'status': self.status.value if self.status else None,
            'project_type': self.project_type.value if self.project_type else None,
            'health_status': self.health_status.value if self.health_status else None,
            'risk_level': self.risk_level.value if self.risk_level else None,
            'project_priority': self.project_priority.value if self.project_priority else None,
            'methodology': self.methodology.value if self.methodology else None,
            'billing_type': self.billing_type.value if self.billing_type else None,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'planned_end_date': self.planned_end_date.isoformat() if self.planned_end_date else None,
            'actual_start_date': self.actual_start_date.isoformat() if self.actual_start_date else None,
            'actual_end_date': self.actual_end_date.isoformat() if self.actual_end_date else None,
            'estimated_hours': self.estimated_hours,
            'actual_hours': self.actual_hours,
            'sow_value': float(self.sow_value) if self.sow_value else 0,
            'budget_allocated': float(self.budget_allocated) if self.budget_allocated else None,
            'actual_cost': float(self.actual_cost) if self.actual_cost else 0,
            'revenue': float(self.revenue) if self.revenue else 0,
            'profit_margin': float(self.profit_margin) if self.profit_margin else 0,
            'monthly_burn_rate': float(self.monthly_burn_rate) if self.monthly_burn_rate else 0,
            'currency': self.currency,
            'on_time_percentage': float(self.on_time_percentage) if self.on_time_percentage else 100.0,
            'utilization_rate': float(self.utilization_rate) if self.utilization_rate else 0.0,
            'completion_percentage': float(self.completion_percentage) if self.completion_percentage else 0.0,
            'scope_change_requests': self.scope_change_requests,
            'change_request_value': float(self.change_request_value) if self.change_request_value else 0.0,
            'defect_count': self.defect_count,
            'critical_defects': self.critical_defects,
            'code_coverage_percentage': float(self.code_coverage_percentage) if self.code_coverage_percentage else None,
            'client_satisfaction_score': float(self.client_satisfaction_score) if self.client_satisfaction_score else None,
            'last_client_feedback_date': self.last_client_feedback_date.isoformat() if self.last_client_feedback_date else None,
            'billable_resources_count': self.billable_resources_count,
            'non_billable_resources_count': self.non_billable_resources_count,
            'shadow_resources_count': self.shadow_resources_count,
            'description': self.description,
            'objectives': self.objectives,
            'deliverables': self.deliverables,
            'success_criteria': self.success_criteria,
            'constraints': self.constraints,
            'assumptions': self.assumptions,
            'technology_stack': self.technology_stack,
            'current_milestone': self.current_milestone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<Project {self.project_code}: {self.project_name}>'


class ProjectMilestone(db.Model):
    __tablename__ = 'project_milestones'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    milestone_name = db.Column(db.String(200), nullable=False)
    description = db.Column(Text)
    milestone_type = db.Column(db.String(50))  # planning, development, testing, deployment, review, delivery
    planned_date = db.Column(db.Date)
    baseline_date = db.Column(db.Date)
    actual_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='not_started')  # not_started, planned, in_progress, completed, delayed, at_risk, cancelled
    completion_percentage = db.Column(db.Numeric(5, 2), default=0.0)
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, critical
    dependencies = db.Column(JSON)  # Array of milestone dependencies
    deliverables = db.Column(Text)
    acceptance_criteria = db.Column(Text)
    owner_id = db.Column(db.Integer)
    estimated_effort_hours = db.Column(db.Integer)
    actual_effort_hours = db.Column(db.Integer)
    budget_allocated = db.Column(db.Numeric(12, 2))
    budget_consumed = db.Column(db.Numeric(12, 2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = db.relationship('Project', back_populates='milestones')
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'milestone_name': self.milestone_name,
            'description': self.description,
            'milestone_type': self.milestone_type,
            'planned_date': self.planned_date.isoformat() if self.planned_date else None,
            'baseline_date': self.baseline_date.isoformat() if self.baseline_date else None,
            'actual_date': self.actual_date.isoformat() if self.actual_date else None,
            'status': self.status,
            'completion_percentage': float(self.completion_percentage) if self.completion_percentage else 0.0,
            'priority': self.priority,
            'dependencies': self.dependencies,
            'deliverables': self.deliverables,
            'acceptance_criteria': self.acceptance_criteria,
            'owner_id': self.owner_id,
            'estimated_effort_hours': self.estimated_effort_hours,
            'actual_effort_hours': self.actual_effort_hours,
            'budget_allocated': float(self.budget_allocated) if self.budget_allocated else None,
            'budget_consumed': float(self.budget_consumed) if self.budget_consumed else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class ProjectRisk(db.Model):
    __tablename__ = 'project_risks'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    risk_title = db.Column(db.String(200), nullable=False)
    risk_description = db.Column(Text)
    risk_category = db.Column(db.String(50))  # technical, business, resource, external, financial, timeline
    probability = db.Column(db.String(20))  # very_low, low, medium, high, very_high
    impact = db.Column(db.String(20))  # negligible, minor, moderate, major, severe
    risk_score = db.Column(db.Numeric(4, 2))
    status = db.Column(db.String(50), default='identified')
    owner_id = db.Column(db.Integer)
    identified_date = db.Column(db.Date, default=datetime.utcnow)
    mitigation_plan = db.Column(Text)
    contingency_plan = db.Column(Text)
    review_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = db.relationship('Project', back_populates='risks')
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'risk_title': self.risk_title,
            'risk_description': self.risk_description,
            'risk_category': self.risk_category,
            'probability': self.probability,
            'impact': self.impact,
            'risk_score': float(self.risk_score) if self.risk_score else None,
            'status': self.status,
            'owner_id': self.owner_id,
            'identified_date': self.identified_date.isoformat() if self.identified_date else None,
            'mitigation_plan': self.mitigation_plan,
            'contingency_plan': self.contingency_plan,
            'review_date': self.review_date.isoformat() if self.review_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class ProjectDeliverable(db.Model):
    __tablename__ = 'project_deliverables'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    deliverable_name = db.Column(db.String(200), nullable=False)
    description = db.Column(Text)
    deliverable_type = db.Column(db.String(50))  # document, software, report, training, hardware, service
    planned_delivery_date = db.Column(db.Date)
    actual_delivery_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='not_started')
    quality_score = db.Column(db.Numeric(3, 1))
    responsible_resource_id = db.Column(db.Integer)
    reviewer_id = db.Column(db.Integer)
    client_acceptance_date = db.Column(db.Date)
    revision_count = db.Column(db.Integer, default=0)
    file_path = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = db.relationship('Project', back_populates='deliverables_list')
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'deliverable_name': self.deliverable_name,
            'description': self.description,
            'deliverable_type': self.deliverable_type,
            'planned_delivery_date': self.planned_delivery_date.isoformat() if self.planned_delivery_date else None,
            'actual_delivery_date': self.actual_delivery_date.isoformat() if self.actual_delivery_date else None,
            'status': self.status,
            'quality_score': float(self.quality_score) if self.quality_score else None,
            'responsible_resource_id': self.responsible_resource_id,
            'reviewer_id': self.reviewer_id,
            'client_acceptance_date': self.client_acceptance_date.isoformat() if self.client_acceptance_date else None,
            'revision_count': self.revision_count,
            'file_path': self.file_path,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class ClientFeedback(db.Model):
    __tablename__ = 'client_feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    feedback_date = db.Column(db.Date, default=datetime.utcnow)
    feedback_type = db.Column(db.String(50))  # formal_review, informal, escalation, appreciation, complaint
    overall_satisfaction = db.Column(db.Numeric(3, 1))  # 0.0 to 10.0
    communication_rating = db.Column(db.Numeric(3, 1))
    quality_rating = db.Column(db.Numeric(3, 1))
    timeline_rating = db.Column(db.Numeric(3, 1))
    value_rating = db.Column(db.Numeric(3, 1))
    feedback_summary = db.Column(Text)
    improvement_suggestions = db.Column(Text)
    action_items = db.Column(Text)
    follow_up_required = db.Column(db.Boolean, default=False)
    follow_up_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = db.relationship('Project', back_populates='client_feedback')
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'feedback_date': self.feedback_date.isoformat() if self.feedback_date else None,
            'feedback_type': self.feedback_type,
            'overall_satisfaction': float(self.overall_satisfaction) if self.overall_satisfaction else None,
            'communication_rating': float(self.communication_rating) if self.communication_rating else None,
            'quality_rating': float(self.quality_rating) if self.quality_rating else None,
            'timeline_rating': float(self.timeline_rating) if self.timeline_rating else None,
            'value_rating': float(self.value_rating) if self.value_rating else None,
            'feedback_summary': self.feedback_summary,
            'improvement_suggestions': self.improvement_suggestions,
            'action_items': self.action_items,
            'follow_up_required': self.follow_up_required,
            'follow_up_date': self.follow_up_date.isoformat() if self.follow_up_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
