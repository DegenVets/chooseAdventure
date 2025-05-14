const story = {
    scenes: {
        start: {
            text: [
                "🕹️ Welcome, Weary Adventurer… 🕹️",
                "",
                "The screen flickers. Static hisses. Your cursor blinks like a heartbeat on the void of cyberspace…",
                "",
                "You find yourself at the threshold of an ancient digital sanctum.",
                "",
                "Neon glyphs line the obsidian walls. Cables snake like vines across the floor.",
                "",
                "The air hums with overclocked servers and the scent of day-old coffee.",
                "",
                "In the center of the chamber, a circle of robed figures (clearly overcaffeinated tech wizards) pause their furious typing. They look up. Silence.",
                "",
                "A single robed mod steps forward. His eyes glow with the light of a thousand command-line prompts."
            ],
            npcDialogue: [
                "WHO DARES CONNECT WITHOUT AUTHENTICATION?",
                "ARE YOU TCP OR UDP?",
                "DO YOU EVEN GIT PUSH, BRO?"
            ],
            actions: [
                { type: "askName" }
            ],
            nextScene: "introduction"
        },
        introduction: {
            text: [
                "The Elders speak. Their voices echo with bandwidth:",
                "",
                "A notification pings:",
                "⚠️ You have entered: The Chamber of the Codebound Ones.",
                "Population: 37 Nerds.",
                "Vibe: Terminally Online.",
                "Dress Code: Hoodies or Nothing.",
                "",
                "System initializing character stats...",
                "",
                "You feel your MANA drain rapidly…"
            ],
            npcDialogue: [
                "Very well, initiate. To remain, you must answer one question:",
                "Vim or Emacs?"
            ],
            choices: [
                { text: "Vim", nextScene: "vim_choice" },
                { text: "Emacs", nextScene: "emacs_choice" },
                { text: "Nano?", nextScene: "nano" },
                { text: "Is this a trap?", nextScene: "trap" }
            ]
        },
        vim_choice: {
            text: [
                "Your fingers twitch, muscle memory trying to exit the non-existent editor.",
                "Several robed figures nod approvingly. One throws you a mechanical keyboard sticker."
            ],
            npcDialogue: [
                "A modal enthusiast! The path of efficiency and keyboard shortcuts.",
                "Your kind is welcome here, though the Emacs disciples may glare from across the room."
            ],
            actions: [
                { type: "modifyStat", stat: "TECH_CRED", value: 8 },
                { type: "modifyStat", stat: "DEX", value: 2 },
                { type: "addInventory", item: "Vim Sticker (Increases escape velocity)" }
            ],
            nextScene: "challenge"
        },
        emacs_choice: {
            text: [
                "Your pinky finger aches in anticipation of countless Ctrl combinations.",
                "Half the room erupts in cheers while the other half boos loudly."
            ],
            npcDialogue: [
                "An operating system disguised as an editor! Bold choice.",
                "The Elder nods. \"May your pinkies remain strong and your RSI at bay.\""
            ],
            actions: [
                { type: "modifyStat", stat: "TECH_CRED", value: 7 },
                { type: "modifyStat", stat: "INT", value: 3 },
                { type: "addInventory", item: "Carpal Tunnel Brace (+2 CTRL resistance)" }
            ],
            nextScene: "challenge"
        },
        nano: {
            text: [
                "A collective groan ripples through the chamber.",
                "Someone in the back mumbles something about 'training wheels'."
            ],
            npcDialogue: [
                "Acceptable for beginners.",
                "But only just barely."
            ],
            actions: [
                { type: "modifyStat", stat: "HONESTY", value: 3 },
                { type: "modifyStat", stat: "SELF_AWARENESS", value: 2 },
                { type: "modifyStat", stat: "TECH_CRED", value: -5 }
            ],
            nextScene: "challenge"
        },
        trap: {
            text: [
                "The Elder's eyes narrow, then crinkle with amusement.",
                "Several robed figures chuckle knowingly."
            ],
            npcDialogue: [
                "Perceptive. You recognize the sacred war when you see it.",
                "A diplomatic answer to the oldest flame war in the scrolls."
            ],
            actions: [
                { type: "modifyStat", stat: "WISDOM", value: 5 },
                { type: "modifyStat", stat: "DIPLOMACY", value: 3 },
                { type: "addInventory", item: "Scroll of Neutrality (Prevents flame wars)" }
            ],
            nextScene: "challenge"
        },
        challenge: {
            text: [
                "The Elder nods slowly, evaluating your worth.",
                "The chamber's lights dim, and a holographic terminal appears before you."
            ],
            npcDialogue: [
                "To prove your worth, you must pass THE FIZZBUZZ TEST.",
                "Write a program that prints numbers from 1 to 15.",
                "For multiples of 3, print 'Fizz' instead.",
                "For multiples of 5, print 'Buzz' instead.",
                "For multiples of both 3 and 5, print 'FizzBuzz'."
            ],
            choices: [
                { text: "Try to write the code", nextScene: "code_attempt" },
                { text: "Ask Stack Overflow", nextScene: "stack_overflow" },
                { text: "Pretend you've done this a million times", nextScene: "pretend" },
                { text: "Suggest a different test", nextScene: "different_test" }
            ]
        },
        code_attempt: {
            text: [
                "You crack your knuckles and begin to type. The keyboard feels ancient yet responsive under your fingers.",
                "The robed figures watch in silence, their faces illuminated by the glow of countless monitors."
            ],
            npcDialogue: [
                "The Council awaits your solution. Type your code at the prompt.",
                "(Hint: we only care about the output, not the elegance of your solution)"
            ],
            actions: [
                { type: "codeChallenge", challenge: "fizzbuzz" }
            ],
            // The next scene will be determined by the code challenge handler in game.js
            successScene: "code_success",
            failScene: "code_failure"
        },
        code_success: {
            text: [
                "The terminal beeps in approval as your code executes flawlessly.",
                "Green text scrolls across the screen, displaying the correct FizzBuzz sequence.",
                "Several council members nod appreciatively."
            ],
            npcDialogue: [
                "Not bad, adventurer. You've passed the first test.",
                "Perhaps there is hope for you yet."
            ],
            actions: [
                { type: "modifyStat", stat: "INT", value: 3 },
                { type: "modifyStat", stat: "TECH_CRED", value: 10 },
                { type: "addInventory", item: "Badge of FizzBuzz (Proof of basic competence)" }
            ],
            nextScene: "council_judgment"
        },
        code_failure: {
            text: [
                "Your code produces unexpected results. The terminal flashes with red warnings.",
                "A few muffled laughs can be heard from the back of the room."
            ],
            npcDialogue: [
                "Not quite. But failure is the compiler of experience.",
                "We shall grant you another opportunity."
            ],
            actions: [
                { type: "modifyStat", stat: "HUMILITY", value: 5 },
                { type: "codeChallenge", challenge: "fizzbuzz" }
            ],
            // Loops back to itself until successful
        },
        stack_overflow: {
            text: [
                "You make the universal gesture for 'let me Google that'.",
                "The council shifts uncomfortably as you reach for an invisible keyboard.",
                "Suddenly, a spectral monitor materializes, displaying the familiar blue and orange interface."
            ],
            npcDialogue: [
                "INVOKING THE ANCIENT KNOWLEDGE REPOSITORY?",
                "Bold, but expected. At least you know where to look.",
                "The real skill is knowing which answer to copy."
            ],
            actions: [
                { type: "modifyStat", stat: "WISDOM", value: 2 },
                { type: "modifyStat", stat: "TECH_CRED", value: -3 },
                { type: "addInventory", item: "Stack Overflow Bookmark (Summons help, 3 charges)" }
            ],
            nextScene: "stack_overflow_result"
        },
        stack_overflow_result: {
            text: [
                "The spectral monitor displays several answers to the FizzBuzz problem.",
                "You quickly scan through them, looking for the simplest solution.",
                "With a flourish, you copy the code into the terminal."
            ],
            npcDialogue: [
                "Copy-paste magic, the programmer's oldest spell.",
                "But tell us: do you understand what you've done?"
            ],
            choices: [
                { text: "Explain the code in detail", nextScene: "explain_code" },
                { text: "Admit you don't fully understand it", nextScene: "admit_ignorance" },
                { text: "Pretend you wrote it yourself", nextScene: "fake_expertise" }
            ]
        },
        explain_code: {
            text: [
                "You take a deep breath and begin to explain the algorithm.",
                "Your voice becomes steadier as you walk through each line, the logic becoming clearer as you speak."
            ],
            npcDialogue: [
                "Understanding exceeds mere execution. Well done.",
                "The Council appreciates those who seek knowledge, not just solutions."
            ],
            actions: [
                { type: "modifyStat", stat: "INT", value: 5 },
                { type: "modifyStat", stat: "TECH_CRED", value: 7 },
                { type: "addInventory", item: "Badge of Comprehension (Transforms copied code into knowledge)" }
            ],
            nextScene: "council_judgment"
        },
        admit_ignorance: {
            text: [
                "You admit that while you found a solution, parts of the implementation remain mysterious to you.",
                "Your honesty hangs in the air, unexpected but refreshing."
            ],
            npcDialogue: [
                "Honesty! In a room full of developers!",
                "The first step to wisdom is acknowledging what you do not know.",
                "Let us enlighten you..."
            ],
            text2: [
                "The Elder approaches and begins explaining the code, line by line.",
                "As they speak, the concepts become clearer, illuminating previously dark corners of your understanding."
            ],
            actions: [
                { type: "modifyStat", stat: "WISDOM", value: 7 },
                { type: "modifyStat", stat: "HONESTY", value: 5 },
                { type: "modifyStat", stat: "INT", value: 3 }
            ],
            nextScene: "council_judgment"
        },
        fake_expertise: {
            text: [
                "You puff out your chest, adopting the confident air of a senior developer.",
                "\"Yeah, this is how I always implement FizzBuzz. Simple, elegant, and efficient.\"",
                "Several council members exchange skeptical glances."
            ],
            npcDialogue: [
                "Indeed? Then perhaps you could explain your... 'creation'... in detail?",
                "The council leans forward, eager to expose your deception."
            ],
            choices: [
                { text: "Keep bluffing", nextScene: "bluff_fails" },
                { text: "Come clean", nextScene: "admit_truth" }
            ]
        },
        bluff_fails: {
            text: [
                "You continue your charade, throwing out technical terms with practiced confidence.",
                "\"Notice the elegant use of the modulo operator, and the concise conditional logic...\"",
                "Halfway through your explanation, you realize you've made a critical error."
            ],
            npcDialogue: [
                "Ah yes, explain to us how your solution uses 'quantum bit-flipping' for FizzBuzz?",
                "That's not even a real thing. Your deception is as transparent as your syntax errors."
            ],
            actions: [
                { type: "modifyStat", stat: "TECH_CRED", value: -10 },
                { type: "modifyStat", stat: "CHARISMA", value: -5 },
                { type: "addInventory", item: "Dunce Cap of Hubris (-5 to credibility checks)" }
            ],
            nextScene: "council_judgment"
        },
        bluff_fails: {
            text: [
                "You continue your charade, throwing out technical terms with practiced confidence.",
                "\"Notice the elegant use of the modulo operator, and the concise conditional logic...\"",
                "Halfway through your explanation, you realize you've made a critical error."
            ],
            npcDialogue: [
                "Ah yes, explain to us how your solution uses 'quantum bit-flipping' for FizzBuzz?",
                "That's not even a real thing. Your deception is as transparent as your syntax errors."
            ],
            actions: [
                { type: "modifyStat", stat: "TECH_CRED", value: -10 },
                { type: "modifyStat", stat: "CHARISMA", value: -5 },
                { type: "addInventory", item: "Dunce Cap of Hubris (-5 to credibility checks)" }
            ],
            nextScene: "council_judgment"
        },
        pretend: {
            text: [
                "You stand tall, puffing your chest slightly.",
                "A confident smile spreads across your face – you've seen junior developers make this exact expression before."
            ],
            npcDialogue: [
                "Oh? Another FizzBuzz master?",
                "We've only seen about eight thousand of those."
            ],
            choices: [
                { text: "Double down on your expertise", nextScene: "double_down" },
                { text: "Laugh it off and admit it's your first time", nextScene: "admit_truth" },
                { text: "Write the code to prove yourself", nextScene: "code_attempt" }
            ]
        },
        double_down: {
            text: [
                "You launch into an unnecessarily verbose explanation of how FizzBuzz tests fundamental programming concepts.",
                "You throw in terms like 'modulo operation' and 'conditional logic' with practiced nonchalance.",
                "Several council members exchange glances."
            ],
            npcDialogue: [
                "Impressive vocabulary. Now demonstrate your mastery.",
                "The terminal awaits your expertise."
            ],
            actions: [
                { type: "modifyStat", stat: "CHARISMA", value: -5 },
                { type: "codeChallenge", challenge: "fizzbuzz" }
            ],
            // This will route to code_success or code_failure based on the result
        },
        admit_truth: {
            text: [
                "Your confident facade crumbles into a self-deprecating laugh.",
                "\"Okay, you got me. I've heard of FizzBuzz but never actually done it myself.\"",
                "Several of the robed figures relax visibly."
            ],
            npcDialogue: [
                "Honesty! How refreshing in these digital halls.",
                "Fear not, young one. All masters began as novices."
            ],
            actions: [
                { type: "modifyStat", stat: "HONESTY", value: 8 },
                { type: "modifyStat", stat: "CHARISMA", value: 3 }
            ],
            nextScene: "code_attempt"
        },
        different_test: {
            text: [
                "You clear your throat and speak with measured confidence.",
                "\"Isn't FizzBuzz a bit... basic? Perhaps a more meaningful challenge would better demonstrate my abilities.\""
            ],
            npcDialogue: [
                "QUESTIONING THE ANCIENT RITUALS?",
                "..."
            ],
            choices: [
                { text: "Suggest sorting algorithm implementation", nextScene: "suggest_sorting" },
                { text: "Propose a debugging challenge", nextScene: "suggest_debugging" },
                { text: "Recommend a design pattern discussion", nextScene: "suggest_design" },
                { text: "Back down and accept the FizzBuzz test", nextScene: "accept_fizzbuzz" }
            ]
        },
        suggest_sorting: {
            text: [
                "You suggest implementing a sorting algorithm, perhaps quicksort or merge sort, to demonstrate algorithm knowledge.",
                "Several council members lean forward, suddenly interested."
            ],
            npcDialogue: [
                "Bold. Very bold.",
                "The Elder strokes their beard. \"Interesting proposition. Tell me, which would you implement, and why?\""
            ],
            choices: [
                { text: "Quicksort - it's efficient and elegant", nextScene: "quicksort_choice" },
                { text: "Merge sort - it's reliable and stable", nextScene: "mergesort_choice" },
                { text: "Bubble sort - it's... uh... simple", nextScene: "bubblesort_choice" }
            ]
        },
        quicksort_choice: {
            text: [
                "You begin eloquently describing the divide-and-conquer approach of quicksort.",
                "Your hands gesture enthusiastically as you explain pivots and partitioning.",
                "Several council members nod with genuine interest."
            ],
            npcDialogue: [
                "An elegant algorithm for a more civilized age.",
                "Your theoretical knowledge is sound, but theory is merely the shadow of practice."
            ],
            actions: [
                { type: "modifyStat", stat: "INT", value: 7 },
                { type: "modifyStat", stat: "TECH_CRED", value: 5 }
            ],
            nextScene: "algorithm_challenge"
        },
        mergesort_choice: {
            text: [
                "You describe merge sort's reliable performance and stable sorting properties.",
                "You emphasize its predictable O(n log n) complexity regardless of input distribution.",
                "A few council members exchange impressed glances."
            ],
            npcDialogue: [
                "A choice of stability over raw speed. Interesting.",
                "You value consistency and predictability. Admirable traits in both algorithms and developers."
            ],
            actions: [
                { type: "modifyStat", stat: "WISDOM", value: 4 },
                { type: "modifyStat", stat: "TECH_CRED", value: 6 }
            ],
            nextScene: "algorithm_challenge"
        },
        bubblesort_choice: {
            text: [
                "You mention bubble sort with a hesitant smile.",
                "The room goes silent. Someone coughs awkwardly.",
                "A tumbleweed of tangled cables rolls across the floor."
            ],
            npcDialogue: [
                "...",
                "Are you... are you serious right now?",
                "That's like saying your favorite car is a horse and buggy."
            ],
            actions: [
                { type: "modifyStat", stat: "TECH_CRED", value: -8 },
                { type: "modifyStat", stat: "SELF_AWARENESS", value: -3 }
            ],
            nextScene: "algorithm_challenge"
        },
        algorithm_challenge: {
            text: [
                "The Elder raises a hand, silencing the chamber.",
                "Their eyes glint with mischief and challenge."
            ],
            npcDialogue: [
                "Your algorithmic knowledge is noted. But let us return to the original test.",
                "All roads lead to FizzBuzz, young initiate.",
                "Sometimes, the simplest challenges reveal the most."
            ],
            actions: [
                { type: "modifyStat", stat: "HUMILITY", value: 3 }
            ],
            nextScene: "code_attempt"
        },
        quicksort_choice: {
            text: [
                "You begin eloquently describing the divide-and-conquer approach of quicksort.",
                "Your hands gesture enthusiastically as you explain pivots and partitioning.",
                "Several council members nod with genuine interest."
            ],
            npcDialogue: [
                "An elegant algorithm for a more civilized age.",
                "Your theoretical knowledge is sound, but theory is merely the shadow of practice."
            ],
            actions: [
                { type: "modifyStat", stat: "INT", value: 7 },
                { type: "modifyStat", stat: "TECH_CRED", value: 5 }
            ],
            nextScene: "algorithm_challenge"
        },
        mergesort_choice: {
            text: [
                "You describe merge sort's reliable performance and stable sorting properties.",
                "You emphasize its predictable O(n log n) complexity regardless of input distribution.",
                "A few council members exchange impressed glances."
            ],
            npcDialogue: [
                "A choice of stability over raw speed. Interesting.",
                "You value consistency and predictability. Admirable traits in both algorithms and developers."
            ],
            actions: [
                { type: "modifyStat", stat: "WISDOM", value: 4 },
                { type: "modifyStat", stat: "TECH_CRED", value: 6 }
            ],
            nextScene: "algorithm_challenge"
        },
        bubblesort_choice: {
            text: [
                "You mention bubble sort with a hesitant smile.",
                "The room goes silent. Someone coughs awkwardly.",
                "A tumbleweed of tangled cables rolls across the floor."
            ],
            npcDialogue: [
                "...",
                "Are you... are you serious right now?",
                "That's like saying your favorite car is a horse and buggy."
            ],
            actions: [
                { type: "modifyStat", stat: "TECH_CRED", value: -8 },
                { type: "modifyStat", stat: "SELF_AWARENESS", value: -3 }
            ],
            nextScene: "algorithm_challenge"
        },
        algorithm_challenge: {
            text: [
                "The Elder raises a hand, silencing the chamber.",
                "Their eyes glint with mischief and challenge."
            ],
            npcDialogue: [
                "Your algorithmic knowledge is noted. But let us return to the original test.",
                "All roads lead to FizzBuzz, young initiate.",
                "Sometimes, the simplest challenges reveal the most."
            ],
            actions: [
                { type: "modifyStat", stat: "HUMILITY", value: 3 }
            ],
            nextScene: "code_attempt"
        },
        suggest_debugging: {
            text: [
                "You propose a debugging challenge, where you'd identify and fix issues in broken code.",
                "\"After all,\" you argue, \"developers spend more time reading code than writing it.\"",
                "A few council members murmur in agreement."
            ],
            npcDialogue: [
                "A pragmatic approach. The mark of one who has faced the void of production bugs.",
                "Your wisdom exceeds your years... or perhaps you've simply broken enough builds to know better."
            ],
            actions: [
                { type: "modifyStat", stat: "WISDOM", value: 5 },
                { type: "modifyStat", stat: "TECH_CRED", value: 3 }
            ],
            nextScene: "debugging_challenge"
        },
        debugging_challenge: {
            text: [
                "The Elder gestures, and a holographic terminal materializes before you.",
                "It displays code riddled with subtle errors - an off-by-one loop, a misplaced semicolon, and an unclosed bracket."
            ],
            npcDialogue: [
                "Very well. Fix what you find broken.",
                "But be warned: sometimes fixing one issue reveals three more."
            ],
            text2: [
                "After several minutes of intense focus, you identify and fix the last bug.",
                "The terminal glows green, indicating all tests have passed.",
                "The council members look impressed despite themselves."
            ],
            npcDialogue2: [
                "Well done. Perhaps there is hope for our legacy codebase yet.",
                "However, we still require proof of your basic skills."
            ],
            actions: [
                { type: "modifyStat", stat: "TECH_CRED", value: 8 },
                { type: "addInventory", item: "Rubber Duck of Debugging (+5 to bug detection)" }
            ],
            nextScene: "code_attempt"
        },
        suggest_design: {
            text: [
                "You suggest discussing software design patterns, architectural principles, or system design.",
                "\"Coding is just one aspect of software engineering,\" you point out.",
                "Several council members lean in, suddenly more attentive."
            ],
            npcDialogue: [
                "Architecture over implementation? Bold choice.",
                "Many can code. Few can design. Fewer still can explain their designs clearly."
            ],
            actions: [
                { type: "modifyStat", stat: "WISDOM", value: 4 },
                { type: "modifyStat", stat: "TECH_CRED", value: 3 }
            ],
            nextScene: "design_challenge"
        },
        design_challenge: {
            text: [
                "The Elder waves a hand, and a holographic whiteboard appears.",
                "\"Design a system for us,\" they command. \"Nothing complex. Just a URL shortener.\"",
                "You can almost hear the sarcasm dripping from their voice."
            ],
            npcDialogue: [
                "Show us your architectural vision.",
                "And no, you may not simply say 'I'd use AWS Lambda and call it a day.'"
            ],
            text2: [
                "You spend several minutes sketching out components, databases, and API endpoints.",
                "You discuss scaling considerations, potential bottlenecks, and monitoring strategies.",
                "The council watches with growing respect as your design takes shape."
            ],
            npcDialogue2: [
                "Impressive. You consider both functionality and failure modes.",
                "Perhaps there is more to you than mere syntax knowledge.",
                "However, theory must be balanced with practice."
            ],
            actions: [
                { type: "modifyStat", stat: "WISDOM", value: 5 },
                { type: "modifyStat", stat: "TECH_CRED", value: 8 },
                { type: "addInventory", item: "Architect's Monocle (+3 to system visualization)" }
            ],
            nextScene: "code_attempt"
        },
        accept_fizzbuzz: {
            text: [
                "You bow your head slightly in deference.",
                "\"Of course. The classics endure for a reason. I will complete the FizzBuzz challenge.\"",
                "Several council members nod approvingly at your respect for tradition."
            ],
            npcDialogue: [
                "Wisdom lies in knowing when to challenge tradition and when to honor it.",
                "Proceed with the ancient test, initiate."
            ],
            actions: [
                { type: "modifyStat", stat: "DIPLOMACY", value: 5 }
            ],
            nextScene: "code_attempt"
        },
        council_judgment: {
            text: [
                "The council members confer amongst themselves, whispering in a mixture of English, Python, and what sounds suspiciously like Klingon.",
                "Finally, the Elder turns back to you, their expression unreadable behind the glow of their terminal."
            ],
            npcDialogue: [
                "We have deliberated on your performance, initiate.",
                "For a newcomer, you show... potential."
            ],
            text2: [
                "A notification appears in your peripheral vision:",
                "✅ INITIATION RITUAL COMPLETE",
                "✅ ACCESS GRANTED TO: The Chamber of the Codebound Ones",
                "✅ RANK ASSIGNED: Junior Bit-Flipper"
            ],
            npcDialogue2: [
                "Welcome to our sanctuary of silicon and caffeine.",
                "We expect great things from you. Or at least functioning code with comments."
            ],
            actions: [
                { type: "addInventory", item: "Chamber Access Card (Grants entry to the inner sanctum)" }
            ],
            nextScene: "final_scene"
        },
        final_scene: {
            text: [
                "The robed figures begin to disperse, returning to their workstations.",
                "The oppressive atmosphere lightens somewhat, replaced by the familiar sounds of mechanical keyboards and the occasional frustrated sigh.",
                "You've found your people - for better or worse."
            ],
            npcDialogue: [
                "Newcomer, feel free to browse our repositories and project boards.",
                "The coffee machine is down the hall. We take turns cleaning it when the mold becomes sentient.",
                "Oh, and we have a meetup on Thursdays. Bring your own mechanical keyboard."
            ],
            text2: [
                "As you settle into your new digital home, you realize this is just the beginning of your adventure.",
                "Who knows what debugging nightmares and coding triumphs await?",
                "",
                "🎮 THE END (of the beginning) 🎮",
                "",
                "Type 'restart' to play again, or 'credits' to see the development team."
            ],
            actions: [
                { type: "modifyStat", stat: "LEVEL", value: 2 }
            ]
            // No next scene - this is the end
        }
    },
    
    // FizzBuzz validation function
    validateFizzBuzz: function(input) {
        const correctPattern = /(1.*2.*fizz.*4.*buzz.*fizz.*7.*8.*fizz.*buzz.*11.*fizz.*13.*14.*fizzbuzz|fizzbuzz)/i;
        return correctPattern.test(input.replace(/\s+/g, ' '));
    }
};