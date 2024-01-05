class Menu extends Component {
	constructor({ className, items }) {
		super({ tag: 'nav', className })
		this.appendChildren(items)
	}

	/**
	 * Toggles the active state of the specified `MenuItem` in the menu.
	 *
	 * @param {MenuItem} item - The `MenuItem` to toggle the active state for.
	 * @returns {void}
	 */
	toggleActiveItem(item) {
		this.getChildren().forEach(
			/**
			 * @param {MenuItem} child
			 */ child => {
				if (child === item && !child.isActive) {
					child.addActiveClass()
				} else if (child !== item && child.isActive) {
					child.removeActiveClass()
				}
			}
		)
	}
}

class MenuItem extends Component {
	activeClassName = 'menu__item--active'

	constructor({ className, text, href, onItemClicked }) {
		super({ tag: 'li', className })
		this.append(
			new Link({
				className: 'menu__link',
				text,
				href,
				onClick: () => {
					onItemClicked(this)
				},
			})
		)
	}

	get isActive() {
		return this.getNode().classList.contains(this.activeClassName)
	}

	addActiveClass() {
		this.toggleClass(this.activeClassName)
	}

	removeActiveClass() {
		this.toggleClass(this.activeClassName)
	}
}

class Link extends Component {
	constructor({ className, text, href, onClick }) {
		super({ tag: 'a', className, text })
		this.onClick = onClick
		this.setAttribute('href', href)
		if (onClick) {
			this.onClick = onClick
			this.addListener('click', this.onClick)
		}
	}

	setHref(href) {
		this.setAttribute('href', href)
	}

	destroy() {
		this.removeListener('click', this.onClick)
		super.destroy()
	}
}

const menuItems = [
	{ text: 'Главная', href: '#' },
	{ text: 'О нас', href: '#about' },
	{ text: 'Контакты', href: '#contact' },
]

class App {
	menu = null

	constructor() {
		this.menu = new Menu({
			className: 'nav nav--main',
			items: menuItems.map(item => {
				return new MenuItem({
					className: 'menu__item',
					text: item.text,
					href: item.href,
					onItemClicked: item => {
						this.menu.toggleActiveItem(item)
					},
				})
			}),
		})
	}

	render(root) {
		root.append(this.menu.getNode())
	}
}

const app = new App()
app.render(document.body)
