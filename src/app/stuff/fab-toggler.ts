export class FabToggler {
    private _btn: HTMLElement;
    private _colorOff: string;
    private _colorOn: string;

    private _state: boolean;

    constructor(btnId: string, colorOff: string, colorOn: string) {
        this._btn = document.getElementById(btnId);
        this._colorOff = colorOff;
        this._colorOn = colorOn;

        this._state = false;

        this._btn.setAttribute('color', colorOff);
    }

    /**
     * Toggles the button's state and updates its color
     * 
     * @returns The button's new state
     */
    public toggle(): boolean {
        this._state = !this._state;
        
        this._btn.setAttribute('color', this._state ? this._colorOn : this._colorOff);

        return this._state;
    }

    public get active(): boolean {
        return this._state;
    }
}