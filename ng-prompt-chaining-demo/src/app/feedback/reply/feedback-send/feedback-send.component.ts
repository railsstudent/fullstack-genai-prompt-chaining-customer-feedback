import { ChangeDetectionStrategy, Component, computed, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-send',
  standalone: true,
  imports: [FormsModule],
  template: `
    <p>Feedback: </p>
    <textarea rows="10" [(ngModel)]="feedback" ></textarea>
    <div>
      <button (click)="handleClicked()" [disabled]="vm.isLoading">{{ vm.buttonText }}</button>
    </div>
    <p class="error">{{ vm.errorMessage }}</p>
  `,
  styles: `
    :host {
      display: block;
    }
    
    p {
      font-size: 1.2rem;
    }

    textarea {
      width: 90%;
    }

    div {
      margin-bottom: 0.5rem;
    }

    .error {
      color: red;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackSendComponent {
  feedback = signal('')
  prevFeedback = signal<string | null>(null);
  errorMessage = signal('');
  isLoading = model.required<boolean>()
  clicked = output<{ feedback: string }>();
  buttonText = computed(() => this.isLoading() ? 'Generating...' : 'Send'); 
  viewModel = computed(() => ({
    feedback: this.feedback(),
    prevFeedback: this.prevFeedback(),
    isLoading: this.isLoading(),
    buttonText: this.buttonText(),
    errorMessage: this.errorMessage(),
  }));

  handleClicked() {
    const previous = this.vm.prevFeedback;
    const current = this.vm.feedback;

    this.errorMessage.set('');
    if (previous !== null && previous === current) {
      this.errorMessage.set('Please try another feedback to generate a different response.');
      return;
    }

    this.prevFeedback.set(current);
    this.clicked.emit({
      feedback: current,
    });
    this.isLoading.set(true);
  }

  get vm() {
    return this.viewModel();
  }
}
