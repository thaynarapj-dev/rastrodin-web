export interface Space {
  id: string;
  name: string;
  owner_id: string;
  created_at?: string;
}

export interface SpaceMember {
  id: string;
  space_id: string;
  user_id: string;
  role: 'owner' | 'member' | string;
  display_name?: string | null;
  created_at?: string;
}
