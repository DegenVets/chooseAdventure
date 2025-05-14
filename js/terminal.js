class Terminal {
    constructor() {
        this.outputElement = document.getElementById('terminal-output');
        this.inputElement = document.getElementById('terminal-input');
        this.typingSpeed = 25; // milliseconds per character
        this.setupEventListeners();
        this.commandHistory = [];
        this.historyIndex = -1;
        this.isTyping = false;
        this.commandQueue = [];
    }

    setupEventListeners() {
        this.inputElement.addEventListener('keydown', this.handleInput.bind(this));
    }

    handleInput(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const command = this.inputElement.value.trim();
            
            // If we're waiting for a name, don't allow empty input
            if (game && game.waitingForName && !command) {
                game.terminal.writeNPC("I didn't catch that. What's your username?");
                return;
            }
            
            if (command || (game && game.waitingForName)) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.processCommand(command);
            }
            this.inputElement.value = '';
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.inputElement.value = this.commandHistory[this.historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.inputElement.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.inputElement.value = '';
            }
        } else if (event.key === 'Tab') {
            // Prevent tab from moving focus
            event.preventDefault();
            
            // If we're waiting for code, insert a tab character
            if (game && game.waitingForCodeChallenge) {
                const cursorPos = this.inputElement.selectionStart;
                const currentValue = this.inputElement.value;
                
                // Insert a tab (2 spaces) at cursor position
                this.inputElement.value = 
                    currentValue.substring(0, cursorPos) + 
                    "  " + 
                    currentValue.substring(cursorPos);
                
                // Move cursor after the inserted tab
                this.inputElement.selectionStart = cursorPos + 2;
                this.inputElement.selectionEnd = cursorPos + 2;
            }
        }
    }

    processCommand(command) {
        // Echo the command
        this.writeLine(`> ${command}`, 'user-command');
        
        // Delegate to the game logic
        game.handleCommand(command);
    }

    writeLine(text, className = '') {
        const line = document.createElement('div');
        line.className = className + ' fadeIn';
        line.textContent = text;
        this.outputElement.appendChild(line);
        this.scrollToBottom();
    }

    writeStory(text) {
        const line = document.createElement('div');
        line.className = 'story-text fadeIn';
        line.textContent = text;
        this.outputElement.appendChild(line);
        this.scrollToBottom();
    }

    writeNPC(text) {
        const line = document.createElement('div');
        line.className = 'npc-text fadeIn';
        line.textContent = text;
        this.outputElement.appendChild(line);
        this.scrollToBottom();
    }

    async typeWriter(text, className = '') {
        if (this.isTyping) {
            this.commandQueue.push({ text, className });
            return;
        }

        this.isTyping = true;
        const line = document.createElement('div');
        line.className = className + ' typing-effect';
        this.outputElement.appendChild(line);
        
        for (let i = 0; i < text.length; i++) {
            line.textContent = text.substring(0, i + 1);
            this.scrollToBottom();
            await this.sleep(this.typingSpeed);
        }
        
        line.classList.remove('typing-effect');
        line.classList.add('fadeIn');
        this.isTyping = false;
        
        // Process queue
        if (this.commandQueue.length > 0) {
            const nextCommand = this.commandQueue.shift();
            this.typeWriter(nextCommand.text, nextCommand.className);
        }
    }

    async typeStory(text) {
        await this.typeWriter(text, 'story-text');
    }

    async typeNPC(text) {
        await this.typeWriter(text, 'npc-text');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clear() {
        this.outputElement.innerHTML = '';
    }

    scrollToBottom() {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    displayChoices(choices) {
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'choices-container fadeIn';
        
        choices.forEach((choice, index) => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'choice';
            choiceElement.textContent = `${index + 1}. ${choice.text}`;
            choiceElement.addEventListener('click', () => {
                this.inputElement.value = (index + 1).toString();
                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                this.inputElement.dispatchEvent(event);
            });
            choicesContainer.appendChild(choiceElement);
        });
        
        this.outputElement.appendChild(choicesContainer);
        this.scrollToBottom();
    }
}