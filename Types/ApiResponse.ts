export interface Message {
  id: string;
  content: string;
  createdAt: Date;
}


export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
}
