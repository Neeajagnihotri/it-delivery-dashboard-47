
from app import db
from datetime import datetime

class Financials(db.Model):
    __tablename__ = 'financials'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    month_year = db.Column(db.Date, nullable=False)
    revenue = db.Column(db.Decimal(12, 2))
    cost = db.Column(db.Decimal(12, 2))
    margin = db.Column(db.Decimal(12, 2))
    invoiced_amount = db.Column(db.Decimal(12, 2))
    collected_amount = db.Column(db.Decimal(12, 2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = db.relationship('Project', back_populates='financials')
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('project_id', 'month_year'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'month_year': self.month_year.isoformat() if self.month_year else None,
            'revenue': float(self.revenue) if self.revenue else None,
            'cost': float(self.cost) if self.cost else None,
            'margin': float(self.margin) if self.margin else None,
            'invoiced_amount': float(self.invoiced_amount) if self.invoiced_amount else None,
            'collected_amount': float(self.collected_amount) if self.collected_amount else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<Financials Project:{self.project_id} Month:{self.month_year}>'
