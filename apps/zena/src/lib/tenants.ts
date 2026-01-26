import { supabase } from "@/lib/supabase";

export const getFamilyId = async () => {
  const { data } = await supabase
    .from("family_members")
    .select("family_id")
    .limit(1)
    .maybeSingle();
  return data?.family_id ?? null;
};

export const getCompanyId = async () => {
  const { data } = await supabase
    .from("company_members")
    .select("company_id")
    .limit(1)
    .maybeSingle();
  return data?.company_id ?? null;
};
