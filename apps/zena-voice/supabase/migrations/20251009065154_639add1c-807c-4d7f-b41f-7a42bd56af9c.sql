-- Create enums for roles and statuses
CREATE TYPE public.app_role AS ENUM ('super_admin', 'company_admin', 'manager', 'employee');
CREATE TYPE public.license_tier AS ENUM ('starter', 'business', 'enterprise', 'custom');
CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'trial', 'cancelled');

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  employee_count INTEGER NOT NULL DEFAULT 0,
  license_tier license_tier NOT NULL DEFAULT 'starter',
  subscription_status subscription_status NOT NULL DEFAULT 'trial',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  team_lead_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_field_team BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employees table (profiles)
CREATE TABLE public.employees (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role, company_id)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  employee_count INTEGER NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  stripe_subscription_id TEXT,
  status subscription_status NOT NULL DEFAULT 'trial',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create security definer function to get user's company
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id
  FROM public.employees
  WHERE id = _user_id
  LIMIT 1
$$;

-- RLS Policies for companies
CREATE POLICY "Users can view their own company"
  ON public.companies
  FOR SELECT
  USING (id = public.get_user_company_id(auth.uid()));

CREATE POLICY "Company admins can update their company"
  ON public.companies
  FOR UPDATE
  USING (
    id = public.get_user_company_id(auth.uid()) 
    AND public.has_role(auth.uid(), 'company_admin')
  );

-- RLS Policies for departments
CREATE POLICY "Users can view departments in their company"
  ON public.departments
  FOR SELECT
  USING (company_id = public.get_user_company_id(auth.uid()));

CREATE POLICY "Company admins can manage departments"
  ON public.departments
  FOR ALL
  USING (
    company_id = public.get_user_company_id(auth.uid())
    AND public.has_role(auth.uid(), 'company_admin')
  );

-- RLS Policies for teams
CREATE POLICY "Users can view teams in their company"
  ON public.teams
  FOR SELECT
  USING (company_id = public.get_user_company_id(auth.uid()));

CREATE POLICY "Managers can manage teams in their department"
  ON public.teams
  FOR ALL
  USING (
    company_id = public.get_user_company_id(auth.uid())
    AND (
      public.has_role(auth.uid(), 'company_admin')
      OR public.has_role(auth.uid(), 'manager')
    )
  );

-- RLS Policies for employees
CREATE POLICY "Users can view their own profile"
  ON public.employees
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can view employees in their company"
  ON public.employees
  FOR SELECT
  USING (company_id = public.get_user_company_id(auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.employees
  FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Company admins can manage employees"
  ON public.employees
  FOR ALL
  USING (
    company_id = public.get_user_company_id(auth.uid())
    AND public.has_role(auth.uid(), 'company_admin')
  );

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Company admins can view roles in their company"
  ON public.user_roles
  FOR SELECT
  USING (
    company_id = public.get_user_company_id(auth.uid())
    AND public.has_role(auth.uid(), 'company_admin')
  );

CREATE POLICY "Company admins can manage roles in their company"
  ON public.user_roles
  FOR ALL
  USING (
    company_id = public.get_user_company_id(auth.uid())
    AND public.has_role(auth.uid(), 'company_admin')
  );

-- RLS Policies for subscriptions
CREATE POLICY "Company admins can view their subscription"
  ON public.subscriptions
  FOR SELECT
  USING (
    company_id = public.get_user_company_id(auth.uid())
    AND public.has_role(auth.uid(), 'company_admin')
  );

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.employees (id, company_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'company_id')::UUID,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_employees_company ON public.employees(company_id);
CREATE INDEX idx_employees_department ON public.employees(department_id);
CREATE INDEX idx_employees_team ON public.employees(team_id);
CREATE INDEX idx_departments_company ON public.departments(company_id);
CREATE INDEX idx_teams_company ON public.teams(company_id);
CREATE INDEX idx_teams_department ON public.teams(department_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_company ON public.user_roles(company_id);
CREATE INDEX idx_subscriptions_company ON public.subscriptions(company_id);