document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const initialScreen = document.getElementById('initial-screen');
    const passwordScreen = document.getElementById('password-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const messageScreen = document.getElementById('message-screen');
    const quizResult = document.getElementById('quiz-result');
    
    const clickObject = document.getElementById('click-object');
    const passwordInput = document.getElementById('password-input');
    const submitPassword = document.getElementById('submit-password');
    const passwordError = document.getElementById('password-error');
    const nextQuestionBtn = document.getElementById('next-question');
    const closeResultBtn = document.getElementById('close-result');
    
    const hearts = document.querySelector('.hearts');
    
    // Variables
    let clickCount = 0;
    const CORRECT_PASSWORD = "4422";
    const TOTAL_CLICK_CHALLENGE = 5;
    let currentQuestion = 1;
    let totalQuestions = 5;
    let correctAnswers = 0;
    
    // Quiz answers (case insensitive for text)
    const quizAnswers = {
        1: ["menganti", "pantai menganti"],
        2: ["wisdom park", "wisdompark", "wisdom-park", "wisdom"],
        3: "11",
        4: "a",
        5: "tyara"
    };
    
    // Result messages based on score
    const resultMessages = {
        5: "Baguss kamu udah siap jadi istrikuuu",
        4: "Not perfect but u did well byyy",
        3: "Ihhh masa ga seratuss",
        2: "Jahattt gakenal akuuu",
        1: "Seriously yang???",
        0: "Seriously yang???"
    };
    
    // Set initial position for the click object
    positionClickObject();
    
    // Click object event handler
    clickObject.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount < TOTAL_CLICK_CHALLENGE) {
            // Make it disappear and reappear at new position with smaller size
            clickObject.style.opacity = '0';
            
            setTimeout(() => {
                let scale = 1 - (clickCount * 0.15); // Reduce size gradually
                clickObject.style.transform = `scale(${scale})`;
                positionClickObject();
                clickObject.style.opacity = '1';
            }, 300);
        } else {
            // Final click - move to password screen
            initialScreen.classList.remove('active');
            passwordScreen.classList.add('active');
        }
    });
    
    // Submit password event handler
    submitPassword.addEventListener('click', function() {
        checkPassword();
    });
    
    // Allow enter key to submit password
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    // Next question button handler
    nextQuestionBtn.addEventListener('click', function() {
        handleQuizNavigation();
    });
    
    // Close result button handler
    closeResultBtn.addEventListener('click', function() {
        quizResult.style.display = 'none';
        messageScreen.classList.add('active');
        createHearts();
    });
    
    // Allow enter key for quiz inputs
    document.querySelectorAll('.quiz-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleQuizNavigation();
            }
        });
    });
    
    // Password validation
    function checkPassword() {
        const enteredPassword = passwordInput.value;
        
        if (enteredPassword === CORRECT_PASSWORD) {
            passwordScreen.classList.remove('active');
            quizScreen.classList.add('active');
            resetQuiz();
        } else {
            passwordError.textContent = "Password salah. Coba lagi!";
            passwordInput.value = '';
            
            // Shake effect for wrong password
            passwordInput.classList.add('shake');
            setTimeout(() => {
                passwordInput.classList.remove('shake');
            }, 500);
        }
    }
    
    // Reset quiz to first question
    function resetQuiz() {
        currentQuestion = 1;
        correctAnswers = 0;
        
        // Hide all questions except the first one
        for (let i = 1; i <= totalQuestions; i++) {
            const questionElement = document.getElementById(`question-${i}`);
            if (questionElement) {
                questionElement.style.display = i === 1 ? 'block' : 'none';
            }
        }
        
        // Clear all inputs
        document.querySelectorAll('.quiz-input').forEach(input => {
            input.value = '';
        });
        
        // Uncheck radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Update button text
        nextQuestionBtn.textContent = 'Selanjutnya';
    }
    
    // Handle quiz navigation and validation
    function handleQuizNavigation() {
        // Check current question's answer
        checkAnswer(currentQuestion);
        
        // If this was the last question, show results
        if (currentQuestion === totalQuestions) {
            showResults();
            return;
        }
        
        // Hide current question and show next
        document.getElementById(`question-${currentQuestion}`).style.display = 'none';
        currentQuestion++;
        document.getElementById(`question-${currentQuestion}`).style.display = 'block';
        
        // Change button text for last question
        if (currentQuestion === totalQuestions) {
            nextQuestionBtn.textContent = 'Selesai';
        }
    }
    
    // Check if the answer is correct
    function checkAnswer(questionNumber) {
        let userAnswer;
        
        // Get user answer based on question type
        if (questionNumber === 4) {
            // Multiple choice question
            const selectedOption = document.querySelector('input[name="answer-4"]:checked');
            userAnswer = selectedOption ? selectedOption.value : '';
        } else {
            // Text input question
            userAnswer = document.getElementById(`answer-${questionNumber}`).value.trim();
        }
        
        // Validate answer
        if (questionNumber === 1 || questionNumber === 2 || questionNumber === 5) {
            // Case insensitive text comparison
            const correctOptions = quizAnswers[questionNumber];
            if (Array.isArray(correctOptions)) {
                const isCorrect = correctOptions.some(option => 
                    userAnswer.toLowerCase() === option.toLowerCase());
                if (isCorrect) correctAnswers++;
            } else {
                if (userAnswer.toLowerCase() === correctOptions.toLowerCase()) {
                    correctAnswers++;
                }
            }
        } else if (questionNumber === 3) {
            // Number comparison
            if (userAnswer === quizAnswers[questionNumber]) {
                correctAnswers++;
            }
        } else if (questionNumber === 4) {
            // Multiple choice
            if (userAnswer === quizAnswers[questionNumber]) {
                correctAnswers++;
            }
        }
    }
    
    // Show quiz results
    function showResults() {
        // Calculate score
        const score = (correctAnswers / totalQuestions) * 100;
        
        // Update result popup
        document.querySelector('.score').textContent = `${score}%`;
        document.querySelector('.result-message').textContent = resultMessages[correctAnswers];
        
        // Show the popup
        quizScreen.classList.remove('active');
        quizResult.style.display = 'flex';
    }
    
    // Position the click object randomly
    function positionClickObject() {
        const containerWidth = initialScreen.offsetWidth;
        const containerHeight = initialScreen.offsetHeight;
        const objectWidth = clickObject.offsetWidth;
        const objectHeight = clickObject.offsetHeight;
        
        // Calculate safe boundaries (80% of container)
        const maxX = containerWidth - objectWidth - 20;
        const maxY = containerHeight - objectHeight - 20;
        
        // Random position within boundaries
        const randomX = Math.floor(Math.random() * maxX) + 10;
        const randomY = Math.floor(Math.random() * maxY) + 10;
        
        clickObject.style.left = randomX + 'px';
        clickObject.style.top = randomY + 'px';
    }
    
    // Create floating hearts in the background
    function createHearts() {
        // Initial hearts
        for (let i = 0; i < 15; i++) {
            createHeart();
        }
        
        // Continue creating hearts periodically
        setInterval(createHeart, 800);
    }
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // Random size
        const size = Math.random() * 20 + 10;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        
        // Set position and opacity
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        
        // Animation duration
        const duration = Math.random() * 5 + 5;
        heart.style.animation = `float ${duration}s linear forwards`;
        
        // Add to DOM
        hearts.appendChild(heart);
        
        // Remove after animation completes
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }
    
    // Add shake effect CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(style);
});