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
      timecode: { type: Number },
      title: { type: String },
      thumbnail: { type: String },
      description: { type: String },
      highlighted: { type: Boolean },
      descriptionShown: { type: Boolean },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: block;
      }
  
      .wrapper {
        display: flex;
        align-items: center;
        gap: 10px; /* Spacing between thumbnail and text */
        padding: 10px;
        margin-bottom: 10px;
        background-color: var(--background-color);
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        cursor: pointer;
        transition: box-shadow 0.3s, background-color 0.3s;
      }
  
      .wrapper:hover, .wrapper.highlighted {
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      .thumbnail {
        width: 60px; 
        height: 60px; 
        object-fit: cover;
        border-radius: 4px; 
      }
  
      .highlighted {
        background-color: var(#005792); 
        color: #fff;
      }
    `;
  }

  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper ${this.highlighted ? 'highlighted' : ''}" >
      ${this.thumbnail ? html`<img src="${this.thumbnail}" alt="${this.title}" class="thumbnail">` : ''}
        <h3>${this.title}</h3>
        <h4>${this.presenter}</h4>
        ${this.descriptionShown ? html`<p>${this.description}</p>` : ''}
      </div>  
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
