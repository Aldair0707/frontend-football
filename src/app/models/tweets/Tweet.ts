export interface Tweet {
  id: number;
  tweet: string;
  //imageUrl?: string;         // Opcional si el tweet no tiene imagen
  postedBy: {
    id: number;
    username: string;
  };
  createdAt: string;         
  reactions?: {
    [reactionType: string]: number; // Ejemplo: { "REACTION_LIKE": 4, "REACTION_GOAT": 1 }
  };
  comments?: {
    id: number;
    content: string;
    username: string;
    createdAt: string;   
  }[];
}