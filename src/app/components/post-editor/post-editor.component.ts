import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { GitHubService } from '../../services/github.service';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [FormsModule, HttpClientModule, MarkdownModule],
  template: `
    <div class="container">
      <h2>Editor de Posts</h2>
      
      <div class="form-group">
        <label>Título do Post</label>
        <input 
          type="text" 
          [(ngModel)]="postTitle" 
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label>Conteúdo (Markdown)</label>
        <div class="editor-container">
          <textarea 
            [(ngModel)]="postContent" 
            class="form-control editor"
          ></textarea>
          
          <input 
            type="file" 
            (change)="onFileSelected($event)"
            accept="image/*"
            class="file-input"
          >
        </div>
      </div>

      <div class="preview-container">
        <h3>Preview</h3>
        <markdown [data]="postContent"></markdown>
      </div>

      <div class="actions">
        <button 
          (click)="publishPost()" 
          class="btn btn-primary"
          [disabled]="!postTitle || !postContent"
        >
          Publicar Post
        </button>
      </div>

      <div *ngIf="publishStatus" class="status-message">
        {{ publishStatus }}
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: auto; }
    .editor-container { display: flex; }
    .editor { width: 100%; height: 300px; }
    .file-input { margin-left: 10px; }
    .preview-container { margin-top: 20px; }
    .status-message { margin-top: 10px; }
  `]
})
export class PostEditorComponent implements OnInit {
  postTitle: string = '';
  postContent: string = '';
  publishStatus: string = '';

  constructor(private githubService: GitHubService) {}

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.githubService.uploadImage(file)
        .then((imageUrl: string) => {
          this.postContent += `\n![${file.name}](${imageUrl})`;
        })
        .catch(error => {
          console.error('Erro no upload', error);
          this.publishStatus = 'Erro no upload da imagem';
        });
    }
  }

  publishPost() {
    if (!this.postTitle || !this.postContent) {
      this.publishStatus = 'Preencha título e conteúdo';
      return;
    }

    this.githubService.createPost(this.postTitle, this.postContent)
      .subscribe({
        next: () => {
          this.publishStatus = 'Post publicado com sucesso!';
          this.resetForm();
        },
        error: (err) => {
          console.error('Erro ao publicar:', err);
          this.publishStatus = 'Erro ao publicar o post';
        }
      });
  }

  private resetForm() {
    this.postTitle = '';
    this.postContent = '';
  }
}