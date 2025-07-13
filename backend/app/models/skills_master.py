from app import db
from datetime import datetime

class SkillsMaster(db.Model):
    __tablename__ = 'skills_master'
    
    id = db.Column(db.Integer, primary_key=True)
    skill_name = db.Column(db.String(100), unique=True, nullable=False)
    skill_category = db.Column(db.String(100), nullable=False)
    skill_group = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with resource skills
    resource_skills = db.relationship('ResourceSkills', back_populates='skill', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'skill_name': self.skill_name,
            'skill_category': self.skill_category,
            'skill_group': self.skill_group,
            'description': self.description,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<SkillsMaster {self.skill_name} ({self.skill_category})>'