/*Script for diplaying card questions questions are in a JSON format 
Will go through these questions to find the correct answer*/


let questions = [];
let allQuizQuestionsData = [];
let currentQ = 0;//Starts the questions from the beginning of the array.
const questionJsonPath = './questions.json';

//Write a function the from the array give me a random 10 question. 
async function loadQuestions(jsonFile) {
    try{
        const response = await fetch(jsonFile);
        if(!response.ok){
            throw new Error(`HTTP error, status ${response.status}`);
        }
        allQuizQuestionsData = await response.json();
        console.log(`Total questions loaded ${allQuizQuestionsData.length}`);
        return allQuizQuestionsData;
    }catch(error){
        console.error('Error loading questions');
        return [];
    }
}

//Function to select a random question
function selectRendomQuestions(questionArray, count = 10){
    if(questionArray.length == 0){
        console.error('No questions left');
        return [];
    }

    if(questionArray.length < count ){
        return [...questionArray];//Using spread operator to read through the question array.
    }

    const shuffledQuestions = [...questionArray];

    for (let i = shuffledQuestions.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i],shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]]
    }
    
    return shuffledQuestions.slice(0,count);//returns the first count question
}

async function initializeQuiz(jsonFilePath) {
    //Loding all questions from JSON
    const allQuestions = await loadQuestions(jsonFilePath);
    
    if(allQuestions.length == 0){
        console.error('Failed to load questions.');
        return false;
    }
    
    questions = selectRendomQuestions(allQuestions,10);
    console.log('Question selected ', questions);//Used to test if the question in terminal matched output onscreen.

    currentQ = 0;//reset index 

    if(questions.length > 0){
        displayQuestion()
        return true;
    }
    return false;
}


function initializeQuizWithData(jsonData) {
    allQuestionsData = jsonData;
    questions = getRandomQuestions(allQuestionsData, 10);
    console.log('Selected questions for quiz:', questions);
    
    currentQ = 0;
    
    if (questions.length > 0) {
        displayQuestion();
        return true;
    }
    
    return false;
}

function displayQuestion() {
    //Creating the question text.
    console.log("Method Called");

    let questionData = questions[currentQ]
    const container = document.getElementById("question_bank");

    //Testing to see if element is found
    if (!container) {
        console.error("Container element is not found");
        return;
    }

    console.log("Curr question: ", questionData)
    container.innerHTML = "";

    const questionText = document.createElement("p");
    questionText.className = "question-text"
    questionText.innerText = questionData.question; //Question from JSON file 
    container.appendChild(questionText);// Added into the question section
    
    //creating a div for the buttons
    // const buttonGrid = document.createElement('div');
    // buttonGrid.className = 'button-grid'

    //Creating the answer buttons and text.
    const options = ["A", "B", "C", "D"]
    options.forEach(option => {
        const button = document.createElement("button");
        button.className = "question-button";//Creates class name question-button
        button.innerText = `${option}.    ${questionData[option]}`;
        button.onclick = () => {
            selectAnswer(option, questionData.answer);//The second param confirms the correct answer.
        };
       // buttonGrid.appendChild(button);
        container.appendChild(button);
        
        
    });


    //Used to create another button so long as there are queestions to answer
    //The onclick is used to go to the next number in the array.
    if (currentQ < questions.length - 1) {
        const nextButton = document.createElement("button");
        nextButton.innerText = "Next Question";
        nextButton.className = "btn btn-success next-button";
        nextButton.onclick = () => {
            currentQ++;
            displayQuestion();
        };
        container.appendChild(nextButton);
    } else {
        const completeButton = document.createElement("button");
        completeButton.innerText = "The Quiz is Completed";
        completeButton.className = "btn btn-warning mt-3";
        completeButton.disabled = true;
        container.appendChild(completeButton);
    }

}

function selectAnswer(selectedOption, correctAnswer) {

    const buttons = document.querySelectorAll(".question-button");  
    //Going through each button
    buttons.forEach(button => {
        const option = button.innerText.charAt(0); // First character (A, B, C, D)
 
        if (option === correctAnswer) {
            button.style.backgroundColor = "green";
            button.style.color = "white";
        } else {
            button.style.backgroundColor = "red";
            button.style.color = "white";
        }
 
        // Disable all buttons after selection
        button.disabled = true;
    });
 
    if (selectedOption === correctAnswer) {
        console.log("Correct!");
    } else {
        console.log("Incorrect!");
    }
}

//Used to confirm that the page is fully loaded before calling displayQuestion function
window.addEventListener('DOMContentLoaded', function(){
    console.log("The DOM is loaded");
    initializeQuiz(questionJsonPath);
});


//Confirm the user is logged in
window.addEventListener('load', () =>{
    //Checks to make sure the user/guest is logged in when the page loads
    const username = sessionStorage.getItem("username");
    const guest = sessionStorage.getItem('isGuest');

    if(!username && !guest){
        alert('Please log in or play as a guest first to play the quiz.');
        window.location.href = 'index.html';
        return;
    }

    //Displays a welcome message based on if you are a guest or not. 
    console.log(guest);
    if(username){
        document.getElementById("welcome-message").textContent = `Hello ${username}.`;
        
    }else{
         document.getElementById("welcome-message").textContent = 'Welcome, Guest';
    }

   
});

/*This is a sign out section.*/
const logoutButton = document.getElementById('logout-btn');
logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('guest');

    //Check to make sure they want to log out
    if(confirm('Are you sure you want to logout?')){
        window.location.href = 'index.html';
    }
});

//Disable leader board for guests of the website.
function guestRestrictedFeatures(){
    const leaderboardLink = document.querySelector('a[href*="Leaderboard"]');
    if(leaderboardLink){
        leaderboardLink.style.display = 'none';
    }
}

function restartQuiz(){
    if(allQuizQuestionsData.length == 0){
        questions = selectRendomQuestions(allQuizQuestionsData,10);
        currentQ = 0;
        displayQuestion();
    }else{
        initializeQuiz(questionJsonPath);
    }
}