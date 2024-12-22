export interface Comment {
  id?: string;
  userId: string;
  username: string;
  profilePicture: string;
  text: string;
  timestamp: number;
  upvotes: number;
  downvotes: number;
}

