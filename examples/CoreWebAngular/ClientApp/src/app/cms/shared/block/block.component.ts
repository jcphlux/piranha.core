import { Component, Input } from '@angular/core';

@Component({
  selector: 'block',
  templateUrl: './block.component.html'
})

export class BlockComponent {

  private _model: any;
  @Input()
  set model(val: any) {
    this._model = val;    
  };

  get model(): any {
    return this._model;
  }

  constructor() { }
}
