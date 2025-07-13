
from app import db
from datetime import datetime

class PersonalInfo(db.Model):
    __tablename__ = 'personal_info'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(100))
    department = db.Column(db.String(100))
    seniority_level = db.Column(db.String(50))
    experience = db.Column(db.Integer)
    location = db.Column(db.String(100))
    joining_date = db.Column(db.Date)
    employment_type = db.Column(db.String(50))
    reporting_manager = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'full_name': self.full_name,
            'designation': self.designation,
            'department': self.department,
            'seniority_level': self.seniority_level,
            'experience': self.experience,
            'location': self.location,
            'joining_date': self.joining_date.isoformat() if self.joining_date else None,
            'employment_type': self.employment_type,
            'reporting_manager': self.reporting_manager,
            'email': self.email,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<PersonalInfo {self.employee_id}: {self.full_name}>'
