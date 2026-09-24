import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Post, PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  template: `
    <h1><code>&#64;arxis/api</code> example</h1>
    <p>
      Posts from <code>jsonplaceholder.typicode.com</code>, loaded with
      <code>inject(ApiService)</code>. See <code>src/app/app.config.ts</code> and
      <code>src/app/posts.service.ts</code>.
    </p>

    <button type="button" (click)="createPost()">Create a post (POST)</button>
    @if (created(); as post) {
      <p id="created">Created post #{{ post.id }}: {{ post.title }}</p>
    }

    <ul id="posts">
      @for (post of posts(); track post.id) {
        <li>
          <strong>{{ post.title }}</strong>
          <p>{{ post.body }}</p>
        </li>
      } @empty {
        <li>Loading…</li>
      }
    </ul>
  `,
})
export class App {
  private readonly postsService = inject(PostsService);

  protected readonly posts = toSignal(this.postsService.list(), { initialValue: [] });
  protected readonly created = signal<Post | undefined>(undefined);

  protected createPost(): void {
    this.postsService
      .create({ userId: 1, title: 'Hello from @arxis/api', body: 'Sent with ApiService.post()' })
      .subscribe((post) => this.created.set(post));
  }
}
