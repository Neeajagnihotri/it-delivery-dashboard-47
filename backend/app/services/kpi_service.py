
from app.models.resource import Resource
from app.models.project import Project
from app.models.escalation import Escalation
from app.models.financial import Financials
from app.services.escalation_service import EscalationService
from app import db
from sqlalchemy import func, desc
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class KPIService:
    
    @staticmethod
    def get_summary_kpis():
        """Get summary KPIs for dashboard"""
        try:
            # Resource KPIs
            total_resources = Resource.query.filter_by(employment_status='active').count()
            billable_resources = Resource.query.filter_by(
                employment_status='active',
                resource_type='billable'
            ).count()
            bench_resources = Resource.query.filter_by(
                employment_status='active',
                status='bench'
            ).count()
            intern_resources = Resource.query.filter_by(
                employment_status='active',
                resource_type='intern'
            ).count()
            
            # Project KPIs
            active_projects = Project.query.filter_by(status='active').count()
            completed_projects = Project.query.filter_by(status='completed').count()
            at_risk_projects = Project.query.filter_by(status='at_risk').count()
            
            # Financial KPIs (current month)
            current_month = datetime.utcnow().replace(day=1)
            monthly_financials = Financials.query.filter(
                Financials.month_year >= current_month.strftime('%Y-%m-01')
            ).all()
            
            total_revenue = sum(f.revenue or 0 for f in monthly_financials)
            total_cost = sum(f.cost or 0 for f in monthly_financials)
            total_margin = total_revenue - total_cost
            
            # Utilization calculations
            if total_resources > 0:
                utilization_rate = (billable_resources / total_resources) * 100
                bench_percentage = (bench_resources / total_resources) * 100
            else:
                utilization_rate = 0
                bench_percentage = 0
            
            # Bench aging
            bench_resource_days = Resource.query.filter_by(status='bench').all()
            avg_bench_days = sum(r.bench_days or 0 for r in bench_resource_days) / len(bench_resource_days) if bench_resource_days else 0
            
            # Get escalation score from escalation service
            escalation_kpis = EscalationService.get_escalation_kpis()
            escalation_score = escalation_kpis.get('escalation_score', 75)
            
            return {
                # Resource KPIs
                'total_resources': total_resources,
                'billable_resources': billable_resources,
                'non_billable_resources': total_resources - billable_resources - intern_resources,
                'bench_resources': bench_resources,
                'intern_resources': intern_resources,
                'contractor_resources': Resource.query.filter_by(
                    employment_status='active',
                    resource_type='contractor'
                ).count(),
                'training_resources': Resource.query.filter_by(
                    employment_status='active',
                    status='training'
                ).count(),
                
                # Project KPIs
                'active_projects': active_projects,
                'completed_projects': completed_projects,
                'delayed_projects': Project.query.filter_by(status='delayed').count(),
                'at_risk_projects': at_risk_projects,
                
                # Financial KPIs
                'total_revenue': total_revenue,
                'total_cost': total_cost,
                'total_margin': total_margin,
                'margin_percentage': (total_margin / total_revenue * 100) if total_revenue > 0 else 0,
                'monthly_revenue': total_revenue,
                'monthly_cost': total_cost,
                'monthly_margin': total_margin,
                
                # Utilization KPIs
                'overall_utilization': utilization_rate,
                'billable_utilization': utilization_rate,
                'target_utilization': 80,
                'utilization_rate': utilization_rate,
                'bench_percentage': bench_percentage,
                'avg_bench_days': avg_bench_days,
                
                # Quality KPIs
                'average_project_health': KPIService._calculate_project_health_score(),
                'client_satisfaction_average': 8.2,  # Mock data
                'defect_density': 0.8,  # Mock data
                
                # Performance KPIs
                'on_time_delivery_rate': KPIService._calculate_on_time_delivery_rate(),
                'budget_adherence_rate': 85.5,  # Mock data
                'scope_change_frequency': 12.3,  # Mock data
                
                # Escalation KPIs
                'total_escalations': escalation_kpis.get('total_escalations', 0),
                'open_escalations': escalation_kpis.get('open_escalations', 0),
                'critical_escalations': escalation_kpis.get('critical_escalations', 0),
                'escalation_score': escalation_score
            }
            
        except Exception as e:
            logger.error(f"Error calculating summary KPIs: {e}")
            # Return default values on error
            return {
                'total_resources': 0,
                'billable_resources': 0,
                'non_billable_resources': 0,
                'bench_resources': 0,
                'intern_resources': 0,
                'contractor_resources': 0,
                'training_resources': 0,
                'active_projects': 0,
                'completed_projects': 0,
                'delayed_projects': 0,
                'at_risk_projects': 0,
                'total_revenue': 0,
                'total_cost': 0,
                'total_margin': 0,
                'margin_percentage': 0,
                'monthly_revenue': 0,
                'monthly_cost': 0,
                'monthly_margin': 0,
                'overall_utilization': 0,
                'billable_utilization': 0,
                'target_utilization': 80,
                'utilization_rate': 0,
                'bench_percentage': 0,
                'avg_bench_days': 0,
                'average_project_health': 0,
                'client_satisfaction_average': 0,
                'defect_density': 0,
                'on_time_delivery_rate': 0,
                'budget_adherence_rate': 0,
                'scope_change_frequency': 0,
                'total_escalations': 0,
                'open_escalations': 0,
                'critical_escalations': 0,
                'escalation_score': 75
            }
    
    @staticmethod
    def _calculate_project_health_score():
        """Calculate average project health score"""
        try:
            projects = Project.query.filter_by(status='active').all()
            if not projects:
                return 0
            
            health_scores = {
                'green': 100,
                'yellow': 75,
                'amber': 50,
                'red': 25,
                'unknown': 60
            }
            
            total_score = sum(health_scores.get(p.health_status, 60) for p in projects)
            return total_score / len(projects)
            
        except Exception as e:
            logger.error(f"Error calculating project health score: {e}")
            return 0
    
    @staticmethod
    def _calculate_on_time_delivery_rate():
        """Calculate on-time delivery rate"""
        try:
            completed_projects = Project.query.filter_by(status='completed').all()
            if not completed_projects:
                return 0
            
            on_time_count = 0
            for project in completed_projects:
                if project.actual_end_date and project.planned_end_date:
                    if project.actual_end_date <= project.planned_end_date:
                        on_time_count += 1
            
            return (on_time_count / len(completed_projects)) * 100
            
        except Exception as e:
            logger.error(f"Error calculating on-time delivery rate: {e}")
            return 0
    
    @staticmethod
    def get_resource_kpis():
        """Get detailed resource KPIs"""
        try:
            # Department distribution
            dept_distribution = db.session.query(
                Resource.department,
                func.count(Resource.id).label('count'),
                func.avg(Resource.utilization_percentage).label('avg_utilization'),
                func.count(func.nullif(Resource.status != 'bench', True)).label('bench_count')
            ).filter_by(employment_status='active').group_by(Resource.department).all()
            
            # Location distribution
            location_distribution = db.session.query(
                Resource.location,
                func.count(Resource.id).label('count'),
                func.avg(Resource.cost_rate).label('avg_cost_rate')
            ).filter_by(employment_status='active').group_by(Resource.location).all()
            
            # Experience distribution
            experience_distribution = db.session.query(
                Resource.experience_level,
                func.count(Resource.id).label('count'),
                func.avg(Resource.billing_rate).label('avg_billing_rate')
            ).filter_by(employment_status='active').group_by(Resource.experience_level).all()
            
            return {
                'department_distribution': [{
                    'name': row.department,
                    'count': row.count,
                    'avg_utilization': round(row.avg_utilization or 0, 2),
                    'bench_count': row.bench_count or 0
                } for row in dept_distribution],
                'location_distribution': [{
                    'name': row.location,
                    'count': row.count,
                    'avg_cost_rate': round(row.avg_cost_rate or 0, 2)
                } for row in location_distribution],
                'experience_distribution': [{
                    'name': row.experience_level,
                    'count': row.count,
                    'avg_billing_rate': round(row.avg_billing_rate or 0, 2)
                } for row in experience_distribution]
            }
            
        except Exception as e:
            logger.error(f"Error getting resource KPIs: {e}")
            return {
                'department_distribution': [],
                'location_distribution': [],
                'experience_distribution': []
            }
