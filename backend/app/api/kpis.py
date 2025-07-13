
from flask import request, g
from app.api import api_bp
from app.services.kpi_service import KPIService
from app.services.escalation_service import EscalationService
from app.utils.response import success_response, error_response
from app.utils.auth import role_required, audit_log
import logging

logger = logging.getLogger(__name__)

@api_bp.route('/kpis/summary', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner', 'finance_head'], 'read', 'kpis')
def get_kpi_summary():
    """Get comprehensive KPI summary including escalation metrics"""
    try:
        kpis = KPIService.get_kpi_summary()
        
        audit_log('READ', 'kpis_summary')
        return success_response(kpis, 'KPI summary retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving KPI summary: {e}")
        return error_response('Failed to retrieve KPI summary', 500)

@api_bp.route('/kpis/dashboard', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner', 'finance_head'], 'read', 'kpis')
def get_dashboard_kpis():
    """Get comprehensive dashboard KPIs with escalation integration"""
    try:
        # Get all KPI data
        summary_kpis = KPIService.get_kpi_summary()
        resource_analytics = KPIService.get_resource_analytics()
        project_analytics = KPIService.get_project_analytics()
        financial_analytics = KPIService.get_financial_analytics()
        escalation_kpis = EscalationService.get_dashboard_kpis()
        escalation_analytics = EscalationService.get_escalation_analytics()
        
        dashboard_data = {
            'summary': summary_kpis,
            'resources': resource_analytics,
            'projects': project_analytics,
            'financials': financial_analytics,
            'escalations': {
                'kpis': escalation_kpis,
                'analytics': escalation_analytics
            }
        }
        
        audit_log('READ', 'dashboard_kpis')
        return success_response(dashboard_data, 'Dashboard KPIs retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving dashboard KPIs: {e}")
        return error_response('Failed to retrieve dashboard KPIs', 500)

@api_bp.route('/kpis/resources', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read', 'resources')
def get_resource_kpis():
    """Get resource-specific KPIs and analytics"""
    try:
        resource_analytics = KPIService.get_resource_analytics()
        
        audit_log('READ', 'resource_kpis')
        return success_response(resource_analytics, 'Resource KPIs retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving resource KPIs: {e}")
        return error_response('Failed to retrieve resource KPIs', 500)

@api_bp.route('/kpis/projects', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read', 'projects')
def get_project_kpis():
    """Get project-specific KPIs and analytics"""
    try:
        project_analytics = KPIService.get_project_analytics()
        
        audit_log('READ', 'project_kpis')
        return success_response(project_analytics, 'Project KPIs retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving project KPIs: {e}")
        return error_response('Failed to retrieve project KPIs', 500)

@api_bp.route('/kpis/financials', methods=['GET'])
@role_required(['leadership', 'finance_head'], 'read', 'financials')
def get_financial_kpis():
    """Get financial KPIs and analytics"""
    try:
        financial_analytics = KPIService.get_financial_analytics()
        
        audit_log('READ', 'financial_kpis')
        return success_response(financial_analytics, 'Financial KPIs retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving financial KPIs: {e}")
        return error_response('Failed to retrieve financial KPIs', 500)

@api_bp.route('/kpis/escalations', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read', 'escalations')
def get_escalation_kpis():
    """Get escalation KPIs and analytics with dashboard integration"""
    try:
        escalation_kpis = EscalationService.get_dashboard_kpis()
        escalation_analytics = EscalationService.get_escalation_analytics()
        
        combined_data = {
            'kpis': escalation_kpis,
            'analytics': escalation_analytics
        }
        
        audit_log('READ', 'escalation_kpis')
        return success_response(combined_data, 'Escalation KPIs retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving escalation KPIs: {e}")
        return error_response('Failed to retrieve escalation KPIs', 500)

# Chart-specific endpoints
@api_bp.route('/kpis/charts/department-distribution', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read', 'resources')
def get_department_distribution():
    """Get department-wise resource distribution"""
    try:
        analytics = KPIService.get_resource_analytics()
        
        audit_log('READ', 'department_distribution')
        return success_response(analytics['department_distribution'], 'Department distribution retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving department distribution: {e}")
        return error_response('Failed to retrieve department distribution', 500)

@api_bp.route('/kpis/charts/location-distribution', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read', 'resources')
def get_location_distribution():
    """Get location-wise resource distribution"""
    try:
        analytics = KPIService.get_resource_analytics()
        
        audit_log('READ', 'location_distribution')
        return success_response(analytics['location_distribution'], 'Location distribution retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving location distribution: {e}")
        return error_response('Failed to retrieve location distribution', 500)

@api_bp.route('/kpis/charts/bench-aging', methods=['GET'])
@role_required(['leadership', 'resource_manager'], 'read', 'resources')
def get_bench_aging_analysis():
    """Get bench aging analysis"""
    try:
        analytics = KPIService.get_resource_analytics()
        
        audit_log('READ', 'bench_aging')
        return success_response(analytics['bench_aging'], 'Bench aging analysis retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving bench aging analysis: {e}")
        return error_response('Failed to retrieve bench aging analysis', 500)

@api_bp.route('/kpis/charts/revenue-trends', methods=['GET'])
@role_required(['leadership', 'finance_head'], 'read', 'financials')
def get_revenue_trends():
    """Get revenue trends"""
    try:
        analytics = KPIService.get_financial_analytics()
        
        audit_log('READ', 'revenue_trends')
        return success_response(analytics['monthly_trends'], 'Revenue trends retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving revenue trends: {e}")
        return error_response('Failed to retrieve revenue trends', 500)

@api_bp.route('/kpis/charts/project-health', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read', 'projects')
def get_project_health_metrics():
    """Get project health metrics"""
    try:
        analytics = KPIService.get_project_analytics()
        
        audit_log('READ', 'project_health')
        return success_response(analytics['health_distribution'], 'Project health metrics retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving project health metrics: {e}")
        return error_response('Failed to retrieve project health metrics', 500)

@api_bp.route('/kpis/charts/escalation-trends', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read', 'escalations')
def get_escalation_trends():
    """Get escalation trends for charts"""
    try:
        analytics = EscalationService.get_escalation_analytics()
        
        audit_log('READ', 'escalation_trends')
        return success_response(analytics['monthly_trends'], 'Escalation trends retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving escalation trends: {e}")
        return error_response('Failed to retrieve escalation trends', 500)
