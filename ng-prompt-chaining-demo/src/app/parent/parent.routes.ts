import { Route } from "@angular/router";
import { BACKEND_URL } from '~app/app.constant';
import { ChildComponent } from "../child/child.component";
import { ParentComponent } from "./parent.component";

export const CUSTOMER_ROUTES: Route[] = [
  {
    path: '',
    component: ParentComponent,
    children: [
      {
        path: 'gemini',
        title: 'Gemini',
        component: ChildComponent,
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
        component: ChildComponent,
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
        component: ChildComponent,
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
        component: ChildComponent,
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
