export type FamilyMemberRole = "parent" | "guardian" | "teen";

export interface FamilyAccount {
  id: string;
  display_name: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_account_id: string;
  user_id: string;
  role: FamilyMemberRole;
  display_name: string;
  created_at: string;
}

export interface FriendConnection {
  id: string;
  teen_user_id: string;
  friend_user_id: string;
  status: "pending" | "accepted" | "blocked";
  created_at: string;
}

export type AlertType = "detresse" | "harcelement";
export type AlertStatus = "new" | "notified" | "acknowledged" | "closed";

export interface Alert {
  id: string;
  family_account_id: string;
  created_by: string;
  alert_type: AlertType;
  message: string;
  status: AlertStatus;
  notified_to: string[];
  created_at: string;
}

export interface AlertNotification {
  id: string;
  alert_id: string;
  channel: "email" | "webhook" | "in_app";
  target: string;
  status: "sent" | "failed";
  created_at: string;
}
