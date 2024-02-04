import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from 'src/app/models/blog-post';
import { Router, RouterLink } from '@angular/router';
import { HtmlDirective } from '../../directives/html.directive';
import { DateDisplayComponent } from '../shared/date-display/date-display.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor } from '@angular/common';
import { PageTitleComponent } from '../shared/page-title/page-title.component';
import { BlogPostAttributes } from 'src/app/models/blog-post-attributes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    PageTitleComponent,
    NgIf,
    MatProgressSpinnerModule,
    NgFor,
    DateDisplayComponent,
    HtmlDirective,
    RouterLink,
  ],
})
export class HomeComponent implements OnInit {
  public isLoading: boolean;
  public blogPosts: BlogPost[];
  public maxBlogPosts: number = 3;

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.blogService.getBlogPosts().subscribe({
      next: (blogPosts: BlogPost[]) => {
        console.log('returned', blogPosts);
        console.log(blogPosts[0].attributes);
        this.blogPosts = blogPosts
          .sort((p1, p2) =>
            new Date(this.getPublishedDate(p1.attributes)) >
            new Date(this.getPublishedDate(p2.attributes))
              ? -1
              : 1
          )
          .slice(0, 3);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  public getPublishedDate(attributes: BlogPostAttributes): string {
    return attributes.originallyPostedDate
      ? attributes.originallyPostedDate
      : attributes.publishedAt;
  }

  openBlogPost($event: MouseEvent, postId: string) {
    // found at https://stackoverflow.com/a/64279838/386869
    if ($event.button == 1) {
      window.open('/blog/' + postId);
    } else if ($event.button < 1) {
      this.router.navigate(['blog', postId]);
    }
  }
}
