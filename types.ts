export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  thumbnail_url: string;
  content_markdown: string;
  likes: number;
  comments: Comment[];
  saved: boolean;
}

export interface FunContent {
  title: string;
  url: string;
  description: string;
}

export interface DevEvent {
  name: string;
  date: string;
  location: string;
  url: string;
}

// Gemini Response Schemas
export interface GeminiArticleResponse {
  title: string;
  content_markdown: string;
  tags: string[];
}

export interface GeminiEventsResponse {
  events: DevEvent[];
}

export interface GeminiFunResponse {
  contents: FunContent[];
}
