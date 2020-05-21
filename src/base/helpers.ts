export class DebugDiv {
  private _div: HTMLElement;

  constructor() {
    this._div = document.getElementById("debug-info")!;
  }

  set(text: string) {
    this._div.innerHTML = text;
  }

  add(text: string) {
    this._div.innerHTML += `<span style="width: 100px; display: inline-block;">${text}</span>`;
  }

  new_line() {
    this._div.innerHTML += '<br>';
  }

  add_line(text: string) {
    this._div.innerHTML += `<div>${text}</div>`;
  }
}

export var debug_div = new DebugDiv();