import {Component, ViewEncapsulation} from '@angular/core';
import {customers} from './customers';
import {
  RowClassArgs,
  SelectableSettings,
  SelectableMode,
  RowArgs,
  GridItem,
  SelectionEvent, EditEvent, GridComponent, CancelEvent, SaveEvent
} from "@progress/kendo-angular-grid";
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  public gridData: any[] = customers;
  public checkboxOnly = false;
  public drag = false;
  public selectableSettings: SelectableSettings;
  public mode: SelectableMode = "multiple";
  public selectedRows: any[] = [];
  public formGroup: FormGroup;
  private editedRowIndex: number;
  public value = 0;
  public running: number;

  constructor() {
    this.setSelectableSettings();
  }

  public rowCallback(context: RowClassArgs){

    const isEven = context.index % 2 === 0;
    const isSelected = context.dataItem.Selected === 'true';
    return {
      even: isEven,
      odd: !isEven,
      selected: isSelected
    };
    console.log("rowcallback-called")
  }
  public disableRow(dataItem: any, rowIndex: any) {

    dataItem.Selected = 'true';

    setTimeout(() => {
      dataItem.Selected = 'false';
    }, 3000);
    console.log("disablerow-called")
  }

  public setSelectableSettings(): void {
    if (this.checkboxOnly || this.mode === "single") {
      this.drag = false;
    }

    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
    console.log("setSelectableSettings-called")
  }

  public onSelectedClicked(): void {
    this.selectedRows.forEach((value, index) => {
      value.Selected = 'true';

      setTimeout(() => {
        value.Selected = 'false';
      }, 3000);
    });
    console.log("onSelectedClicked-called")
  }
  public onSelect(e: SelectionEvent) {
    if( e.deselectedRows !== undefined){
      e.deselectedRows?.forEach((value, index) => {
        this.removeElementFromArray(value.dataItem);
      });
    }
    if ( e.selectedRows !== undefined){
      e.selectedRows.forEach((value, index) => {
        this.selectedRows.push(value.dataItem);
      });
    }
    console.log(this.selectedRows);
    console.log("onSelect called")
  }

  //local element remover from list
  public removeElementFromArray(element: any){
    this.selectedRows.forEach((value,index) => {
      if(value == element){
        this.selectedRows.splice(index,1);
      }
    });
    console.log("removeElementFromArray-called")
  }

  public listItems: Array<string> = [
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "2X-Large",
  ];

  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values
    const { dataItem } = args;

    this.formGroup = new FormGroup({
      ProductID: new FormControl(dataItem.ProductID),
      ProductName: new FormControl(dataItem.ProductName, Validators.required),
      UnitPrice: new FormControl(dataItem.UnitPrice),
      UnitsInStock: new FormControl(
        dataItem.UnitsInStock,
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]{1,3}"),
        ])
      ),
      Discontinued: new FormControl(dataItem.Discontinued),
    });

    this.editedRowIndex = args.rowIndex;
    // put the row in edit mode, with the `FormGroup` build above
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  public startProgress(): void {
    this.running = window.setInterval(() => {
      if (this.value <= 100) {
        this.value++;
      } else {
        this.stopProgress();
      }
    }, 50);
  }

  public stopProgress(): void {
    if (this.running) {
      clearInterval(this.running);
      this.running = 0;
    }
  }

  public resetProgress(): void {
    this.value = 0;
    this.stopProgress();
  }




}
