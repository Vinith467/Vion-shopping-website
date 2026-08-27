-- Run this script in your Supabase SQL Editor to create the consultant bookings table

CREATE TABLE IF NOT EXISTS public.consultant_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    country TEXT NOT NULL,
    collection_interest TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    location_address TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT
);

-- Allow public inserts (so non-logged-in users can book a consultation)
ALTER TABLE public.consultant_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to consultant_bookings" 
ON public.consultant_bookings FOR INSERT 
WITH CHECK (true);

-- Allow reading all bookings (in a real app this should be restricted to admin role)
CREATE POLICY "Allow reading consultant_bookings" 
ON public.consultant_bookings FOR SELECT 
USING (true);

-- Allow updates (e.g. for admin to change status)
CREATE POLICY "Allow updating consultant_bookings" 
ON public.consultant_bookings FOR UPDATE 
USING (true);
