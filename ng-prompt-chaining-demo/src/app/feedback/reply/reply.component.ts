import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, finalize, switchMap, tap } from 'rxjs';
import { ReplyService } from '../services/reply.service';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <span>Generative AI Stack: </span> 
      <span>{{ generativeAIStack() }}</span>
    </div>
    <p>Feedback: </p>
    <textarea rows="10" [(ngModel)]="feedback" ></textarea>
    <div>
      <button (click)="clicked.emit()" [disabled]="vm.isLoading">{{ vm.buttonText }}</button>
    </div>
    <p>Reply: </p>
    <p>{{ vm.reply }}</p>
  `,
  styles: `
    p, div span {
      font-size: 1.2rem;
    }

    textarea {
      width: 90%;
    }

    div {
      margin-bottom: 1rem;
      span:first-child {
        color: #aaa;
      }
    }
  `,
  providers: [ReplyService]
})
export class ReplyComponent {
  generativeAIStack = input<string>('technicalStack');
  feedback = signal<string>('');
  reply = signal('');
  isLoading = signal(false)
  clicked = output();
  replyService = inject(ReplyService);
  buttonText = computed(() => this.isLoading() ? 'Generating...' : 'Send'); 

  get vm() {
    return {
      feedback: this.feedback(),
      isLoading: this.isLoading(),
      buttonText: this.buttonText(),
      reply: this.reply(),
    };
  }

  constructor() {
    effect((cleanUp) => { 
      const sub = outputToObservable(this.clicked)
        .pipe(
          filter(() => this.vm.feedback !== undefined && this.vm.feedback.trim() !== ''),
          tap(() => { 
            this.isLoading.set(true);
            this.reply.set('');
          }),
          switchMap(() => this.replyService.getReply(this.vm.feedback)
            .pipe(finalize(() => this.isLoading.set(false)))
          ),
        ).subscribe((aiReply) => this.reply.set(aiReply));
     
      cleanUp(() => sub.unsubscribe());
    });
  }
}


