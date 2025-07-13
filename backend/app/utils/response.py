
from flask import jsonify

def success_response(data=None, message="Success", status_code=200):
    """Generate standardized success response"""
    response = {
        'success': True,
        'message': message
    }
    
    if data is not None:
        response['data'] = data
    
    return jsonify(response), status_code

def error_response(message="Error occurred", status_code=400, errors=None):
    """Generate standardized error response"""
    response = {
        'success': False,
        'message': message
    }
    
    if errors:
        response['errors'] = errors
    
    return jsonify(response), status_code

def paginated_response(data, page, per_page, total, message="Success"):
    """Generate paginated response"""
    return jsonify({
        'success': True,
        'message': message,
        'data': data,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page
        }
    })
