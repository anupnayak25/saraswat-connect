-- Create tables for Temple Management System

-- Places table - stores all religious/tourist locations
CREATE TABLE places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  nearby_places JSONB, -- Array of place IDs for recommendations
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Travel Agents table
CREATE TABLE travel_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(255) NOT NULL,
  place_id UUID REFERENCES places(id) ON DELETE SET NULL,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table - accommodations at specific places
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100), -- 'AC Deluxe', 'Non-AC', 'Suite', 'Dormitory'
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  contact VARCHAR(255),
  price_per_night DECIMAL(10, 2) NOT NULL,
  availability_status VARCHAR(50) DEFAULT 'available', -- 'available', 'booked', 'maintenance'
  max_guests INTEGER,
  amenities JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tourist Places table - attractions at locations
CREATE TABLE tourist_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100), -- 'temple', 'museum', 'historical site', etc.
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  open_hours VARCHAR(100),
  entry_fee DECIMAL(10, 2) DEFAULT 0,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table - transport options through travel agents
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(100) NOT NULL, -- 'Car', 'Bus', 'SUV', 'Tempo Traveller'
  agent_id UUID REFERENCES travel_agents(id) ON DELETE CASCADE,
  vehicle_number VARCHAR(50),
  capacity INTEGER NOT NULL,
  price_per_km DECIMAL(10, 2) NOT NULL,
  availability_status VARCHAR(50) DEFAULT 'available',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Poojas table - religious ceremonies at temples
CREATE TABLE poojas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100), -- 'daily', 'special', 'festival'
  temple_place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  timings VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  duration VARCHAR(50),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Packages table - tour packages for specific places
CREATE TABLE packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  highlights JSONB,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Package Rooms junction table - rooms included in packages
CREATE TABLE package_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  nights INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(package_id, room_id)
);

-- Package Places junction table - tourist places included in packages
CREATE TABLE package_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  tourist_place_id UUID REFERENCES tourist_places(id) ON DELETE CASCADE,
  visit_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(package_id, tourist_place_id)
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'admin', 'hotel-admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Room Bookings table
CREATE TABLE room_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  number_of_guests INTEGER,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Bookings table
CREATE TABLE vehicle_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  travel_date DATE NOT NULL,
  distance_km DECIMAL(10, 2),
  pickup_location VARCHAR(255),
  drop_location VARCHAR(255),
  total_price DECIMAL(10, 2) NOT NULL,
  booking_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pooja Bookings table
CREATE TABLE pooja_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pooja_id UUID REFERENCES poojas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TIME,
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Package Bookings table
CREATE TABLE package_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  number_of_travelers INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_status VARCHAR(50) DEFAULT 'pending',
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
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE poojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pooja_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public read access for places and related entities
CREATE POLICY "Public read access for places" ON places FOR SELECT USING (true);
CREATE POLICY "Public read access for rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read access for tourist places" ON tourist_places FOR SELECT USING (true);
CREATE POLICY "Public read access for travel agents" ON travel_agents FOR SELECT USING (true);
CREATE POLICY "Public read access for vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public read access for poojas" ON poojas FOR SELECT USING (true);
CREATE POLICY "Public read access for packages" ON packages FOR SELECT USING (true);
CREATE POLICY "Public read access for package rooms" ON package_rooms FOR SELECT USING (true);
CREATE POLICY "Public read access for package places" ON package_places FOR SELECT USING (true);

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

CREATE POLICY "Users can read own package bookings" ON package_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create package bookings" ON package_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own package bookings" ON package_bookings FOR UPDATE USING (auth.uid() = user_id);

-- Anyone can create contact messages
CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_rooms_place_id ON rooms(place_id);
CREATE INDEX idx_rooms_availability ON rooms(availability_status);

CREATE INDEX idx_tourist_places_place_id ON tourist_places(place_id);
CREATE INDEX idx_tourist_places_type ON tourist_places(type);

CREATE INDEX idx_vehicles_agent_id ON vehicles(agent_id);
CREATE INDEX idx_vehicles_availability ON vehicles(availability_status);

CREATE INDEX idx_poojas_temple_place_id ON poojas(temple_place_id);

CREATE INDEX idx_packages_place_id ON packages(place_id);
CREATE INDEX idx_packages_availability ON packages(is_available);

CREATE INDEX idx_package_rooms_package_id ON package_rooms(package_id);
CREATE INDEX idx_package_rooms_room_id ON package_rooms(room_id);

CREATE INDEX idx_package_places_package_id ON package_places(package_id);
CREATE INDEX idx_package_places_tourist_place_id ON package_places(tourist_place_id);

CREATE INDEX idx_room_bookings_user_id ON room_bookings(user_id);
CREATE INDEX idx_room_bookings_room_id ON room_bookings(room_id);
CREATE INDEX idx_room_bookings_dates ON room_bookings(check_in, check_out);
CREATE INDEX idx_room_bookings_status ON room_bookings(booking_status);

CREATE INDEX idx_vehicle_bookings_user_id ON vehicle_bookings(user_id);
CREATE INDEX idx_vehicle_bookings_vehicle_id ON vehicle_bookings(vehicle_id);
CREATE INDEX idx_vehicle_bookings_date ON vehicle_bookings(travel_date);
CREATE INDEX idx_vehicle_bookings_status ON vehicle_bookings(booking_status);

CREATE INDEX idx_pooja_bookings_user_id ON pooja_bookings(user_id);
CREATE INDEX idx_pooja_bookings_pooja_id ON pooja_bookings(pooja_id);
CREATE INDEX idx_pooja_bookings_date ON pooja_bookings(booking_date);
CREATE INDEX idx_pooja_bookings_status ON pooja_bookings(booking_status);

CREATE INDEX idx_package_bookings_user_id ON package_bookings(user_id);
CREATE INDEX idx_package_bookings_package_id ON package_bookings(package_id);
CREATE INDEX idx_package_bookings_date ON package_bookings(booking_date);
CREATE INDEX idx_package_bookings_status ON package_bookings(booking_status);
