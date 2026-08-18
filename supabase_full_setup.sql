-- =========================================================================================
-- VION FASHION: FULL SUPABASE SCHEMA & RLS SETUP
-- Copy all of this code and paste it into your Supabase SQL Editor, then click "Run"
-- =========================================================================================

-- 1. Enable UUID Extension (needed for primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLE DEFINITIONS
-- ==========================================

-- A. PROFILES (Linked 1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. CONSUMERS (Multiple profiles/members per user account)
CREATE TABLE IF NOT EXISTS public.consumers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    age INTEGER,
    gender TEXT,
    height_cm INTEGER,
    body_shape TEXT,
    skin_tone TEXT,
    avatar_url TEXT,
    measurements JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. PREFERENCES (Linked to a consumer)
CREATE TABLE IF NOT EXISTS public.preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    consumer_id UUID REFERENCES public.consumers(id) ON DELETE CASCADE NOT NULL,
    preferred_content JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. CATEGORIES (Global Data)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- E. PRODUCTS (Global Data)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- F. ADDRESSES (User Shipping Info)
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    country TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- G. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    consumer_id UUID REFERENCES public.consumers(id) ON DELETE SET NULL,
    address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    items JSONB,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- H. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    size TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consumers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES (Users can only view and edit their own profile)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. CONSUMERS POLICIES (Users manage their own members/consumers)
DROP POLICY IF EXISTS "Users can view own consumers" ON public.consumers;
CREATE POLICY "Users can view own consumers" ON public.consumers FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own consumers" ON public.consumers;
CREATE POLICY "Users can insert own consumers" ON public.consumers FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own consumers" ON public.consumers;
CREATE POLICY "Users can update own consumers" ON public.consumers FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own consumers" ON public.consumers;
CREATE POLICY "Users can delete own consumers" ON public.consumers FOR DELETE USING (auth.uid() = user_id);

-- 3. PREFERENCES POLICIES (Users manage preferences for their own consumers)
DROP POLICY IF EXISTS "Users can view preferences for their consumers" ON public.preferences;
CREATE POLICY "Users can view preferences for their consumers" ON public.preferences FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.consumers WHERE consumers.id = preferences.consumer_id AND consumers.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert preferences for their consumers" ON public.preferences;
CREATE POLICY "Users can insert preferences for their consumers" ON public.preferences FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.consumers WHERE consumers.id = preferences.consumer_id AND consumers.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update preferences for their consumers" ON public.preferences;
CREATE POLICY "Users can update preferences for their consumers" ON public.preferences FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.consumers WHERE consumers.id = preferences.consumer_id AND consumers.user_id = auth.uid()));

-- 4. CATEGORIES & PRODUCTS (Everyone can read, only admins should edit - for now anyone can read)
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- 5. ADDRESSES POLICIES
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
CREATE POLICY "Users can view their own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.addresses;
CREATE POLICY "Users can insert their own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
CREATE POLICY "Users can update their own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;
CREATE POLICY "Users can delete their own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- 6. ORDERS & ORDER ITEMS
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
CREATE POLICY "Users can insert their own order items" ON public.order_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));


-- ==========================================
-- TRIGGERS (Auto-create Profile and Primary Consumer on Signup)
-- ==========================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    fallback_name TEXT;
BEGIN
    fallback_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'My Profile');

    -- 1. Create the profile
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (NEW.id, fallback_name, NEW.raw_user_meta_data->>'avatar_url');

    -- 2. Create the primary consumer/member automatically
    INSERT INTO public.consumers (
        user_id, 
        name, 
        is_primary, 
        age, 
        gender, 
        height_cm, 
        body_shape
    ) VALUES (
        NEW.id,
        fallback_name,
        true,
        COALESCE((NEW.raw_user_meta_data->>'age')::integer, 25),
        COALESCE(NEW.raw_user_meta_data->>'gender', 'Female'),
        COALESCE((NEW.raw_user_meta_data->>'height_cm')::integer, 165),
        COALESCE(NEW.raw_user_meta_data->>'body_shape', 'Hourglass')
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
