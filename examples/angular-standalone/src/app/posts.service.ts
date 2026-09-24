import { Injectable, inject } from '@angular/core';
import { ApiService } from '@arxis/api';

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly api = inject(ApiService);

  // GET https://jsonplaceholder.typicode.com/posts?_limit=5
  list(limit = 5) {
    return this.api.get<Post[]>('posts', { _limit: String(limit) });
  }

  // POST https://jsonplaceholder.typicode.com/posts
  create(post: Omit<Post, 'id'>) {
    return this.api.post<Post>('posts', post);
  }
}
