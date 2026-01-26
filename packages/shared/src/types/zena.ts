export type TenantType = "family" | "company";

export type Profile = {
  user_id: string;
  display_name: string | null;
  role_global: "guardian" | "teen" | "child" | "admin" | "employee";
};

export type Family = {
  id: string;
  owner_id: string;
  plan_status: "active" | "trial" | "paused";
};

export type FamilyMember = {
  family_id: string;
  user_id: string;
  role: "guardian" | "teen" | "child";
};

export type Company = {
  id: string;
  owner_id: string;
  name: string;
  status: "lead" | "active";
};

export type CompanyMember = {
  company_id: string;
  user_id: string;
  role: "admin" | "employee";
};

export type Invite = {
  id: string;
  tenant_type: TenantType;
  tenant_id: string;
  role: string;
  code: string;
  expires_at: string | null;
  created_by: string;
};

export type Alert = {
  id: string;
  tenant_type: TenantType;
  tenant_id: string;
  created_by: string;
  category: string;
  severity: "low" | "medium" | "high";
  message: string;
  status: "open" | "triaged" | "resolved";
  created_at: string;
};

export type Post = {
  id: string;
  tenant_type: TenantType;
  tenant_id: string;
  author_id: string;
  visibility: "tenant" | "group";
  content: string;
  created_at: string;
};

export type Group = {
  id: string;
  tenant_type: TenantType;
  tenant_id: string;
  name: string;
};

export type GroupMember = {
  group_id: string;
  user_id: string;
};

export type PlanItem = {
  id: string;
  tenant_type: TenantType;
  tenant_id: string;
  owner_id: string | null;
  title: string;
  start_at: string;
  end_at: string | null;
  notes: string | null;
};
