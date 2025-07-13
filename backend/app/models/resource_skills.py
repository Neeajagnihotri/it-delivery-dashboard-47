from app import db
from datetime import datetime

class ResourceSkills(db.Model):
    __tablename__ = 'resource_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), nullable=False, index=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills_master.id'), nullable=False)
    skill_type = db.Column(db.String(50), nullable=False)  # 'primary' or 'secondary'
    experience_years = db.Column(db.Integer, default=0)
    experience_months = db.Column(db.Integer, default=0)
    proficiency_level = db.Column(db.String(50), default='intermediate')
    last_used_date = db.Column(db.Date, nullable=True)
    certification_available = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with skills master
    skill = db.relationship('SkillsMaster', back_populates='resource_skills')
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('employee_id', 'skill_id', 'skill_type', name='unique_employee_skill_type'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'skill_id': self.skill_id,
            'skill_name': self.skill.skill_name if self.skill else None,
            'skill_category': self.skill.skill_category if self.skill else None,
            'skill_group': self.skill.skill_group if self.skill else None,
            'skill_type': self.skill_type,
            'experience_years': self.experience_years,
            'experience_months': self.experience_months,
            'proficiency_level': self.proficiency_level,
            'last_used_date': self.last_used_date.isoformat() if self.last_used_date else None,
            'certification_available': self.certification_available,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<ResourceSkills {self.employee_id}: {self.skill.skill_name if self.skill else "Unknown"} ({self.skill_type})>'