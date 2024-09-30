export interface IComment {
  id: number;
  created_at: Date;
  payload: string;
  user: {
    username: string;
    profile_img?: string;
  };
}
