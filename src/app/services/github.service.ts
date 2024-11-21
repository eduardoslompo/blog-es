import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private baseUrl = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  createPost(title: string, content: string, image: string): Observable<any> {
    const date = new Date();
    const fileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    const path = `_posts/${fileName}`;

    const postContent = `---
title: ${title}
date: ${date.toISOString()}
image: ${image}
---
${content}`;

    const body = {
      message: `Add new post: ${title}`,
      content: btoa(postContent),
      branch: 'main'
    };

    const headers = new HttpHeaders({
      'Authorization': `token ${environment.githubToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(
      `${this.baseUrl}/repos/${environment.githubUsername}/${environment.githubRepo}/contents/${path}`,
      body,
      { headers }
    );
  }
}