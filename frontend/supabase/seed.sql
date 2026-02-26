-- Sample data for places
INSERT INTO places (id, name, description, nearby_places, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Varanasi', 'Ancient city on the banks of Ganges, one of the oldest living cities in the world', '["22222222-2222-2222-2222-222222222222", "44444444-4444-4444-4444-444444444444"]', '/assets/varanasi.jpg'),
('22222222-2222-2222-2222-222222222222', 'Ayodhya', 'Birthplace of Lord Rama, a major pilgrimage site', '["11111111-1111-1111-1111-111111111111", "33333333-3333-3333-3333-333333333333"]', '/assets/ayodhya.jpg'),
('33333333-3333-3333-3333-333333333333', 'Mathura', 'Birthplace of Lord Krishna, land of temples', '["22222222-2222-2222-2222-222222222222", "44444444-4444-4444-4444-444444444444"]', '/assets/mathura.jpg'),
('44444444-4444-4444-4444-444444444444', 'Prayagraj', 'Confluence of three rivers, Kumbh Mela venue', '["11111111-1111-1111-1111-111111111111", "33333333-3333-3333-3333-333333333333"]', '/assets/prayagraj.jpg'),
('55555555-5555-5555-5555-555555555555', 'Haridwar', 'Gateway to the Himalayas, holy city on Ganges', '["66666666-6666-6666-6666-666666666666"]', '/assets/haridwar.jpg'),
('66666666-6666-6666-6666-666666666666', 'Rishikesh', 'Yoga capital of the world, spiritual retreat', '["55555555-5555-5555-5555-555555555555"]', '/assets/rishikesh.jpg');

-- Sample data for travel agents
INSERT INTO travel_agents (name, contact, place_id, email) VALUES
('Divine Tours & Travels', '+91-9876543210', '11111111-1111-1111-1111-111111111111', 'divine@tours.com'),
('Sacred Journey Travels', '+91-9876543211', '22222222-2222-2222-2222-222222222222', 'sacred@journey.com'),
('Krishna Travels', '+91-9876543212', '33333333-3333-3333-3333-333333333333', 'krishna@travels.com'),
('Ganga Travels', '+91-9876543213', '11111111-1111-1111-1111-111111111111', 'ganga@travels.com'),
('Himalayan Travels', '+91-9876543214', '55555555-5555-5555-5555-555555555555', 'himalayan@travels.com');

-- Sample data for rooms
INSERT INTO rooms (name, type, place_id, contact, price_per_night, availability_status, max_guests, amenities, image_url) VALUES
('AC Deluxe Room', 'AC Deluxe', '11111111-1111-1111-1111-111111111111', '+91-9876543220', 1500.00, 'available', 2, '["WiFi", "TV", "Hot Water", "Attached Bathroom"]', '/assets/ac-room.jpg'),
('Non-AC Room', 'Non-AC', '11111111-1111-1111-1111-111111111111', '+91-9876543220', 800.00, 'available', 2, '["Fan", "Attached Bathroom", "Hot Water"]', '/assets/non-ac-room.jpg'),
('Suite Room', 'Suite', '22222222-2222-2222-2222-222222222222', '+91-9876543221', 2500.00, 'available', 4, '["WiFi", "TV", "AC", "Mini Fridge", "Sofa"]', '/assets/suite-room.jpg'),
('Dormitory', 'Dormitory', '33333333-3333-3333-3333-333333333333', '+91-9876543222', 300.00, 'available', 6, '["Fans", "Shared Bathroom", "Lockers"]', '/assets/dormitory.jpg'),
('Premium Suite', 'Premium Suite', '22222222-2222-2222-2222-222222222222', '+91-9876543221', 3000.00, 'available', 4, '["WiFi", "TV", "AC", "Jacuzzi", "Premium Amenities"]', '/assets/premium-suite.jpg'),
('Budget Room', 'Budget', '33333333-3333-3333-3333-333333333333', '+91-9876543222', 500.00, 'available', 2, '["Fan", "Basic Amenities"]', '/assets/budget-room.jpg'),
('River View Room', 'AC Deluxe', '44444444-4444-4444-4444-444444444444', '+91-9876543223', 1800.00, 'available', 3, '["WiFi", "TV", "River View", "Balcony"]', '/assets/river-view.jpg'),
('Ganga View Suite', 'Suite', '55555555-5555-5555-5555-555555555555', '+91-9876543224', 2800.00, 'available', 4, '["WiFi", "TV", "AC", "Ganga View", "Prayer Room"]', '/assets/ganga-suite.jpg');

-- Sample data for tourist places
INSERT INTO tourist_places (name, type, place_id, open_hours, entry_fee, description, image_url) VALUES
('Kashi Vishwanath Temple', 'temple', '11111111-1111-1111-1111-111111111111', '3:00 AM - 11:00 PM', 0, 'One of the twelve Jyotirlingas, dedicated to Lord Shiva', '/assets/kashi-vishwanath.jpg'),
('Dashashwamedh Ghat', 'ghat', '11111111-1111-1111-1111-111111111111', 'Open 24 hours', 0, 'Famous ghat where Ganga Aarti is performed', '/assets/dashashwamedh-ghat.jpg'),
('Ram Janmabhoomi Temple', 'temple', '22222222-2222-2222-2222-222222222222', '6:00 AM - 9:00 PM', 0, 'Birthplace of Lord Rama', '/assets/ram-janmabhoomi.jpg'),
('Hanuman Garhi', 'temple', '22222222-2222-2222-2222-222222222222', '5:00 AM - 10:00 PM', 0, 'Ancient Hanuman temple with 76 steps', '/assets/hanuman-garhi.jpg'),
('Krishna Janmabhoomi', 'temple', '33333333-3333-3333-3333-333333333333', '5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM', 0, 'Birthplace of Lord Krishna', '/assets/krishna-janmabhoomi.jpg'),
('Dwarkadhish Temple', 'temple', '33333333-3333-3333-3333-333333333333', '4:30 AM - 12:30 PM, 5:00 PM - 9:30 PM', 0, 'Principal temple of Mathura dedicated to Lord Krishna', '/assets/dwarkadhish.jpg'),
('Triveni Sangam', 'pilgrimage site', '44444444-4444-4444-4444-444444444444', 'Open 24 hours', 0, 'Confluence of Ganga, Yamuna, and Saraswati', '/assets/triveni-sangam.jpg'),
('Har Ki Pauri', 'ghat', '55555555-5555-5555-5555-555555555555', 'Open 24 hours', 0, 'Sacred ghat where Ganga Aarti is performed', '/assets/har-ki-pauri.jpg'),
('Laxman Jhula', 'bridge', '66666666-6666-6666-6666-666666666666', 'Open 24 hours', 0, 'Iconic suspension bridge over Ganges', '/assets/laxman-jhula.jpg');

-- Sample data for vehicles
INSERT INTO vehicles (type, agent_id, vehicle_number, capacity, price_per_km, availability_status, image_url) VALUES
('Sedan', (SELECT id FROM travel_agents WHERE name = 'Divine Tours & Travels'), 'UP65AB1234', 4, 12.00, 'available', '/assets/sedan.jpg'),
('SUV', (SELECT id FROM travel_agents WHERE name = 'Divine Tours & Travels'), 'UP65CD5678', 7, 18.00, 'available', '/assets/suv.jpg'),
('Tempo Traveller', (SELECT id FROM travel_agents WHERE name = 'Sacred Journey Travels'), 'UP82EF9012', 12, 25.00, 'available', '/assets/tempo.jpg'),
('Mini Bus', (SELECT id FROM travel_agents WHERE name = 'Krishna Travels'), 'UP85GH3456', 18, 30.00, 'available', '/assets/mini-bus.jpg'),
('Luxury Bus', (SELECT id FROM travel_agents WHERE name = 'Ganga Travels'), 'UP70IJ7890', 40, 50.00, 'available', '/assets/luxury-bus.jpg'),
('Car', (SELECT id FROM travel_agents WHERE name = 'Himalayan Travels'), 'UK07KL1234', 5, 15.00, 'available', '/assets/car.jpg');

-- Sample data for poojas
INSERT INTO poojas (name, type, temple_place_id, timings, price, description, duration, image_url) VALUES
('Rudrabhishek', 'special', '11111111-1111-1111-1111-111111111111', '6:00 AM, 12:00 PM, 6:00 PM', 500.00, 'Special abhishek for Lord Shiva', '1 hour', '/assets/rudrabhishek.jpg'),
('Maha Aarti', 'daily', '11111111-1111-1111-1111-111111111111', '7:00 PM', 100.00, 'Grand evening aarti at the ghat', '45 minutes', '/assets/maha-aarti.jpg'),
('Archana', 'daily', '22222222-2222-2222-2222-222222222222', '6:00 AM - 8:00 PM (Hourly)', 100.00, 'Simple archana pooja to Lord Rama', '30 minutes', '/assets/archana.jpg'),
('Sunderkand Path', 'special', '22222222-2222-2222-2222-222222222222', '9:00 AM', 800.00, 'Recitation of Sunderkand from Ramayana', '2 hours', '/assets/sunderkand.jpg'),
('Abhishek', 'daily', '33333333-3333-3333-3333-333333333333', '5:00 AM, 9:00 AM, 6:00 PM', 200.00, 'Abhishek to Lord Krishna', '30 minutes', '/assets/abhishek.jpg'),
('Bhagwat Katha', 'special', '33333333-3333-3333-3333-333333333333', '10:00 AM', 1500.00, 'Recitation of Srimad Bhagavatam', '3 hours', '/assets/bhagwat.jpg'),
('Ganga Aarti', 'daily', '55555555-5555-5555-5555-555555555555', '6:00 PM', 0, 'Daily evening Ganga Aarti', '30 minutes', '/assets/ganga-aarti.jpg');

-- Sample data for packages
INSERT INTO packages (name, place_id, duration_days, price, description, highlights, image_url) VALUES
('Varanasi Spiritual Tour', '11111111-1111-1111-1111-111111111111', 3, 5999.00, '3 days spiritual journey in the holy city of Varanasi', '["Temple visits", "Ganga Aarti", "Boat ride", "Hotel stay", "Meals"]', '/assets/varanasi-tour.jpg'),
('Ayodhya Darshan', '22222222-2222-2222-2222-222222222222', 2, 4499.00, 'Complete Ayodhya pilgrimage package', '["Ram Janmabhoomi", "Hanuman Garhi", "Hotel stay", "Guide", "Meals"]', '/assets/ayodhya-tour.jpg'),
('Mathura Vrindavan Yatra', '33333333-3333-3333-3333-333333333333', 2, 3999.00, 'Divine journey to Krishna''s birthplace', '["Krishna temples", "Vrindavan visit", "Hotel stay", "Transport"]', '/assets/mathura-tour.jpg'),
('Prayagraj Pilgrimage', '44444444-4444-4444-4444-444444444444', 1, 2999.00, 'Day trip to Triveni Sangam and temples', '["Sangam bath", "Temple visits", "Lunch", "Transport"]', '/assets/prayagraj-tour.jpg'),
('Haridwar Rishikesh Combo', '55555555-5555-5555-5555-555555555555', 4, 7999.00, 'Complete spiritual experience in Uttarakhand', '["Har Ki Pauri", "Rishikesh", "Yoga session", "Hotels", "All meals"]', '/assets/haridwar-tour.jpg'),
('Char Dham Yatra', '55555555-5555-5555-5555-555555555555', 12, 45000.00, 'Complete Char Dham pilgrimage', '["4 sacred shrines", "Helicopter option", "Hotels", "Guide", "Full board"]', '/assets/char-dham.jpg');

-- Sample data for package_rooms (linking packages with rooms)
INSERT INTO package_rooms (package_id, room_id, nights) VALUES
((SELECT id FROM packages WHERE name = 'Varanasi Spiritual Tour'), (SELECT id FROM rooms WHERE name = 'AC Deluxe Room' AND place_id = '11111111-1111-1111-1111-111111111111'), 2),
((SELECT id FROM packages WHERE name = 'Ayodhya Darshan'), (SELECT id FROM rooms WHERE name = 'Suite Room'), 1),
((SELECT id FROM packages WHERE name = 'Mathura Vrindavan Yatra'), (SELECT id FROM rooms WHERE name = 'Dormitory'), 1),
((SELECT id FROM packages WHERE name = 'Haridwar Rishikesh Combo'), (SELECT id FROM rooms WHERE name = 'Ganga View Suite'), 3);

-- Sample data for package_places (linking packages with tourist places)
INSERT INTO package_places (package_id, tourist_place_id, visit_order) VALUES
((SELECT id FROM packages WHERE name = 'Varanasi Spiritual Tour'), (SELECT id FROM tourist_places WHERE name = 'Kashi Vishwanath Temple'), 1),
((SELECT id FROM packages WHERE name = 'Varanasi Spiritual Tour'), (SELECT id FROM tourist_places WHERE name = 'Dashashwamedh Ghat'), 2),
((SELECT id FROM packages WHERE name = 'Ayodhya Darshan'), (SELECT id FROM tourist_places WHERE name = 'Ram Janmabhoomi Temple'), 1),
((SELECT id FROM packages WHERE name = 'Ayodhya Darshan'), (SELECT id FROM tourist_places WHERE name = 'Hanuman Garhi'), 2),
((SELECT id FROM packages WHERE name = 'Mathura Vrindavan Yatra'), (SELECT id FROM tourist_places WHERE name = 'Krishna Janmabhoomi'), 1),
((SELECT id FROM packages WHERE name = 'Mathura Vrindavan Yatra'), (SELECT id FROM tourist_places WHERE name = 'Dwarkadhish Temple'), 2),
((SELECT id FROM packages WHERE name = 'Prayagraj Pilgrimage'), (SELECT id FROM tourist_places WHERE name = 'Triveni Sangam'), 1),
((SELECT id FROM packages WHERE name = 'Haridwar Rishikesh Combo'), (SELECT id FROM tourist_places WHERE name = 'Har Ki Pauri'), 1),
((SELECT id FROM packages WHERE name = 'Haridwar Rishikesh Combo'), (SELECT id FROM tourist_places WHERE name = 'Laxman Jhula'), 2);
