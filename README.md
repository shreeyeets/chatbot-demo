# ChatGPT Clone

A ChatGPT-like chatbot interface that replicates the ChatGPT UI with automatic dark/light mode detection and URL-based initial prompts.

## Features

✨ **ChatGPT-Style UI** - Faithful recreation of the ChatGPT interface with message bubbles, action buttons, and smooth animations

🌓 **Automatic Theme Detection** - Automatically switches between dark and light mode based on your system preferences

🔗 **URL-Based Prompts** - Three different entry points with pre-configured conversation starters

🤖 **OpenAI Integration** - Ready to connect with OpenAI's API for real chat functionality

📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

## Setup

### 1. Add Your OpenAI API Key

Open `script.js` and replace the placeholder with your actual API key:

```javascript
const CONFIG = {
    OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE', // Replace with your actual API key
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-3.5-turbo'
};
```

### 2. Open in Browser

Simply open any of the HTML files in your browser:

- **Grounding Conversation**: Open `grounding.html` or `index.html?prompt=grounding`
- **Mindfulness Session**: Open `mindfulness.html` or `index.html?prompt=mindfulness`
- **Reflection Conversation**: Open `reflection.html` or `index.html?prompt=reflection`

## File Structure

```
chatgpt-clone/
├── index.html          # Main chat interface
├── grounding.html      # Grounding conversation entry point
├── mindfulness.html    # Mindfulness session entry point
├── reflection.html     # Reflection conversation entry point
├── styles.css          # All styling with dark/light mode support
├── script.js           # Chat functionality and OpenAI integration
└── README.md           # This file
```

## How It Works

### URL-Based Prompts

Each HTML file redirects to the main interface with a specific prompt parameter:

- `?prompt=grounding` - Starts a grounding conversation
- `?prompt=mindfulness` - Starts a mindfulness session
- `?prompt=reflection` - Starts a reflection conversation

When the page loads, it automatically:
1. Detects the prompt type from the URL
2. Sends the initial prompt to OpenAI
3. Displays the bot's first response

### Dark/Light Mode

The interface automatically detects your system's appearance preference using CSS media queries:

```css
@media (prefers-color-scheme: dark) {
    /* Dark mode colors */
}
```

No manual toggle needed - it just works!

## Customization

### Adding New Prompts

Edit the `INITIAL_PROMPTS` object in `script.js`:

```javascript
const INITIAL_PROMPTS = {
    yourPromptName: {
        system: "Your system prompt here",
        userMessage: "The initial user message"
    }
};
```

Then create a new HTML file that redirects with `?prompt=yourPromptName`.

### Changing Colors

All colors are defined as CSS variables in `styles.css`. Modify the `:root` section for light mode and the `@media (prefers-color-scheme: dark)` section for dark mode.

### API Configuration

You can change the OpenAI model or adjust parameters in the `sendToOpenAI()` function in `script.js`:

```javascript
body: JSON.stringify({
    model: CONFIG.MODEL,
    messages: conversationHistory,
    temperature: 0.7,      // Adjust creativity (0-2)
    max_tokens: 500        // Adjust response length
})
```

## Features Included

- ✅ Message bubbles with proper alignment (user right, assistant left)
- ✅ Typing indicator animation
- ✅ Auto-resizing textarea
- ✅ Scroll to bottom button
- ✅ Copy message functionality
- ✅ Action buttons (copy, read aloud, share, more)
- ✅ Smooth animations and transitions
- ✅ Mobile-responsive design
- ✅ Conversation history management

## Browser Support

Works in all modern browsers that support:
- CSS Grid and Flexbox
- CSS Custom Properties
- ES6+ JavaScript
- Fetch API

## Notes

- The API key is stored in the client-side JavaScript. For production use, you should implement a backend proxy to keep your API key secure.
- The interface will show an error message if the API key is not configured.
- All conversation history is stored in memory and will be lost on page refresh.

## License

Free to use for personal projects.
