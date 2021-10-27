// Declarations
let NextButton = document.getElementsByClassName('LSButton-content LSButton-Light-content')

// Get Next Button
for (i of NextButton) {
    if (i.lastChild.getAttribute('src') === 'https://cdn.testout.com/labsimsaas/images_v2/next.png') {
        NextButton = i 
    }
}

console.log(NextButton)

// Functions 
const SelectAnswers = function() {
    let Answers = document.querySelectorAll('[data-automationid ="arrow-correct"]')

    for (A of Answers) {
        A.parentElement.lastChild.firstChild.click() // Answer Button
    }

    NextButton.click() // Next Question
}

NextButton.onclick = function(){ // On Next Click
    window.setTimeout(SelectAnswers, 700);
}
SelectAnswers() // Base Execution
