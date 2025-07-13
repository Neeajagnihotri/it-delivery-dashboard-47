
from flask import request
from app.api import api_bp
from app.services.financial_service import FinancialService
from app.utils.response import success_response, error_response
from app.utils.validators import validate_required_fields
from app.utils.auth import role_required

@api_bp.route('/financials', methods=['GET'])
@role_required(['leadership', 'finance_head'], 'read')
def get_financials():
    """Get all financial records"""
    try:
        financials = FinancialService.get_all_financials()
        financials_data = [financial.to_dict() for financial in financials]
        
        return success_response(financials_data, 'Financial records retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve financial records', 500)

@api_bp.route('/financials', methods=['POST'])
@role_required(['finance_head'], 'write')
def create_financial():
    """Create financial record"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['project_id', 'month_year'])
        
        financial = FinancialService.create_financial(**data)
        
        return success_response(
            financial.to_dict(),
            'Financial record created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Financial record creation failed', 500)

@api_bp.route('/financials/<int:financial_id>', methods=['PUT'])
@role_required(['finance_head'], 'write')
def update_financial(financial_id):
    """Update financial record"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        financial = FinancialService.update_financial(financial_id, **data)
        
        return success_response(
            financial.to_dict(),
            'Financial record updated successfully'
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Financial record update failed', 500)

@api_bp.route('/financials/<int:financial_id>', methods=['DELETE'])
@role_required(['finance_head'], 'write')
def delete_financial(financial_id):
    """Delete financial record"""
    try:
        FinancialService.delete_financial(financial_id)
        
        return success_response(None, 'Financial record deleted successfully')
        
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response('Financial record deletion failed', 500)

@api_bp.route('/bench-costing', methods=['GET'])
@role_required(['leadership', 'finance_head'], 'read')
def get_bench_costing():
    """Get all bench costing records"""
    try:
        bench_costs = FinancialService.get_all_bench_costing()
        bench_costs_data = [bench_cost.to_dict() for bench_cost in bench_costs]
        
        return success_response(bench_costs_data, 'Bench costing records retrieved successfully')
        
    except Exception as e:
        return error_response('Failed to retrieve bench costing records', 500)

@api_bp.route('/bench-costing', methods=['POST'])
@role_required(['finance_head'], 'write')
def create_bench_cost():
    """Create bench costing record"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['resource_id', 'month_year'])
        
        bench_cost = FinancialService.create_bench_cost(**data)
        
        return success_response(
            bench_cost.to_dict(),
            'Bench costing record created successfully',
            201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response('Bench costing record creation failed', 500)
