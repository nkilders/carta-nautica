export class FabToggler {
    private readonly button: HTMLElement;
    private readonly colorOff: string;
    private readonly colorOn: string;

    private state: boolean;

    constructor(buttonId: string, colorOff: string, colorOn: string) {
        this.button = document.getElementById(buttonId);
        this.colorOff = colorOff;
        this.colorOn = colorOn;

        this.state = false;

        this.button.setAttribute('color', colorOff);
    }

    public toggle(): boolean {
        this.state = !this.state;

        this.button.setAttribute('color', this.state ? this.colorOn : this.colorOff);

        return this.state;
    }

    public get active(): boolean {
        return this.state;
    }
}