## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Inspired by text adventures and classic terminal interfaces
- Special thanks to all contributors and testers# Weary Adventurer Terminal

A retro-styled, interactive terminal-based adventure game that simulates a tech hazing ritual. This project features a choice-based narrative, character stats, inventory system, and a functional terminal interface with API commands.

![image](https://github.com/user-attachments/assets/22d4a83c-e5c0-4d74-bac5-ace5628989be)


## Demo

Experience the Weary Adventurer Terminal: [https://fuck-out.com](https://fuck-out.com)

## Features

- 🎮 Text-based adventure game with multiple branching paths
- 💻 Authentic terminal look and feel with typing animations
- 🧙‍♂️ Character stats and inventory system
- 🔄 Multiple themes (Dark, Light, Hacker)
- 🌐 Built-in API commands to interact with external services
- 📊 Dynamic user interface with stats sidebar
- 🖱️ Both clickable and keyboard-based interaction
- 🧩 Code challenges and puzzles
- 📱 Built with HTML5 for modularity and future extensibility

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript if you want to customize

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/chooseAdventure.git
cd chooseAdventure
```

2. Open the project in your code editor.

3. Launch the game by opening `index.html` in your web browser, or use a local server:
```bash
# Using Python
python -m http.server

# Using Node.js with http-server
npx http-server
```

## Customization Guide

This project is designed to be easily customizable. Here's how to make it your own:

### 1. Story Customization

The entire story is contained in `js/story.js`. Each scene is defined as an object in the `scenes` property:

```javascript
const story = {
    scenes: {
        start: {
            text: [
                "Your welcome text here...",
                "Additional paragraphs..."
            ],
            npcDialogue: [
                "NPC dialogue lines..."
            ],
            actions: [
                { type: "askName" }
            ],
            nextScene: "introduction"
        },
        // Additional scenes...
    }
};
```

**Scene Structure:**
- `text`: Array of story paragraphs
- `npcDialogue`: Array of character dialogue lines
- `choices`: Array of options for the player to choose from
- `actions`: Special actions to execute (modify stats, add inventory, etc.)
- `nextScene`: The ID of the next scene to transition to

### 2. Theme Customization

The visual themes are defined in `css/style.css`. To add a new theme:

1. Add a new theme class:
```css
body.theme-yourtheme {
    background-color: #your-bg-color;
    color: #your-text-color;
}

body.theme-yourtheme .terminal-window {
    background-color: #your-terminal-bg;
    /* ... additional styling ... */
}
```

2. Add the theme option to the `/theme` command in `js/game.js`:
```javascript
case '/theme':
    if (params[0] === 'yourtheme') {
        document.body.className = 'theme-yourtheme';
        this.terminal.writeStory("Theme switched to your theme.");
    }
    // ... other themes ...
```

### 3. Adding Commands

To add new terminal commands, modify the `handleCommand` and `handleSlashCommand` methods in `js/game.js`:

```javascript
handleSlashCommand(command) {
    const [mainCommand, ...params] = command.split(' ');
    
    switch (mainCommand) {
        case '/yourcommand':
            // Your command logic here
            this.terminal.writeStory("Your command output");
            break;
        // ... other commands ...
    }
}
```

### 4. Adding API Endpoints

To add new API integrations, extend the `handleApiCommand` method in `js/game.js`:

```javascript
async handleApiCommand(params) {
    switch (params[0]) {
        case 'yourapi':
            try {
                this.terminal.writeStory("Fetching data...");
                const response = await this.makeApiRequest('https://your-api-url.com');
                const data = await response.json();
                
                this.terminal.writeStory("YOUR API RESULTS");
                this.terminal.writeStory("-----------------");
                this.terminal.writeStory(data.yourProperty);
            } catch (error) {
                this.terminal.writeStory(`Error: ${error.message}`);
            }
            break;
        // ... other API commands ...
    }
}
```

### 5. Customizing Character Stats

Edit the initial stats in the `Game` constructor in `js/game.js`:

```javascript
constructor() {
    // ...
    this.playerStats = {
        HEALTH: 100,
        MANA: 20,
        YOUR_STAT: 5,
        // ... other stats ...
    };
    // ...
}
```

### 6. Customizing URLs and External Links

Update the URLs in the slash commands:

```javascript
case '/about':
    this.terminal.writeStory("Opening about page...");
    window.open('https://your-website.com/about', '_blank');
    break;
```

## Project Structure

```
weary-adventurer-terminal/
├── index.html             # Main HTML file
├── css/
│   └── style.css          # Styles and themes
├── js/
│   ├── game.js            # Main game logic and commands
│   ├── terminal.js        # Terminal UI functionality
│   ├── story.js           # Story scenes and branches
│   └── fallback.js        # Error handling
└── README.md              # This file
```

## Key JavaScript Classes

### Game Class (`js/game.js`)
Handles game state, scene transitions, and command processing.

### Terminal Class (`js/terminal.js`)
Manages the terminal UI, typing effects, and user input.

### Story Object (`js/story.js`)
Contains all story content, scenes, and branching logic.

## Advanced Customization

### Adding Mini-Games

You can create custom mini-games by adding new action types:

1. Add a new action type in `processAction` method in `game.js`:
```javascript
case 'yourgame':
    this.startYourGame();
    break;
```

2. Create the game handling method:
```javascript
startYourGame() {
    this.terminal.writeStory("Your game instructions");
    this.waitingForGameInput = true;
}

handleYourGameInput(input) {
    // Process game input and determine outcome
}
```

3. Update `handleCommand` to route to your game handler:
```javascript
if (this.waitingForGameInput) {
    this.handleYourGameInput(command);
    return;
}
```

### Adding Custom Characters

To add new characters that appear in the online users list:

```javascript
this.onlineUsers = [
    "YourCharacter1",
    "YourCharacter2",
    // ... other users ...
];
```

### Persistent Progress

To add save/load functionality, you could implement localStorage:

```javascript
// Save game
saveGame() {
    const saveData = {
        playerName: this.playerName,
        currentScene: this.currentScene,
        playerStats: this.playerStats,
        inventory: this.inventory
    };
    localStorage.setItem('wearyAdventurerSave', JSON.stringify(saveData));
}

// Load game
loadGame() {
    const saveData = JSON.parse(localStorage.getItem('wearyAdventurerSave'));
    if (saveData) {
        this.playerName = saveData.playerName;
        this.currentScene = saveData.currentScene;
        this.playerStats = saveData.playerStats;
        this.inventory = saveData.inventory;
        this.updateStats();
        this.updateInventory();
        this.renderScene(this.currentScene);
    }
}
```

## Credits

- Original concept and development: [@KitBaroness](https://github.com/KitBaroness)
- Font: [VT323](https://fonts.google.com/specimen/VT323) by Peter Hull
- APIs used:
  - [Open-Meteo](https://open-meteo.com/) for weather data
  - [Advice Slip](https://api.adviceslip.com/) for random advice
  - [Official Joke API](https://official-joke-api.appspot.com/) for jokes
  - [Cat Facts](https://catfact.ninja/) for cat facts
  - [CoinCap](https://coincap.io/) for cryptocurrency data

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Extensibility

This project is built with HTML5 and designed with modularity in mind to facilitate future extensions and integrations:

### WebAssembly (WASM) Integration

The modular architecture makes it easy to integrate WebAssembly modules. To extend with WASM:

1. Compile your Rust/C/C++ code to WebAssembly
2. Add the WASM module to your project:
   ```javascript
   // In a new file, e.g., js/wasm-module.js
   const wasmInstance = await WebAssembly.instantiateStreaming(
     fetch('path/to/your/module.wasm'), 
     importObject
   );
   export const wasmFunctions = wasmInstance.instance.exports;
   ```

3. Import and use in your game:
   ```javascript
   import { wasmFunctions } from './wasm-module.js';
   
   // Use in your game logic
   const result = wasmFunctions.yourFunction(param1, param2);
   ```

### JWT Authentication

To add JWT authentication for user accounts or saved games:

1. Create an authentication service API endpoint
2. Implement JWT handling:
   ```javascript
   // In a new file, e.g., js/auth.js
   export function login(username, password) {
     return fetch('your-auth-endpoint', {
       method: 'POST',
       body: JSON.stringify({ username, password }),
       headers: { 'Content-Type': 'application/json' }
     })
     .then(response => response.json())
     .then(data => {
       localStorage.setItem('token', data.token);
       return data.user;
     });
   }
   
   export function getAuthenticatedUser() {
     const token = localStorage.getItem('token');
     if (!token) return null;
     
     // Parse JWT payload (for demo purposes - in production use proper JWT library)
     const payload = JSON.parse(atob(token.split('.')[1]));
     return payload;
   }
   ```

3. Use in your game for authenticated API calls:
   ```javascript
   import { getAuthenticatedUser } from './auth.js';
   
   async makeAuthenticatedApiRequest(url) {
     const token = localStorage.getItem('token');
     const response = await fetch(url, {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     });
     // ...rest of request handling
   }
   ```

### Rust Integration

Rust can be integrated in two main ways:

1. **Via WebAssembly**: For high-performance game logic, physics, or procedural generation
   ```rust
   // Example Rust function to be compiled to WASM
   #[no_mangle]
   pub extern "C" fn calculate_game_logic(input: u32) -> u32 {
       // Your complex game logic here
       input * 2
   }
   ```

2. **Server-side**: For persistent game state, multiplayer features, or authentication
   ```rust
   // Example Rust server endpoint using Rocket
   #[get("/game-state/<user_id>")]
   fn get_game_state(user_id: String) -> Json<GameState> {
       // Retrieve and return the user's game state
       Json(database.get_user_game_state(user_id))
   }
   ```

The HTML5 foundation makes all these integrations possible without significant architecture changes.
