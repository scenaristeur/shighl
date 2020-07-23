// Create a class for the element
//https://github.com/mdn/web-components-examples
//https://developer.mozilla.org/fr/docs/Web/Web_Components/Using_custom_elements

class ShighlFormInput extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
  //  static get observedAttributes() {return ['text', 'l']; }

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});

    // Create spans
    const wrapper = document.createElement('span');
    wrapper.setAttribute('class', 'wrapper');

    const icon = document.createElement('span');
    icon.setAttribute('class', 'icon');
    icon.setAttribute('tabindex', 0);

    const info = document.createElement('span');
    info.setAttribute('class', 'info');

    // Take attribute content and put it inside the info span
    const text = this.getAttribute('text');
    console.log("TEXTE",text)
    info.textContent = text;

    // Insert icon
    let imgUrl;
    if(this.hasAttribute('img')) {
      imgUrl = this.getAttribute('img');
    } else {
      imgUrl = 'img/default.png';
    }

    const img = document.createElement('img');
    img.src = imgUrl;
    icon.appendChild(img);

    const input = document.createElement('INPUT')
    const button = document.createElement('BUTTON')
    button.textContent = "TEXTE"+text


    // Create some CSS to apply to the shadow dom
    const style = document.createElement('style');
    console.log(style.isConnected);

    style.textContent = `
    .wrapper {
      position: relative;
    }
    .infoDESACTIVEPOPUP {
      font-size: 0.8rem;
      width: 200px;
      display: inline-block;
      border: 1px solid black;
      padding: 10px;
      background: white;
      border-radius: 10px;
      opacity: 0;
      transition: 0.6s all;
      position: absolute;
      bottom: 20px;
      left: 10px;
      z-index: 3;
    }
    img {
      width: 1.2rem;
    }
    .icon:hover + .info, .icon:focus + .info {
      opacity: 1;
    }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    console.log(style.isConnected);
    shadow.appendChild(wrapper);

    wrapper.appendChild(info);
    wrapper.appendChild(input);
    wrapper.appendChild(button);
  }

  attributeChangedCallback(name, oldValue, newValue) {
  console.log('Custom square element attributes changed.');
  updateStyle(this);
}
}

// Define the new element
customElements.define('shighl-form-input', ShighlFormInput);