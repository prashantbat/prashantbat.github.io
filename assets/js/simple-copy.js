// Simple Code Copy Functionality - Non-intrusive version

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all code copy buttons
    initSimpleCopyButtons();
});

function initSimpleCopyButtons() {
    // Find all code blocks
    const codeBlocks = document.querySelectorAll('pre code, .highlight pre');
    
    codeBlocks.forEach(function(codeBlock) {
        // Get the text content
        const text = codeBlock.textContent;
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'simple-copy-button';
        copyButton.textContent = 'Copy';
        copyButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: #667eea;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            z-index: 1000;
        `;
        
        // Add click handler
        copyButton.addEventListener('click', function() {
            copyText(text, copyButton);
        });
        
        // Create wrapper if needed
        let wrapper = codeBlock.closest('.code-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper';
            wrapper.style.cssText = `
                position: relative;
                margin: 20px 0;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #e1e8ed;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;
            
            // Insert wrapper before code block
            codeBlock.parentNode.insertBefore(wrapper, codeBlock);
            // Move code block into wrapper
            wrapper.appendChild(codeBlock);
        }
        
        // Add header
        if (!wrapper.querySelector('.code-header')) {
            const header = document.createElement('div');
            header.className = 'code-header';
            header.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 8px 15px;
                border-bottom: 1px solid #e1e8ed;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const language = getLanguage(codeBlock);
            const languageSpan = document.createElement('span');
            languageSpan.textContent = language;
            languageSpan.style.cssText = 'color: white; font-size: 12px; font-weight: 600;';
            
            header.appendChild(languageSpan);
            header.appendChild(copyButton);
            
            wrapper.insertBefore(header, wrapper.firstChild);
        } else {
            // Add copy button to existing header
            const existingHeader = wrapper.querySelector('.code-header');
            existingHeader.appendChild(copyButton);
        }
    });
}

function getLanguage(codeBlock) {
    // Try to get language from classes
    const classes = (codeBlock.className || '') + ' ' + (codeBlock.parentElement.className || '');
    const match = classes.match(/language-(\w+)/);
    if (match) {
        return match[1];
    }
    
    // Fallback to 'bash' for terminal commands
    if (codeBlock.textContent.includes('$ ') || codeBlock.textContent.includes('# ')) {
        return 'bash';
    }
    
    return 'text';
}

function copyText(text, button) {
    // Use Clipboard API if available
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showFeedback(button, 'Copied!');
        }).catch(() => {
            fallbackCopy(text, button);
        });
    } else {
        fallbackCopy(text, button);
    }
}

function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showFeedback(button, 'Copied!');
    } catch (err) {
        console.error('Failed to copy:', err);
        showFeedback(button, 'Failed!');
    }
    
    document.body.removeChild(textArea);
}

function showFeedback(button, message) {
    const originalText = button.textContent;
    button.textContent = message;
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#667eea';
    }, 2000);
}