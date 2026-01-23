insert into thresholds (title, description, category, target_count, current_count) values
-- Original 5 thresholds
('Hospital AI Transparency', 'Hospital systems must publish AI decision-making audit logs', 'Healthcare', 10000, 4721),
('Right to Repair', 'Manufacturers must provide repair documentation for all products', 'Consumer Rights', 5000, 2103),
('Climate Disclosure', 'Companies over $1B revenue must disclose full carbon footprint', 'Climate', 25000, 18420),
('Algorithm Accountability', 'Social platforms must explain why content is shown to users', 'Technology', 15000, 6892),
('Living Wage Standard', 'All employers must pay at least 150% of local poverty line', 'Labor', 50000, 31205),

-- Education (3 new)
('Student Loan Interest Cap', 'Federal student loan interest rates must be capped at 3% APR', 'Education', 75000, 42150),
('Free School Meals', 'All public schools must provide free breakfast and lunch to every student', 'Education', 100000, 67890),
('Teacher Pay Floor', 'Public school teachers must earn at least $60,000 annually', 'Education', 80000, 38420),

-- Climate (3 new)
('Single-Use Plastic Ban', 'Ban single-use plastic packaging in retail stores nationwide', 'Climate', 150000, 89340),
('EV Charging Infrastructure', 'Require EV charging stations at all new construction over 50 parking spots', 'Climate', 60000, 23150),
('Ocean Protection Zones', 'Designate 30% of coastal waters as protected marine sanctuaries', 'Climate', 200000, 156780),

-- Healthcare (2 new)
('Drug Price Transparency', 'Pharmaceutical companies must disclose full cost breakdown for medications over $100', 'Healthcare', 120000, 78920),
('Mental Health Parity', 'Insurance must cover mental health services equal to physical health', 'Healthcare', 90000, 62410),

-- Technology (3 new)
('Personal Data Ownership', 'Users must have full ownership and portability of their personal data', 'Technology', 180000, 134560),
('AI Content Disclosure', 'All AI-generated content must be clearly labeled as such', 'Technology', 75000, 31240),
('Net Neutrality Guarantee', 'ISPs must treat all internet traffic equally without throttling or prioritization', 'Technology', 100000, 89120),

-- Labor/Housing (4 new)
('Rent Increase Cap', 'Annual rent increases must be limited to 5% in areas with housing shortages', 'Housing', 200000, 167430),
('First-Time Buyer Fund', 'Government must provide matching funds up to $20K for first-time home buyers', 'Housing', 150000, 89650),
('Subscription Transparency', 'Companies must send annual cost summaries and easy one-click cancellation', 'Consumer Rights', 50000, 43210),
('Extended Warranty Standards', 'Electronics must include minimum 2-year warranties by default', 'Consumer Rights', 40000, 21890);
