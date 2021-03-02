import { Injectable, TemplateRef  } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
    console.log(this.toasts);
  }

  // Callback method to remove Toast DOM element from view
  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
