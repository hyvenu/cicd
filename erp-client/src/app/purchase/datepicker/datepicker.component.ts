import { Component, OnInit } from '@angular/core';
import {
  ColDef,
  GridReadyEvent,
  ICellEditorComp,
  ICellEditorParams,
} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
//import 'ag-grid-enterprise';
import datepickerFactory from 'jquery-datepicker';
import datepickerJAFactory from 'jquery-datepicker/i18n/jquery.ui.datepicker-en-GB';

declare const $: any; // avoid the error on $(this.eInput).datepicker();
datepickerFactory($);
datepickerJAFactory($);

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})

export class DatepickerComponent implements ICellEditorComp {
  eInput!: HTMLInputElement;

  // gets called once before the renderer is used
  init(params: ICellEditorParams) {
    // create the cell
    this.eInput = document.createElement('input');
    this.eInput.placeholder = "dd-mm-yyyy";
    this.eInput.type = "date";
    this.eInput.value = params.value;
    this.eInput.classList.add('nb-input');
    this.eInput.style.backgroundColor = 'white';
    this.eInput.style.height = '100%';

    // https://jqueryui.com/datepicker/
    // $(this.eInput).datepicker({
    //   //dateFormat: 'dd/mm/yy',
    //   dateFormat: 'dd-mm-yy',
    //   onSelect: () => {
    //     this.eInput.focus();
    //   },
    // });
  }

  // gets called once when grid ready to insert the element
  getGui() {
    return this.eInput;
  }

  // focus and select can be done after the gui is attached
  afterGuiAttached() {
    this.eInput.focus();
    this.eInput.select();
  }

  // returns the new value after editing
  getValue() {
    return this.eInput.value;
  }

  // any cleanup we need to be done here
  destroy() {
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
  }

  // if true, then this editor will appear in a popup
  isPopup() {
    // and we could leave this method out also, false is the default
    return false;
  }
}
