const toggleButton = document.getElementById('toggle-answer-button')
const mainMenuButton = document.getElementById('main-menu-button')
const previousButton = document.getElementById('previous-button')
const nextButton = document.getElementById('next-button')
const retryButton = document.getElementById('retry-button')
const question = document.getElementById('question')
const answer = document.getElementById('answer')

let answerHidden = true;
let value = 0;

let configDirectory = './src/config.json'
let config = await electron.readFileSync(configDirectory, { encoding: 'utf8' }) ? JSON.parse(await electron.readFileSync(configDirectory, { encoding: 'utf8' })) : {};
if (!config.path) {
  config.path = await electron.default_path
  await electron.writeFileSync(configDirectory, JSON.stringify(config, null, 4));
}

let cards = await electron.readFileSync(config.path, { encoding: 'utf8' }) ? JSON.parse(await electron.readFileSync(config.path, { encoding: 'utf8' })) : {};
if (!cards) {
  cards = []
  question.innerText = ''
  answer.innerText = 'There are no cards in this folder!\nTo add more cards select \"Main Menu\".'
  toggleButton.style.display = 'none'
  previousButton.style.display = 'none'
  nextButton.style.display = 'none'
  retryButton.style.display = 'none'
}

function session(index) {
  answerHidden = true

  if (index < cards.length) {
    if (index === 0) {
      previousButton.style.display = 'none'
    } else {
      previousButton.style.display = 'inline'
    }
    question.innerText = cards[index].question
    answer.innerText = ''
    toggleButton.innerText = 'Show Answer'
    toggleButton.style.display = 'inline'
    nextButton.style.display = 'inline'
    retryButton.style.display = 'none'
  } else {
    question.innerText = ''
    answer.innerText = 'There are no more cards left!\nTo add more cards select \"Main Menu\"\nand to restart the flash cards select \"Retry\".'
    toggleButton.style.display = 'none'
    previousButton.style.display = 'inline'
    nextButton.style.display = 'none'
    retryButton.style.display = 'inline'
  }
}

toggleButton.addEventListener('click', async (event) => {
  let answer = document.getElementById('answer')

  if (answerHidden) {
    answer.innerText = cards[value].answer
    toggleButton.innerText = 'Hide Answer'
    answerHidden = false
  } else {
    answer.innerText = ''
    toggleButton.innerText = 'Show Answer'
    answerHidden = true
  }
});

mainMenuButton.addEventListener('click', async (event) => {
  location.href = '../main_menu/index.html'
});

previousButton.addEventListener('click', async (event) => {
  value -= 1
  session(value)
});

nextButton.addEventListener('click', async (event) => {
  value += 1
  session(value)
});

retryButton.addEventListener('click', async (event) => {
  window.location.reload()
});

session(0);