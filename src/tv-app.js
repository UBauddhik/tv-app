// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";
import '@lrnwebcomponents/video-player/video-player.js';

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.activeIndex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateTimeInterval = setInterval(() => {
      const videoPlayer = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player');
      const currentTime = videoPlayer.currentTime;
      if (this.activeIndex + 1 < this.listings.length &&
          currentTime >= this.listings[this.activeIndex + 1].metadata.timecode) {
        this.activeIndex++;  // This will trigger the updated method
      }
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._updateTimeInterval) {
      clearInterval(this._updateTimeInterval);
    }
  }

  
  // Lifecycle callback for when the element is added to the DOM
  updateSlide(newIndex, updateVideo = true) {
    if (newIndex >= 0 && newIndex < this.listings.length && newIndex !== this.activeIndex) {
      this.activeIndex = newIndex;
      this.updateSlideIndexAndUI();  // Always update the UI
      if (updateVideo) {
        this.updateVideoTime();  // Update video time only if specified
      }
    }
  }
  
  nextSlide() {
    this.updateSlide(this.activeIndex + 1);
  }
  
  previousSlide() {
    this.updateSlide(this.activeIndex - 1);
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
      activeIndex: { type: Number },
      activeItem: { type: Object }
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
        height: calc(100vh - 32px);
        background-color: #f0f0f0; /* Softer shade for background */
        color: #333; /* Dark grey for better readability */
        font-family: 'Roboto', sans-serif; /* Modern, readable font */
      }

      h1, h2, h3 {
        font-family: 'Garamond Premier Pro', serif;
        font-weight: bold;
      }

      .button-box {
        font-family: Garamond Premier Pro, serif;
      }

      .grid-container {
        display: grid;
        grid-template-columns: 1.618fr 1fr; 
        grid-template-rows: auto auto;
        grid-template-areas: 
          "lecture-screen lecture-sidebar"
          "button-box lecture-sidebar"
          "player-description lecture-sidebar";
        gap: 16px;
      }

      .button-box, .lecture-sidebar, .lecture-screen {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
      }

      .lecture-screen {
        grid-area: lecture-screen;
        border-radius: 4px;
        padding: 10px;
      }

      .button-box {
        grid-area: button-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f8f8f8;
        border: 1px solid #ccc;
        padding: 10px;
      }

      .player-description {
        grid-area: player-description;
        background-color: #FFFFFF; /* Assuming white fits the theme */
        color: #333; /* Dark grey for text */
        padding: 16px;
        margin: 0; /* Adjust as needed */
        border-radius: 4px; /* Matching the theme's border radius */
        box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow */
        /* Typography consistent with the theme */
        font-family: 'Roboto', sans-serif;
      }

      .lecture-sidebar {
        grid-area: lecture-sidebar;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow-y: auto; /* Enables vertical scrolling if content overflows */
        max-height: calc(100vh - 120px); /* Adjusted for viewport height and padding */
        padding: 10px;
        border-radius: 8px; /* Consistent border radius */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      .lecture-sidebar::-webkit-scrollbar {
        width: 8px;
      }

      .lecture-sidebar::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 4px;
      }

      .lecture-sidebar::-webkit-scrollbar-thumb:hover {
        background: #bbb;
      }

      tv-channel {
        margin: 0px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        border-color: #B5C1D0;
        border-radius: 4px;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
        flex: 0 0 auto;
      }

      .prev, .next {
        background-color: #005792; /* New primary color */
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px 24px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .prev:hover , .next:hover {
        background-color: #003d5b;
      }

      tv-channel.active {
        background-color: #e9ecef; 
        color: white; 
        border-color: var(--primary-color); 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; 
        --background-color: var(--primary-color, #005792);
      }


      @media screen and (max-width: 768px) {

        .grid-container {
          transition: transform 0.3s ease;
          grid-template-columns: 1fr; /* Stack sidebar below the main content on small screens */
          grid-template-rows: auto 50px auto 1fr;
          grid-template-areas:
            "lecture-screen"
            "button-box"
            "player-description"
            "lecture-sidebar";
        }
      }

      `
    ];
  }

  // LitElement rendering template of your element
  render() {
    const activeChannel = this.activeIndex >= 0 && this.activeIndex < this.listings.length
    ? this.listings[this.activeIndex]
    : null;

    return html`
      <div class="grid-container">
        
        <div class="lecture-screen">
          <video-player source = 'https://youtu.be/-HmaAl2X09E'></video-player>
        </div>

        <div class="button-box">
          <!-- Information about the current slide -->
          <button class="prev" @click="${this.previousSlide}">Previous Slide</button>
          <button class="next" @click="${this.nextSlide}">Next Slide</button>
        </div>

        <div class="player-description">
          ${activeChannel ? html`
            <h3>${activeChannel.title}</h3>
            <p>${activeChannel.description}</p>
          ` : html`<p>No active slide.</p>`}
        </div>

        <div class ="lecture-sidebar">
          ${
            this.listings.map(
              (item, index) => html`
                <tv-channel
                ?active="${index === this.activeIndex}" 
                .index="${index}" 
                .title="${item.title}"
                .description="${item.description}"
                .timecode="${item.metadata.timecode}"
                .thumbnail="${item.metadata.thumbnail}"
                @click="${() => this.updateSlide(index)}"
                >
                </tv-channel>
              `)}
        </div> 
      </div>
    `;

  }

  // LitElement life cycle for when any property changes | Fetches data from the source URL
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      // Handle source changes
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
  
      // Handle activeIndex changes
      if (propName === "activeIndex") {
        const currentSlideData = this.listings[this.activeIndex];
        if (currentSlideData) {
          // Update video player time
          if (currentSlideData.metadata.timecode !== undefined) {
            const videoPlayer = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player');
            videoPlayer.seek(currentSlideData.metadata.timecode);
            videoPlayer.play();
          }

          const activeChannel = this.shadowRoot.querySelector(`tv-channel[index="${this.activeIndex}"]`);
          if (activeChannel) {
            activeChannel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
  
          // Update UI for active slide
          const activeItem = this.shadowRoot.querySelector(".activeLectureSlide");
          if (activeItem) {
            // Update title, presenter, description as necessary
            // Ensure these properties exist on the activeItem
            activeItem.title = currentSlideData.title;
            activeItem.presenter = currentSlideData.metadata.author;
            activeItem.description = currentSlideData.description;
          }
  
          // Update active state of channels
          const channels = this.shadowRoot.querySelectorAll('tv-channel');
          channels.forEach((channel, index) => {
            channel.classList.toggle('active', index === this.activeIndex);
          });
        }
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