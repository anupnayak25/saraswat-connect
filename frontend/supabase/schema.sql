-- Create tables for Saraswath Connect

-- Rooms table
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  max_guests INTEGER NOT NULL,
  amenities JSONB,
  image_url TEXT,
  is_ac BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_per_km DECIMAL(10, 2) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL, -- 'Car', 'Bus', 'SUV'
  seats INTEGER NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Poojas table
CREATE TABLE poojas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(50), -- e.g., '2 hours', '30 minutes'
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tour Packages table
CREATE TABLE tour_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  days INTEGER NOT NULL,
  nights INTEGER NOT NULL,
  highlights JSONB,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Room Bookings table
CREATE TABLE room_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  room_id UUID REFERENCES rooms(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Bookings table
CREATE TABLE vehicle_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  booking_date DATE NOT NULL,
  pickup_location VARCHAR(255),
  drop_location VARCHAR(255),
  estimated_km DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pooja Bookings table
CREATE TABLE pooja_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  pooja_id UUID REFERENCES poojas(id),
  booking_date DATE NOT NULL,
  booking_time TIME,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tour Package Bookings table
CREATE TABLE tour_package_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  package_id UUID REFERENCES tour_packages(id),
  booking_date DATE NOT NULL,
  number_of_travelers INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'read', 'replied'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE poojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pooja_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_package_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public read access for rooms, vehicles, poojas, and tour packages
CREATE POLICY "Public read access for rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read access for vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public read access for poojas" ON poojas FOR SELECT USING (true);
CREATE POLICY "Public read access for tour packages" ON tour_packages FOR SELECT USING (true);

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can manage their own bookings
CREATE POLICY "Users can read own room bookings" ON room_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create room bookings" ON room_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own room bookings" ON room_bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own vehicle bookings" ON vehicle_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create vehicle bookings" ON vehicle_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vehicle bookings" ON vehicle_bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own pooja bookings" ON pooja_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create pooja bookings" ON pooja_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pooja bookings" ON pooja_bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own tour package bookings" ON tour_package_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tour package bookings" ON tour_package_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tour package bookings" ON tour_package_bookings FOR UPDATE USING (auth.uid() = user_id);

-- Anyone can create contact messages
CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_room_bookings_user_id ON room_bookings(user_id);
CREATE INDEX idx_room_bookings_room_id ON room_bookings(room_id);
CREATE INDEX idx_room_bookings_dates ON room_bookings(check_in_date, check_out_date);

CREATE INDEX idx_vehicle_bookings_user_id ON vehicle_bookings(user_id);
CREATE INDEX idx_vehicle_bookings_vehicle_id ON vehicle_bookings(vehicle_id);
CREATE INDEX idx_vehicle_bookings_date ON vehicle_bookings(booking_date);

CREATE INDEX idx_pooja_bookings_user_id ON pooja_bookings(user_id);
CREATE INDEX idx_pooja_bookings_pooja_id ON pooja_bookings(pooja_id);
CREATE INDEX idx_pooja_bookings_date ON pooja_bookings(booking_date);

CREATE INDEX idx_tour_package_bookings_user_id ON tour_package_bookings(user_id);
CREATE INDEX idx_tour_package_bookings_package_id ON tour_package_bookings(package_id);
CREATE INDEX idx_tour_package_bookings_date ON tour_package_bookings(booking_date);
