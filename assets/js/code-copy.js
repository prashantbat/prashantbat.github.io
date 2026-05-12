// Code Copy Functionality for Jekyll Blog

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all code copy buttons
    initCodeCopyButtons();
});

function initCodeCopyButtons() {
    // Find all code blocks and add copy functionality
    const codeBlocks = document.querySelectorAll('.highlight pre, .highlight code, pre code');
    
    codeBlocks.forEach(function(codeBlock) {
        // Check if this code block already has a wrapper
        if (codeBlock.closest('.code-wrapper')) {
            return; // Skip if already wrapped
        }
        
        // Get the language from the parent or fallback
        const language = getLanguage(codeBlock);
        
        // Create the wrapper structure
        const wrapper = createCodeWrapper(codeBlock, language);
        
        // Replace the original code block with the wrapper
        if (codeBlock.parentNode) {
            codeBlock.parentNode.replaceChild(wrapper, codeBlock);
        }
    });
}

function getLanguage(codeBlock) {
    // Try to get language from class or parent
    const parent = codeBlock.parentElement;
    const classes = parent.className || '';
    
    const match = classes.match(/language-(\w+)/);
    if (match) {
        return match[1];
    }
    
    // Check code block itself
    const blockClasses = codeBlock.className || '';
    const blockMatch = blockClasses.match(/language-(\w+)/);
    if (blockMatch) {
        return blockMatch[1];
    }
    
    // Fallback to 'bash' for terminal commands
    if (codeBlock.textContent.includes('$ ') || codeBlock.textContent.includes('# ')) {
        return 'bash';
    }
    
    return 'text';
}

function createCodeWrapper(codeBlock, language) {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';
    
    const header = document.createElement('div');
    header.className = 'code-header';
    
    const languageSpan = document.createElement('span');
    languageSpan.className = 'code-language';
    languageSpan.textContent = language;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = `
        <svg class="copy-icon" viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        Copy
    `;
    copyButton.onclick = function() {
        copyCode(copyButton, codeBlock);
    };
    
    header.appendChild(languageSpan);
    header.appendChild(copyButton);
    
    const highlightDiv = document.createElement('div');
    highlightDiv.className = 'highlight';
    highlightDiv.appendChild(codeBlock);
    
    wrapper.appendChild(header);
    wrapper.appendChild(highlightDiv);
    
    return wrapper;
}

function copyCode(button, codeBlock) {
    const text = codeBlock.textContent;
    
    // Show loading state
    const originalHTML = button.innerHTML;
    button.innerHTML = `
        <svg class="copy-icon" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
        Copying...
    `;
    button.disabled = true;
    
    // Use Clipboard API if available
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopied(button);
        }).catch(() => {
            fallbackCopy(text, button, originalHTML);
        });
    } else {
        fallbackCopy(text, button, originalHTML);
    }
}

function fallbackCopy(text, button, originalHTML) {
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
        showCopied(button);
    } catch (err) {
        console.error('Failed to copy:', err);
        button.innerHTML = originalHTML;
        button.disabled = false;
    }
    
    document.body.removeChild(textArea);
}

function showCopied(button) {
    button.innerHTML = `
        <svg class="copy-icon" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
        Copied!
    `;
    button.classList.add('copied');
    
    setTimeout(() => {
        button.innerHTML = `
            <svg class="copy-icon" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Copy
        `;
        button.classList.remove('copied');
    }, 2000);
}