#!/usr/bin/env python3
"""
Start script for the Flask backend server
Run this file to start the backend server for development
"""

import os
import sys
from app import app, db

def create_tables():
    """Create database tables if they don't exist"""
    try:
        db.create_all()
        print("✅ Database tables created successfully")
        
        # Create default admin user if it doesn't exist
        from app import User
        if not User.query.filter_by(email='admin@zapcg.com').first():
            admin_user = User(
                email='admin@zapcg.com',
                password_hash=generate_password_hash('admin123'),
                name='System Administrator',
                role='leadership'
            )
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Default admin user created")
            
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    return True

def main():
    """Main function to start the server"""
    print("🚀 Starting Flask Backend Server...")
    print("📋 Configuration:")
    print(f"   - Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"   - Database: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Not configured')}")
    print(f"   - Host: 0.0.0.0")
    print(f"   - Port: 5000")
    print(f"   - Debug: True")
    print()
    
    # Create tables
    with app.app_context():
        if not create_tables():
            print("❌ Failed to create database tables. Exiting.")
            sys.exit(1)
    
    print("🌐 Frontend can connect from:")
    print("   - https://d7cc165f-e16d-47a0-a692-20276fa49a45.lovableproject.com")
    print("   - http://localhost:5173")
    print("   - http://localhost:3000")
    print()
    print("📡 API Base URL: http://localhost:5000/api")
    print("🔑 Default credentials: admin@zapcg.com / admin123")
    print()
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server error: {e}")

if __name__ == '__main__':
    main()