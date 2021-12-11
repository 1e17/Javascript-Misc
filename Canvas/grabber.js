
// Consts 
const body = document.body

// Grab answer from parent element
let errors = 0 
let grabAnswer = (parent) => {
  try {
    let answers = [...parent.parentElement
    .getElementsByClassName('answers')[0]
    .getElementsByClassName('answer answer_for_ correct_answer')]
    answers = answers.map(element => element.getElementsByClassName('answer_text'))
    .map((element,indx) => element[indx].textContent.trim())
    return answers
  } 
  catch (error) {
    console.error(`Ignore this if your name isn't Tristan. ${error}`)
    errors += 1
  }
}

// Grab current data keys 
let dict = {}
let _keys = [...body.getElementsByClassName('question_text user_content enhanced')]
let keys = _keys.map(element => element.textContent.trim())
_keys.map((element,indx) => dict[keys[indx]] = grabAnswer(element))
navigator.clipboard.writeText(JSON.stringify(dict,null,'\t'))
window.alert(`[DATA COPIED TO CLIPBOARD]\n[${errors} QUESTIONS COULD NOT BE MAPPED.]`)
