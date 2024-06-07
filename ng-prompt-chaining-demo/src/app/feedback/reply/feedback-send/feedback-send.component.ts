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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackSendComponent {
  feedback = signal('');
  isLoading = model.required<boolean>()
  clicked = output<{ feedback: string }>();
  buttonText = computed(() => this.isLoading() ? 'Generating...' : 'Send'); 
  viewModel = computed(() => ({
    feedback: this.feedback(),
    isLoading: this.isLoading(),
    buttonText: this.buttonText(),
  }));

  handleClicked() {
    this.clicked.emit({
      feedback: this.feedback(),
    });
    this.isLoading.set(true);
  }

  get vm() {
    return this.viewModel();
  }
}
