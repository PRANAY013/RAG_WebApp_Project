// Microsoft Copilot-inspired JavaScript functionality

class CopilotApp {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupChatInput();
        this.setupSuggestionCards();
        this.setupSendButton();
        this.detectSystemTheme();
    }

    // Theme Management
    detectSystemTheme() {
        // Check system preference for initial theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            this.currentTheme = 'light';
            document.documentElement.setAttribute('data-theme', 'light');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (e.matches) {
                this.setTheme('dark');
            } else {
                this.setTheme('light');
            }
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });

            // Add keyboard support
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Add smooth transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Update aria-label for accessibility
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            themeToggle.setAttribute('aria-label', label);
        }
    }

    // Chat Input Management
    setupChatInput() {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            // Auto-resize functionality
            chatInput.addEventListener('input', () => {
                this.autoResizeTextarea(chatInput);
                this.updateSendButtonState();
            });

            // Handle Enter key
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });

            // Focus management
            chatInput.addEventListener('focus', () => {
                this.scrollToInput();
            });

            // Initial resize
            this.autoResizeTextarea(chatInput);
        }
    }

    autoResizeTextarea(textarea) {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        
        // Set height based on scrollHeight, with min and max constraints
        const minHeight = 24;
        const maxHeight = 120;
        const scrollHeight = textarea.scrollHeight;
        
        if (scrollHeight <= maxHeight) {
            textarea.style.height = Math.max(scrollHeight, minHeight) + 'px';
            textarea.style.overflowY = 'hidden';
        } else {
            textarea.style.height = maxHeight + 'px';
            textarea.style.overflowY = 'auto';
        }
    }

    updateSendButtonState() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        
        if (chatInput && sendButton) {
            const hasContent = chatInput.value.trim().length > 0;
            sendButton.style.opacity = hasContent ? '1' : '0.6';
        }
    }

    setupSendButton() {
        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.handleSendMessage();
            });
        }
    }

    handleSendMessage() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        
        if (chatInput && sendButton) {
            const message = chatInput.value.trim();
            
            if (message.length > 0) {
                // Add loading state
                sendButton.classList.add('loading');
                sendButton.style.pointerEvents = 'none';
                
                // Simulate sending (replace with actual API call)
                setTimeout(() => {
                    console.log('Message sent:', message);
                    chatInput.value = '';
                    this.autoResizeTextarea(chatInput);
                    this.updateSendButtonState();
                    
                    // Remove loading state
                    sendButton.classList.remove('loading');
                    sendButton.style.pointerEvents = 'auto';
                    
                    // Show a simple response (for demo purposes)
                    this.showResponseDemo(message);
                }, 1000);
            }
        }
    }

    showResponseDemo(userMessage) {
        // Create a simple response indicator
        const responseDiv = document.createElement('div');
        responseDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--copilot-surface);
            border: 1px solid var(--copilot-border);
            border-radius: 12px;
            padding: 16px;
            box-shadow: var(--copilot-shadow-elevated);
            max-width: 300px;
            z-index: 1000;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        
        responseDiv.innerHTML = `
            <div style="font-size: 14px; color: var(--copilot-text-secondary); margin-bottom: 8px;">
                Demo Response:
            </div>
            <div style="font-size: 16px; color: var(--copilot-text);">
                I received your message: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}"
            </div>
        `;
        
        document.body.appendChild(responseDiv);
        
        // Animate in
        setTimeout(() => {
            responseDiv.style.opacity = '1';
            responseDiv.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            responseDiv.style.opacity = '0';
            responseDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (responseDiv.parentNode) {
                    responseDiv.parentNode.removeChild(responseDiv);
                }
            }, 300);
        }, 3000);
    }

    setupSuggestionCards() {
        const suggestionCards = document.querySelectorAll('.suggestion-card');
        
        suggestionCards.forEach(card => {
            card.addEventListener('click', () => {
                const suggestionText = card.querySelector('h3')?.textContent;
                if (suggestionText) {
                    this.fillInputWithSuggestion(suggestionText);
                }
            });

            // Add keyboard support
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            // Add focus styles
            card.addEventListener('focus', () => {
                card.style.outline = '2px solid var(--copilot-primary)';
                card.style.outlineOffset = '2px';
            });

            card.addEventListener('blur', () => {
                card.style.outline = 'none';
            });
        });
    }

    fillInputWithSuggestion(suggestion) {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = `Help me ${suggestion.toLowerCase()}`;
            chatInput.focus();
            this.autoResizeTextarea(chatInput);
            this.updateSendButtonState();
            this.scrollToInput();
        }
    }

    scrollToInput() {
        const inputContainer = document.querySelector('.input-container');
        if (inputContainer) {
            inputContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Smooth scroll behavior for suggestion cards
function addSmoothInteractions() {
    // Add subtle hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.suggestion-card, .theme-toggle, .send-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('suggestion-card') 
                ? 'translateY(-2px)' 
                : 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Enhanced focus management
function setupAccessibility() {
    // Skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#chatInput';
    skipLink.textContent = 'Skip to main input';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--copilot-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Announce theme changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const theme = document.documentElement.getAttribute('data-theme');
                announcer.textContent = `Switched to ${theme} mode`;
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CopilotApp();
    addSmoothInteractions();
    setupAccessibility();
    
    // Add loading animation for the page
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput && document.activeElement === chatInput) {
        setTimeout(() => {
            chatInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
});

// Prevent form submission if wrapped in a form
document.addEventListener('submit', (e) => {
    e.preventDefault();
});