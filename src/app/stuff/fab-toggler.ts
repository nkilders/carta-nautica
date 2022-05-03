export class FabToggler {
    private btn: HTMLElement;
    private colorOff: string;
    private colorOn: string;

    private state: boolean;

    constructor(btnId: string, colorOff: string, colorOn: string) {
        this.btn = document.getElementById(btnId);
        this.colorOff = colorOff;
        this.colorOn = colorOn;

        this.state = false;

        this.btn.setAttribute('color', colorOff);
    }

    /**
     * Toggles the button's state and updates its color
     * 
     * @returns The button's new state
     */
    public toggle(): boolean {
        this.state = !this.state;
        
        this.btn.setAttribute('color', this.state ? this.colorOn : this.colorOff);

        return this.state;
    }

    public get active(): boolean {
        return this.state;
    }
}