
#!/usr/bin/env python3
"""
IT Delivery Dashboard Backend
Production-ready main application runner
"""

import os
import sys
from app import create_app, db

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    """Main application entry point"""
    # Get configuration from environment
    config_name = os.getenv('FLASK_ENV', 'development')
    
    # Create application instance
    app = create_app(config_name)
    
    # Get server configuration
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = app.config.get('DEBUG', False)
    
    # Log startup information
    print(f"Starting IT Delivery Dashboard API")
    print(f"Environment: {config_name}")
    print(f"Server: {host}:{port}")
    print(f"Debug mode: {debug}")
    print("API Documentation available at: /api/docs")
    print("-" * 50)
    
    # Run the application
    try:
        app.run(
            host=host,
            port=port,
            debug=debug,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\nShutting down gracefully...")
    except Exception as e:
        print(f"Error starting application: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
