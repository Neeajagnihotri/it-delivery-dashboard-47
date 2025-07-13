
from flask import request, g
from app.api import api_bp
from app.services.escalation_service import EscalationService
from app.utils.response import success_response, error_response
from app.utils.validators import validate_required_fields
from app.utils.auth import role_required, audit_log
import logging

logger = logging.getLogger(__name__)

@api_bp.route('/escalations', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read', 'escalations')
def get_escalations():
    """Get all escalations with filtering and pagination"""
    try:
        # Get query parameters for filtering
        filters = {}
        if request.args.get('status'):
            filters['status'] = request.args.get('status')
        if request.args.get('priority'):
            filters['priority'] = request.args.get('priority')
        if request.args.get('project_id'):
            filters['project_id'] = int(request.args.get('project_id'))
        if request.args.get('assigned_to'):
            filters['assigned_to'] = request.args.get('assigned_to')
        
        # Get sorting parameters
        sort_by = request.args.get('sort_by', 'raised_date')
        sort_order = request.args.get('sort_order', 'desc')
        
        escalations = EscalationService.get_all_escalations(filters, sort_by, sort_order)
        escalations_data = []
        
        for escalation in escalations:
            escalation_dict = escalation.to_dict()
            if escalation.project:
                escalation_dict['project_name'] = escalation.project.project_name
                escalation_dict['client_name'] = escalation.project.client_name
            else:
                escalation_dict['project_name'] = 'Unknown'
                escalation_dict['client_name'] = 'Unknown'
            escalations_data.append(escalation_dict)
        
        audit_log('READ', 'escalations', details=f"Retrieved {len(escalations_data)} escalations")
        return success_response(escalations_data, 'Escalations retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving escalations: {e}")
        return error_response('Failed to retrieve escalations', 500)

@api_bp.route('/escalations', methods=['POST'])
@role_required(['resource_manager', 'delivery_owner'], 'write', 'escalations')
def create_escalation():
    """Create new escalation"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['title', 'project_id', 'priority', 'escalation_type'])
        
        # Set the user who raised the escalation
        data['raised_by'] = g.current_user.email
        
        escalation = EscalationService.create_escalation(**data)
        
        audit_log('CREATE', 'escalations', escalation.id, f"Created escalation: {escalation.title}")
        return success_response(
            escalation.to_dict(),
            'Escalation created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        logger.error(f"Error creating escalation: {e}")
        return error_response('Escalation creation failed', 500)

@api_bp.route('/escalations/<int:escalation_id>', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read', 'escalations')
def get_escalation(escalation_id):
    """Get escalation by ID"""
    try:
        escalation = EscalationService.get_escalation_by_id(escalation_id)
        
        if not escalation:
            return error_response('Escalation not found', 404)
        
        escalation_dict = escalation.to_dict()
        if escalation.project:
            escalation_dict['project_details'] = escalation.project.to_dict()
        
        audit_log('READ', 'escalations', escalation_id)
        return success_response(escalation_dict, 'Escalation retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving escalation {escalation_id}: {e}")
        return error_response('Failed to retrieve escalation', 500)

@api_bp.route('/escalations/<int:escalation_id>', methods=['PUT'])
@role_required(['resource_manager', 'delivery_owner'], 'write', 'escalations')
def update_escalation(escalation_id):
    """Update escalation"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        # Add updated_by information
        data['updated_by'] = g.current_user.email
        
        escalation = EscalationService.update_escalation(escalation_id, **data)
        
        audit_log('UPDATE', 'escalations', escalation_id, f"Updated escalation: {escalation.title}")
        return success_response(
            escalation.to_dict(),
            'Escalation updated successfully'
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        logger.error(f"Error updating escalation {escalation_id}: {e}")
        return error_response('Escalation update failed', 500)

@api_bp.route('/escalations/<int:escalation_id>', methods=['DELETE'])
@role_required(['resource_manager'], 'delete', 'escalations')
def delete_escalation(escalation_id):
    """Delete escalation (soft delete)"""
    try:
        escalation = EscalationService.delete_escalation(escalation_id)
        
        audit_log('DELETE', 'escalations', escalation_id, f"Deleted escalation: {escalation.title}")
        return success_response(None, 'Escalation deleted successfully')
        
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        logger.error(f"Error deleting escalation {escalation_id}: {e}")
        return error_response('Escalation deletion failed', 500)

@api_bp.route('/escalations/analytics', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read', 'escalations')
def get_escalation_analytics():
    """Get escalation analytics for charts and reports"""
    try:
        analytics = EscalationService.get_escalation_analytics()
        
        audit_log('READ', 'escalations_analytics')
        return success_response(analytics, 'Escalation analytics retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving escalation analytics: {e}")
        return error_response('Failed to retrieve escalation analytics', 500)

@api_bp.route('/escalations/dashboard-kpis', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner', 'finance_head'], 'read', 'escalations')
def get_escalation_dashboard_kpis():
    """Get escalation KPIs specifically for main dashboard"""
    try:
        kpis = EscalationService.get_dashboard_kpis()
        
        audit_log('READ', 'escalations_kpis')
        return success_response(kpis, 'Escalation dashboard KPIs retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving escalation dashboard KPIs: {e}")
        return error_response('Failed to retrieve escalation dashboard KPIs', 500)

@api_bp.route('/escalations/summary', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read', 'escalations')
def get_escalation_summary():
    """Get escalation summary for quick overview"""
    try:
        dashboard_kpis = EscalationService.get_dashboard_kpis()
        analytics = EscalationService.get_escalation_analytics()
        
        summary = {
            'kpis': dashboard_kpis,
            'analytics': analytics
        }
        
        audit_log('READ', 'escalations_summary')
        return success_response(summary, 'Escalation summary retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving escalation summary: {e}")
        return error_response('Failed to retrieve escalation summary', 500)
