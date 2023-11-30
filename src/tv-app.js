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
    this.currentSlideIndex = 0;
  }

  nextSlide() {
    if (this.currentSlideIndex < this.listings.length - 1) {
      this.currentSlideIndex++;
      this.updateSlide();
    }
  }

  previousSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.updateSlide();
    }
  }

  updateSlide() {
    const currentSlideData = this.listings[this.currentSlideIndex];
    const videoPlayer = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player');
    if (videoPlayer) {
      videoPlayer.source = currentSlideData.metadata.source;
      videoPlayer.seek(currentSlideData.metadata.timecode);
    }
  
    // Update the tv-channel in the lecture-player section
    const lecturePlayerChannel = this.shadowRoot.querySelector('.lecture-player .activeLectureSlide');
    if (lecturePlayerChannel) {
      lecturePlayerChannel.title = currentSlideData.title;
      lecturePlayerChannel.presenter = currentSlideData.metadata.author;
      lecturePlayerChannel.description = currentSlideData.description;
      // If you have any other properties to update, do it here
      lecturePlayerChannel.requestUpdate(); // Request update if needed
    }
  
    // Update the active state in the sidebar
    const channels = this.shadowRoot.querySelectorAll('tv-channel');
    channels.forEach((channel, index) => {
      channel.classList.toggle('active', index === this.currentSlideIndex);
      // Add any other UI updates you need for each channel
    });
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
      currentSlideIndex: { type: Number },
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
      }

      .grid-container {
        display: grid;
        grid-template-columns: 3fr 1fr; /* 3 to 1 ratio between main content and sidebar */
        grid-template-rows: auto 50px auto; /* auto for content, fixed height for slide info and player */
        grid-template-areas: 
          "lecture-screen lecture-sidebar"
          "lecture-slide-info lecture-sidebar"
          "lecture-player lecture-sidebar";
        height: 100%; /* Fill the height of the host */
        gap: 16px; /* Space between grid items */
      }

      .lecture-content {
        display: grid;
        grid-template-rows: 70vh 20vh auto; /* Divide the content area into three rows */
        grid-template-columns: 1fr; /* Single column layout in this container */
      }

      .lecture-screen {
        grid-area: lecture-screen;
        background-color: #ddd;
      }

      .lecture-slide-info {
        grid-area: lecture-slide-info;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #eee; /* Placeholder color */
        padding: 0 1em;
      }

      .lecture-player {
        grid-area: lecture-player;
        background-color: #eeeeee;
      }

      .lecture-sidebar {
        grid-area: lecture-sidebar;
        background-color: #f8f8f8;
        overflow-y: auto;  // Enables scrolling
        padding: 10px;
        -webkit-overflow-scrolling: touch; // For smooth scrolling on touch devices
      }

      tv-channel {
        flex: 0 0 auto; // Prevents channels from shrinking
        margin-bottom: 10px; // Spacing between channels
      }

      .previous-slide, .next-slide {
        font-size: 20px;
        background-color: #eeeeee;
        /* Centering text in the button */
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px; /* Adjust padding as needed */
      }

      @media screen and (max-width: 768px) {

        .grid-container {

          grid-template-columns: 1fr; /* Stack sidebar below the main content on small screens */
          grid-template-rows: auto 50px auto 1fr;
          grid-template-areas:
            "lecture-screen"
            "lecture-slide-info"
            "lecture-player"
            "lecture-sidebar";
        }
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`

      <div class="grid-container">
        <div class="lecture-screen">
          <video-player source = 'https://www.youtube.com/watch?v=PedcMZihFbM&t'></video-player>
        </div>

        <div class="lecture-slide-info">
          <!-- Information about the current slide -->
          <button class="previous-slide" @click="${this.previousSlide}">Previous Slide</button>
          <button class="next-slide" @click="${this.nextSlide}">Next Slide</button>
        </div>

        <div class="lecture-player">
          <tv-channel title="HAX: Wordpress Killer" presenter="Bryan Ollendyke" class="activeLectureSlide" descriptionShown >

          </tv-channel>
        </div>

        <div class ="lecture-sidebar">
          ${
            this.listings.map(
              (item) => html`
                <tv-channel 
                  title="${item.title}"
                  presenter="${item.metadata.author}"
                  description="${item.description}"
                  timecode=${item.metadata.timecode}
                  @click="${this.itemClick}"
                >
                </tv-channel>
              `
            )
          }
        </div> 
      </div>
    `;
  }

  // Lifecycle callback for property changes
  itemClick(e) {
    console.log(e.target);
    const activeItem = this.shadowRoot.querySelector(".activeLectureSlide");
    console.log(activeItem);
    activeItem.setAttribute("title", e.target.title);
    activeItem.setAttribute("presenter", e.target.presenter);
    activeItem.setAttribute("description", e.target.description);
    console.log(e.target.timecode);
    this.shadowRoot.querySelector("video-player").shadowRoot.querySelector('a11y-media-player').seek(e.target.timecode);
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").media.currentTime;
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
    const clickedIndex = this.listings.findIndex(item => item.title === e.target.title);
    if (clickedIndex >= 0) {
      this.currentSlideIndex = clickedIndex;
      this.updateSlide();
    }
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
