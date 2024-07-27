export class FabToggler {
  private readonly button: HTMLElement;

  private active: boolean;

  constructor(
    buttonId: string,
    private readonly colorInactive: string,
    private readonly colorActive: string,
  ) {
    this.button = document.getElementById(buttonId)!;

    this.active = false;

    this.updateColor();
  }

  public toggle() {
    this.active = !this.active;

    this.updateColor();

    return this.active;
  }

  public isActive() {
    return this.active;
  }

  private updateColor() {
    const color = this.active ? this.colorActive : this.colorInactive;
    this.button.setAttribute('color', color);
  }
}
