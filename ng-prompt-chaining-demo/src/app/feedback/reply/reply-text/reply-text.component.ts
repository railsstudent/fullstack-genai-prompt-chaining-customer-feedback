import { Component, effect, inject, input, model, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { finalize, switchMap, tap } from 'rxjs';
import { ReplyService } from '~app/feedback/services/reply.service';

@Component({
  selector: 'app-reply-text',
  standalone: true,
  template: `
    <p>Reply: </p>
    <p>{{ reply() }}</p>
  `,
  styles: `
    p {
      font-size: 1.2rem;
    }
  `,
})
export class ReplyTextComponent {
  feedback = input.required<string>();
  isLoading = model.required<boolean>();
  reply = signal('');
  replyService = inject(ReplyService);

  constructor() {
    effect((cleanUp) => {       
      const sub = toObservable(this.feedback)
        .pipe(
          tap(() => this.reply.set('')),
          switchMap(() => this.replyService.getReply(this.feedback())
            .pipe(finalize(() => this.isLoading.set(false)))
          )
        ).subscribe((aiReply) => this.reply.set(aiReply));

      cleanUp(() => sub.unsubscribe());
    });
  }
}
