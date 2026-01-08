// Configuration
const CONFIG = {
    OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE', // Replace with your actual API key
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-3.5-turbo'
};

// Initial prompts based on URL parameter
const INITIAL_PROMPTS = {
    grounding: {
        system: "You are a compassionate AI assistant specialized in grounding exercises. Help users feel more present and calm through guided grounding techniques.",
        userMessage: "Start a grounding conversation"
    },
    mindfulness: {
        system: "You are a mindful AI assistant focused on meditation and mindfulness practices. Guide users through mindfulness exercises and help them develop awareness.",
        userMessage: "Start a mindfulness session"
    },
    reflection: {
        system: "You are a reflective AI assistant that helps users explore their thoughts and feelings through thoughtful questions and active listening.",
        userMessage: "Start a reflection conversation"
    }
};

// State
let conversationHistory = [];
let isTyping = false;

// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const scrollBottomBtn = document.getElementById('scrollBottomBtn');

// Initialize app
function init() {
    setupEventListeners();
    handleInitialPrompt();
}

// Setup event listeners
function setupEventListeners() {
    sendBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keydown', handleKeyPress);
    messageInput.addEventListener('input', () => {
        autoResizeTextarea();
        updateSendButtonState();
    });
    chatContainer.addEventListener('scroll', handleScroll);
    scrollBottomBtn.addEventListener('click', scrollToBottom);
}

// Update send button state
function updateSendButtonState() {
    const hasText = messageInput.value.trim().length > 0;
    sendBtn.disabled = !hasText || isTyping;
}

// Handle initial prompt from URL
function handleInitialPrompt() {
    const urlParams = new URLSearchParams(window.location.search);
    const promptType = urlParams.get('prompt');

    if (promptType && INITIAL_PROMPTS[promptType]) {
        const prompt = INITIAL_PROMPTS[promptType];

        // Set system message
        conversationHistory.push({
            role: 'system',
            content: prompt.system
        });

        // Add user message to conversation
        conversationHistory.push({
            role: 'user',
            content: prompt.userMessage
        });

        // Display user message
        addMessage(prompt.userMessage, 'user');

        // Get AI response
        setTimeout(() => {
            sendToOpenAI();
        }, 500);
    }
}

// Handle send message
function handleSendMessage() {
    const message = messageInput.value.trim();

    if (message && !isTyping) {
        addMessage(message, 'user');
        conversationHistory.push({
            role: 'user',
            content: message
        });

        messageInput.value = '';
        autoResizeTextarea();
        updateSendButtonState();

        sendToOpenAI();
    }
}

// Handle key press
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) {
            handleSendMessage();
        }
    }
}

// Auto-resize textarea
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
}

// Add message to chat
function addMessage(text, sender, isTypingResponse = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    if (isTypingResponse) {
        bubbleDiv.textContent = ''; // Start empty for typing effect
    } else {
        bubbleDiv.textContent = text;
    }

    messageDiv.appendChild(bubbleDiv);

    // Add action buttons for assistant messages (only after typing is done if it's a typing response)
    if (sender === 'assistant' && !isTypingResponse) {
        addActions(messageDiv);
    }

    chatContainer.appendChild(messageDiv);
    scrollToBottom();

    return bubbleDiv;
}

// Type message letter by letter
function typeMessage(text, bubbleDiv, messageDiv) {
    let index = 0;
    const speed = 20; // Type speed in ms

    function type() {
        if (index < text.length) {
            bubbleDiv.textContent += text.charAt(index);
            index++;
            scrollToBottom();
            setTimeout(type, speed);
        } else {
            // Typing complete, add actions
            addActions(messageDiv);
            isTyping = false;
            updateSendButtonState();
        }
    }

    type();
}

// Add actions to assistant message
function addActions(messageDiv) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message-actions';
    actionsDiv.innerHTML = `
        <button class="action-btn" aria-label="Copy" onclick="copyMessage(this)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        </button>
        <button class="action-btn" aria-label="Read aloud">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        </button>
        <button class="action-btn" aria-label="Share">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
        </button>
        <button class="action-btn" aria-label="More">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
            </svg>
        </button>
    `;
    messageDiv.appendChild(actionsDiv);
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typingIndicator';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'typing-indicator';
    indicatorDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;

    bubbleDiv.appendChild(indicatorDiv);
    typingDiv.appendChild(bubbleDiv);
    chatContainer.appendChild(typingDiv);
    scrollToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message to OpenAI
async function sendToOpenAI() {
    if (isTyping) return;

    isTyping = true;
    updateSendButtonState();
    showTypingIndicator();

    try {
        const response = await fetch(CONFIG.OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: conversationHistory,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;

        removeTypingIndicator();

        // Start typing animation
        const bubble = addMessage('', 'assistant', true);
        const messageDiv = bubble.closest('.message');
        typeMessage(assistantMessage, bubble, messageDiv);

        conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        removeTypingIndicator();

        // Show error message to user
        const errorMessage = CONFIG.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE'
            ? "Please add your OpenAI API key in the script.js file to enable chat functionality."
            : "Sorry, I'm having trouble connecting right now. Please try again.";

        const bubble = addMessage('', 'assistant', true);
        const messageDiv = bubble.closest('.message');
        typeMessage(errorMessage, bubble, messageDiv);
    }
}

// Copy message to clipboard
function copyMessage(button) {
    const messageText = button.closest('.message').querySelector('.message-bubble').textContent;
    navigator.clipboard.writeText(messageText).then(() => {
        // Visual feedback
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 1000);
    });
}

// Handle scroll
function handleScroll() {
    const scrollTop = chatContainer.scrollTop;
    const scrollHeight = chatContainer.scrollHeight;
    const clientHeight = chatContainer.clientHeight;

    // Show scroll to bottom button if not at bottom
    if (scrollHeight - scrollTop - clientHeight > 100) {
        scrollBottomBtn.classList.add('visible');
    } else {
        scrollBottomBtn.classList.remove('visible');
    }
}

// Scroll to bottom
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
