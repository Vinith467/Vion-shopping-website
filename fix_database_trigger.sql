-- Fix the trigger's search path and use native UUID generation
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
        id, 
        user_id, 
        name, 
        is_primary, 
        age, 
        gender, 
        height_cm, 
        body_shape
    ) VALUES (
        gen_random_uuid(), -- Use built-in function instead of uuid_generate_v4()
        NEW.id,
        fallback_name,
        true,
        (NEW.raw_user_meta_data->>'age')::integer,
        COALESCE(NEW.raw_user_meta_data->>'gender', 'Female'),
        (NEW.raw_user_meta_data->>'height_cm')::integer,
        NEW.raw_user_meta_data->>'body_shape'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Also update all tables to use the native Postgres gen_random_uuid()
-- This prevents similar "function not found" errors in the future
ALTER TABLE public.consumers ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.preferences ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.categories ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.products ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.addresses ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.orders ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.order_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
