class Game {
    constructor() {
        this.terminal = new Terminal();
        this.currentScene = 'start';
        this.playerName = '';
        this.playerStats = {
            HEALTH: 100,
            MANA: 20,
            INT: 9,
            STR: 3,
            DEX: 4,
            LUCK: 7,
            CHARISMA: 0,
            TECH_CRED: 0,
            HONESTY: 0,
            SELF_AWARENESS: 0,
            WISDOM: 0,
            DIPLOMACY: 0,
            ANXIETY: 0,
            REFLEXES: 0
        };
        this.inventory = [
            "Cracked USB Stick",
            "Energy Drink (lukewarm)",
            "\"Hello, World!\" tattoo in Comic Sans",
            "Debug Duck (Cursed)"
        ];
        this.onlineUsers = [
            "CoffeeWizard",
            "BitByter",
            "CtrlAltDefeat",
            "NullPointerException",
            "SyntaxTerror",
            "RootAdmin"
        ];
        this.waitingForInput = false;
        this.waitingForName = false;
        this.waitingForCodeChallenge = false;
        this.currentCodeChallenge = '';
        this.processedScenes = new Set(); // Keep track of scenes we've already shown
    }

    async start() {
        this.updateStats();
        this.updateInventory();
        this.updateOnlineUsers();
        await this.renderScene(this.currentScene);
    }

    async renderScene(sceneId) {
        const scene = story.scenes[sceneId];
        if (!scene) {
            console.error(`Scene ${sceneId} not found`);
            return;
        }

        // Store the current scene
        this.currentScene = sceneId;
        
        // Add this scene to the processed scenes set
        this.processedScenes.add(sceneId);

        // Display story text with typing effect
        for (const line of scene.text) {
            await this.terminal.typeStory(line);
        }

        // Display NPC dialogue with typing effect
        if (scene.npcDialogue) {
            for (const line of scene.npcDialogue) {
                await this.terminal.typeNPC(line);
            }
        }

        // Process any actions
        if (scene.actions) {
            for (const action of scene.actions) {
                await this.processAction(action);
                
                // If we're waiting for a name, stop rendering the scene until name is provided
                if (this.waitingForName) {
                    return;
                }
                
                // If we're waiting for code challenge, stop rendering until code is provided
                if (this.waitingForCodeChallenge) {
                    return;
                }
            }
        }

        // Display additional text if available
        if (scene.text2) {
            // Add a small pause before continuing
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            for (const line of scene.text2) {
                await this.terminal.typeStory(line);
            }
        }

        // Display additional NPC dialogue if available
        if (scene.npcDialogue2) {
            for (const line of scene.npcDialogue2) {
                await this.terminal.typeNPC(line);
            }
        }

        // Display choices if available
        if (scene.choices) {
            this.terminal.displayChoices(scene.choices);
            this.waitingForInput = true;
        } else if (scene.nextScene) {
            // Automatic transition to next scene after a delay
            // But only if we've never seen this scene before (prevent looping)
            if (!this.processedScenes.has(scene.nextScene)) {
                setTimeout(() => {
                    this.renderScene(scene.nextScene);
                }, 1500);
            }
        }
    }

    async processAction(action) {
        switch (action.type) {
            case 'askName':
                await this.terminal.typeStory("What is your username, adventurer?");
                this.waitingForName = true;
                break;
            case 'modifyStat':
                this.playerStats[action.stat] = (this.playerStats[action.stat] || 0) + action.value;
                await this.terminal.typeStory(`${action.stat} ${action.value >= 0 ? '+' : ''}${action.value}`);
                this.updateStats();
                break;
            case 'addInventory':
                this.inventory.push(action.item);
                await this.terminal.typeStory(`Added ${action.item} to inventory`);
                this.updateInventory();
                break;
            case 'removeInventory':
                const index = this.inventory.indexOf(action.item);
                if (index > -1) {
                    this.inventory.splice(index, 1);
                    await this.terminal.typeStory(`Removed ${action.item} from inventory`);
                    this.updateInventory();
                }
                break;
            case 'codeChallenge':
                this.waitingForCodeChallenge = true;
                this.currentCodeChallenge = action.challenge;
                break;
        }
    }

    handleCommand(command) {
        // Check for special slash commands first
        if (command.startsWith('/')) {
            this.handleSlashCommand(command.toLowerCase());
            return;
        }

        if (this.waitingForName) {
            // Don't accept empty name
            if (!command.trim()) {
                this.terminal.writeNPC("You must enter a name to continue.");
                return;
            }
            
            this.setPlayerName(command);
            return;
        }

        if (this.waitingForCodeChallenge) {
            this.checkCodeChallenge(command);
            return;
        }

        if (this.waitingForInput) {
            this.processChoice(command);
            return;
        }

        // Special commands for after the game ends
        if (this.currentScene === 'final_scene') {
            if (command.toLowerCase() === 'restart') {
                this.terminal.clear();
                this.currentScene = 'start';
                this.playerName = '';
                this.processedScenes = new Set(); // Reset processed scenes
                this.waitingForName = false;  // Reset waiting flag
                this.renderScene('start');
                return;
            } else if (command.toLowerCase() === 'credits') {
                this.terminal.writeStory("🎮 WEARY ADVENTURER TERMINAL 🎮");
                this.terminal.writeStory("A Choose-Your-Own-Adventure Tech Hazing Experience");
                this.terminal.writeStory("");
                this.terminal.writeStory("Created with the help of your friendly AI assistant");
                this.terminal.writeStory("Dedicated to all the nerds who've ever felt lost in a room full of devs");
                this.terminal.writeStory("Opening registration to join the development team...");
                
                // Open the mailing list subscription in a new tab
                setTimeout(() => {
                    window.open('https://app.mailingboss.com/lists/66ea00e72dcd1/subscribe', '_blank');
                }, 2000);
                
                return;
            }
        }

        // Handle help command
        if (command.toLowerCase() === 'help') {
            this.terminal.writeStory("Available commands:");
            this.terminal.writeStory("- Type a number to select a choice");
            this.terminal.writeStory("- Type 'restart' at the end to play again");
            this.terminal.writeStory("- Type 'credits' to see the development team");
            this.terminal.writeStory("- Type '/help' for more hidden commands");
            return;
        }

        // Default command handling
        this.terminal.writeLine("Command not recognized. Wait for prompts or try 'help'.");
    }
    
    handleSlashCommand(command) {
        // Extract the main command and any parameters
        const [mainCommand, ...params] = command.split(' ');
        
        switch (mainCommand) {
            case '/help':
                this.terminal.writeStory("🔍 HIDDEN COMMAND INDEX 🔍");
                this.terminal.writeStory("------------------------");
                this.terminal.writeStory("/about - Learn about AcmeWerx");
                this.terminal.writeStory("/login - Go to AcmeWerx signin");
                this.terminal.writeStory("/signup - Visit CryptoVersus signup");
                this.terminal.writeStory("/stats - View detailed character stats");
                this.terminal.writeStory("/system - View system information");
                this.terminal.writeStory("/theme dark - Switch to dark theme");
                this.terminal.writeStory("/theme light - Switch to light theme");
                this.terminal.writeStory("/theme hacker - Switch to hacker theme");
                this.terminal.writeStory("/skip - Skip current scene (debugging)");
                this.terminal.writeStory("/tip - Get gameplay tips");
                this.terminal.writeStory("/clear - Clear terminal output");
                this.terminal.writeStory("/api get url - Make a GET request to URL");
                this.terminal.writeStory("/api example - Show API usage examples");
                this.terminal.writeStory("/api weather [city] - Get weather info");
                this.terminal.writeStory("/api advice - Get random advice");
                this.terminal.writeStory("/api joke - Get a random joke");
                break;
                
            case '/about':
                this.terminal.writeStory("Opening AcmeWerx about page...");
                window.open('https://www.acmewerx.com/about', '_blank');
                break;
                
            case '/login':
                this.terminal.writeStory("Redirecting to AcmeWerx signin...");
                window.open('https://www.acmewerx.com/signin', '_blank');
                break;
                
            case '/signup':
                this.terminal.writeStory("Redirecting to CryptoVersus signup...");
                window.open('https://cryptoversus.io', '_blank');
                break;
                
            case '/stats':
                this.displayDetailedStats();
                break;
                
            case '/system':
                this.terminal.writeStory("🖥️ SYSTEM INFORMATION 🖥️");
                this.terminal.writeStory("------------------------");
                this.terminal.writeStory(`User Agent: ${navigator.userAgent}`);
                this.terminal.writeStory(`Screen Resolution: ${window.screen.width}x${window.screen.height}`);
                this.terminal.writeStory(`Time: ${new Date().toLocaleTimeString()}`);
                this.terminal.writeStory(`Memory Usage: Random Access Memory™ Edition`);
                this.terminal.writeStory(`Connection Status: Connected to the Matrix`);
                this.terminal.writeStory(`Server Status: Definitely Not On Fire`);
                break;
                
            case '/theme':
                if (params[0] === 'dark') {
                    document.body.className = 'theme-dark';
                    this.terminal.writeStory("Theme switched to dark mode.");
                } else if (params[0] === 'light') {
                    document.body.className = 'theme-light';
                    this.terminal.writeStory("Theme switched to light mode.");
                } else if (params[0] === 'hacker') {
                    document.body.className = 'theme-hacker';
                    this.terminal.writeStory("Theme switched to hacker mode. Hack the planet!");
                } else {
                    this.terminal.writeStory("Available themes: dark, light, hacker");
                    this.terminal.writeStory("Usage: /theme [theme name]");
                }
                break;
                
            case '/skip':
                // Only allow skipping if we're not waiting for name or code
                if (!this.waitingForName && !this.waitingForCodeChallenge) {
                    this.waitingForInput = false;
                    const currentScene = story.scenes[this.currentScene];
                    
                    if (currentScene.choices && currentScene.choices.length > 0) {
                        // Skip to the first choice's next scene
                        this.terminal.writeStory("[SKIPPING CURRENT SCENE]");
                        setTimeout(() => {
                            this.renderScene(currentScene.choices[0].nextScene);
                        }, 500);
                    } else if (currentScene.nextScene) {
                        // Skip to the next scene
                        this.terminal.writeStory("[SKIPPING CURRENT SCENE]");
                        setTimeout(() => {
                            this.renderScene(currentScene.nextScene);
                        }, 500);
                    } else {
                        this.terminal.writeStory("Cannot skip this scene.");
                    }
                } else {
                    this.terminal.writeStory("Cannot skip during name entry or code challenge.");
                }
                break;
                
            case '/tip':
                const tips = [
                    "Try clicking on choices instead of typing numbers.",
                    "There are multiple paths through the story - replay to see them all!",
                    "Your editor choice affects your character stats in different ways.",
                    "If stuck on the FizzBuzz challenge, type 'hint' for help.",
                    "Some items in your inventory provide special bonuses.",
                    "The Council values honesty, but sometimes bluffing works too.",
                    "There are no wrong answers, just different paths.",
                    "Try using the arrow keys to navigate command history.",
                    "If you're asked to write code, use Tab to indent (2 spaces).",
                    "Hidden easter eggs await the curious explorer.",
                    "Try the /api commands to interact with external services.",
                    "Change your visual experience with /theme commands."
                ];
                this.terminal.writeStory("💡 GAMEPLAY TIP:");
                this.terminal.writeStory(tips[Math.floor(Math.random() * tips.length)]);
                break;
                
            case '/clear':
                this.terminal.clear();
                break;
                
            case '/api':
                this.handleApiCommand(params);
                break;
                
            default:
                this.terminal.writeStory(`Unknown command: ${command}`);
                this.terminal.writeStory("Type '/help' to see available commands.");
        }
    }
    
    async handleApiCommand(params) {
        if (!params.length || params[0] === 'help') {
            this.terminal.writeStory("🌐 API COMMAND USAGE 🌐");
            this.terminal.writeStory("-----------------");
            this.terminal.writeStory("/api get [url] - Make a GET request to URL");
            this.terminal.writeStory("/api example - Show API usage examples");
            this.terminal.writeStory("/api weather [city] - Get weather info for a city");
            this.terminal.writeStory("/api advice - Get random advice");
            this.terminal.writeStory("/api joke - Get a random joke");
            this.terminal.writeStory("/api cat - Get a random cat fact");
            this.terminal.writeStory("/api crypto - Get cryptocurrency prices");
            return;
        }
        
        switch (params[0]) {
            case 'example':
                this.terminal.writeStory("📋 API EXAMPLES 📋");
                this.terminal.writeStory("-----------------");
                this.terminal.writeStory("/api weather tokyo");
                this.terminal.writeStory("/api joke");
                this.terminal.writeStory("/api advice");
                this.terminal.writeStory("/api cat");
                this.terminal.writeStory("/api crypto");
                break;
                
            case 'get':
                if (!params[1]) {
                    this.terminal.writeStory("Error: URL required");
                    this.terminal.writeStory("Usage: /api get [url]");
                    return;
                }
                
                try {
                    this.terminal.writeStory(`Fetching data from ${params[1]}...`);
                    const response = await this.makeApiRequest(params[1]);
                    
                    // Format the response based on content type
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await response.json();
                        this.terminal.writeStory("Response (JSON):");
                        this.terminal.writeStory(JSON.stringify(data, null, 2));
                    } else {
                        const text = await response.text();
                        this.terminal.writeStory("Response (Text):");
                        this.terminal.writeStory(text.substring(0, 500) + (text.length > 500 ? '...' : ''));
                    }
                } catch (error) {
                    this.terminal.writeStory(`Error: ${error.message}`);
                }
                break;
                
            case 'weather':
                if (!params[1]) {
                    this.terminal.writeStory("Error: City name required");
                    this.terminal.writeStory("Usage: /api weather [city]");
                    return;
                }
                
                try {
                    const city = params.slice(1).join(' ');
                    this.terminal.writeStory(`Fetching weather for ${city}...`);
                    
                    // Using Open-Meteo API which doesn't require an API key
                    // First, get the coordinates for the city using geocoding
                    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
                    const geocodeResponse = await this.makeApiRequest(geocodeUrl);
                    const geocodeData = await geocodeResponse.json();
                    
                    if (!geocodeData.results || geocodeData.results.length === 0) {
                        this.terminal.writeStory(`Could not find coordinates for "${city}"`);
                        return;
                    }
                    
                    const location = geocodeData.results[0];
                    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
                    const weatherResponse = await this.makeApiRequest(weatherUrl);
                    const weatherData = await weatherResponse.json();
                    
                    if (weatherData.current) {
                        const current = weatherData.current;
                        const weatherCode = this.getWeatherDescription(current.weather_code);
                        
                        this.terminal.writeStory("🌤️ WEATHER REPORT 🌤️");
                        this.terminal.writeStory("-----------------");
                        this.terminal.writeStory(`Location: ${location.name}, ${location.country}`);
                        this.terminal.writeStory(`Temperature: ${current.temperature_2m}${weatherData.current_units.temperature_2m}`);
                        this.terminal.writeStory(`Conditions: ${weatherCode}`);
                        this.terminal.writeStory(`Wind Speed: ${current.wind_speed_10m} ${weatherData.current_units.wind_speed_10m}`);
                    } else {
                        this.terminal.writeStory("Could not retrieve weather data");
                    }
                } catch (error) {
                    this.terminal.writeStory(`Error: ${error.message}`);
                }
                break;
                
            case 'advice':
                try {
                    this.terminal.writeStory("Fetching random advice...");
                    const response = await this.makeApiRequest('https://api.adviceslip.com/advice');
                    const data = await response.json();
                    
                    this.terminal.writeStory("💭 RANDOM ADVICE 💭");
                    this.terminal.writeStory("-----------------");
                    this.terminal.writeStory(data.slip.advice);
                } catch (error) {
                    this.terminal.writeStory(`Error: ${error.message}`);
                }
                break;
                
            case 'joke':
                try {
                    this.terminal.writeStory("Fetching a random joke...");
                    const response = await this.makeApiRequest('https://official-joke-api.appspot.com/random_joke');
                    const data = await response.json();
                    
                    this.terminal.writeStory("😂 RANDOM JOKE 😂");
                    this.terminal.writeStory("-----------------");
                    this.terminal.writeStory(`${data.setup}`);
                    
                    // Add a slight delay for the punchline
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    this.terminal.writeStory(`${data.punchline}`);
                } catch (error) {
                    this.terminal.writeStory(`Error: ${error.message}`);
                }
                break;
                
            case 'cat':
                try {
                    this.terminal.writeStory("Fetching a random cat fact...");
                    const response = await this.makeApiRequest('https://catfact.ninja/fact');
                    const data = await response.json();
                    
                    this.terminal.writeStory("🐱 CAT FACT 🐱");
                    this.terminal.writeStory("-----------------");
                    this.terminal.writeStory(data.fact);
                } catch (error) {
                    this.terminal.writeStory(`Error: ${error.message}`);
                }
                break;
                
            case 'crypto':
                try {
                    this.terminal.writeStory("Fetching cryptocurrency prices...");
                    const response = await this.makeApiRequest('https://api.coincap.io/v2/assets?limit=5');
                    const data = await response.json();
                    
                    this.terminal.writeStory("💰 CRYPTO PRICES 💰");
                    this.terminal.writeStory("-----------------");
                    
                    data.data.forEach(coin => {
                        const price = parseFloat(coin.priceUsd).toFixed(2);
                        const change = parseFloat(coin.changePercent24Hr).toFixed(2);
                        const symbol = change >= 0 ? '▲' : '▼';
                        this.terminal.writeStory(`${coin.name} (${coin.symbol}): ${price} ${symbol} ${change}%`);
                    });
                } catch (error) {
                    this.terminal.writeStory(`Error: ${error.message}`);
                }
                break;
                
            default:
                this.terminal.writeStory(`Unknown API command: ${params[0]}`);
                this.terminal.writeStory("Type '/api help' to see available API commands");
        }
    }
    
    async makeApiRequest(url) {
        // Add a special class to the terminal to indicate loading
        const terminalContent = document.querySelector('.terminal-content');
        if (terminalContent) {
            terminalContent.classList.add('loading');
        }
        
        try {
            // Make the actual request
            const response = await fetch(url);
            
            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            return response;
        } finally {
            // Remove the loading class regardless of success or failure
            if (terminalContent) {
                terminalContent.classList.remove('loading');
            }
        }
    }
    
    getWeatherDescription(code) {
        // WMO Weather interpretation codes (WW)
        const weatherCodes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            56: 'Light freezing drizzle',
            57: 'Dense freezing drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            66: 'Light freezing rain',
            67: 'Heavy freezing rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
        };
        
        return weatherCodes[code] || 'Unknown';
    }
    
    displayDetailedStats() {
        this.terminal.writeStory("📊 DETAILED CHARACTER STATS 📊");
        this.terminal.writeStory("----------------------------");
        this.terminal.writeStory(`NAME: ${this.playerName || 'Unnamed Adventurer'}`);
        this.terminal.writeStory(`CLASS: Noob of the First Ping`);
        this.terminal.writeStory(`LEVEL: ${this.playerStats.LEVEL || 1}`);
        this.terminal.writeStory("");
        
        const statDescriptions = {
            HEALTH: "Physical wellbeing. Decreases with each stack overflow error.",
            MANA: "Mystical debugging energy. Consumed when writing code.",
            INT: "Intelligence. Affects code quality and algorithm understanding.",
            STR: "Strength. Determines keyboard smashing power during rage moments.",
            DEX: "Dexterity. Affects typing speed and accuracy.",
            LUCK: "Luck. Determines random number generation in your favor.",
            CHARISMA: "Charisma. Affects your ability to convince others your bugs are features.",
            TECH_CRED: "Technical Credibility. Your standing in the developer community.",
            HONESTY: "Honesty. Your willingness to admit when you don't know something.",
            SELF_AWARENESS: "Self-Awareness. Your ability to recognize your own limitations.",
            WISDOM: "Wisdom. Knowledge of when to use Stack Overflow vs. writing from scratch.",
            DIPLOMACY: "Diplomacy. Skill at navigating religious wars (tabs vs. spaces, etc.).",
            ANXIETY: "Anxiety. Increases when approaching deadlines or during code reviews.",
            REFLEXES: "Reflexes. Speed at which you can ctrl+z after breaking something."
        };
        
        // Display core stats with descriptions
        for (const [stat, value] of Object.entries(this.playerStats)) {
            if (value !== 0 && stat !== 'LEVEL') { // Only show non-zero stats, exclude LEVEL
                let displayValue = value;
                if (stat === 'HEALTH' || stat === 'MANA') {
                    displayValue = `${value}/100`;
                }
                
                this.terminal.writeStory(`${stat}: ${displayValue}`);
                if (statDescriptions[stat]) {
                    this.terminal.writeStory(`  ${statDescriptions[stat]}`);
                }
                this.terminal.writeStory("");
            }
        }
        
        // Display inventory with item counts
        this.terminal.writeStory("🎒 INVENTORY:");
        
        // Count duplicate items
        const itemCounts = {};
        for (const item of this.inventory) {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        }
        
        // Display items with counts
        for (const [item, count] of Object.entries(itemCounts)) {
            this.terminal.writeStory(`- ${item}${count > 1 ? ` (x${count})` : ''}`);
        }
    }

    setPlayerName(name) {
        this.playerName = name;
        this.waitingForName = false;
        this.terminal.writeStory(`Welcome, ${name}! Your adventure begins.`);
        this.updateStats();
        
        // Move to the next scene
        setTimeout(() => {
            this.renderScene('introduction');
        }, 1000);
    }

    processChoice(input) {
        const scene = story.scenes[this.currentScene];
        
        if (!scene.choices) {
            return;
        }

        let choiceIndex;
        
        // Try to parse the input as a number
        if (!isNaN(input) && input > 0 && input <= scene.choices.length) {
            choiceIndex = parseInt(input) - 1;
        } else {
            // Try to match the input text with a choice
            choiceIndex = scene.choices.findIndex(choice => 
                choice.text.toLowerCase().includes(input.toLowerCase()));
            
            // If that doesn't work, try to match common shorthand answers
            if (choiceIndex === -1) {
                // For the Vim/Emacs question
                if (input.toLowerCase() === 'vim') {
                    choiceIndex = scene.choices.findIndex(choice => 
                        choice.text.toLowerCase() === 'vim');
                } else if (input.toLowerCase() === 'emacs') {
                    choiceIndex = scene.choices.findIndex(choice => 
                        choice.text.toLowerCase() === 'emacs');
                } else if (input.toLowerCase() === 'nano') {
                    choiceIndex = scene.choices.findIndex(choice => 
                        choice.text.toLowerCase().includes('nano'));
                } else if (input.toLowerCase().includes('trap')) {
                    choiceIndex = scene.choices.findIndex(choice => 
                        choice.text.toLowerCase().includes('trap'));
                }
                
                // For other common shorthand answers
                if (choiceIndex === -1 && input.toLowerCase() === 'yes') {
                    choiceIndex = 0; // Usually the first option is affirmative
                } else if (choiceIndex === -1 && input.toLowerCase() === 'no') {
                    choiceIndex = 1; // Usually the second option is negative
                }
            }
        }

        if (choiceIndex >= 0 && choiceIndex < scene.choices.length) {
            const choice = scene.choices[choiceIndex];
            this.terminal.writeLine(`You chose: ${choice.text}`);
            this.waitingForInput = false;
            
            // Reset processed scenes when going to a new branch to avoid skipping content
            // but maintain current scene to avoid looping
            if (scene.choices.some(c => c.nextScene === choice.nextScene)) {
                const currentScene = this.currentScene;
                this.processedScenes = new Set([currentScene]);
            }
            
            setTimeout(() => {
                this.renderScene(choice.nextScene);
            }, 1000);
        } else {
            this.terminal.writeLine("Invalid choice. Please select a valid option:");
            // Re-display the choices for clarity
            this.terminal.displayChoices(scene.choices);
        }
    }

    checkCodeChallenge(code) {
        if (this.currentCodeChallenge === 'fizzbuzz') {
            // Special case for 'hint' command
            if (code.toLowerCase() === 'hint') {
                this.terminal.writeNPC("Here's a hint: Try using a for loop from 1 to 15, and use the modulo operator (%) to check divisibility.");
                this.terminal.writeNPC("Example: if (i % 3 === 0) means 'if i is divisible by 3'");
                return;
            }
            
            const isValid = story.validateFizzBuzz(code);
            
            if (isValid) {
                this.waitingForCodeChallenge = false;
                this.terminal.writeStory("The terminal beeps in approval.");
                this.terminal.writeNPC("Your code executes successfully.");
                
                const currentScene = story.scenes[this.currentScene];
                if (currentScene.successScene) {
                    setTimeout(() => {
                        this.renderScene(currentScene.successScene);
                    }, 1500);
                }
            } else {
                this.terminal.writeNPC("That doesn't seem right. Try again or type 'hint' for help.");
                
                const currentScene = story.scenes[this.currentScene];
                if (currentScene.failScene && Math.random() > 0.7) { // 30% chance to move to fail scene after incorrect attempt
                    setTimeout(() => {
                        this.renderScene(currentScene.failScene);
                    }, 1500);
                }
            }
        }
    }

    updateStats() {
        const statsElement = document.getElementById('character-stats');
        statsElement.innerHTML = '';
        
        // Add name if we have it
        if (this.playerName) {
            const nameElement = document.createElement('div');
            nameElement.className = 'stat-item';
            nameElement.innerHTML = `<span>NAME:</span> <span>${this.playerName}</span>`;
            statsElement.appendChild(nameElement);
            
            const classElement = document.createElement('div');
            classElement.className = 'stat-item';
            classElement.innerHTML = `<span>CLASS:</span> <span>Noob of the First Ping</span>`;
            statsElement.appendChild(classElement);
            
            const levelElement = document.createElement('div');
            levelElement.className = 'stat-item';
            levelElement.innerHTML = `<span>LEVEL:</span> <span>${this.playerStats.LEVEL || 1}</span>`;
            statsElement.appendChild(levelElement);
        }
        
        // Add core stats
        for (const [stat, value] of Object.entries(this.playerStats)) {
            if (value !== 0 && stat !== 'LEVEL') { // Only show non-zero stats, exclude LEVEL as it's shown above
                const statElement = document.createElement('div');
                statElement.className = 'stat-item';
                
                // Format different stats in different ways
                let displayValue = value;
                if (stat === 'HEALTH' || stat === 'MANA') {
                    displayValue = `${value}/100`;
                }
                
                statElement.innerHTML = `<span>${stat}:</span> <span>${displayValue}</span>`;
                statsElement.appendChild(statElement);
            }
        }
    }

    updateInventory() {
        const inventoryElement = document.getElementById('inventory');
        inventoryElement.innerHTML = '';
        
        for (const item of this.inventory) {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.textContent = `- ${item}`;
            inventoryElement.appendChild(itemElement);
        }
    }

    updateOnlineUsers() {
        const usersElement = document.getElementById('online-adventurers');
        usersElement.innerHTML = '';
        
        for (const user of this.onlineUsers) {
            const userElement = document.createElement('div');
            userElement.className = 'online-user';
            userElement.innerHTML = `<span class="user-status"></span> ${user}`;
            usersElement.appendChild(userElement);
        }
        
        // Randomly add or remove users over time to simulate activity
        setInterval(() => {
            // 10% chance to add or remove a user
            if (Math.random() < 0.1) {
                const possibleUsers = [
                    "CodeNinja",
                    "BugHunter",
                    "DevDragon",
                    "SyntaxSage",
                    "BitCraftsman",
                    "ScriptSmith",
                    "HashSlasher",
                    "ByteMaster",
                    "LogicLord",
                    "QueryQueen"
                ];
                
                if (Math.random() < 0.5 && this.onlineUsers.length < 12) {
                    // Add a new user
                    const newUser = possibleUsers[Math.floor(Math.random() * possibleUsers.length)];
                    if (!this.onlineUsers.includes(newUser)) {
                        this.onlineUsers.push(newUser);
                        this.updateOnlineUsers();
                        
                        // Flash the sidebar to indicate user joined
                        const panel = document.getElementById('online-adventurers').parentElement;
                        panel.classList.add('flash-highlight');
                        setTimeout(() => {
                            panel.classList.remove('flash-highlight');
                        }, 500);
                    }
                } else if (this.onlineUsers.length > 3) {
                    // Remove a random user (but keep at least 3)
                    const randomIndex = Math.floor(Math.random() * this.onlineUsers.length);
                    this.onlineUsers.splice(randomIndex, 1);
                    this.updateOnlineUsers();
                }
            }
        }, 15000); // Check every 15 seconds
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    
    // Make the start button cursor blink
    startButton.classList.add('blink-cursor');
    
    // Start the game when clicking the start button
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        
        // Initialize and start the game
        window.game = new Game();
        game.start();
        
        // Focus on the terminal input
        document.getElementById('terminal-input').focus();
    });
    
    // Also allow pressing Enter to start
    startButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            startButton.click();
        }
    });
    
    // Focus on the start button when the page loads
    startButton.focus();
});