
"""
Backward compatibility module
This file maintains compatibility with the old structure
while redirecting to the new application factory pattern
"""

import os
import sys
import warnings

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Show deprecation warning
warnings.warn(
    "Direct usage of app.py is deprecated. Please use 'python run.py' instead.",
    DeprecationWarning,
    stacklevel=2
)

# Import the new application factory
from app import create_app, db
from app.models import *

# Create app instance for backward compatibility
app = create_app()

# Expose database and models for backward compatibility
__all__ = ['app', 'db', 'User', 'PersonalInfo', 'Resource', 'Project', 
           'ProjectMilestone', 'ProjectAllocation', 'Financials', 
           'BenchCosting', 'Escalation']

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    print("WARNING: Using deprecated app.py directly.")
    print("Please use 'python run.py' for production deployment.")
    print("-" * 50)
    
    app.run(
        host=host,
        port=port,
        debug=app.config.get('DEBUG', False)
    )
