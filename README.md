# AI Profile Picture Generator

A web application that lets users generate, edit, and download custom AI profile pictures. 

Features

## The Generation Engine
Bring-Your-Own-Key: Securely input your own OpenAI API key to generate high-definition DALL-E masterpieces.

Smart Failsafe System: Out of credits? No API key? The app automatically detects API failures and switches to a mathematical placeholder system (generating Robo-cats, Trash-bots, and Space Fish) so the UI remains 100% interactive.

Theme Selector: Dropdown presets (`Meowl`, `Trash`, `Fish`) are prompts to guide the aesthetic of your generation.

History Gallery: Automatically saves your generated images during your session so you can swap back and forth between your favorites without losing them.

Prompt Engineering Tools
Live Prompt Box: Custom input with a character counter (100-character limit) to keep requests concise.

The "Enhance" Button: Instantly adds professional art keywords (e.g., *8k resolution, cinematic lighting, masterpiece*) into your prompt to guarantee better AI results.

Random Shuffle: Click the shuffle button to instantly load a pre-written prompt idea.

Pro Photo Editor & UI
Real-Time CSS Filters: Built-in sliders for **Brightness**, **Contrast**, and **Sepia**. The JavaScript engine mathematically calculates and applies these filters to both the main image and the circular preview in real-time.

Dynamic Preview Sizing: A slider to adjust the size of the profile picture preview box.

Dark Mode & Color Customization: Fully responsive UI that supports dark mode and dynamic color changing for a personalized aesthetic experience.

**The Troll Button:** Click at your own risk.

## Smart Export
CORS-Safe Download Engine: A custom HTML5 Canvas script that "burns" your filter edits directly into the image pixels. If browser security (CORS) blocks the download of a third-party placeholder, a built-in `try/catch` failsafe automatically opens the image in a new tab so it's never lost.
Copy to Clipboard: Copy your unedited generations directly to your clipboard to paste into Discord, Twitter, or Slack.

## How to Use It

Zero installation required!

1. Visit the live demo link.
2. (Optional) Paste in your OpenAI API Key for real AI generation.
3. Select a Theme and type a Prompt (or click Shuffle/Enhance).
4. Click **Generate**.
5. Use the sliders to edit your image.
6. Click **Download** to save your new PFP!

##Tech Stack
HTML5: Semantic structure and Canvas API integration.
CSS3: Glassmorphism UI, Dark Mode, and flexbox layouts.
Vanilla JavaScript (ES6+): Async/Await API fetching, DOM manipulation, error handling, and real-time event listeners. No frameworks. Just raw speed.
**************
