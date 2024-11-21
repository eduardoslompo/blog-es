import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  standalone: true,
  styles: [`
    .container {
      padding: 1rem;
      max-width: 64rem;
      margin: 0 auto;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .input-field {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
    }
    
    .preview {
      border: 1px solid #ccc;
      padding: 1rem;
      height: 24rem;
      overflow: auto;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      background-color: #3b82f6;
      color: white;
      cursor: pointer;
    }
    
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .success {
      color: #16a34a;
    }
    
    .error {
      color: #dc2626;
    }
  `],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule
  ]
})
export class PostEditorComponent {
  postForm: FormGroup;
  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  preview: string = '';

  constructor(
    private fb: FormBuilder,
    private githubService: GithubService
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: ['']
    });

    this.postForm.get('content')?.valueChanges.subscribe(value => {
      this.preview = value;
    });
  }

  async onSubmit() {
    if (this.postForm.valid) {
      this.status = 'loading';
      const { title, content, image } = this.postForm.value;

      this.githubService.createPost(title, content, image)
        .subscribe({
          next: () => {
            this.status = 'success';
            this.postForm.reset();
          },
          error: () => {
            this.status = 'error';
          }
        });
    }
  }
}