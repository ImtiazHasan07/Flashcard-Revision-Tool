class Notifications {
  constructor() {
    this.notification;
  }

  displayErrorBox(message) {
    popupContainer.style.visibility = 'visible'
    popupContainer.style.backgroundColor = '#ebc8c4'
    popupMessage.style.color = '#9e2a2d'
    popupMessage.innerText = `Error: ${message}`
    if (this.notification) {
      clearTimeout(this.notification)
    }
    this.notification = setTimeout(() => popupContainer.style.visibility = 'hidden', 3000)
  }

  displayAlertBox(message) {
    popupContainer.style.visibility = 'visible'
    popupContainer.style.backgroundColor = '#a4ccff'
    popupMessage.style.color = '#003172'
    popupMessage.innerText = `Alert: ${message}`
    if (this.notification) {
      clearTimeout(this.notification)
    }
    this.notification = setTimeout(() => popupContainer.style.visibility = 'hidden', 3000)
  }
}

async function getConfig() {
  let configDirectory = './src/config.json'
  let config = await electron.readFileSync(configDirectory, { encoding: 'utf8' }) ? JSON.parse(await electron.readFileSync(configDirectory, { encoding: 'utf8' })) : {};
  if (!config.path) {
    config.path = await electron.default_path
    await electron.writeFileSync(configDirectory, JSON.stringify(config, null, 4));
  }
}

const startSessionButton = document.getElementById('start-session-button')
const createButton = document.getElementById('create-button')
const cardsForm = document.getElementById('cards-form')
const changeDirectory = document.getElementById('change-directory')
const popupContainer = document.getElementById('popup-container')
const popupMessage = document.getElementById('popup-message')
const notifications = new Notifications()

startSessionButton.addEventListener('click', async (event) => {
  location.href = '../session/index.html'
})

cardsForm.addEventListener('submit', (event) => {
  event.preventDefault()
})

createButton.addEventListener('click', async (event) => {
  event.preventDefault()

  let questionInput = document.getElementById('question-input')
  let answerInput = document.getElementById('answer-input')

  if (!questionInput.value || !answerInput.value) {
    notifications.displayErrorBox('All fields are required to be provided.')
    return;
  };

  let configDirectory = './src/config.json'
  let config = await electron.readFileSync(configDirectory, { encoding: 'utf8' }) ? JSON.parse(await electron.readFileSync(configDirectory, { encoding: 'utf8' })) : {};
  if (!config.path) {
    config.path = await electron.default_path
    if (!await electron.existsSync('../../flashcards')) {
      await electron.mkdirSync('../../flashcards')
    }
    await electron.writeFileSync(configDirectory, JSON.stringify(config, null, 4));
  }
  
  let data;
  try {
    data = JSON.parse(await electron.readFileSync(config.path, {
      encoding: 'utf8'
    }))
  } catch (error) {}

  if (!data) {
    data = []
    await electron.writeFileSync(config.path, JSON.stringify(data, null, 4));
  }

  data.push({
    question: questionInput.value,
    answer: answerInput.value
  })

  await electron.writeFileSync(config.path, JSON.stringify(data, null, 4));
  notifications.displayAlertBox('Card has been created successfully.')
  return;
})

changeDirectory.addEventListener('click', async (event) => {
  event.preventDefault()

  await electron.showOpenDialog({
    properties: ['openFile'],
    filters: [
        { name: 'JSON Files', extensions: ['json'] }
    ]
  }).then(async ({ filePaths }) => {
    if (filePaths.length === 0) return;

    let config = await getConfig();
    config.path = filePaths[0];

    await electron.writeFileSync(configDirectory, JSON.stringify(config, null, 4));
  }).catch((error) => {});
})