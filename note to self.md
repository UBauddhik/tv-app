seperate the update slide function - one of the functions should update the index, active slide index 
and another that updates the video time and that will be called when the next and previous slide is clicked on , but not when the video is playing as-is 


interval, inbuilt in java - setInterval(function() {
  // do something repeatedly
}, 1000);



Responsive Design (High Priority):

Ensure that the layout adjusts seamlessly for different screen sizes, especially for mobile devices.
The current grid layout with grid-template-areas is a good start, but consider how each element (video player, slide info, sidebar) behaves on smaller screens.
Utilize media queries to adjust the layout, font sizes, and element visibility for mobile and tablet views.
Accessibility (High Priority):

Ensure that all interactive elements are keyboard accessible, including buttons and clickable slide elements.
Use appropriate ARIA labels and roles, particularly for custom elements and interactive components.
Check color contrast ratios to ensure readability for users with visual impairments.
Consistent and Readable Typography (Medium Priority):

Establish a clear hierarchy in text elements (headings, body text, buttons).
Ensure that font sizes are legible and that there's enough contrast between text and background colors.
Consider using a consistent font family that complements the overall design.
Visual Hierarchy and Spacing (Medium Priority):

Use spacing and alignment consistently to create a clear visual structure.
Ensure that there's enough padding around elements and between text for readability.
Use headings, bold text, or different sizes to denote importance and organize content.
Button and Interactive Element Styles (Medium Priority):

Style buttons and clickable elements to make them stand out and appear interactive (e.g., change on hover).
Ensure buttons have sufficient padding and are easy to interact with, especially on touch devices.
Sidebar Design and Functionality (Medium Priority):

The sidebar containing the slides might need a more distinct design to differentiate it from the main content.
Consider implementing visual cues to indicate the currently active slide.
Ensure that the scrollbar is styled and visible for ease of navigation.
Color Scheme and Branding (Lower Priority):

Implement a color scheme that aligns with your brand or the purpose of the site.
Use colors consistently throughout the application for a cohesive look.
Animations and Transitions (Lower Priority):

Subtle animations or transitions can enhance the user experience, like when changing slides or hovering over interactive elements.
Be cautious with motion to ensure it doesn't detract from usability or accessibility.
Consistent Styling for Custom Elements (Lower Priority):

Ensure that custom elements like tv-channel have a consistent design throughout the application.
Consider reusability and how these elements fit into the overall design system of your app.