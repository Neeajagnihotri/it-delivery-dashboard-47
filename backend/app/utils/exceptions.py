
class ValidationError(Exception):
    """Custom validation error"""
    def __init__(self, message, field=None):
        self.message = message
        self.field = field
        super().__init__(self.message)

class AuthorizationError(Exception):
    """Custom authorization error"""
    def __init__(self, message="Insufficient permissions"):
        self.message = message
        super().__init__(self.message)

class ResourceNotFoundError(Exception):
    """Custom resource not found error"""
    def __init__(self, resource_type, resource_id=None):
        if resource_id:
            self.message = f"{resource_type} with ID {resource_id} not found"
        else:
            self.message = f"{resource_type} not found"
        super().__init__(self.message)
