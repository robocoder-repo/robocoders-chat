
const axios = require('axios');
const readline = require('readline');

const API_BASE_URL = 'https://api.robocoders.ai';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OTA2ZmJhZi00ZWM3LTRlYmMtODNmMi03NjRjNTY0MzI0NmUiLCJleHAiOjE3NjMyMTM3MTV9.z1K0-GF-QMbBOrtYBuH6SaGLbPg5hNwQVXguRW5gP-Y';

let sessionId = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createSession() {
  try {
    const response = await axios.get(`${API_BASE_URL}/create-session`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    sessionId = response.data.sid;
    console.log('Session created successfully.');
  } catch (error) {
    console.error('Error creating session:', error.message);
  }
}

async function chat(agent, prompt) {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, {
      sid: sessionId,
      prompt: prompt,
      agent: agent
    }, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    console.log('AI Response:', response.data);
  } catch (error) {
    console.error('Error in chat:', error.message);
  }
}

function promptUser() {
  rl.question('Enter command (general/repo/frontend/exit): ', (command) => {
    if (command.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    let agent;
    switch (command.toLowerCase()) {
      case 'general':
        agent = 'GeneralCodingAgent';
        break;
      case 'repo':
        agent = 'RepoAgent';
        break;
      case 'frontend':
        agent = 'FrontEndAgent';
        break;
      default:
        console.log('Invalid command. Please try again.');
        promptUser();
        return;
    }

    rl.question('Enter your prompt: ', async (prompt) => {
      await chat(agent, prompt);
      promptUser();
    });
  });
}

async function main() {
  await createSession();
  promptUser();
}

main();
