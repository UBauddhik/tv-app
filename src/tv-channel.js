// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.presenter = '';
    this.description = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      thumbnail: { type: String },
      description: { type: String },
      highlighted: { type: Boolean },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: block;
        margin-bottom: 16px;
      }
  
      .wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background-color: #f8f8f8;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        cursor: pointer;
        transition: box-shadow 0.3s, background-color 0.3s;
        overflow: hidden; /* Ensure no overflow outside the border radius */
      }
  
      .wrapper:hover, .wrapper.highlighted {
        background-color: #e9ecef;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      .thumbnail {
        width: 100%; /* Full width of the container */
        height: 100%;
        object-fit: contain;
        
      }

      .text-overlay {
        position: absolute;
        bottom: 0; /* Align with the bottom of the container */
        left: 0;
        width: 100%;
        text-align: center;
        color: #2e2b2b; /* White text for better contrast */
        padding: 10px;
        backdrop-filter: blur(15px); /* Apply a blur effect to the background */
        -webkit-backdrop-filter: blur(15px); /* For Safari browser compatibility */
      }




      h3, h4 {
        margin: 0;
        color: inherit; /* Use color from the parent element */
      }

      .highlighted {
        background-color: #005792;
        color: #fff;
      }
    `;
  }

  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper ${this.highlighted ? 'highlighted' : ''}" >
        ${this.thumbnail ? html`<img src="${this.thumbnail}" alt="${this.title}" class="thumbnail">` : ''}
        <div class="text-overlay">
          <h3>${this.title}</h3>
          <h4>${this.presenter}</h4>
        </div>
      </div>  
    `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
