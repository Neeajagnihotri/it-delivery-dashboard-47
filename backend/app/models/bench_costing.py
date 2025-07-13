
from app import db
from datetime import datetime

class BenchCosting(db.Model):
    __tablename__ = 'bench_costing'
    
    id = db.Column(db.Integer, primary_key=True)
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'), nullable=False)
    month_year = db.Column(db.Date, nullable=False)
    
    # Cost Details
    bench_cost = db.Column(db.Decimal(12, 2))
    salary_cost = db.Column(db.Decimal(12, 2))
    benefits_cost = db.Column(db.Decimal(12, 2))
    overhead_cost = db.Column(db.Decimal(12, 2))
    training_cost = db.Column(db.Decimal(12, 2))
    
    # Time Tracking
    bench_days = db.Column(db.Integer, default=0)
    total_working_days = db.Column(db.Integer, default=22)
    training_days = db.Column(db.Integer, default=0)
    available_days = db.Column(db.Integer, default=0)
    
    # Bench Information
    bench_reason = db.Column(db.String(200))
    bench_category = db.Column(db.String(100))  # project_gap, skill_development, awaiting_allocation, performance_improvement, client_delay
    expected_allocation_date = db.Column(db.Date)
    upskilling_activities = db.Column(db.Text)
    
    # Cost Center
    cost_center = db.Column(db.String(50))
    department_code = db.Column(db.String(50))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    resource = db.relationship('Resource', back_populates='bench_costs')
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('resource_id', 'month_year'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'resource_id': self.resource_id,
            'month_year': self.month_year.isoformat() if self.month_year else None,
            'bench_cost': float(self.bench_cost) if self.bench_cost else None,
            'salary_cost': float(self.salary_cost) if self.salary_cost else None,
            'benefits_cost': float(self.benefits_cost) if self.benefits_cost else None,
            'overhead_cost': float(self.overhead_cost) if self.overhead_cost else None,
            'training_cost': float(self.training_cost) if self.training_cost else None,
            'bench_days': self.bench_days,
            'total_working_days': self.total_working_days,
            'training_days': self.training_days,
            'available_days': self.available_days,
            'bench_reason': self.bench_reason,
            'bench_category': self.bench_category,
            'expected_allocation_date': self.expected_allocation_date.isoformat() if self.expected_allocation_date else None,
            'upskilling_activities': self.upskilling_activities,
            'cost_center': self.cost_center,
            'department_code': self.department_code,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<BenchCosting Resource:{self.resource_id} Month:{self.month_year}>'
