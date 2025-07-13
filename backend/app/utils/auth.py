
from functools import wraps
from flask import g, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.user_service import UserService
from app.models.user import User
from app import db
import logging

logger = logging.getLogger(__name__)

def get_current_user():
    """Get current authenticated user"""
    try:
        user_id = get_jwt_identity()
        if user_id:
            return User.query.get(user_id)
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
    return None

def role_required(allowed_roles, action=None, resource=None):
    """
    Decorator to check if user has required role and permissions
    """
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            try:
                current_user = get_current_user()
                if not current_user:
                    return jsonify({'error': 'User not found'}), 404
                
                if not current_user.is_active:
                    return jsonify({'error': 'User account is deactivated'}), 403
                
                # Check if user has required role
                if current_user.role not in allowed_roles:
                    return jsonify({'error': 'Insufficient permissions'}), 403
                
                # Check specific permissions if provided
                if action and resource:
                    permissions = UserService.get_user_permissions(current_user.role)
                    resource_perms = permissions.get(resource, {})
                    
                    if action not in resource_perms or not resource_perms[action]:
                        return jsonify({'error': f'No {action} permission for {resource}'}), 403
                
                # Store current user in global context
                g.current_user = current_user
                return f(*args, **kwargs)
                
            except Exception as e:
                logger.error(f"Role check error: {e}")
                return jsonify({'error': 'Authorization failed'}), 500
                
        return decorated_function
    return decorator

def audit_log(action, resource_type, resource_id=None, details=None, user_id=None):
    """Log audit trail for important actions"""
    try:
        if not user_id:
            current_user = get_current_user()
            user_id = current_user.id if current_user else None
        
        # In a production system, you'd store this in an audit table
        logger.info(f"AUDIT: User {user_id} performed {action} on {resource_type} {resource_id}: {details}")
        
    except Exception as e:
        logger.error(f"Audit logging failed: {e}")

def validate_permissions(user_role, resource, action):
    """Validate if user role has permission for specific action on resource"""
    permissions = UserService.get_user_permissions(user_role)
    resource_perms = permissions.get(resource, {})
    return resource_perms.get(action, False)

def admin_required(f):
    """Decorator for admin-only endpoints"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user = get_current_user()
        if not current_user or current_user.role != 'leadership':
            return jsonify({'error': 'Admin access required'}), 403
        g.current_user = current_user
        return f(*args, **kwargs)
    return decorated_function

def optional_auth(f):
    """Decorator for endpoints that work with or without authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Try to get user if token is provided
            if 'Authorization' in request.headers:
                from flask_jwt_extended import verify_jwt_in_request
                verify_jwt_in_request(optional=True)
                g.current_user = get_current_user()
            else:
                g.current_user = None
        except:
            g.current_user = None
        
        return f(*args, **kwargs)
    return decorated_function
