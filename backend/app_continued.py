
# Continuation of app.py - Project endpoints

@app.route('/api/projects', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_projects():
    projects = Project.query.all()
    return jsonify([{
        'id': p.id,
        'project_code': p.project_code,
        'project_name': p.project_name,
        'client_name': p.client_name,
        'project_manager': p.project_manager,
        'start_date': p.start_date.isoformat() if p.start_date else None,
        'end_date': p.end_date.isoformat() if p.end_date else None,
        'status': p.status,
        'project_type': p.project_type,
        'budget': float(p.budget) if p.budget else None,
        'actual_cost': float(p.actual_cost) if p.actual_cost else None,
        'revenue': float(p.revenue) if p.revenue else None
    } for p in projects])

@app.route('/api/projects', methods=['POST'])
@role_required(['resource_manager'], 'write')
def create_project():
    data = request.get_json()
    
    project = Project(
        project_code=data['project_code'],
        project_name=data['project_name'],
        client_name=data.get('client_name'),
        project_manager=data.get('project_manager'),
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data.get('start_date') else None,
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
        status=data.get('status'),
        project_type=data.get('project_type'),
        budget=data.get('budget'),
        actual_cost=data.get('actual_cost'),
        revenue=data.get('revenue')
    )
    
    db.session.add(project)
    db.session.commit()
    
    return jsonify({'message': 'Project created successfully'}), 201

@app.route('/api/projects/<int:id>', methods=['PUT'])
@role_required(['resource_manager'], 'write')
def update_project(id):
    project = Project.query.get_or_404(id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(project, key):
            if key in ['start_date', 'end_date'] and value:
                setattr(project, key, datetime.strptime(value, '%Y-%m-%d').date())
            else:
                setattr(project, key, value)
    
    db.session.commit()
    return jsonify({'message': 'Project updated successfully'})

# Project Milestones endpoints
@app.route('/api/project-milestones', methods=['GET'])
@role_required(['leadership', 'delivery_owner'], 'read')
def get_project_milestones():
    project_id = request.args.get('project_id')
    
    query = ProjectMilestone.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    
    milestones = query.all()
    
    return jsonify([{
        'id': m.id,
        'project_id': m.project_id,
        'milestone_name': m.milestone_name,
        'description': m.description,
        'planned_date': m.planned_date.isoformat() if m.planned_date else None,
        'actual_date': m.actual_date.isoformat() if m.actual_date else None,
        'status': m.status,
        'completion_percentage': float(m.completion_percentage) if m.completion_percentage else None
    } for m in milestones])

# Financials endpoints (Finance Head only)
@app.route('/api/financials', methods=['GET'])
@role_required(['leadership', 'finance_head'], 'read')
def get_financials():
    financials = Financials.query.all()
    
    # For leadership role, exclude sensitive financial details
    if g.current_user.role == 'leadership':
        return jsonify([{
            'id': f.id,
            'project_id': f.project_id,
            'month_year': f.month_year.isoformat(),
            'revenue': float(f.revenue) if f.revenue else None,
            'margin': float(f.margin) if f.margin else None
            # Exclude cost, invoiced_amount, collected_amount for leadership
        } for f in financials])
    
    return jsonify([{
        'id': f.id,
        'project_id': f.project_id,
        'month_year': f.month_year.isoformat(),
        'revenue': float(f.revenue) if f.revenue else None,
        'cost': float(f.cost) if f.cost else None,
        'margin': float(f.margin) if f.margin else None,
        'invoiced_amount': float(f.invoiced_amount) if f.invoiced_amount else None,
        'collected_amount': float(f.collected_amount) if f.collected_amount else None
    } for f in financials])

@app.route('/api/financials', methods=['POST'])
@role_required(['finance_head'], 'write')
def create_financial():
    data = request.get_json()
    
    financial = Financials(
        project_id=data['project_id'],
        month_year=datetime.strptime(data['month_year'], '%Y-%m-%d').date(),
        revenue=data.get('revenue'),
        cost=data.get('cost'),
        margin=data.get('margin'),
        invoiced_amount=data.get('invoiced_amount'),
        collected_amount=data.get('collected_amount')
    )
    
    db.session.add(financial)
    db.session.commit()
    
    return jsonify({'message': 'Financial record created successfully'}), 201

@app.route('/api/financials/<int:id>', methods=['PUT'])
@role_required(['finance_head'], 'write')
def update_financial(id):
    financial = Financials.query.get_or_404(id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(financial, key):
            if key == 'month_year' and value:
                setattr(financial, key, datetime.strptime(value, '%Y-%m-%d').date())
            else:
                setattr(financial, key, value)
    
    db.session.commit()
    return jsonify({'message': 'Financial record updated successfully'})

@app.route('/api/financials/<int:id>', methods=['DELETE'])
@role_required(['finance_head'], 'write')
def delete_financial(id):
    financial = Financials.query.get_or_404(id)
    db.session.delete(financial)
    db.session.commit()
    return jsonify({'message': 'Financial record deleted successfully'})

# Bench Costing endpoints
@app.route('/api/bench-costing', methods=['GET'])
@role_required(['leadership', 'finance_head'], 'read')
def get_bench_costing():
    bench_costs = BenchCosting.query.all()
    return jsonify([{
        'id': bc.id,
        'resource_id': bc.resource_id,
        'month_year': bc.month_year.isoformat(),
        'bench_cost': float(bc.bench_cost) if bc.bench_cost else None,
        'bench_days': bc.bench_days,
        'cost_center': bc.cost_center
    } for bc in bench_costs])

@app.route('/api/bench-costing', methods=['POST'])
@role_required(['finance_head'], 'write')
def create_bench_cost():
    data = request.get_json()
    
    bench_cost = BenchCosting(
        resource_id=data['resource_id'],
        month_year=datetime.strptime(data['month_year'], '%Y-%m-%d').date(),
        bench_cost=data.get('bench_cost'),
        bench_days=data.get('bench_days'),
        cost_center=data.get('cost_center')
    )
    
    db.session.add(bench_cost)
    db.session.commit()
    
    return jsonify({'message': 'Bench cost record created successfully'}), 201

# Project Allocations endpoints
@app.route('/api/project-allocations', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_project_allocations():
    allocations = ProjectAllocation.query.all()
    return jsonify([{
        'id': a.id,
        'project_id': a.project_id,
        'resource_id': a.resource_id,
        'allocation_percentage': float(a.allocation_percentage) if a.allocation_percentage else None,
        'start_date': a.start_date.isoformat() if a.start_date else None,
        'end_date': a.end_date.isoformat() if a.end_date else None,
        'role_in_project': a.role_in_project,
        'status': a.status
    } for a in allocations])

@app.route('/api/project-allocations', methods=['POST'])
@role_required(['resource_manager'], 'write')
def create_project_allocation():
    data = request.get_json()
    
    allocation = ProjectAllocation(
        project_id=data['project_id'],
        resource_id=data['resource_id'],
        allocation_percentage=data.get('allocation_percentage'),
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data.get('start_date') else None,
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
        role_in_project=data.get('role_in_project'),
        status=data.get('status')
    )
    
    db.session.add(allocation)
    db.session.commit()
    
    return jsonify({'message': 'Project allocation created successfully'}), 201

# Updated Escalations endpoints with simplified schema
@app.route('/api/escalations', methods=['GET'])
@role_required(['leadership', 'resource_manager', 'delivery_owner'], 'read')
def get_escalations():
    escalations = Escalation.query.all()
    return jsonify([{
        'id': e.id,
        'title': e.title,
        'description': e.description,
        'customer': e.customer,
        'project_owner': e.project_owner,
        'priority': e.priority,
        'status': e.status,
        'date_raised': e.date_raised.isoformat() if e.date_raised else None,
        'resolution_eta': e.resolution_eta.isoformat() if e.resolution_eta else None,
        'impact_assessment': e.impact_assessment,
        'actions_taken': e.actions_taken,
        'created_at': e.created_at.isoformat()
    } for e in escalations])

@app.route('/api/escalations', methods=['POST'])
@role_required(['resource_manager', 'delivery_owner'], 'write')
def create_escalation():
    data = request.get_json()
    
    escalation = Escalation(
        title=data['title'],
        description=data.get('description'),
        customer=data['customer'],
        project_owner=data['project_owner'],
        priority=data.get('priority', 'medium'),
        status=data.get('status', 'open'),
        date_raised=datetime.strptime(data['date_raised'], '%Y-%m-%d').date() if data.get('date_raised') else datetime.now().date(),
        resolution_eta=datetime.strptime(data['resolution_eta'], '%Y-%m-%d').date() if data.get('resolution_eta') else None,
        impact_assessment=data.get('impact_assessment'),
        actions_taken=data.get('actions_taken')
    )
    
    db.session.add(escalation)
    db.session.commit()
    
    return jsonify({'message': 'Escalation created successfully'}), 201

@app.route('/api/escalations/<int:id>', methods=['PUT'])
@role_required(['resource_manager', 'delivery_owner'], 'write')
def update_escalation(id):
    escalation = Escalation.query.get_or_404(id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(escalation, key):
            if key in ['date_raised', 'resolution_eta'] and value:
                setattr(escalation, key, datetime.strptime(value, '%Y-%m-%d').date())
            else:
                setattr(escalation, key, value)
    
    db.session.commit()
    return jsonify({'message': 'Escalation updated successfully'})

@app.route('/api/escalations/<int:id>', methods=['DELETE'])
@role_required(['resource_manager', 'delivery_owner'], 'write')
def delete_escalation(id):
    escalation = Escalation.query.get_or_404(id)
    db.session.delete(escalation)
    db.session.commit()
    return jsonify({'message': 'Escalation deleted successfully'})

# KPI endpoints (read-only for most roles)
@app.route('/api/kpis/summary', methods=['GET'])
@role_required(['leadership', 'finance_head', 'resource_manager', 'delivery_owner'], 'read')
def get_kpi_summary():
    # Calculate various KPIs based on user role
    
    # Basic KPIs available to all roles
    total_resources = Resource.query.count()
    active_projects = Project.query.filter_by(status='active').count()
    
    # Role-specific KPI calculations
    kpis = {
        'total_resources': total_resources,
        'active_projects': active_projects,
        'billable_resources': Resource.query.filter_by(resource_type='billable').count(),
        'bench_resources': Resource.query.filter_by(status='bench').count()
    }
    
    # Financial KPIs only for authorized roles
    if g.current_user.role in ['leadership', 'finance_head']:
        current_month = datetime.now().date().replace(day=1)
        financial_data = Financials.query.filter_by(month_year=current_month).first()
        
        if financial_data:
            kpis.update({
                'monthly_revenue': float(financial_data.revenue) if financial_data.revenue else 0,
                'monthly_cost': float(financial_data.cost) if financial_data.cost else 0,
                'monthly_margin': float(financial_data.margin) if financial_data.margin else 0
            })
    
    return jsonify(kpis)

# Database initialization
@app.before_first_request
def create_tables():
    db.create_all()
    
    # Create default admin user if it doesn't exist
    if not User.query.filter_by(email='admin@zapcg.com').first():
        admin_user = User(
            email='admin@zapcg.com',
            password_hash=generate_password_hash('admin123'),
            name='System Administrator',
            role='leadership'
        )
        db.session.add(admin_user)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
