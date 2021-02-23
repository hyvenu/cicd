import { AdminService } from './../admin.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Editor, toHTML } from 'ngx-editor';
import { NbToastrService, NbDialogService } from '@nebular/theme';


@Component({
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.scss']
})
export class SiteSettingsComponent implements OnInit, OnDestroy  {
  editor: Editor;
  setting_value: '';
  setting_type:any;
  nbtoastService:NbToastrService;
  constructor(private AdminService:AdminService) {

  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  AddSiteSettings()
  {
    var param =
      {
        setting_Type: this.setting_type,
        setting_Value: toHTML(this.setting_value)
    };

    this.AdminService.AddSiteSettings(param).subscribe(
      (data) => {
        this.setting_type = "";
        this.setting_value = "";
        this.nbtoastService.success("Added Successfully");
      }),
      (error) => {
        this.nbtoastService.danger(error, "Error")
      };
  }
}
