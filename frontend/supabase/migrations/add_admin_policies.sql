-- Admin RLS policies for management + admin-wide reporting
-- Apply this after schema.sql and create_user_trigger_and_rls.sql

-- Helper check: current user is admin
-- (Uses public.users; users can always read their own row per existing policies.)

-- Places
DROP POLICY IF EXISTS "Admins can insert places" ON public.places;
DROP POLICY IF EXISTS "Admins can update places" ON public.places;
DROP POLICY IF EXISTS "Admins can delete places" ON public.places;
CREATE POLICY "Admins can insert places" ON public.places FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update places" ON public.places FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete places" ON public.places FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Rooms
DROP POLICY IF EXISTS "Admins can insert rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins can update rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins can delete rooms" ON public.rooms;
CREATE POLICY "Admins can insert rooms" ON public.rooms FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update rooms" ON public.rooms FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete rooms" ON public.rooms FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Packages
DROP POLICY IF EXISTS "Admins can insert packages" ON public.packages;
DROP POLICY IF EXISTS "Admins can update packages" ON public.packages;
DROP POLICY IF EXISTS "Admins can delete packages" ON public.packages;
CREATE POLICY "Admins can insert packages" ON public.packages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update packages" ON public.packages FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete packages" ON public.packages FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Poojas
DROP POLICY IF EXISTS "Admins can insert poojas" ON public.poojas;
DROP POLICY IF EXISTS "Admins can update poojas" ON public.poojas;
DROP POLICY IF EXISTS "Admins can delete poojas" ON public.poojas;
CREATE POLICY "Admins can insert poojas" ON public.poojas FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update poojas" ON public.poojas FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete poojas" ON public.poojas FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Tourist places
DROP POLICY IF EXISTS "Admins can insert tourist places" ON public.tourist_places;
DROP POLICY IF EXISTS "Admins can update tourist places" ON public.tourist_places;
DROP POLICY IF EXISTS "Admins can delete tourist places" ON public.tourist_places;
CREATE POLICY "Admins can insert tourist places" ON public.tourist_places FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update tourist places" ON public.tourist_places FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete tourist places" ON public.tourist_places FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Admin reporting: bookings (read all)
DROP POLICY IF EXISTS "Admins can read all room bookings" ON public.room_bookings;
DROP POLICY IF EXISTS "Admins can read all vehicle bookings" ON public.vehicle_bookings;
DROP POLICY IF EXISTS "Admins can read all package bookings" ON public.package_bookings;
DROP POLICY IF EXISTS "Admins can read all pooja bookings" ON public.pooja_bookings;
DROP POLICY IF EXISTS "Admins can read all trip bookings" ON public.trip_bookings;

DROP POLICY IF EXISTS "Admins can update room bookings" ON public.room_bookings;
DROP POLICY IF EXISTS "Admins can update vehicle bookings" ON public.vehicle_bookings;
DROP POLICY IF EXISTS "Admins can update package bookings" ON public.package_bookings;
DROP POLICY IF EXISTS "Admins can update pooja bookings" ON public.pooja_bookings;
DROP POLICY IF EXISTS "Admins can update trip bookings" ON public.trip_bookings;

CREATE POLICY "Admins can read all room bookings" ON public.room_bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can read all vehicle bookings" ON public.vehicle_bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can read all package bookings" ON public.package_bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can read all pooja bookings" ON public.pooja_bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can read all trip bookings" ON public.trip_bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update room bookings" ON public.room_bookings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update vehicle bookings" ON public.vehicle_bookings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update package bookings" ON public.package_bookings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update pooja bookings" ON public.pooja_bookings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update trip bookings" ON public.trip_bookings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
