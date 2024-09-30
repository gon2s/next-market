export interface IComment {
  id: number;
  created_at: Date;
  payload: string;
  user: {
    id: number;
    username: string;
    profile_img?: string;
  };
}
