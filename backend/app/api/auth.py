
from flask import request, jsonify, g
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.api import api_bp
from app.services.user_service import UserService
from app.utils.response import success_response, error_response
from app.utils.validators import validate_email, validate_required_fields
from app.utils.auth import role_required, audit_log, get_current_user
import logging

logger = logging.getLogger(__name__)

@api_bp.route('/auth/login', methods=['POST'])
def login():
    """User login endpoint with enhanced security"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['email', 'password'])
        
        email = data.get('email').lower().strip()
        password = data.get('password')
        
        if not validate_email(email):
            return error_response('Invalid email format', 400)
        
        user = UserService.authenticate_user(email, password)
        
        if user:
            # Create access token with additional claims
            additional_claims = {
                'role': user.role,
                'email': user.email,
                'name': user.name
            }
            access_token = create_access_token(
                identity=user.id,
                additional_claims=additional_claims
            )
            
            audit_log('LOGIN', 'auth', user.id, f"User {user.email} logged in successfully")
            
            return success_response({
                'access_token': access_token,
                'user': user.to_dict(),
                'permissions': UserService.get_user_permissions(user.role)
            }, 'Login successful')
        
        # Log failed login attempt
        logger.warning(f"Failed login attempt for email: {email}")
        return error_response('Invalid credentials', 401)
        
    except ValueError as e:
        logger.error(f"Login validation error: {e}")
        return error_response(str(e), 400)
    except Exception as e:
        logger.error(f"Login error: {e}")
        return error_response('Login failed', 500)

@api_bp.route('/auth/register', methods=['POST'])
@role_required(['hr', 'leadership'], 'write', 'users')
def register():
    """User registration endpoint (HR and Leadership only)"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['email', 'password', 'name', 'role'])
        
        email = data.get('email').lower().strip()
        
        if not validate_email(email):
            return error_response('Invalid email format', 400)
        
        # Validate role
        valid_roles = ['employee', 'hr', 'resource_manager', 'delivery_owner', 'finance_head', 'leadership']
        if data.get('role') not in valid_roles:
            return error_response(f'Invalid role. Must be one of: {", ".join(valid_roles)}', 400)
        
        # Only leadership can create leadership roles
        if data.get('role') == 'leadership' and g.current_user.role != 'leadership':
            return error_response('Only leadership can create leadership roles', 403)
        
        user = UserService.create_user(
            email=email,
            password=data.get('password'),
            name=data.get('name'),
            role=data.get('role')
        )
        
        audit_log('CREATE', 'users', user.id, f"Created user {user.email} with role {user.role}")
        
        return success_response(
            user.to_dict(),
            'User created successfully',
            201
        )
        
    except ValueError as e:
        logger.error(f"Registration validation error: {e}")
        return error_response(str(e), 400)
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return error_response('User creation failed', 500)

@api_bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user_info():
    """Get current user information"""
    try:
        current_user_id = get_jwt_identity()
        user = UserService.get_user_by_id(current_user_id)
        
        if not user:
            return error_response('User not found', 404)
        
        user_data = user.to_dict()
        user_data['permissions'] = UserService.get_user_permissions(user.role)
        
        return success_response(user_data, 'User information retrieved')
        
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        return error_response('Failed to get user information', 500)

@api_bp.route('/auth/users', methods=['GET'])
@role_required(['hr', 'leadership'], 'read', 'users')
def get_all_users():
    """Get all users (HR and Leadership only)"""
    try:
        users = UserService.get_all_users()
        users_data = []
        
        for user in users:
            user_dict = user.to_dict()
            user_dict['permissions'] = UserService.get_user_permissions(user.role)
            users_data.append(user_dict)
        
        audit_log('READ', 'users', details=f"Retrieved {len(users_data)} users")
        return success_response(users_data, 'Users retrieved successfully')
        
    except Exception as e:
        logger.error(f"Error retrieving users: {e}")
        return error_response('Failed to retrieve users', 500)

@api_bp.route('/auth/users/<int:user_id>', methods=['PUT'])
@role_required(['hr', 'leadership'], 'write', 'users')
def update_user(user_id):
    """Update user information"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        # Only leadership can update role to leadership
        if 'role' in data and data['role'] == 'leadership' and g.current_user.role != 'leadership':
            return error_response('Only leadership can assign leadership roles', 403)
        
        user = UserService.update_user(user_id, **data)
        
        audit_log('UPDATE', 'users', user_id, f"Updated user {user.email}")
        return success_response(user.to_dict(), 'User updated successfully')
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        logger.error(f"Error updating user {user_id}: {e}")
        return error_response('User update failed', 500)

@api_bp.route('/auth/users/<int:user_id>/deactivate', methods=['PUT'])
@role_required(['hr', 'leadership'], 'delete', 'users')
def deactivate_user(user_id):
    """Deactivate user (soft delete)"""
    try:
        if user_id == g.current_user.id:
            return error_response('Cannot deactivate your own account', 400)
        
        user = UserService.deactivate_user(user_id)
        
        audit_log('DEACTIVATE', 'users', user_id, f"Deactivated user {user.email}")
        return success_response(user.to_dict(), 'User deactivated successfully')
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        logger.error(f"Error deactivating user {user_id}: {e}")
        return error_response('User deactivation failed', 500)

@api_bp.route('/auth/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('Request body is required', 400)
        
        validate_required_fields(data, ['current_password', 'new_password'])
        
        current_user = get_current_user()
        if not current_user:
            return error_response('User not found', 404)
        
        # Verify current password
        if not current_user.check_password(data['current_password']):
            return error_response('Current password is incorrect', 400)
        
        # Update password
        current_user.set_password(data['new_password'])
        current_user.save()
        
        audit_log('CHANGE_PASSWORD', 'users', current_user.id, "Password changed")
        return success_response(None, 'Password changed successfully')
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        logger.error(f"Error changing password: {e}")
        return error_response('Password change failed', 500)
