import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-feedback-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="grid">
      <h2>Customer Feedback</h2>
      <nav class="menu">
        <p>Menu</p>
        <ul>
          <li><a routerLink="gemini">Gemini</a></li>
          <li><a routerLink="groq">Groq + gemma 7b</a></li>
          <li><a routerLink="huggingface">Hugginface JS + Mixtrial</a></li>
          <li><a routerLink="langchain">Langchain.js + Gemini</a></li>
        </ul>
      </nav>
      <div class="main">
        <router-outlet />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    div.grid {
      border: 1px solid #4aa;
      display: grid;
      grid-template-columns: 200px 1fr;
      grid-template-rows: 70px 1fr;
      height: calc(100vh - 4rem);
      width: calc(100vw - 3.5rem);
      overflow-y: auto;
    }

    h2 {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      padding-top: 1rem;
      padding-left: 0.5rem;
    }

    nav.menu {
      grid-column: 1 / 2;
      grid-row: 1 / 3;

      border-right: 1px solid #4aa;
      padding-left: 0.5rem;
      padding-top: 0.5rem;

      p {
        font-size: 1.25rem;
        margin-bottom: 0.25rem;
      }
      
      ul > li {
        list-style-type: none;
        font-size: 1rem;
        margin-bottom: 0.5rem;
      } 
    }

    div.main, router-outlet + * {
      grid-column: 2 / 3;
      grid-row: -1 / -2;

      padding-left: 0.5rem;
    }
  `
})
export class FeedbackShellComponent {}
