
from app import db
from datetime import datetime

class PersonalInfo(db.Model):
    __tablename__ = 'personal_info'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    designation = db.Column(db.String(100))
    department = db.Column(db.String(100))
    seniority_level = db.Column(db.String(50))
    experience_years = db.Column(db.Integer)
    experience_months = db.Column(db.Integer)
    location = db.Column(db.String(100))
    work_location = db.Column(db.String(50))  # office, remote, hybrid
    joining_date = db.Column(db.Date)
    probation_end_date = db.Column(db.Date)
    employment_type = db.Column(db.String(50))  # full_time, part_time, contract, intern, consultant
    employment_status = db.Column(db.String(50))  # active, inactive, terminated, resigned, on_leave
    reporting_manager = db.Column(db.String(100))
    reporting_manager_id = db.Column(db.String(50))
    email = db.Column(db.String(120))
    personal_email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    emergency_contact_name = db.Column(db.String(100))
    emergency_contact_phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(20))
    marital_status = db.Column(db.String(20))
    nationality = db.Column(db.String(50))
    passport_number = db.Column(db.String(50))
    visa_status = db.Column(db.String(50))
    visa_expiry_date = db.Column(db.Date)
    salary_currency = db.Column(db.String(10))
    bank_account_number = db.Column(db.String(50))
    tax_id = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'full_name': self.full_name,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'designation': self.designation,
            'department': self.department,
            'seniority_level': self.seniority_level,
            'experience_years': self.experience_years,
            'experience_months': self.experience_months,
            'location': self.location,
            'work_location': self.work_location,
            'joining_date': self.joining_date.isoformat() if self.joining_date else None,
            'probation_end_date': self.probation_end_date.isoformat() if self.probation_end_date else None,
            'employment_type': self.employment_type,
            'employment_status': self.employment_status,
            'reporting_manager': self.reporting_manager,
            'reporting_manager_id': self.reporting_manager_id,
            'email': self.email,
            'personal_email': self.personal_email,
            'phone': self.phone,
            'emergency_contact_name': self.emergency_contact_name,
            'emergency_contact_phone': self.emergency_contact_phone,
            'address': self.address,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'gender': self.gender,
            'marital_status': self.marital_status,
            'nationality': self.nationality,
            'passport_number': self.passport_number,
            'visa_status': self.visa_status,
            'visa_expiry_date': self.visa_expiry_date.isoformat() if self.visa_expiry_date else None,
            'salary_currency': self.salary_currency,
            'bank_account_number': self.bank_account_number,
            'tax_id': self.tax_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<PersonalInfo {self.employee_id}: {self.full_name}>'
