
from app import db
from app.models.financial import Financials
from app.models.bench_costing import BenchCosting
from sqlalchemy.orm import joinedload

class FinancialService:
    @staticmethod
    def get_all_financials():
        """Get all financial records"""
        return db.session.query(Financials).options(
            joinedload(Financials.project)
        ).all()

    @staticmethod
    def get_financial_by_id(financial_id):
        """Get financial record by ID"""
        return db.session.query(Financials).options(
            joinedload(Financials.project)
        ).filter(Financials.id == financial_id).first()

    @staticmethod
    def create_financial(project_id, month_year, **kwargs):
        """Create a new financial record"""
        # Check if record already exists for project and month
        existing = Financials.query.filter_by(
            project_id=project_id,
            month_year=month_year
        ).first()
        
        if existing:
            raise ValueError('Financial record already exists for this project and month')

        financial = Financials(
            project_id=project_id,
            month_year=month_year,
            **kwargs
        )
        
        db.session.add(financial)
        db.session.commit()
        
        return financial

    @staticmethod
    def update_financial(financial_id, **kwargs):
        """Update financial record"""
        financial = Financials.query.get(financial_id)
        if not financial:
            raise ValueError('Financial record not found')

        for key, value in kwargs.items():
            if hasattr(financial, key):
                setattr(financial, key, value)

        db.session.commit()
        return financial

    @staticmethod
    def delete_financial(financial_id):
        """Delete financial record"""
        financial = Financials.query.get(financial_id)
        if not financial:
            raise ValueError('Financial record not found')

        db.session.delete(financial)
        db.session.commit()

    @staticmethod
    def get_project_financials(project_id):
        """Get all financial records for a project"""
        return Financials.query.filter_by(project_id=project_id).all()

    @staticmethod
    def get_all_bench_costing():
        """Get all bench costing records"""
        return db.session.query(BenchCosting).options(
            joinedload(BenchCosting.resource)
        ).all()

    @staticmethod
    def create_bench_cost(resource_id, month_year, **kwargs):
        """Create a bench costing record"""
        bench_cost = BenchCosting(
            resource_id=resource_id,
            month_year=month_year,
            **kwargs
        )
        
        db.session.add(bench_cost)
        db.session.commit()
        
        return bench_cost

    @staticmethod
    def get_resource_bench_costs(resource_id):
        """Get all bench costs for a resource"""
        return BenchCosting.query.filter_by(resource_id=resource_id).all()
