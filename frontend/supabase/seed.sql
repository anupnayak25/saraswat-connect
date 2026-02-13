-- Sample data for rooms
INSERT INTO rooms (name, description, price, max_guests, is_ac, image_url, amenities) VALUES
('AC Deluxe Room', 'Comfortable air-conditioned room with modern amenities', 1500.00, 2, true, '/assets/ac-room.jpg', '["WiFi", "TV", "Hot Water", "Attached Bathroom"]'),
('Non-AC Room', 'Simple and clean room for budget travelers', 800.00, 2, false, '/assets/non-ac-room.jpg', '["Fan", "Attached Bathroom", "Hot Water"]'),
('Suite Room', 'Spacious suite with separate living area', 2500.00, 4, true, '/assets/suite-room.jpg', '["WiFi", "TV", "AC", "Mini Fridge", "Sofa", "Hot Water"]'),
('Dormitory', 'Shared accommodation for groups', 300.00, 6, false, '/assets/dormitory.jpg', '["Fans", "Shared Bathroom", "Lockers"]');

-- Sample data for vehicles
INSERT INTO vehicles (name, description, price_per_km, vehicle_type, seats, image_url) VALUES
('Sedan', 'Comfortable sedan for small groups', 12.00, 'Car', 4, '/assets/sedan.jpg'),
('Mini Bus', 'Perfect for medium-sized groups', 20.00, 'Bus', 18, '/assets/mini-bus.jpg'),
('SUV', 'Spacious SUV for families', 18.00, 'Car', 7, '/assets/suv.jpg'),
('Luxury Bus', 'Large luxury bus for big groups', 35.00, 'Bus', 40, '/assets/luxury-bus.jpg');

-- Sample data for poojas
INSERT INTO poojas (name, description, price, duration, image_url) VALUES
('Saraswati Pooja', 'Special pooja dedicated to Goddess Saraswati', 500.00, '2 hours', '/assets/saraswati-pooja.jpg'),
('Abhishekam', 'Traditional abhishekam ritual', 200.00, '1 hour', '/assets/abhishekam.jpg'),
('Archana', 'Simple archana pooja', 100.00, '30 minutes', '/assets/archana.jpg'),
('Special Darshan', 'VIP darshan with special blessings', 300.00, '1 hour', '/assets/special-darshan.jpg'),
('Maha Pooja', 'Grand pooja ceremony', 1500.00, '3 hours', '/assets/maha-pooja.jpg'),
('Navagraha Pooja', 'Nine planets pooja for prosperity', 800.00, '2 hours', '/assets/navagraha.jpg');

-- Sample data for tour packages
INSERT INTO tour_packages (name, description, price, days, nights, image_url, highlights) VALUES
('Spiritual Darshan Tour', 'Visit sacred temples with expert guides', 5999.00, 3, 2, '/assets/spiritual-tour.jpg', '["Temple visits", "Guided tours", "Accommodation", "Meals included"]'),
('Hill Station Yatra', 'Spiritual journey to hill temples', 4499.00, 2, 1, '/assets/hill-station.jpg', '["Hill temple", "Scenic views", "Hotel stay", "Breakfast included"]'),
('Pilgrimage Special', 'Complete pilgrimage package', 7999.00, 4, 3, '/assets/pilgrimage.jpg', '["Multiple temples", "AC bus", "3-star hotel", "All meals"]'),
('Weekend Temple Tour', 'Perfect weekend getaway', 3999.00, 2, 1, '/assets/weekend-tour.jpg', '["2 temple visits", "Transport", "Lunch", "Guide"]'),
('Divine Expedition', 'Premium spiritual experience', 12999.00, 5, 4, '/assets/expedition.jpg', '["5 sacred temples", "Luxury stay", "Full board", "Private vehicle"]'),
('Heritage Temple Circuit', 'Explore ancient temple architecture', 6499.00, 3, 2, '/assets/heritage.jpg', '["Ancient temples", "Cultural shows", "Hotel stay", "Meals"]');
