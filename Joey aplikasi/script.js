// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {

    // --- DOM Elements ---
    const guessInput = document.getElementById("guess-input");
    const guessBtn = document.getElementById("guess-btn");
    const mobileTryNowBtn = document.getElementById("mobile-try-now");
    const feedbackMessage = document.getElementById("feedback-message");
    const guessesList = document.getElementById("guesses-list");
    const playAgainBtn = document.getElementById("play-again-btn");
    const body = document.body;

    // --- Game Variables ---
    let randomNumber;
    let previousGuesses;

    /**
     * Initializes or resets the game.
     */
    function initializeGame() {
        // 1. Generate a random number between 1 and 100
        randomNumber = Math.floor(Math.random() * 100) + 1;
        
        // 2. Reset guess array
        previousGuesses = [];
        
        // 3. Reset UI elements
        guessInput.value = "";
        feedbackMessage.textContent = "Good luck!";
        feedbackMessage.className = ""; // Remove .wrong or .correct
        guessesList.innerHTML = "";
        
        // 4. Reset button states
        playAgainBtn.classList.add("hidden");
        guessInput.disabled = false;
        guessBtn.style.display = "block";
        mobileTryNowBtn.style.display = "none"; // Will be corrected by CSS media query
        
        // 5. Reset body class
        body.classList.remove("game-over");

        // 6. Re-apply mobile button visibility based on screen size
        // This ensures the correct button shows on reset
        if (window.innerWidth <= 600) {
            guessBtn.style.display = "none";
            mobileTryNowBtn.style.display = "block";
        } else {
            guessBtn.style.display = "block";
            mobileTryNowBtn.style.display = "none";
        }
    }

    /**
     * Handles the guess submission from the user.
     */
    function handleGuess() {
        const guess = parseInt(guessInput.value);

        // --- 1. Validation ---
        if (isNaN(guess) || guess < 1 || guess > 100) {
            setFeedback("Please enter a valid number between 1 and 100.", "wrong");
            return;
        }

        if (previousGuesses.includes(guess)) {
            setFeedback("You already tried that number!", "wrong");
            guessInput.value = ""; // Clear input
            return;
        }
        
        // --- 2. Record the guess ---
        previousGuesses.push(guess);
        addGuessToList(guess);
        
        // --- 3. Check the guess ---
        if (guess === randomNumber) {
            // Correct guess
            setFeedback(`Correct! The number was ${randomNumber}. You win!`, "correct");
            endGame();
        } else if (guess < randomNumber) {
            // Guess is too low
            setFeedback("Too Low! Try a higher number.", "wrong");
        } else {
            // Guess is too high
            setFeedback("Too High! Try a lower number.", "wrong");
        }

        // Clear input for next guess
        guessInput.value = "";
        guessInput.focus();
    }

    /**
     * Ends the game, disabling inputs and showing "Play Again".
     */
    function endGame() {
        guessInput.disabled = true;
        playAgainBtn.classList.remove("hidden");
        
        // Hide both guess buttons
        guessBtn.style.display = "none";
        mobileTryNowBtn.style.display = "none";
        
        // Add class to body to help hide mobile button (if needed)
        body.classList.add("game-over");
    }

    /**
     * Updates the feedback message with text and style.
     * @param {string} message - The text to display.
     * @param {string} type - The class to apply ('wrong', 'correct', or 'info').
     */
    function setFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = type;
    }

    /**
     * Adds the guess to the "Previous Guesses" list in the UI.
     * @param {number} guess - The number the user guessed.
     */
    function addGuessToList(guess) {
        const li = document.createElement("li");
        li.textContent = `Guess #${previousGuesses.length}: ${guess}`;
        // Add to the top of the list
        guessesList.prepend(li);
    }

    // --- Event Listeners ---
    
    // Start the game on page load
    initializeGame();
    
    // Listen for clicks on both guess buttons
    guessBtn.addEventListener("click", handleGuess);
    mobileTryNowBtn.addEventListener("click", handleGuess);
    
    // Listen for "Enter" key press in the input field
    guessInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            handleGuess();
        }
    });
    
    // Listen for "Play Again" click
    playAgainBtn.addEventListener("click", initializeGame);
    
    // Adjust button visibility on window resize
    window.addEventListener("resize", () => {
        if (!body.classList.contains("game-over")) {
            if (window.innerWidth <= 600) {
                guessBtn.style.display = "none";
                mobileTryNowBtn.style.display = "block";
            } else {
                guessBtn.style.display = "block";
                mobileTryNowBtn.style.display = "none";
            }
        }
    });

});