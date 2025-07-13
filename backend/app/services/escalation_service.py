
from app.models.escalation import Escalation
from app.models.project import Project
from app import db
from sqlalchemy import func, desc, asc
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class EscalationService:
    
    @staticmethod
    def get_all_escalations():
        """Get all escalations with project and client information"""
        try:
            escalations = db.session.query(Escalation, Project).join(
                Project, Escalation.project_id == Project.id, isouter=True
            ).all()
            
            result = []
            for escalation, project in escalations:
                escalation_dict = escalation.to_dict()
                if project:
                    escalation_dict['project_name'] = project.project_name
                    escalation_dict['client_name'] = project.client_name
                result.append(escalation_dict)
            
            return result
            
        except Exception as e:
            logger.error(f"Error fetching escalations: {e}")
            return []
    
    @staticmethod
    def get_escalation_by_id(escalation_id):
        """Get escalation by ID"""
        try:
            return Escalation.query.get(escalation_id)
        except Exception as e:
            logger.error(f"Error fetching escalation {escalation_id}: {e}")
            return None
    
    @staticmethod
    def create_escalation(data):
        """Create new escalation"""
        try:
            escalation = Escalation(**data)
            db.session.add(escalation)
            db.session.commit()
            return escalation
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating escalation: {e}")
            raise
    
    @staticmethod
    def update_escalation(escalation_id, data):
        """Update escalation"""
        try:
            escalation = Escalation.query.get(escalation_id)
            if not escalation:
                raise ValueError("Escalation not found")
            
            for key, value in data.items():
                if hasattr(escalation, key):
                    setattr(escalation, key, value)
            
            db.session.commit()
            return escalation
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating escalation {escalation_id}: {e}")
            raise
    
    @staticmethod
    def delete_escalation(escalation_id):
        """Delete escalation"""
        try:
            escalation = Escalation.query.get(escalation_id)
            if not escalation:
                raise ValueError("Escalation not found")
            
            db.session.delete(escalation)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting escalation {escalation_id}: {e}")
            raise
    
    @staticmethod
    def get_escalation_kpis():
        """Get escalation KPIs for dashboard"""
        try:
            # Basic counts
            total_escalations = Escalation.query.count()
            open_escalations = Escalation.query.filter_by(status='open').count()
            critical_escalations = Escalation.query.filter_by(priority='critical').count()
            overdue_escalations = Escalation.query.filter(
                Escalation.target_resolution_date < datetime.utcnow(),
                Escalation.status.in_(['open', 'in_progress'])
            ).count()
            
            # Resolution time analysis
            resolved_escalations = Escalation.query.filter_by(status='resolved').all()
            total_resolution_time = 0
            resolution_count = 0
            
            for escalation in resolved_escalations:
                if escalation.raised_date and escalation.resolved_date:
                    resolution_time = (escalation.resolved_date - escalation.raised_date).total_seconds() / 3600
                    total_resolution_time += resolution_time
                    resolution_count += 1
            
            avg_resolution_time = total_resolution_time / resolution_count if resolution_count > 0 else 0
            
            # Calculate escalation score (0-100)
            # Score based on: open vs total ratio, critical escalations, overdue items
            if total_escalations > 0:
                open_ratio = open_escalations / total_escalations
                critical_ratio = critical_escalations / total_escalations
                overdue_ratio = overdue_escalations / total_escalations
                
                # Lower score for more problems (inverted scale)
                escalation_score = max(0, 100 - (
                    (open_ratio * 40) +          # 40% weight for open escalations
                    (critical_ratio * 35) +      # 35% weight for critical escalations
                    (overdue_ratio * 25)         # 25% weight for overdue escalations
                ) * 100)
            else:
                escalation_score = 100  # Perfect score if no escalations
            
            # Resolution rate
            resolved_count = Escalation.query.filter_by(status='resolved').count()
            resolution_rate = (resolved_count / total_escalations * 100) if total_escalations > 0 else 100
            
            # Client satisfaction average (mock data - would come from actual feedback)
            avg_client_satisfaction = 7.5  # Out of 10
            
            return {
                'total_escalations': total_escalations,
                'open_escalations': open_escalations,
                'critical_escalations': critical_escalations,
                'overdue_escalations': overdue_escalations,
                'avg_resolution_time_hours': round(avg_resolution_time, 2),
                'resolution_rate_percentage': round(resolution_rate, 2),
                'avg_client_satisfaction': avg_client_satisfaction,
                'escalation_score': round(escalation_score, 0)
            }
            
        except Exception as e:
            logger.error(f"Error calculating escalation KPIs: {e}")
            return {
                'total_escalations': 0,
                'open_escalations': 0,
                'critical_escalations': 0,
                'overdue_escalations': 0,
                'avg_resolution_time_hours': 0,
                'resolution_rate_percentage': 0,
                'avg_client_satisfaction': 0,
                'escalation_score': 75  # Default score
            }
    
    @staticmethod
    def get_escalation_analytics():
        """Get detailed escalation analytics"""
        try:
            # Status distribution
            status_distribution = db.session.query(
                Escalation.status,
                func.count(Escalation.id).label('count')
            ).group_by(Escalation.status).all()
            
            # Priority distribution
            priority_distribution = db.session.query(
                Escalation.priority,
                func.count(Escalation.id).label('count')
            ).group_by(Escalation.priority).all()
            
            # Type distribution
            type_distribution = db.session.query(
                Escalation.escalation_type,
                func.count(Escalation.id).label('count')
            ).group_by(Escalation.escalation_type).all()
            
            # Monthly trend (last 12 months)
            twelve_months_ago = datetime.utcnow() - timedelta(days=365)
            monthly_trend = db.session.query(
                func.date_part('year', Escalation.raised_date).label('year'),
                func.date_part('month', Escalation.raised_date).label('month'),
                func.count(Escalation.id).label('total'),
                func.count(func.nullif(Escalation.status != 'resolved', True)).label('resolved')
            ).filter(
                Escalation.raised_date >= twelve_months_ago
            ).group_by(
                func.date_part('year', Escalation.raised_date),
                func.date_part('month', Escalation.raised_date)
            ).order_by(
                func.date_part('year', Escalation.raised_date),
                func.date_part('month', Escalation.raised_date)
            ).all()
            
            # Project escalations summary
            project_escalations = db.session.query(
                Project.project_name,
                Project.client_name,
                func.count(Escalation.id).label('total_escalations'),
                func.count(func.nullif(Escalation.priority != 'critical', True)).label('critical_escalations')
            ).join(
                Escalation, Project.id == Escalation.project_id
            ).group_by(
                Project.id, Project.project_name, Project.client_name
            ).order_by(
                desc(func.count(Escalation.id))
            ).limit(10).all()
            
            return {
                'kpis': EscalationService.get_escalation_kpis(),
                'status_distribution': [{'status': row.status, 'count': row.count} for row in status_distribution],
                'priority_distribution': [{'priority': row.priority, 'count': row.count} for row in priority_distribution],
                'type_distribution': [{'type': row.escalation_type, 'count': row.count} for row in type_distribution],
                'monthly_trend': [{
                    'year': int(row.year),
                    'month': int(row.month),
                    'total': row.total,
                    'resolved': row.resolved or 0,
                    'avg_resolution_time': 0  # Would calculate actual resolution times
                } for row in monthly_trend],
                'project_escalations': [{
                    'project_name': row.project_name,
                    'client_name': row.client_name,
                    'total_escalations': row.total_escalations,
                    'critical_escalations': row.critical_escalations or 0,
                    'avg_satisfaction': 7.5  # Mock data
                } for row in project_escalations]
            }
            
        except Exception as e:
            logger.error(f"Error getting escalation analytics: {e}")
            return {
                'kpis': EscalationService.get_escalation_kpis(),
                'status_distribution': [],
                'priority_distribution': [],
                'type_distribution': [],
                'monthly_trend': [],
                'project_escalations': []
            }
