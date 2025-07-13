
from app import db
from datetime import datetime
from sqlalchemy import Enum, Text, JSON
import enum

class ResourceStatus(enum.Enum):
    ALLOCATED = 'allocated'
    BENCH = 'bench'
    TRAINING = 'training'
    SHADOW = 'shadow'
    INTERNAL = 'internal'
    PIP = 'pip'
    INACTIVE = 'inactive'

class ResourceType(enum.Enum):
    BILLABLE = 'billable'
    NON_BILLABLE = 'non_billable'
    INTERN = 'intern'
    CONTRACTOR = 'contractor'

class ExperienceLevel(enum.Enum):
    FRESHER = 'fresher'
    JUNIOR = 'junior'
    SENIOR = 'senior'
    LEAD = 'lead'
    ARCHITECT = 'architect'

class WorkLocation(enum.Enum):
    OFFICE = 'office'
    REMOTE = 'remote' 
    HYBRID = 'hybrid'

class EmploymentType(enum.Enum):
    FULL_TIME = 'full_time'
    PART_TIME = 'part_time'
    CONTRACT = 'contract'
    INTERN = 'intern'
    CONSULTANT = 'consultant'

class EmploymentStatus(enum.Enum):
    ACTIVE = 'active'
    INACTIVE = 'inactive'
    TERMINATED = 'terminated'
    RESIGNED = 'resigned'
    ON_LEAVE = 'on_leave'

class Resource(db.Model):
    __tablename__ = 'resources'
    
    # Primary identifiers
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # Personal Information
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    personal_email = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    emergency_contact_name = db.Column(db.String(100))
    emergency_contact_phone = db.Column(db.String(20))
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(20))
    marital_status = db.Column(db.String(20))
    nationality = db.Column(db.String(50))
    address = db.Column(Text)
    
    # Professional Information
    designation = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    work_location = db.Column(Enum(WorkLocation), default=WorkLocation.OFFICE)
    
    # Employment Details
    employment_type = db.Column(Enum(EmploymentType), default=EmploymentType.FULL_TIME)
    employment_status = db.Column(Enum(EmploymentStatus), default=EmploymentStatus.ACTIVE)
    joining_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    probation_end_date = db.Column(db.Date)
    reporting_manager = db.Column(db.String(100))
    reporting_manager_id = db.Column(db.String(50))
    
    # Resource Classification
    status = db.Column(Enum(ResourceStatus), nullable=False, default=ResourceStatus.BENCH)
    resource_type = db.Column(Enum(ResourceType), nullable=False, default=ResourceType.NON_BILLABLE)
    experience_level = db.Column(Enum(ExperienceLevel), nullable=False, default=ExperienceLevel.JUNIOR)
    years_of_experience = db.Column(db.Integer, default=0)
    experience_months = db.Column(db.Integer, default=0)
    
    # Skills and Qualifications
    primary_skills = db.Column(JSON)  # Array of skills
    secondary_skills = db.Column(JSON)  # Array of skills
    primary_skills_experience = db.Column(db.Integer, default=0)
    secondary_skills_experience = db.Column(db.Integer, default=0)
    certifications = db.Column(JSON)  # Array of certifications
    education_qualification = db.Column(db.String(200))
    training_completed = db.Column(JSON)  # Array of training
    
    # Financial Information
    cost_center = db.Column(db.String(50))
    cost_rate = db.Column(db.Numeric(10, 2))
    billing_rate = db.Column(db.Numeric(10, 2))
    overtime_rate = db.Column(db.Numeric(10, 2))
    currency = db.Column(db.String(10), default='USD')
    rate_effective_date = db.Column(db.Date)
    salary_currency = db.Column(db.String(10))
    
    # Performance and Utilization
    utilization_percentage = db.Column(db.Numeric(5, 2), default=0.0)
    utilization_target = db.Column(db.Numeric(5, 2), default=80.0)
    current_utilization = db.Column(db.Numeric(5, 2), default=0.0)
    average_utilization_3m = db.Column(db.Numeric(5, 2), default=0.0)
    average_utilization_6m = db.Column(db.Numeric(5, 2), default=0.0)
    billable_hours_target = db.Column(db.Integer, default=160)
    productivity_score = db.Column(db.Integer, default=0)
    performance_rating = db.Column(db.Numeric(3, 2))
    last_performance_review_date = db.Column(db.Date)
    next_performance_review_date = db.Column(db.Date)
    
    # Bench Information
    bench_days = db.Column(db.Integer, default=0)
    bench_start_date = db.Column(db.Date)
    bench_reason = db.Column(db.String(200))
    available_from_date = db.Column(db.Date)
    last_project_end_date = db.Column(db.Date)
    
    # Career Development
    career_level = db.Column(db.String(50))
    promotion_eligible_date = db.Column(db.Date)
    learning_budget = db.Column(db.Numeric(10, 2))
    learning_budget_used = db.Column(db.Numeric(10, 2), default=0.0)
    
    # Allocation Management
    current_project_allocation = db.Column(db.Numeric(5, 2), default=0.0)
    max_allocation_percentage = db.Column(db.Numeric(5, 2), default=100.0)
    
    # Visa and Legal
    passport_number = db.Column(db.String(50))
    visa_status = db.Column(db.String(50))
    visa_expiry_date = db.Column(db.Date)
    tax_id = db.Column(db.String(50))
    bank_account_number = db.Column(db.String(50))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    allocations = db.relationship('ProjectAllocation', back_populates='resource', cascade='all, delete-orphan')
    bench_costs = db.relationship('BenchCosting', back_populates='resource', cascade='all, delete-orphan')
    skill_assessments = db.relationship('ResourceSkillAssessment', back_populates='resource', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': f"{self.first_name} {self.last_name}",
            'email': self.email,
            'personal_email': self.personal_email,
            'phone': self.phone,
            'emergency_contact_name': self.emergency_contact_name,
            'emergency_contact_phone': self.emergency_contact_phone,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'gender': self.gender,
            'marital_status': self.marital_status,
            'nationality': self.nationality,
            'address': self.address,
            'designation': self.designation,
            'department': self.department,
            'location': self.location,
            'work_location': self.work_location.value if self.work_location else None,
            'employment_type': self.employment_type.value if self.employment_type else None,
            'employment_status': self.employment_status.value if self.employment_status else None,
            'joining_date': self.joining_date.isoformat() if self.joining_date else None,
            'probation_end_date': self.probation_end_date.isoformat() if self.probation_end_date else None,
            'reporting_manager': self.reporting_manager,
            'reporting_manager_id': self.reporting_manager_id,
            'status': self.status.value if self.status else None,
            'resource_type': self.resource_type.value if self.resource_type else None,
            'experience_level': self.experience_level.value if self.experience_level else None,
            'years_of_experience': self.years_of_experience,
            'experience_months': self.experience_months,
            'primary_skills': self.primary_skills,
            'secondary_skills': self.secondary_skills,
            'primary_skills_experience': self.primary_skills_experience,
            'secondary_skills_experience': self.secondary_skills_experience,
            'certifications': self.certifications,
            'education_qualification': self.education_qualification,
            'training_completed': self.training_completed,
            'cost_center': self.cost_center,
            'cost_rate': float(self.cost_rate) if self.cost_rate else 0,
            'billing_rate': float(self.billing_rate) if self.billing_rate else 0,
            'overtime_rate': float(self.overtime_rate) if self.overtime_rate else 0,
            'currency': self.currency,
            'rate_effective_date': self.rate_effective_date.isoformat() if self.rate_effective_date else None,
            'salary_currency': self.salary_currency,
            'utilization_percentage': float(self.utilization_percentage) if self.utilization_percentage else 0,
            'utilization_target': float(self.utilization_target) if self.utilization_target else 80,
            'current_utilization': float(self.current_utilization) if self.current_utilization else 0,
            'average_utilization_3m': float(self.average_utilization_3m) if self.average_utilization_3m else 0,
            'average_utilization_6m': float(self.average_utilization_6m) if self.average_utilization_6m else 0,
            'billable_hours_target': self.billable_hours_target,
            'productivity_score': self.productivity_score,
            'performance_rating': float(self.performance_rating) if self.performance_rating else None,
            'last_performance_review_date': self.last_performance_review_date.isoformat() if self.last_performance_review_date else None,
            'next_performance_review_date': self.next_performance_review_date.isoformat() if self.next_performance_review_date else None,
            'bench_days': self.bench_days,
            'bench_start_date': self.bench_start_date.isoformat() if self.bench_start_date else None,
            'bench_reason': self.bench_reason,
            'available_from_date': self.available_from_date.isoformat() if self.available_from_date else None,
            'last_project_end_date': self.last_project_end_date.isoformat() if self.last_project_end_date else None,
            'career_level': self.career_level,
            'promotion_eligible_date': self.promotion_eligible_date.isoformat() if self.promotion_eligible_date else None,
            'learning_budget': float(self.learning_budget) if self.learning_budget else 0,
            'learning_budget_used': float(self.learning_budget_used) if self.learning_budget_used else 0,
            'current_project_allocation': float(self.current_project_allocation) if self.current_project_allocation else 0,
            'max_allocation_percentage': float(self.max_allocation_percentage) if self.max_allocation_percentage else 100,
            'passport_number': self.passport_number,
            'visa_status': self.visa_status,
            'visa_expiry_date': self.visa_expiry_date.isoformat() if self.visa_expiry_date else None,
            'tax_id': self.tax_id,
            'bank_account_number': self.bank_account_number,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<Resource {self.employee_id}: {self.first_name} {self.last_name}>'


class ResourceSkillAssessment(db.Model):
    __tablename__ = 'resource_skill_assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'), nullable=False)
    skill_name = db.Column(db.String(100), nullable=False)
    skill_category = db.Column(db.String(50))
    proficiency_level = db.Column(db.String(20))  # beginner, intermediate, advanced, expert
    proficiency_score = db.Column(db.Numeric(3, 1))  # 0.0 to 10.0
    years_experience = db.Column(db.Numeric(4, 1))
    last_assessed_date = db.Column(db.Date)
    assessed_by = db.Column(db.Integer)
    certification_obtained = db.Column(db.Boolean, default=False)
    certification_name = db.Column(db.String(200))
    certification_date = db.Column(db.Date)
    certification_expiry = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    resource = db.relationship('Resource', back_populates='skill_assessments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'resource_id': self.resource_id,
            'skill_name': self.skill_name,
            'skill_category': self.skill_category,
            'proficiency_level': self.proficiency_level,
            'proficiency_score': float(self.proficiency_score) if self.proficiency_score else None,
            'years_experience': float(self.years_experience) if self.years_experience else None,
            'last_assessed_date': self.last_assessed_date.isoformat() if self.last_assessed_date else None,
            'assessed_by': self.assessed_by,
            'certification_obtained': self.certification_obtained,
            'certification_name': self.certification_name,
            'certification_date': self.certification_date.isoformat() if self.certification_date else None,
            'certification_expiry': self.certification_expiry.isoformat() if self.certification_expiry else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
