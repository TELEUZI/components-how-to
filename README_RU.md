# Создание разметки при помощи JS

## Перед чтением

Перед чтением убедитесь, что вам знакомы следующие концепции:

- [DOM]
- [Functions]
- [Classes]
- [OOP]

## Введение в Проблему

В мире веб-разработки, где интерактивность и динамичность приложения играют ключевую роль, создание HTML элементов с использованием JavaScript становится неотъемлемой частью создания сайта. Необходимость в динамическом формировании элементов на веб-страницах обусловлена множеством факторов, от адаптивности и реакции на события до эффективного управления данными.

Статические веб-страницы, созданные статичным HTML, ограничивают способность взаимодействия пользователя с содержимым. В этом контексте JavaScript выступает в роли ключа к разнообразию и гибкости, позволяя разработчикам создавать, изменять и удалять HTML элементы динамически, в соответствии с потребностями пользователя и требованиями приложения. В статье рассматриваются различные методы создания HTML элементов с использованием JavaScript, обосновывается необходимость такого подхода и выявляются преимущества и недостатки каждого способа.

## Наивная реализация ✨

[Template Strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) — относительно новое добавление в стандарт ES6, которое предоставляет удобный и читаемый способ вставки переменных и выражений в строки. Они также используются для создания HTML элементов при помощи свойства [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML). Пример:

```js
const bodyElement = document.body
const title = 'Welcome to our website!'
const content = 'This element comes with additional classes.'

const template = `
    <h1 class="custom-header">${title}</h1>
    <p class="content--hidden">${content}</p>
    <button>Click me!</button>
`

bodyElement.innerHTML += template
```

Таким образом можно быстро создавать некоторые куски HTML разметки в файлах Javascipt, однако использование свойства `innerHTML` для создания и обновления HTML элементов сопряжено с проблемами, которые должны учитываться при использовании. Вот некоторые из них:

1. **Безопасность:**
      Одна из основных проблем использования `innerHTML` — потенциальная уязвимость безопасности. Разметка, добавляемая через `innerHTML`, которая содержит пользовательский ввод или данные, должна пройти валидацию и [очистку от вредоносного кода](https://www.tiny.cloud/blog/input-sanitization/), чтобы избежать атак вроде внедрения скриптов ([XSS](https://owasp.org/www-community/attacks/xss/)). Неправильная обработка ввода может привести к выполнению вредоносного кода на стороне клиента.

2. **Перерисовка и потеря состояния:**
      Использование `innerHTML` приводит к полной перерисовке элемента и потомков, что будет неэффективным, особенно при работе с большими и сложными структурами DOM. Более того, при обновлении `innerHTML`, связанные события и данные будут потеряны, что затруднит поддержание состояния элемента.

3. **Избыточность обновлений:**
      При использовании `innerHTML` для обновления элемента его HTML-код перезаписывается, независимо от того, изменилась ли только часть содержимого. Это приводит к избыточности обновлений и снижению производительности, особенно при частых манипуляциях содержимым.

4. **Сложность в работе с кодом:**
      `innerHTML` работает с HTML строками, что может сделать код менее ясным и подверженным ошибкам, особенно при вставке динамически генерируемого контента. Это также создаёт трудности в обработке особых случаев, таких как экранирование символов или работа с особенностями разметки.

Дополнительная сложность при поддержке такого способа появляется в ситуации, когда нужно динамически обновить элемент, который уже создан, но у нас нет на него ссылки:

```js
bodyElement.innerHTML += `
    <h1 class="custom-header">${title}</h1>
    <p class="content--hidden">${content}</p>
    <button>Click me!</button>
`
document.querySelector('button').addEventListener('click', () => {
 document.querySelector('p').classList.toggle('content--hidden')
})
```

При этом, если бы мы создали элементы `p` и `button` самостоятельно, а не при помощи `innerHTML`, то нам бы не пришлось искать в DOM дереве при помощи `document.querySelector`, так как могли бы обращаться к ним напрямую.

Использование методов поиска по DOM, таких, как `querySelector` и аналогичных может быть удобным, однако существуют серьёзные причины их не использовать:

1. **Производительность:**
      Методы поиска по DOM могут быть медленными, особенно при выполнении сложных запросов в больших документах. Поиск по селекторам может привести к обходу большого количества элементов, что сказывается на производительности.

2. **Слабая читаемость кода:**
      Использование селекторов в коде может сделать его менее читаемым, особенно если селекторы сложны или длинны.

3. **Хрупкость кода:**
      Изменение структуры DOM может повлиять на работу селекторов, что делает код хрупким, если структура страницы меняется, селекторы могут перестать находить нужные элементы.

4. **Ограниченная переиспользуемость:**
      Код, который использует селекторы менее переиспользуем, поскольку привязан к конкретной структуре DOM. Это усложняет использование кода в других проектах или даже внутри того же проекта с измененной структурой.

5. **Легкость дублирования кода:**
      При многократном поиске одних и тех же элементов в разных частях кода легко допустить дублирование кода.

6. **Не _best practice_**
      Современные фреймворки не поощряют использование методов поиска в DOM, предлагая собственные инструменты.

Вместо `innerHTML` рекомендуется использовать безопасные и гибкие методы, такие как `document.createElement()`, `textContent`, `append()` и другие, которые дают возможность создавать и обновлять элементы DOM с учетом безопасности, эффективности и сохранения состояния. Использование непосредственного создания элементов и обращения к ним по ссылке, например, через присваивание идентификатору, позволяет писать более стабильный и производительный код. Тем не менее выбор между использованием селекторов и прямого обращения к элементам зависит от конкретного контекста приложения и требований к нему.

## Работаем руками 🤜

Реализуем такую же функциональность при помощи метода `createElement()`:

```js
const headerElement = document.createElement('h1')

// Set the text content of the element
headerElement.textContent = title

// Add the class "custom-header"
headerElement.classList.add('custom-header')

const additionalClassElement = document.createElement('p')
additionalClassElement.textContent = content
additionalClassElement.classList.add('content--hidden')

const buttonElement = document.createElement('button')
buttonElement.textContent = 'Click me!'
buttonElement.classList.add('button')
buttonElement.addEventListener('click', () => {
 additionalClassElement.classList.toggle('content--hidden')
})

// Add elements to the DOM
bodyElement.append(headerElement, additionalClassElement, buttonElement)
```

Количество кода возросло, однако теперь нет угроз, связанных с использованием `innerHTML` и можно взаимодействовать с элементами без необходимости поиска в DOM. В предыдущем примере только параграф и кнопка являются динамическими, заголовок при этом остаётся статичным, но его также пришлось создавать при помощи этого способа. При наличии статичных элементов, состояние которых не зависит от действий пользователя, их возможно создавать при помощи шаблонных строк, однако для вставки использовать метод [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML), который принимает позицию для вставки элемента и строку с HTML. Метод имеет проблемы с безопасностью, как и `innerHTML`, однако подходит для статической разметки, так как:

> It does not reparse the element it is being used on, and thus it does not corrupt the existing element it is being used on, and thus it does not corrupt the existing elements inside that element. This avoids the extra step of serialization, making it much faster than direct `innerHTML` manipulation.

Пример:

```js
const headerElement = `<h1 class="custom-header">${title}</h1>`
bodyElement.insertAdjacentHTML('afterbegin', headerElement)
bodyElement.append(additionalClassElement, buttonElement)
```

#### Преимущества

1. **Безопасность:**
      Использование `document.createElement()` и свойства `textContent` обеспечивает безопасное создание элементов, поскольку предотвращает внедрение вредоносного кода, связанного с неправильной обработкой HTML строк, как это может происходить при использовании `innerHTML`.

2. **Эффективность:**
      Метод `document.createElement()` позволяет создавать пустой элемент без непосредственного добавления в DOM. Это полезно, если нужно произвести манипуляции с элементом, прежде чем добавить на страницу. Добавление элементов с использованием `append()` более эффективно, чем полная перерисовка с `innerHTML`.

3. **Сохранение состояния:**
      Использование отдельных методов для создания, установки текстового содержимого и добавления элемента позволяет более гибко управлять состоянием и обновлением частей DOM без потери событий и данных.

#### Недостатки

1. **Больше кода:**
      Создание элементов требует больше кода, особенно при создании сложных структур.

2. **Большее количество операций:**
      Использование отдельных методов приводит к большему количеству операций для достижения того же результата, по сравнению с более компактным синтаксисом шаблонных строк.

3. **Читаемость HTML кода:**
      В случае, если структура элемента сложная и читаемость приоритетна, использование шаблонных строк является более удобным.

## Ликвидируем мартышкин труд 🐵

Нетрудно заметить, что процесс создания элементов при помощи `document.createElement()` практически одинаков для всех элементов:

1. Создать элемент
2. Присвоить классы
3. Присвоить текст
4. ???
5. PROFIT!

Используем принцип [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) и создадим функцию для создания элемента без _boilerplate code_:

Эта функция обеспечивает гибкость в создании и добавлении элементов в DOM, позволяя указывать тег, текст, родителя и классы элемента.

```js
/**
 * Function to create an HTML element with specified parameters.
 * @param {Object} options - Object containing parameters for creating the element.
 * @param {string} options.tag - HTML element tag (default is 'div').
 * @param {string} options.text - Text content of the element (default is an empty string).
 * @param {HTMLElement} options.parent - Parent HTML element to which the created element is appended (default is null).
 * @param {Array} options.classes - Array of classes to be added to the created element (default is an empty array).
 * @returns {HTMLElement} - Created HTML element.
 */
function createElement(options) {
 // Default values
 const { tag = 'div', text = '', parent, classes = [] } = options

 const element = document.createElement(tag)
 element.textContent = text // Adding classes if provided

 if (classes.length > 0) {
  element.classList.add(...classes)
 } // Adding the element to the parent element if necessary

 if (parent != null) {
  parent.appendChild(element)
 } // Returning the created element for further manipulations

 return element
}
```

Функция `createElement` принимает объект параметров `options` для создания HTML-элемента и добавления его к родительскому элементу, если тот предоставлен. Используем функцию для предыдущего примера с кнопкой:

```js
const paragraphElement = createElement({
 tag: 'p',
 text: content,
 classes: ['content--hidden'],
})

const buttonElement = createElement({
 tag: 'button',
 text: 'Click me!',
 classes: ['custom-button'],
})
buttonElement.addEventListener('click', () => {
 paragraphElement.classList.toggle('content--hidden')
})

bodyElement.append(paragraphElement, buttonElement)
```

Альтернативой передачи родительского элемента является передача дочерних элементов для создаваемого элемента:

```js
function createElement(options) {
 const { tag = 'div', text = '', children = [], classes = [] } = options
 const element = document.createElement(tag)
 element.textContent = text
 if (classes.length > 0) {
  element.classList.add(...classes)
 }
 element.append(...children)
 return element
}
```

Использование для создания динамического меню:

```js
const menuItems = [
 { text: 'Главная', href: '#' },
 { text: 'О нас', href: '#about' },
 { text: 'Контакты', href: '#contact' },
]

function createMenu1(menuItems) {
 return createElement(
  {
   tag: 'nav',
  },
  createElement(
   {
    tag: 'ul',
   },
   ...menuItems.map(item =>
    createElement(
     {
      tag: 'li',
     },
     createElement({
      tag: 'a',
      text: item.text,
      href: item.href,
     })
    )
   )
  )
 )
}
// Используем функцию для создания иерархии элементов меню
const navigation = createMenu1(menuItems)
document.body.append(navigation)
```

При этом вложенность элементов контролируется произвольно, разделим создание элементов на этапы:

```js
function createMenu2(menuItems) {
 const navElement = createElement({
  tag: 'nav',
 })
 const ulElement = createElement({ tag: 'ul' })
 ulElement.append(
  ...menuItems.map(item => {
   const liElement = createElement({ tag: 'li' })
   const aElement = createElement({
    tag: 'a',
    text: item.text,
    href: item.href,
   })
   liElement.append(aElement)
   return liElement
  })
 )
 navElement.append(ulElement)
 return navElement
}
```

Выбор стиля зависит исключительно от предпочтений и code style.

При запуске в браузере предыдущего примера можно заметить, что ссылки, созданные при помощи `createElement()` не работают, так как функция никаким образом не обрабатывает переданный аргумент `href` при создании элемента ссылки. Для решения проблемы можно либо изменить реализацию функции `createElement()`, либо создать новую, расширяющую функциональность предыдущей при помощи композиции функций. Принцип [Open-Closed](https://www.freecodecamp.org/news/open-closed-principle-solid-architecture-concept-explained/) из [SOLID](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#open-closed-principle) говорит, что лучше выбрать второй вариант. Реализуем:

```js
/**
 * Creates an HTML link element with the given text and href attributes.
 *
 * @param {Object} options - An object containing the following properties:
 *   - text (string, optional): The text content of the link element. Default is an empty string.
 *   - href (string, optional): The href attribute of the link element. Default is '#'.
 * @returns {HTMLElement} - The created link element with the specified text and href attributes.
 */
function createLinkElement(options) {
 const { text = '', href = '#' } = options
 const element = createElement({
  tag: 'a',
  text,
  classes: ['link'],
 })
 element.setAttribute('href', href)
 return element
}
```

Таким образом можно создавать отдельные функции для элементов, которым необходима специфичная функциональность (кнопки, ссылки, инпуты, формы).
Хотя функция `createElement()` предоставляет базовый способ создания и добавления элементов в DOM, существуют некоторые проблемы её использования:

1. **Отсутствие инкапсуляции:**
      Функция `createElement()` не предоставляет механизма для инкапсуляции логики и состояния компонента. В объекте параметров передаются свойства элемента, но они не связаны с методами или логикой компонента.

2. **Сложность управления состоянием:**
      Без явного управления состоянием становится сложнее создавать компоненты, которые могут реагировать на изменения состояния и обновлять интерфейс соответствующим образом.

3. **Сложность взаимодействия с другими компонентами:**
      При компонентном подходе существуют более простые механизмы для взаимодействия между компонентами, например, через передачу свойств (props). Функция `createElement()` не предоставляет таких встроенных механизмов.

4. **Ограниченная переиспользуемость:**
      Создание любых HTML-элементов происходит единым образом, однако некоторые элементы имеют собственную логику поведения, которую эта функция не учитывает.

5. **Сложность отслеживания состояния:**
      Функция `createElement` не предоставляет механизмов для отслеживания состояния компонента, что затрудняет реакцию на изменения и обновление интерфейса.

6. **Сложность обработки событий:**
      Обработка событий в функции `createElement()` требует добавления слушателей напрямую, что делает код менее структурированным и читаемым.

Функция `createElement()` предоставляет базовый уровень абстракции для создания элементов, но при разработке более сложных приложений или компонентов, применение классов и компонентного подхода может обеспечить более высокий уровень структурированности, переиспользуемости и поддерживаемости кода.

## Компонентная архитектура 🏆

[**Component-Based Architecture (CBA)**](https://nandbox.com/all-you-need-to-know-about-component-based-architecture/) — структура программной архитектуры, в которой система разбивается на независимые, переиспользуемые компоненты, каждый из которых выполняет конкретную функцию. Этот подход облегчает разработку, тестирование и поддержку программного обеспечения.

В компонентно-ориентированной архитектуре приложение строится из множества мелких, автономных компонентов, представляющих логические блоки функциональности. Эти компоненты могут взаимодействовать друг с другом, создавая сложное приложение.

Некоторые ключевые аспекты Component-Based Architecture включают:

1. **Разделение на компоненты:**
   Приложение делится на множество компонентов, каждый из которых представляет отдельную часть функциональности.

2. **Независимость компонентов:**
   Каждый компонент функционирует автономно и не зависит от внутренней реализации других компонентов. Это позволяет проводить изменения в одном компоненте, не затрагивая другие части системы.

3. **Интерфейсы и коммуникация:**
   Компоненты общаются между собой через четко определенные интерфейсы. Интерфейсы определяют способы передачи данных и управления между компонентами.

4. **Повторное использование:**
   Компоненты разрабатываются с возможностью повторного использования в различных контекстах. Это способствует уменьшению дублирования кода и ускоряет процесс разработки.

5. **Обслуживание и тестирование:**
   Компоненты могут быть тестированы и обслуживаемыми независимо от остальной системы. Это упрощает тестирование отдельных частей приложения и улучшает общую поддерживаемость системы.

6. **Примеры компонентов:**
   Компоненты могут представляться как UI-элементы в веб-разработке (например, кнопка, форма), так и более сложные функциональные блоки (например, система управления пользователями).

Применение компонентно-ориентированной архитектуры может упростить процесс разработки, обеспечить четкую организацию кода и увеличить переиспользуемость компонентов, что делает систему гибкой и масштабируемой.

Рассмотрим создание компонентов при помощи классов. Конструктов классов компонентов будет представлять собой уже созданную функцию `createElement`, созданный внутри конструктора элемент будет сохраняться в приватное поле класса, предоставляя пользователям нашего компонента интерфейс для работы с ним в виде методов, дублирующих функциональность [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), при этом расширяя её. Такой подход аналогичен использованию паттерна [Proxy](https://refactoring.guru/design-patterns/proxy).

Базовая реализация класса для компонентов может выглядеть следующим образом:

```ts
/**
 * Represents a component for creating and managing HTML elements with additional functionalities.
 * @class
 */
class Component {
 /**
  * @private
  * @type {Array<Component>} - An array to store child components.
  */
 #children = []

 /**
  * @private
  * @type {HTMLElement} - The HTML node associated with the component.
  */
 #node = null
 /**
  * Creates a new Component.
  * @constructor
  * @param {Object} options - The options for creating the component.
  * @param {string} options.tag - HTML element tag (default is 'div').
  * @param {string} options.className - CSS class name for the element.
  * @param {string} options.content - Text content of the element.
  * @param {...Component} children - Child components to be appended.
  */

 constructor({ tag, className, content }, ...children) {
  const node = document.createElement(tag ?? 'div')
  node.className = className ?? ''
  node.textContent = content ?? ''
  this.#node = node

  if (children) {
   this.appendChildren(children)
  }
 }
 /**
  * Appends a child component to the current component.
  * @param {Component} child - The child component to be appended.
  */

 append(child) {
  this.#children.push(child)
  this.#node.append(child.getNode())
 }
 /**
  * Appends an array of child components to the current component.
  * @param {Array<Component>} children - Array of child components to be appended.
  */

 appendChildren(children) {
  children.forEach(el => {
   this.append(el)
  })
 }
 /**
  * Returns the HTML node associated with the component.
  * @returns {HTMLElement} - The HTML node.
  */

 getNode() {
  return this.#node
 }
 /**
  * Returns an array of child components.
  * @returns {Array<Component>} - Array of child components.
  */

 getChildren() {
  return this.#children
 }
 /**
  * Sets the text content of the component.
  * @param {string} content - The text content to be set.
  */

 setTextContent(content) {
  this.#node.textContent = content
 }
 /**
  * Sets an attribute on the component's HTML node.
  * @param {string} attribute - The attribute to set.
  * @param {string} value - The value to set for the attribute.
  */

 setAttribute(attribute, value) {
  this.#node.setAttribute(attribute, value)
 }
 /**
  * Removes an attribute from the component's HTML node.
  * @param {string} attribute - The attribute to remove.
  */

 removeAttribute(attribute) {
  this.#node.removeAttribute(attribute)
 }
 /**
  * Toggles the presence of a CSS class on the component's HTML node.
  * @param {string} className - The class name to toggle.
  */

 toggleClass(className) {
  this.#node.classList.toggle(className)
 }
 /**
  * Adds an event listener to the component's HTML node.
  * @param {string} event - The event type to listen for.
  * @param {EventListener} listener - The callback function to be executed when the event occurs.
  * @param {boolean|AddEventListenerOptions} [options=false] - An options object specifying characteristics of the event listener.
  */

 addListener(event, listener, options = false) {
  this.#node.addEventListener(event, listener, options)
 }
 /**
  * Removes an event listener from the component's HTML node.
  * @param {string} event - The event type for which to remove the listener.
  * @param {EventListener} listener - The listener function to be removed.
  * @param {boolean|EventListenerOptions} [options=false] - Options that were used when adding the listener.
  */

 removeListener(event, listener, options = false) {
  this.#node.removeEventListener(event, listener, options)
 }
 /**
  * Destroys all child components associated with the current component.
  */

 destroyChildren() {
  this.#children.forEach(child => {
   child.destroy()
  })
  this.#children.length = 0
 }
 /**
  * Destroys the current component and removes its HTML node from the DOM.
  */

 destroy() {
  this.destroyChildren()
  this.#node.remove()
 }
}
```

Состоянием класса является созданный элемент и список дочерних элементов, которыми можно управлять при помощи методов класса. Стоит отметить, что если бы в Javascript существовал модификатор доступа `protected`, то концептуально необходимо было бы использовать именно его, так как все компоненты будут наследоваться от класса `Component` и для них важно иметь прямой доступ к собственному элементу.
Класс `Component` обеспечивает инкапсуляцию и абстракцию от деталей реализации DOM, методы по работе с DOM должен реализовать именно этот класс. Для расширения функциональности компонента вместо композиции функций будем использовать наследование классов. Реализуем компонент кнопки:

```js
class Button extends Component {
 constructor({ className, text, onClick }) {
  super({ tag: 'button', className, text })
  if (onClick) {
   this.onClick = onClick
   this.addListener('click', this.onClick)
  }
 }

 destroy() {
  this.removeListener('click', this.onClick)
  super.destroy()
 }
}
```

Кнопка создаётся, чтобы пользователь на неё нажимал, поэтому конструктор компонента кнопки принимает обработчик события `click`. Для удаления элемента из DOM используется метод `destroy()`, в классе компонента кнопки он переопределяется, для удаления слушателя события.
Вспомним пример с изменением класса элемента кликом по кнопке и перепишем с использованием компонентов:

```js
// сохраняем ссылку на элемент, который будем изменять
const paragraph = new Component({
 tag: 'p',
 className: 'content',
 text: content,
})
const app = new Component(
 {
  className: 'app',
 },
 new Component({
  tag: 'h1',
  className: 'title',
  text: title,
 }),
 paragraph,
 new Button({
  className: 'btn',
  text: 'Нажми меня',
  onClick: () => {
   paragraph.toggleClass('content--hidden')
  },
 })
)
document.body.append(app.getNode())
```

Теперь, в отличие от решения с функцией `createElement`, мы имеем набор методов, которые позволяют удобно манипулировать DOM, не вдаваясь в детали реализации браузера. А также создавать компоненты с внутренней логикой, которые взаимодействуют через вызов методов друг друга. Создадим при помощи классовых компонентов меню, которое раньше создавалось при помощи функций `createMenu*`, добавив упрощённую реализацию функциональности подсветки активной ссылки:

```js
class Menu extends Component {
 constructor({ className, items }) {
  super({ tag: 'nav', className })
  this.appendChildren(items)
 }

 toggleActiveItem(item) {
  this.getChildren().forEach(child => {
   if (child === item && !child.isActive) {
    child.addActiveClass()
   } else if (child !== item && child.isActive) {
    child.removeActiveClass()
   }
  })
 }
}

class MenuItem extends Component {
 activeClassName = 'menu__item--active'

 constructor({ className, text, href, onItemClicked = () => {} }) {
  super({ tag: 'li', className })
  this.append(
   new Link({
    className: 'menu__link',
    text,
    href,
    onClick: event => {
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
```

Для внедрения приложения на страницу создадим class App, который будет точкой входа.

```js
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
```

Этот код представляет собой набор классов для управления компонентами пользовательского интерфейса, такими как меню и элементы меню. Каждый компонент, такой как `Menu`, `MenuItem` и `Link`, является подклассом базового класса `Component`.

- `Menu` представляет собой навигационное меню и имеет функцию `toggleActiveItem`, которая изменяет активное состояние выбранного элемента меню и обновляет состояние других элементов соответственно.

- `MenuItem` представляет отдельный пункт меню, который может быть активным или неактивным. Он содержит методы `addActiveClass` и `removeActiveClass` для управления активным состоянием.

- `Link` представляет гиперссылку внутри элемента меню. Он содержит метод `setHref` для изменения адреса ссылки и функцию `onClick`, которая вызывается при клике на ссылку.

Каждый элемент меню может взаимодействовать с внешним миром с помощью функций обратного вызова ([callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) функций). Например, при клике на элемент меню, предусмотрен вызов `onItemClicked()`, который передает сам элемент в качестве параметра для дальнейших действий с ним.

Этот подход позволяет создавать гибкие и переиспользуемые компоненты пользовательского интерфейса, взаимодействующие друг с другом с использованием обратных вызовов для обработки событий и изменения состояний. Альтернативой подходу будут являться реализация событийной системы, где одни компоненты будут источниками событий, а другие компоненты будут подписываться на эти события. Такая схема взаимодействия используется реализацией паттернов [Observer](https://refactoring.guru/design-patterns/observer), [EventEmitter](https://gist.github.com/abravalheri/d137cf14652eb932f398cdffe06fc7c2), [Шина Событий](https://www.thisdot.co/blog/how-to-implement-an-event-bus-in-typescript).

[OOP]: https://en.wikipedia.org/wiki/Object-oriented_programming
[Classes]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[Functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
[DOM]: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction

## Для самых ленивых 🦥

Создание компонентов можно сократить ещё больше, создав утилитные функции по названиям тегов, которые они собой представляют:

```ts
const div = (className, ...children) =>
 new Component({ tag: 'div', className }, ...children)
const p = (className, text) => new Component({ tag: 'p', className, text })

const h1 = (className, text) => new Component({ tag: 'h1', className, text })

const button = (className, text, onClick) =>
 new Button({ className, text, onClick })
```

И так далее...
Тогда более реалистичный пример с созданием меню может выглядеть следующим образом:

```js
function createMenu(menuItems) {
 return nav(
  ['nav', 'nav--main'],
  ul(
   ['menu', 'menu--horizontal'],
   ...menuItems.map(item =>
    li(['menu__item'], a(['menu__link'], item.text, item.href))
   )
  )
 )
}
```

Пример с кнопкой перепишется в пару строк:

```js
const paragraph = p('paragraph', content)
const app = div('app', h1('title', title), paragraph, button('btn', 'Click me!', () => {
 paragraph.toggleClass('content--hidden')
})
document.body.append(app.getNode())
```

Спасибо за внимание!
