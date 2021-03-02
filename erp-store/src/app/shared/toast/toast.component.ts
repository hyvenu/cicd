import { ToastService } from './toast.service';
import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  constructor(public toastService: ToastService) {}

  isTemplate(toast) {
    console.log(this.toastService.toasts);
    return toast.textOrTpl instanceof TemplateRef; }
  ngOnInit(): void {
  }

}
