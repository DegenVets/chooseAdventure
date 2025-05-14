// This script will run if the main game script fails to load or initialize properly
(function() {
    // Check if game has started after 3 seconds
    setTimeout(function() {
        // Check if the game has been initialized
        if (!window.game) {
            console.log("Game hasn't started, attempting fallback initialization");
            
            // Get the terminal output element
            const output = document.getElementById('terminal-output');
            const input = document.getElementById('terminal-input');
            
            // If output exists but game hasn't started
            if (output) {
                // Create a basic terminal functionality
                const terminal = {
                    print: function(text) {
                        const line = document.createElement('div');
                        line.textContent = text;
                        line.className = 'story-text fadeIn';
                        output.appendChild(line);
                        
                        // Auto-scroll
                        output.scrollTop = output.scrollHeight;
                    }
                };
                
                // Display an error message
                terminal.print("System initialization error detected.");
                terminal.print("Attempting emergency terminal boot...");
                
                setTimeout(function() {
                    terminal.print("Emergency terminal active.");
                    terminal.print("");
                    terminal.print("🕹️ Welcome, Weary Adventurer... 🕹️");
                    terminal.print("");
                    terminal.print("Type 'restart' or reload the page to try again.");
                    
                    // Set up basic input handling
                    if (input) {
                        input.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') {
                                const command = input.value.trim();
                                input.value = '';
                                
                                if (command) {
                                    const cmdLine = document.createElement('div');
                                    cmdLine.className = 'user-command fadeIn';
                                    cmdLine.textContent = `> ${command}`;
                                    output.appendChild(cmdLine);
                                    output.scrollTop = output.scrollHeight;
                                    
                                    if (command.toLowerCase() === 'restart') {
                                        window.location.reload();
                                    } else if (command.toLowerCase() === 'credits') {
                                        terminal.print("🎮 WEARY ADVENTURER TERMINAL 🎮");
                                        terminal.print("A Choose-Your-Own-Adventure Tech Hazing Experience");
                                        terminal.print("");
                                        terminal.print("Created with the help of your friendly AI assistant");
                                        terminal.print("Dedicated to all the nerds who've ever felt lost in a room full of devs");
                                        terminal.print("Opening registration to join the development team...");
                                        
                                        // Open the mailing list subscription in a new tab
                                        setTimeout(() => {
                                            window.open('https://app.mailingboss.com/lists/66ea00e72dcd1/subscribe', '_blank');
                                        }, 2000);
                                    } else if (command.toLowerCase() === 'help') {
                                        terminal.print("Available commands:");
                                        terminal.print("- restart: Reload the game");
                                        terminal.print("- credits: View the development team");
                                        terminal.print("- help: Show this help message");
                                    } else {
                                        terminal.print("Command processing subsystem offline. Try 'restart', 'credits', or 'help'.");
                                    }
                                }
                            }
                        });
                        
                        // Focus on the input
                        input.focus();
                    }
                }, 1000);
                
                // Show the game screen if still on start screen
                const startScreen = document.getElementById('start-screen');
                const gameScreen = document.getElementById('game-screen');
                
                if (startScreen && startScreen.style.display !== 'none' && gameScreen) {
                    startScreen.style.display = 'none';
                    gameScreen.style.display = 'flex';
                }
            } else {
                // If the terminal output doesn't exist, there's a more serious problem
                // Try to create a minimal emergency interface
                document.body.innerHTML = `
                    <div style="font-family: monospace; color: #33ff33; background-color: #121212; padding: 20px; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                        <h1 style="color: #ff5f56;">CRITICAL SYSTEM FAILURE</h1>
                        <p>Terminal initialization failed.</p>
                        <p>Please reload the page or check console for errors.</p>
                        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background-color: #33ff33; color: #121212; border: none; cursor: pointer; font-family: monospace;">RESTART</button>
                        <p style="margin-top: 20px;">
                            <a href="https://app.mailingboss.com/lists/66ea00e72dcd1/subscribe" target="_blank" style="color: #33ff33; text-decoration: underline;">Join the developer team</a>
                        </p>
                    </div>
                `;
            }
        }
    }, 3000);
})();