
#!/usr/bin/env python3
"""
Development server startup script for IT Delivery Dashboard
"""

import os
import sys
from flask import Flask
from flask_cors import CORS

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import create_app, db
    from app.services.user_service import UserService
    
    def main():
        print("🚀 Starting IT Delivery Dashboard Backend...")
        
        # Create Flask app
        app = create_app()
        
        # Configure CORS for development
        CORS(app, origins=["http://localhost:5173", "https://*.lovableproject.com"], 
             supports_credentials=True)
        
        # Create database tables and default users
        with app.app_context():
            try:
                db.create_all()
                print("✅ Database tables created")
                
                # Create default users
                UserService.create_default_users()
                print("✅ Default users created")
                
            except Exception as e:
                print(f"⚠️  Database setup warning: {e}")
        
        print("\n🎯 Demo Credentials:")
        print("   Admin: admin@zapcg.com / admin123")
        print("   Finance: finance@zapcg.com / finance123")
        print("   HR: hr@zapcg.com / hr123")
        print("   Manager: manager@zapcg.com / manager123")
        print("   Delivery: delivery@zapcg.com / delivery123")
        print("\n🌐 Server running on http://localhost:5000")
        print("📱 Frontend should connect from http://localhost:5173")
        print("\n" + "="*50)
        
        # Run the development server
        app.run(host='0.0.0.0', port=5000, debug=True)

    if __name__ == "__main__":
        main()
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("💡 Make sure you're in the backend directory and have installed requirements:")
    print("   cd backend")
    print("   pip install -r requirements.txt")
    sys.exit(1)
