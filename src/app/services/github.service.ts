import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private baseUrl = 'https://api.github.com';
  private githubToken: string;

  constructor(
    private http: HttpClient,
    @Inject('GITHUB_TOKEN') githubToken: string
  ) {
    this.githubToken = githubToken;
    console.log('GitHub token:', this.githubToken);
    console.log('Tipo do token:', typeof this.githubToken);
  }

  createPost(title: string, content: string): Observable<any> {
    const path = `posts/${this.formatDate()}-${this.slugify(title)}.md`;
    const headers = this.getHeaders();

    const body = {
      message: `Add post: ${title}`,
      content: btoa(content),
      branch: 'main'
    };

    return this.http.put(
      `${this.baseUrl}/repos/${environment.githubUsername}/${environment.githubRepo}/contents/${path}`,
      body,
      { headers }
    );
  }

  uploadImage(file: File): Promise<string> {
    const path = `images/${new Date().getTime()}_${file.name}`;
    const headers = this.getHeaders();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = (reader.result as string).split(',')[1];
        
        const body = {
          message: `Upload image: ${file.name}`,
          content: base64Image,
          branch: 'main'
        };

        this.http.put(
          `${this.baseUrl}/repos/${environment.githubUsername}/${environment.githubRepo}/contents/${path}`,
          body,
          { headers }
        ).subscribe({
          next: (response: any) => resolve(response.content.download_url),
          error: (err) => reject(err)
        });
      };
      
      reader.readAsDataURL(file);
    });
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Authorization': `token ${this.githubToken}`,
      'Content-Type': 'application/json'
    });
    console.log('Headers:', headers);
    return headers;
  }

  private formatDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}