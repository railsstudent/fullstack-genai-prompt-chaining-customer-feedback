import { Route } from "@angular/router";
import { BACKEND_URL } from '~app/app.constant';
import { ReplyComponent } from "./reply/reply.component";
import { FeedbackShellComponent } from './feedback-shell/feedback-shell.component';

export const CUSTOMER_ROUTES: Route[] = [
  {
    path: '',
    component: FeedbackShellComponent,
    children: [
      {
        path: 'gemini',
        title: 'Gemini',
        component: ReplyComponent,
        data: {
          technicalStack: 'Google Gemini API and gemini-1.5-pro-latest model'
        },
        providers: [
          {
            provide: BACKEND_URL,
            useValue: 'http://localhost:3000'
          }
        ]
      },
      {
        path: 'groq',
        title: 'Groq',
        component: ReplyComponent,
        data: {
          technicalStack: 'Groq Cloud and gemma-7b-it model'
        },
        providers: [
          {
            provide: BACKEND_URL,
            useValue: 'http://localhost:3001'
          }
        ]
      },
      {
        path: 'huggingface',
        title: 'Huggingface',
        component: ReplyComponent,
        data: {
          technicalStack: 'huggingface.js and Mistral-7B-Instruct-v0.2 model'
        },
        providers: [
          {
            provide: BACKEND_URL,
            useValue: 'http://localhost:3003'
          }
        ]
      },
      {
        path: 'langchain',
        title: 'Langchain',
        component: ReplyComponent,
        data: {
          technicalStack: 'Langchain.js and gemini-1.5-pro-latest model'
        },
        providers: [
          {
            provide: BACKEND_URL,
            useValue: 'http://localhost:3002'
          }
        ]
      },
    ]
  }
];
