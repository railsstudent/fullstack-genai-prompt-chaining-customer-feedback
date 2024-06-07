import { Component, DestroyRef, inject, input, model, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
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
export class ReplyTextComponent implements OnInit {
  feedback = input.required<string>();
  isLoading = model.required<boolean>();
  reply = signal('');
  replyService = inject(ReplyService);
  destroyRef$ = inject(DestroyRef);

  ngOnInit(): void {
    toObservable(this.feedback)
      .pipe(
        tap(() => this.reply.set('')),
        switchMap(() => this.replyService.getReply(this.feedback())
          .pipe(finalize(() => this.isLoading.set(false)))
        ),
        takeUntilDestroyed(this.destroyRef$),
      )
      .subscribe((aiReply) => this.reply.set(aiReply));
  }
}
