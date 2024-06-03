import { Component, effect, input, signal, viewChild } from '@angular/core';
import { ReplyService } from '../services/reply.service';
import { FeedbackSendComponent } from './feedback-send/feedback-send.component';
import { ReplyHeadComponent } from './reply-head/reply-head.component';
import { ReplyTextComponent } from './reply-text/reply-text.component';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [ReplyHeadComponent, FeedbackSendComponent, ReplyTextComponent],
  template: `
    <app-reply-head class="head" [generativeAiStack]="generativeAiStack()" />
    <app-feedback-send [(isLoading)]="isLoading" />
    <app-reply-text [feedback]="feedback()" [(isLoading)]="isLoading" />
  `,
  styles: `
    app-reply-head.head, app-feedback-send {
      margin-bottom: 1rem;
    }
  `,
  providers: [ReplyService]
})
export class ReplyComponent {
  generativeAiStack = input<string>('');
  feedbackSend = viewChild.required(FeedbackSendComponent);
  isLoading = signal(false)
  feedback = signal('');

  constructor() {
    effect((cleanUp) => { 
      const sub = outputToObservable(this.feedbackSend().clicked)
        .pipe(
          filter(({ feedback }) => feedback !== undefined && feedback.trim() !== ''),
        ).subscribe(({ feedback }) => this.feedback.set(feedback));
     
      cleanUp(() => sub.unsubscribe());
    });
  }
}


