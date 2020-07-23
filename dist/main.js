
customElements.define('person-details',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('person-template');
      const templateContent = template.content;

      const shadowRoot = this.attachShadow({mode: 'open'});

      const style = document.createElement('style');
      style.textContent = `
        div { padding: 10px; border: 1px solid gray; width: 200px; margin: 10px; }
        h2 { margin: 0 0 10px; }
        ul { margin: 0; }
        p { margin: 10px 0; }
      `;

      shadowRoot.appendChild(style);
      shadowRoot.appendChild(templateContent.cloneNode(true));
    }
  }
);

customElements.define('edit-word',
  class extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({mode: 'open'});
      const form = document.createElement('form');
      const input = document.createElement('input');
      const span = document.createElement('span');

      const style = document.createElement('style');
      style.textContent = 'span { background-color: #eef; padding: 0 2px }';

      shadowRoot.appendChild(style);
      shadowRoot.appendChild(form);
      shadowRoot.appendChild(span);

      span.textContent = this.textContent;
      input.value = this.textContent;

      form.appendChild(input);
      form.style.display = 'none';
      span.style.display = 'inline-block';
      input.style.width = span.clientWidth + 'px';

      this.setAttribute('tabindex', '0');
      input.setAttribute('required', 'required');
      this.style.display = 'inline-block';

      this.addEventListener('click', () => {
        span.style.display = 'none';
        form.style.display = 'inline-block';
        input.focus();
        input.setSelectionRange(0, input.value.length)
      });

      form.addEventListener('submit', e => {
        updateDisplay();
        e.preventDefault();
      });

      input.addEventListener('blur', updateDisplay);

      function updateDisplay() {
        span.style.display = 'inline-block';
        form.style.display = 'none';
        span.textContent = input.value;
        input.style.width = span.clientWidth + 'px';
      }
    }
  }
);


'use strict';

(function() {
  class EditableList extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // attaches shadow tree and returns shadow root reference
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
      const shadow = this.attachShadow({ mode: 'open' });

      // creating a container for the editable-list component
      const editableListContainer = document.createElement('div');

      // get attribute values from getters
      const title = this.title;
      const addItemText = this.addItemText;
      const listItems = this.items;

      // adding a class to our container for the sake of clarity
      editableListContainer.classList.add('editable-list');

      // creating the inner HTML of the editable list element
      editableListContainer.innerHTML = `
        <style>
          li, div > div {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .icon {
            background-color: #fff;
            border: none;
            cursor: pointer;
            float: right;
            font-size: 1.8rem;
          }
        </style>
        <h3>${title}</h3>
        <ul class="item-list">
          ${listItems.map(item => `
            <li>${item}
              <button class="editable-list-remove-item icon">&ominus;</button>
            </li>
          `).join('')}
        </ul>
        <div>
          <label>${addItemText}</label>
          <input class="add-new-list-item-input" type="text"></input>
          <button class="editable-list-add-item icon">&oplus;</button>
        </div>
      `;

      // binding methods
      this.addListItem = this.addListItem.bind(this);
      this.handleRemoveItemListeners = this.handleRemoveItemListeners.bind(this);
      this.removeListItem = this.removeListItem.bind(this);

      // appending the container to the shadow DOM
      shadow.appendChild(editableListContainer);
    }

    // add items to the list
    addListItem(e) {
      const textInput = this.shadowRoot.querySelector('.add-new-list-item-input');

      if (textInput.value) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        const childrenLength = this.itemList.children.length;

        li.textContent = textInput.value;
        button.classList.add('editable-list-remove-item', 'icon');
        button.innerHTML = '&ominus;';

        this.itemList.appendChild(li);
        this.itemList.children[childrenLength].appendChild(button);

        this.handleRemoveItemListeners([button]);

        textInput.value = '';
      }
    }

    // fires after the element has been attached to the DOM
    connectedCallback() {
      const removeElementButtons = [...this.shadowRoot.querySelectorAll('.editable-list-remove-item')];
      const addElementButton = this.shadowRoot.querySelector('.editable-list-add-item');

      this.itemList = this.shadowRoot.querySelector('.item-list');

      this.handleRemoveItemListeners(removeElementButtons);
      addElementButton.addEventListener('click', this.addListItem, false);
    }

    // gathering data from element attributes
    get title() {
      return this.getAttribute('title') || '';
    }

    get items() {
      const items = [];

      [...this.attributes].forEach(attr => {
        if (attr.name.includes('list-item')) {
          items.push(attr.value);
        }
      });

      return items;
    }

    get addItemText() {
      return this.getAttribute('add-item-text') || '';
    }

    handleRemoveItemListeners(arrayOfElements) {
      arrayOfElements.forEach(element => {
        element.addEventListener('click', this.removeListItem, false);
      });
    }

    removeListItem(e) {
      e.target.parentNode.remove();
    }
  }

  // let the browser know about the custom element
  customElements.define('editable-list', EditableList);
})();
