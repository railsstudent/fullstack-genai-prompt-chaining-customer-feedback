import { ChangeDetectionStrategy, Component, effect, inject, input, signal, viewChild } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { filter, finalize, map, switchMap, tap } from 'rxjs';
import { ReplyService } from '../services/reply.service';
import { FeedbackSendComponent } from './feedback-send/feedback-send.component';
import { ReplyHeadComponent } from './reply-head/reply-head.component';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [ReplyHeadComponent, FeedbackSendComponent],
  providers: [ReplyService],
  template: `
    <app-reply-head class="head" [generativeAiStack]="generativeAiStack()" />
    <app-feedback-send [(isLoading)]="isLoading" />
    <p>Reply: </p>
    <p>{{ reply() }}</p>
  `,
  styles: `
    app-reply-head.head, app-feedback-send {
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplyComponent {
  generativeAiStack = input<string>('');
  feedbackSend = viewChild.required(FeedbackSendComponent);
  isLoading = signal(false)
  feedback = signal('');
  reply = signal('');
  replyService = inject(ReplyService);

  constructor() {
    effect((cleanUp) => { 
      const sub = outputToObservable(this.feedbackSend().clicked)
        .pipe(
          filter(({ feedback }) => typeof feedback !== 'undefined' && feedback.trim() !== ''),
          map(({ feedback }) => feedback.trim()),
          tap(() => this.reply.set('')),
          switchMap((feedback) => this.replyService.getReply(feedback)
            .pipe(finalize(() => this.isLoading.set(false)))
          ),
        )
        .subscribe((aiReply) => this.reply.set(aiReply));
     
      cleanUp(() => sub.unsubscribe());
    });
  }
}


