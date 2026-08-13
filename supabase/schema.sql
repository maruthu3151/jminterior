-- JM INTERIOR Database DDL (PostgreSQL / Supabase Schema)
-- Owner: K. Selvam | Luxury Interior & Custom Woodwork

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    company_name VARCHAR(255) NOT NULL DEFAULT 'JM INTERIOR',
    owner_name VARCHAR(255) NOT NULL DEFAULT 'K. Selvam',
    tagline VARCHAR(255) DEFAULT 'Crafting Premium Interior Spaces with Precision',
    phones TEXT[] DEFAULT ARRAY['7358549554', '9342004411'],
    email VARCHAR(255) DEFAULT 'contact@jminterior.com',
    whatsapp VARCHAR(50) DEFAULT '917358549554',
    address TEXT DEFAULT '4/29 Kamarajar Street, Nesapakkam, Chennai, Tamil Nadu - 600078',
    google_maps_url TEXT DEFAULT 'https://maps.google.com/?q=4/29+Kamarajar+Street+Nesapakkam+Chennai',
    logo_url TEXT DEFAULT '',
    admin_passkey VARCHAR(255) DEFAULT 'selvam123',
    meta_title VARCHAR(255) DEFAULT 'JM INTERIOR | Premium Interior Design & Woodwork',
    meta_description TEXT DEFAULT 'Luxury modular kitchens, wardrobes, and custom interior design in Chennai by K. Selvam.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    location VARCHAR(255),
    category VARCHAR(100) NOT NULL, -- 'Modular Kitchen', 'Wardrobe', 'Living Room', 'Bedroom', 'Commercial', 'Villa', 'Custom Furniture'
    description TEXT,
    wood_type VARCHAR(100),
    materials TEXT[],
    budget VARCHAR(100),
    timeline VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Completed', -- 'Planning', 'In Progress', 'Completed', 'Archived'
    cover_image TEXT NOT NULL,
    before_image TEXT,
    after_image TEXT,
    blueprint_url TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    customer_review TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Gallery
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    price_range VARCHAR(100),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Materials
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    durability INT DEFAULT 5, -- 1 to 5
    finish VARCHAR(100),
    maintenance VARCHAR(50), -- 'Low', 'Medium', 'High'
    water_resistance VARCHAR(50), -- 'High', 'Waterproof', 'Standard'
    termite_resistance VARCHAR(50), -- '100% Termite Proof', 'Treated', 'High'
    cost_level VARCHAR(50), -- 'Standard', 'Premium', 'Ultra Luxury'
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    project_type VARCHAR(100) NOT NULL,
    budget VARCHAR(100),
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50),
    message TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    project_title VARCHAR(255),
    rating INT DEFAULT 5,
    comment TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS Enablement
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published items
CREATE POLICY "Allow public read published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read published gallery" ON public.gallery FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read published services" ON public.services FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read published materials" ON public.materials FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read approved reviews" ON public.reviews FOR SELECT USING (status = 'Approved');
CREATE POLICY "Allow public read site settings" ON public.site_settings FOR SELECT USING (true);

-- Allow public insertion for appointments, messages, reviews
CREATE POLICY "Allow public insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Full access policy for authenticated service role / admins
CREATE POLICY "Allow full access for service role on projects" ON public.projects USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for service role on gallery" ON public.gallery USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for service role on services" ON public.services USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for service role on materials" ON public.materials USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for service role on appointments" ON public.appointments USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for service role on messages" ON public.messages USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for service role on reviews" ON public.reviews USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for service role on site_settings" ON public.site_settings USING (true) WITH CHECK (true);
