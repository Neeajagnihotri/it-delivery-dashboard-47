
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app import db
import logging

logger = logging.getLogger(__name__)

class UserService:
    
    @staticmethod
    def authenticate_user(email, password):
        """Authenticate user with email and password"""
        try:
            user = User.query.filter_by(email=email, is_active=True).first()
            if user and user.check_password(password):
                return user
            return None
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return None
    
    @staticmethod
    def create_user(email, password, name, role='employee'):
        """Create new user"""
        try:
            # Check if user already exists
            if User.query.filter_by(email=email).first():
                raise ValueError("User with this email already exists")
            
            user = User(
                email=email,
                name=name,
                role=role,
                is_active=True
            )
            user.set_password(password)
            
            db.session.add(user)
            db.session.commit()
            
            logger.info(f"User created successfully: {email}")
            return user
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"User creation error: {e}")
            raise
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        try:
            return User.query.get(user_id)
        except Exception as e:
            logger.error(f"Error fetching user {user_id}: {e}")
            return None
    
    @staticmethod
    def get_all_users():
        """Get all users"""
        try:
            return User.query.all()
        except Exception as e:
            logger.error(f"Error fetching users: {e}")
            return []
    
    @staticmethod
    def update_user(user_id, **kwargs):
        """Update user information"""
        try:
            user = User.query.get(user_id)
            if not user:
                raise ValueError("User not found")
            
            for key, value in kwargs.items():
                if hasattr(user, key) and key != 'id':
                    if key == 'password':
                        user.set_password(value)
                    else:
                        setattr(user, key, value)
            
            db.session.commit()
            return user
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"User update error: {e}")
            raise
    
    @staticmethod
    def deactivate_user(user_id):
        """Deactivate user (soft delete)"""
        try:
            user = User.query.get(user_id)
            if not user:
                raise ValueError("User not found")
            
            user.is_active = False
            db.session.commit()
            return user
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"User deactivation error: {e}")
            raise
    
    @staticmethod
    def get_user_permissions(role):
        """Get permissions for user role"""
        permissions = {
            'leadership': {
                'users': {'read': True, 'write': True, 'delete': True},
                'resources': {'read': True, 'write': True, 'delete': True},
                'projects': {'read': True, 'write': True, 'delete': True},
                'financials': {'read': True, 'write': True, 'delete': True},
                'escalations': {'read': True, 'write': True, 'delete': True},
                'kpis': {'read': True, 'write': False, 'delete': False},
                'settings': {'read': True, 'write': True, 'delete': True}
            },
            'finance_head': {
                'users': {'read': True, 'write': False, 'delete': False},
                'resources': {'read': True, 'write': False, 'delete': False},
                'projects': {'read': True, 'write': True, 'delete': False},
                'financials': {'read': True, 'write': True, 'delete': True},
                'escalations': {'read': True, 'write': False, 'delete': False},
                'kpis': {'read': True, 'write': False, 'delete': False},
                'settings': {'read': False, 'write': False, 'delete': False}
            },
            'delivery_owner': {
                'users': {'read': True, 'write': False, 'delete': False},
                'resources': {'read': True, 'write': True, 'delete': False},
                'projects': {'read': True, 'write': True, 'delete': False},
                'financials': {'read': True, 'write': False, 'delete': False},
                'escalations': {'read': True, 'write': True, 'delete': True},
                'kpis': {'read': True, 'write': False, 'delete': False},
                'settings': {'read': False, 'write': False, 'delete': False}
            },
            'resource_manager': {
                'users': {'read': True, 'write': False, 'delete': False},
                'resources': {'read': True, 'write': True, 'delete': True},
                'projects': {'read': True, 'write': False, 'delete': False},
                'financials': {'read': False, 'write': False, 'delete': False},
                'escalations': {'read': True, 'write': False, 'delete': False},
                'kpis': {'read': True, 'write': False, 'delete': False},
                'settings': {'read': False, 'write': False, 'delete': False}
            },
            'hr': {
                'users': {'read': True, 'write': True, 'delete': True},
                'resources': {'read': True, 'write': True, 'delete': False},
                'projects': {'read': True, 'write': False, 'delete': False},
                'financials': {'read': False, 'write': False, 'delete': False},
                'escalations': {'read': True, 'write': False, 'delete': False},
                'kpis': {'read': True, 'write': False, 'delete': False},
                'settings': {'read': False, 'write': False, 'delete': False}
            },
            'employee': {
                'users': {'read': False, 'write': False, 'delete': False},
                'resources': {'read': True, 'write': False, 'delete': False},
                'projects': {'read': True, 'write': False, 'delete': False},
                'financials': {'read': False, 'write': False, 'delete': False},
                'escalations': {'read': True, 'write': False, 'delete': False},
                'kpis': {'read': True, 'write': False, 'delete': False},
                'settings': {'read': False, 'write': False, 'delete': False}
            }
        }
        
        return permissions.get(role, {})
    
    @staticmethod
    def create_default_users():
        """Create default users for the system"""
        try:
            default_users = [
                {'email': 'admin@zapcg.com', 'password': 'admin123', 'name': 'System Administrator', 'role': 'leadership'},
                {'email': 'finance@zapcg.com', 'password': 'finance123', 'name': 'Finance Head', 'role': 'finance_head'},
                {'email': 'hr@zapcg.com', 'password': 'hr123', 'name': 'HR Manager', 'role': 'hr'},
                {'email': 'manager@zapcg.com', 'password': 'manager123', 'name': 'Resource Manager', 'role': 'resource_manager'},
                {'email': 'delivery@zapcg.com', 'password': 'delivery123', 'name': 'Delivery Owner', 'role': 'delivery_owner'}
            ]
            
            for user_data in default_users:
                if not User.query.filter_by(email=user_data['email']).first():
                    UserService.create_user(**user_data)
                    logger.info(f"Created default user: {user_data['email']}")
            
        except Exception as e:
            logger.error(f"Error creating default users: {e}")
