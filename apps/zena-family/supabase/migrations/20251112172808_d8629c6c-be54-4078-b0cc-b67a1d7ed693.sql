-- Add 'admin' role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';

-- Add 'admin' role to family_role enum  
ALTER TYPE public.family_role ADD VALUE IF NOT EXISTS 'admin';