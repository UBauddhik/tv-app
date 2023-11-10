// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }

      .course-container {
        display: flex;
        flex-direction: row; /* Aligns the two main sections side by side */
      }

      .lecture-content {
        flex-grow: 1; /* Allows the content to grow to fill the space */
        display: flex;
        flex-direction: column; /* Aligns the content vertically */
        padding: 10px;
      }

      .lecture-screen {
        height: 70vh;
        width: 100%;
        background-color: #ddd;
      }

      .lecture-slide-info {
        height: 20vh;
        width: 100%;
        background-color: #eee;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 1em; /* Adds padding to the left and right of the content */
      }

      .lecture-player {
        height: 10vh;
        width: 100%;
        background-color: #ccc;
      }

      .lecture-sidebar {
        width: 250px;
        background-color: #f8f8f8;
        height: 100vh;
        overflow-y: auto;  // Enables scrolling
        padding: 10px;
        -webkit-overflow-scrolling: touch; // For smooth scrolling on touch devices
      }

      tv-channel {
        flex: 0 0 auto; // Prevents channels from shrinking
        margin-right: 100px; // Spacing between channels
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`

    <div class="course-container">
      <div class="lecture-content">
        <div class="lecture-screen">
          <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/${this.videoId}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          ></iframe>
        </div>

        <div class="lecture-slide-info">
          <!-- Information about the current slide -->
          <button class="previous-slide">Previous Slide</button>
          <button class="next-slide">Next Slide</button>
        </div>

        <div class="lecture-player">
          <!-- Player controls or additional content here -->
        </div>

        <div class = "lecture-sidebar">
          ${
            this.listings.map(
              (item) => html`
                <tv-channel 
                  title="${item.title}"
                  presenter="${item.metadata.author}"
                  @click="${this.itemClick}"
                >
                </tv-channel>
              `
            )
          }
        </div>      

      </div>
      <!-- dialog -->
      <sl-dialog label="Dialog" class="dialog">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
      </sl-dialog>
    `;
  }

  // Handles item click events
  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  // Lifecycle callback for property changes
  itemClick(e) {
    console.log(e.target);
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes | Fetches data from the source URL
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error('Network response was not ok');
      const responseData = await response.json();
      if (responseData.status === 200 && responseData.data.items) {
        this.listings = [...responseData.data.items];
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Handle errors appropriately for your application
    }
  }  
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
