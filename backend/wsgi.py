
"""
WSGI entry point for production deployment
Use this file with WSGI servers like Gunicorn, uWSGI, etc.
"""

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

# Create application instance
application = create_app(os.getenv('FLASK_ENV', 'production'))

# For compatibility with some WSGI servers
app = application

if __name__ == "__main__":
    # This won't be called in production, but useful for testing
    application.run()
