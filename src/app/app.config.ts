import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(MarkdownModule.forRoot()),
    {
      provide: 'GITHUB_TOKEN',
      useValue: environment.githubToken
    }
  ]
};