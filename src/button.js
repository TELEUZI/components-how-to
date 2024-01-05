/**
 * Represents a button component.
 *
 * @class Button
 * @extends Component
 */
class Button extends Component {
	/**
	 * Creates a new Button.
	 * @constructor
	 * @param {Object} options - The options for creating the button.
	 * @param {string=} options.className - CSS class name for the element.
	 * @param {string=} options.text - Text content of the element.
	 * @param {(event: Event) => void=} options.onClick - The function to be called when the button is clicked.
	 */
	constructor({ className, text, onClick }) {
		super({ tag: 'button', className, text })
		if (onClick) {
			this.onClick = onClick
			this.addListener('click', this.onClick)
		}
	}

	destroy() {
		if (this.onClick) {
			this.removeListener('click', this.onClick)
		}
		super.destroy()
	}
}
