import { ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, input, model, OnInit, runInInjectionContext, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, finalize, switchMap, tap } from 'rxjs';
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
  providers: [ReplyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplyTextComponent implements OnInit {
  feedback = input.required<string>();
  isLoading = model.required<boolean>();
  reply = signal('');
  replyService = inject(ReplyService);
  destroyRef$ = inject(DestroyRef);
  injector = inject(Injector);

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      toObservable(this.feedback)
        .pipe(
          tap((feedback) => console.log('in replyText', feedback)),
          filter((feedback) => typeof feedback !== 'undefined' && feedback !== ''),
          tap(() => this.reply.set('')),
          switchMap((feedback) => this.replyService.getReply(feedback)
            .pipe(finalize(() => this.isLoading.set(false)))
          ),
          takeUntilDestroyed(this.destroyRef$),
        )
        .subscribe((aiReply) => this.reply.set(aiReply));
    });
  }
}
