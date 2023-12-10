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
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.activeIndex = 0;
  }

  /**
 * Lifecycle callback for when the component is connected to the DOM.
 * Sets up an interval to periodically check the current time of the video
 * and update the active channel index accordingly.
 */
  connectedCallback() {
    super.connectedCallback();
    // Set an interval to check the video's current time every second
    this._updateTimeInterval = setInterval(() => {
      // Access the video player element and its current playback time
      const videoPlayer = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player');
      const currentTime = videoPlayer.currentTime;
      
      // Find the active index based on the current time of the video
      let newActiveIndex = this.findActiveIndex(currentTime);
      
      // Update the active index if it's different from the current activeIndex
      if (newActiveIndex !== this.activeIndex) {
          this.activeIndex = newActiveIndex;
          // Request an update to re-render the component with the new active index
          this.requestUpdate(); 
      }
    }, 1000);
  }

  /**
  * Determines the active index (channel) based on the current time of the video.
  * This function iterates backwards through the listings array to find the first
  * listing whose timecode is less than or equal to the given currentTime.
  * @param {number} currentTime - The current time of the video player.
  * @returns {number} The index of the active channel based on the current time.
  */

  findActiveIndex(currentTime) {
    // Iterate backwards through the listings
    for (let i = this.listings.length - 1; i >= 0; i--) {
        // If the current time is greater than or equal to a listing's timecode,
        // return that listing's index as the active index
        if (currentTime >= this.listings[i].metadata.timecode) {
            return i;
        }
    }
    // If no match is found, return 0 (default to the first index)
    return 0;
  }


  /**
  * Lifecycle callback for when the component is disconnected from the DOM.
  * Clears the interval set in connectedCallback to prevent memory leaks.
  */

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clear the interval to stop updating the active index
    if (this._updateTimeInterval) {
      clearInterval(this._updateTimeInterval);
    }
  }

  /**
  * Updates the currently active slide based on a new index.
  * Optionally updates the video time to match the new slide.
  * @param {number} newIndex - The new index to set as the active slide.
  * @param {boolean} [updateVideo=true] - Flag to control whether to update the video time.
  */

  updateSlide(newIndex, updateVideo = true) {
    // Check if the newIndex is valid and different from the current activeIndex
    if (newIndex >= 0 && newIndex < this.listings.length && newIndex !== this.activeIndex) {
      // Update the activeIndex to the new index
      this.activeIndex = newIndex;
      
      // If updateVideo flag is true, seek the video to the new slide's timecode
      if (updateVideo) {
        const videoPlayer = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player');
        videoPlayer.seek(this.listings[newIndex].metadata.timecode);
        videoPlayer.play();
      }
    }
  }

  /**
  * Navigates to the next slide.
  */

  nextSlide() {
    this.updateSlide(this.activeIndex + 1);
  }

  /**
  * Navigates to the previous slide.
  */

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
        background-color: #f0f0f0; 
        color: #333; 
        font-family: 'Roboto', sans-serif; 
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
        box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
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
        background-color: #FFFFFF; 
        color: #333; 
        padding: 16px;
        margin: 0; 
        border-radius: 4px; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
        font-family: 'Roboto', sans-serif;
      }

      .lecture-sidebar {
        grid-area: lecture-sidebar;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow-y: auto; 
        max-height: calc(100vh - 120px); 
        padding: 10px;
        border-radius: 8px; 
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
        background-color: #005792;
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
          grid-template-columns: 1fr; 
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
    // Determine the active channel based on the current activeIndex.
    const activeChannel = this.activeIndex >= 0 && this.activeIndex < this.listings.length
    ? this.listings[this.activeIndex]
    : null;

    return html`
      <div class="grid-container">
        
        <!-- Video Player Section -->
        <div class="lecture-screen">
          <!-- Embed the video player with the specified source URL -->
          <video-player source = 'https://youtu.be/-HmaAl2X09E'></video-player>
        </div>

        <!-- Navigation Buttons Section -->
        <div class="button-box">
          <!-- Button to navigate to the previous slide -->
          <button class="prev" @click="${this.previousSlide}">Previous Slide</button>
          <!-- Button to navigate to the next slide -->
          <button class="next" @click="${this.nextSlide}">Next Slide</button>
        </div>

        <!-- Player Description Section -->
        <div class="player-description">
          <!-- Conditionally display the title and description of the active channel -->
          ${activeChannel ? html`
            <h3>${activeChannel.title}</h3>
            <p>${activeChannel.description}</p>
          ` : html`<p>No active slide.</p>`}
        </div>

        <!-- Lecture Sidebar Section -->
        <div class ="lecture-sidebar">
          <!-- Map through the listings to generate tv-channel elements -->
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
                  @click="${() => { 
                    // Log the channel click event and update the slide
                    console.log(`[Click Event] Channel Index: ${index}`);
                    this.updateSlide(index);
                  }}"
                ></tv-channel>
            `)}
        </div> 
      </div>
    `;
  }

  /**
   * Lifecycle callback that is invoked after the element’s properties have been updated.
   * This method ensures that changes to properties trigger appropriate actions.
   *
   * @param {Map} changedProperties - A map of properties that have changed, mapping the name to the old value.
   */

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      // Handle updates to the 'source' property.
      if (propName === "source" && this[propName]) {
        // Update the source data when the 'source' property changes.
        this.updateSourceData(this[propName]);
      }

      // Handle updates to the 'activeIndex' property.
      if (propName === "activeIndex") {
        // Update the UI to reflect the new active slide.
        this.updateUI();
      }
    });
  }

  /**
   * Update the user interface based on the current active index.
   * This method updates the details displayed for the active slide and ensures the active channel is visible.
   */

  updateUI() {
    // Retrieve data for the current active slide.
    const currentSlideData = this.listings[this.activeIndex];

    if (currentSlideData) {
      // Locate and update the active item in the UI, if it exists.
      const activeItem = this.shadowRoot.querySelector(".activeLectureSlide");
      if (activeItem) {
        // Populate the active item with title, presenter, and description from the current slide data.
        activeItem.title = currentSlideData.title;
        activeItem.presenter = currentSlideData.metadata.author;
        activeItem.description = currentSlideData.description;
      }

      // Scroll the active channel into view in the sidebar.
      const activeChannel = this.shadowRoot.querySelector(`tv-channel[index="${this.activeIndex}"]`);
      if (activeChannel) {
        // Smoothly scroll to make the active channel visible.
        activeChannel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Update the active state of all channel components in the sidebar.
      const channels = this.shadowRoot.querySelectorAll('tv-channel');
      channels.forEach((channel, index) => {
        // Set the 'active' class based on whether the channel index matches the active index.
        channel.classList.toggle('active', index === this.activeIndex);
      });
    }
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
      // Handle errors appropriately for the application
    }
  }  
}

// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);