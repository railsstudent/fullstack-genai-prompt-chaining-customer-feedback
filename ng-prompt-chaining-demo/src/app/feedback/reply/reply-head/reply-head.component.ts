import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-reply-head',
  standalone: true,
  template: `
    <div>
      <span>Generative AI Stack: </span> 
      <span>{{ generativeAiStack() }}</span>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    div span {
      font-size: 1.2rem;
    }

    div span:first-child {
      color: #aaa;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplyHeadComponent {
  generativeAiStack = input<string>('');
}
