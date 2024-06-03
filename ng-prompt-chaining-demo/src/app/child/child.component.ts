import { Component, effect, inject, input, output, signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { ReplyService } from './services/reply.service';

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <span>Technical Stack: </span> 
      <span>{{ technicalStack() }}</span>
    </div>
    <p>Feedback: </p>
    <textarea rows="15" [(ngModel)]="feedback" ></textarea>
    <div>
      <button (click)="clicked.emit()">Send</button>
    </div>
    <p>{{ reply() }}</p>
  `,
  styles: `
    p {
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

      span {
        font-size: 1.25rem;
      }
    }
  `,
  providers: [ReplyService]
})
export class ChildComponent {
  technicalStack = input<string>('technicalStack');
  feedback = signal<string>('');
  clicked = output();
  replyService = inject(ReplyService);
  reply = signal<string>('');

  get vm() {
    return {
      feedback: this.feedback(),
    };
  }

  constructor() {
    effect((cleanUp) => { 
      const sub = outputToObservable(this.clicked)
        .pipe(
          filter(() => this.vm.feedback !== undefined && this.vm.feedback.trim() !== ''),
          switchMap(() => this.replyService.getReply(this.vm.feedback)),
        ).subscribe((aiReply) => {
          this.reply.set(aiReply);
        });
     
      cleanUp(() => sub.unsubscribe());
    });
  }
}


