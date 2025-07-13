
from flask import jsonify
from app.api import api_bp

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'IT Delivery Dashboard API is running',
        'version': '1.0.0'
    }), 200
