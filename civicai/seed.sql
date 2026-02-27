-- seed.sql: Comprehensive structured mock data for SewaSetu Indore Demonstration

-- 1. Departments Setup
INSERT INTO departments (id, name, description, sla_hours) VALUES
('11111111-0000-0000-0000-000000000001', 'Roads', 'Road infrastructure, potholes, road blocks', 48),
('11111111-0000-0000-0000-000000000002', 'Electricity', 'Power outages, live wires, street lights', 24),
('11111111-0000-0000-0000-000000000003', 'Sanitation', 'Waste collection, sewage, animal control', 48),
('11111111-0000-0000-0000-000000000004', 'Water', 'Water supply pipelines, contamination', 24)
ON CONFLICT DO NOTHING;

-- 2. Users (1 Citizen, 4 Officers)
INSERT INTO users (id, full_name, email, password_hash, role, department_id, phone) VALUES
('22222222-0000-0000-0000-000000000001', 'Aarav Sharma', 'aarav@example.com', 'hashed_pwd_example', 'citizen', NULL, '9876543210'),
('22222222-0000-0000-0000-000000000003', 'Ramesh (Roads)', 'ramesh.roads@sewasetu.gov.in', 'hashed_pwd_example', 'officer', '11111111-0000-0000-0000-000000000001', '9876543212'),
('22222222-0000-0000-0000-000000000004', 'Sunita (Power)', 'sunita.power@sewasetu.gov.in', 'hashed_pwd_example', 'officer', '11111111-0000-0000-0000-000000000002', '9876543213'),
('22222222-0000-0000-0000-000000000005', 'Vikram (Waste)', 'vikram.waste@sewasetu.gov.in', 'hashed_pwd_example', 'officer', '11111111-0000-0000-0000-000000000003', '9876543214'),
('22222222-0000-0000-0000-000000000006', 'Aditi (Water)', 'aditi.water@sewasetu.gov.in', 'hashed_pwd_example', 'officer', '11111111-0000-0000-0000-000000000004', '9876543215')
ON CONFLICT (email) DO NOTHING;

-- 3 & 4. Complaints & AI Analysis

-- --- ROADS DEPARTMENT ---
INSERT INTO complaints (id, citizen_id, department_id, title, description, latitude, longitude, priority_level, status) VALUES
('33333333-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Massive Pothole', 'Deep pothole causing vehicle damage near Vijay Nagar Square. Needs immediate repair.', 22.7533, 75.8937, 'high', 'pending'),
('33333333-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Broken Divider', 'Traffic divider collapsed at Palasia intersection.', 22.7244, 75.8839, 'medium', 'in_progress'),
('33333333-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Fallen Tree on Road', 'Large tree blocking two lanes of AB Road traffic.', 22.7150, 75.8900, 'critical', 'pending'),
('33333333-0000-0000-0000-000000000013', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Missing Manhole Cover', 'Open manhole in the middle of LIG Link Road. High hazard.', 22.7300, 75.8750, 'critical', 'pending'),
('33333333-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Warped Asphalt', 'Road surface is heavily warped near Bengali Square causing skidding.', 22.7120, 75.8980, 'medium', 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO complaint_ai_analysis (id, complaint_id, category, sub_category, sentiment_score, risk_score, escalation_score, ai_summary, suggested_action) VALUES
('44444444-0000-0000-0000-000000000010', '33333333-0000-0000-0000-000000000010', 'Roads', 'Pothole', -0.7, 75, 65, 'Deep pothole causing vehicle damage.', 'Dispatch asphalt unit for patching.'),
('44444444-0000-0000-0000-000000000011', '33333333-0000-0000-0000-000000000011', 'Roads', 'Infrastructure', -0.4, 50, 40, 'Traffic divider collapsed at intersection.', 'Schedule masonry crew for next week.'),
('44444444-0000-0000-0000-000000000012', '33333333-0000-0000-0000-000000000012', 'Roads', 'Obstruction', -0.9, 90, 85, 'Large tree blocking two lanes of highway traffic.', 'Deploy heavy machinery lifting crew immediately.'),
('44444444-0000-0000-0000-000000000013', '33333333-0000-0000-0000-000000000013', 'Roads', 'Safety Hazard', -0.95, 95, 90, 'Open manhole in traffic lane.', 'Emergency barricade placement. Missing cover replacement.'),
('44444444-0000-0000-0000-000000000014', '33333333-0000-0000-0000-000000000014', 'Roads', 'Surface Defect', -0.5, 45, 30, 'Road surface warped causing minor skidding.', 'Add to routine surfacing schedule.')
ON CONFLICT DO NOTHING;


-- --- ELECTRICITY DEPARTMENT ---
INSERT INTO complaints (id, citizen_id, department_id, title, description, latitude, longitude, priority_level, status) VALUES
('33333333-0000-0000-0000-000000000020', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'Live Wire Down', 'Live electrical wire sparking on the sidewalk near Rajwada.', 22.7180, 75.8550, 'critical', 'pending'),
('33333333-0000-0000-0000-000000000021', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'Streetlight Outage', 'Entire block pitch black near MY Hospital, very unsafe.', 22.7120, 75.8647, 'high', 'in_progress'),
('33333333-0000-0000-0000-000000000022', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'Transformer Sparking', 'Heavy sparks flying from the colony transformer in South Tukoganj.', 22.7210, 75.8750, 'critical', 'pending'),
('33333333-0000-0000-0000-000000000023', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'Low Voltage', 'Consistent low voltage affecting appliances in scheme 140.', 22.7350, 75.9050, 'low', 'pending'),
('33333333-0000-0000-0000-000000000024', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'Meter Box Open', 'The main meter box is wide open to the rain in Annapurna.', 22.7050, 75.8500, 'medium', 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO complaint_ai_analysis (id, complaint_id, category, sub_category, sentiment_score, risk_score, escalation_score, ai_summary, suggested_action) VALUES
('44444444-0000-0000-0000-000000000020', '33333333-0000-0000-0000-000000000020', 'Electricity', 'Live Wire', -0.95, 100, 98, 'Live wire sparking on pedestrian path.', 'Dispatch emergency cutoff team immediately. Extremely lethal.'),
('44444444-0000-0000-0000-000000000021', '33333333-0000-0000-0000-000000000021', 'Electricity', 'Streetlight', -0.6, 60, 50, 'Streetlights out near hospital making it unsafe at night.', 'Replace bulbs/check wiring on Hospital road grid.'),
('44444444-0000-0000-0000-000000000022', '33333333-0000-0000-0000-000000000022', 'Electricity', 'Transformer', -0.85, 95, 88, 'Transformer sparking heavily.', 'Immediate engineer inspection required. Fire risk.'),
('44444444-0000-0000-0000-000000000023', '33333333-0000-0000-0000-000000000023', 'Electricity', 'Power Quality', -0.3, 20, 15, 'Low voltage reported by residents in locality.', 'Send grid balancing team over next 72 hours.'),
('44444444-0000-0000-0000-000000000024', '33333333-0000-0000-0000-000000000024', 'Electricity', 'Equipment Safety', -0.5, 45, 35, 'Meter box exposed to weather.', 'Secure enclosure to prevent short circuit.')
ON CONFLICT DO NOTHING;


-- --- SANITATION DEPARTMENT ---
INSERT INTO complaints (id, citizen_id, department_id, title, description, latitude, longitude, priority_level, status) VALUES
('33333333-0000-0000-0000-000000000030', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'Uncollected Garbage', 'Garbage piled up for a week at Geeta Bhawan.', 22.7150, 75.8950, 'medium', 'pending'),
('33333333-0000-0000-0000-000000000031', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'Sewage Overflow', 'Raw sewage spilling onto the street near LIG Square.', 22.7300, 75.8800, 'critical', 'pending'),
('33333333-0000-0000-0000-000000000032', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'Dead Animal', 'Dead dog rotting on side of ring road for 2 days.', 22.7500, 75.9100, 'high', 'in_progress'),
('33333333-0000-0000-0000-000000000033', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'Public Toilet Unclean', 'Sulabh Shauchalaya in absolutely filthy state.', 22.7200, 75.8600, 'low', 'pending'),
('33333333-0000-0000-0000-000000000034', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'Stray Pig Menace', 'Herd of pigs terrorizing residents and ripping garbage bags in scheme 78.', 22.7600, 75.8850, 'medium', 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO complaint_ai_analysis (id, complaint_id, category, sub_category, sentiment_score, risk_score, escalation_score, ai_summary, suggested_action) VALUES
('44444444-0000-0000-0000-000000000030', '33333333-0000-0000-0000-000000000030', 'Sanitation', 'Waste Collection', -0.6, 40, 35, 'Garbage pile buildup for one week.', 'Schedule heavy dump vehicle route deviation.'),
('44444444-0000-0000-0000-000000000031', '33333333-0000-0000-0000-000000000031', 'Sanitation', 'Sewage Leak', -0.9, 90, 85, 'Raw sewage overflowing to the street.', 'Dispatch hydro-vac suction truck immediately. Biohazard.'),
('44444444-0000-0000-0000-000000000032', '33333333-0000-0000-0000-000000000032', 'Sanitation', 'Biohazard', -0.8, 70, 60, 'Dead animal remains decomposing on public road.', 'Biological waste disposal team required.'),
('44444444-0000-0000-0000-000000000033', '33333333-0000-0000-0000-000000000033', 'Sanitation', 'Facility Maintenance', -0.7, 30, 20, 'Public toilet hygiene severely degraded.', 'Fine the contracted cleaning company and dispatch inspector.'),
('44444444-0000-0000-0000-000000000034', '33333333-0000-0000-0000-000000000034', 'Sanitation', 'Animal Control', -0.5, 45, 40, 'Stray pigs destroying public sanitation.', 'Alert municipal animal catchment unit.')
ON CONFLICT DO NOTHING;


-- --- WATER DEPARTMENT ---
INSERT INTO complaints (id, citizen_id, department_id, title, description, latitude, longitude, priority_level, status) VALUES
('33333333-0000-0000-0000-000000000040', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'Pipe Burst', 'Narmada line pipe burst, millions of gallons wasting on ring road.', 22.7550, 75.9200, 'critical', 'pending'),
('33333333-0000-0000-0000-000000000041', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'Contaminated Supply', 'Black foul smelling water coming from domestic taps in Nipania.', 22.7650, 75.9000, 'critical', 'pending'),
('33333333-0000-0000-0000-000000000042', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'No Supply', 'No water supply for 4 days straight in Sudama Nagar.', 22.6850, 75.8400, 'high', 'in_progress'),
('33333333-0000-0000-0000-000000000043', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'Low Pressure', 'Extremely low pipeline pressure for weeks in Sindhi Colony.', 22.7300, 75.8600, 'medium', 'pending'),
('33333333-0000-0000-0000-000000000044', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'Illegal Tapping', 'Commercial building illegally tapping into residential borewell line.', 22.7250, 75.8750, 'medium', 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO complaint_ai_analysis (id, complaint_id, category, sub_category, sentiment_score, risk_score, escalation_score, ai_summary, suggested_action) VALUES
('44444444-0000-0000-0000-000000000040', '33333333-0000-0000-0000-000000000040', 'Water', 'Pipeline Damage', -0.85, 95, 90, 'Main structural pipe burst causing massive water loss.', 'Immediate cutoff of upstream valve and dispatch pump repair crew.'),
('44444444-0000-0000-0000-000000000041', '33333333-0000-0000-0000-000000000041', 'Water', 'Contamination', -0.98, 100, 100, 'Toxic public water supply reported via domestic taps.', 'Severe Health Crisis. Halt supply immediately. Send tankards.'),
('44444444-0000-0000-0000-000000000042', '33333333-0000-0000-0000-000000000042', 'Water', 'Supply Shortage', -0.7, 75, 70, 'Extended multi-day outage of residential water supply.', 'Investigate zonal pressure station fault.'),
('44444444-0000-0000-0000-000000000043', '33333333-0000-0000-0000-000000000043', 'Water', 'Pressure Deficit', -0.4, 30, 25, 'Persistent low water pressure in affected zone.', 'Assign surveyor to check line blockages or pump failures.'),
('44444444-0000-0000-0000-000000000044', '33333333-0000-0000-0000-000000000044', 'Water', 'Theft', -0.6, 50, 45, 'Unauthorized connections sapping public utility line.', 'Dispatch vigilance officer to penalize and disconnect.')
ON CONFLICT DO NOTHING;
