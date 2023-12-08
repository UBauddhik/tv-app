// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.presenter = '';
    this.descriptionShown = false;
    this.description = '';
    this.timecode ;
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      presenter: { type: String },
      highlighted: { type: Boolean },
      descriptionShown: { type: Boolean },
      description: { type: String },
      timecode: { type: Number },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: inline-flex;
        --background-color: #fff; /* Default white background */
        --primary-color: #005792; /* PSU Blue */
      }

      .wrapper {
        padding: 16px;
        margin-bottom: 10px;
        background-color: var(--background-color);
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        cursor: pointer;
        transition: box-shadow 0.3s, background-color 0.3s;
      }
      
      .wrapper:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      tv-channel.highlighted {
        background-color: var(--primary-color);
        color: #fff;
      }

    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper ${this.highlighted ? 'highlighted' : ''}" >
        <h3>${this.title}</h3>
        <h4>${this.presenter}</h4>
        ${this.descriptionShown ? html`<p>${this.description}</p>` : ''}
      </div>  
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
