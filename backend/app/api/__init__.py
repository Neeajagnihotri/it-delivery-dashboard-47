
from flask import Blueprint

api_bp = Blueprint('api', __name__)

# Import all route modules to register them
from app.api import (
    auth, 
    health, 
    resources, 
    projects, 
    escalations, 
    financials, 
    kpis,
    project_allocations,
    skills,
    personal_info,
    resignations
)
