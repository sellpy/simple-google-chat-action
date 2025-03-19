import * as core from '@actions/core'

interface GoogleChatMessage {
  text?: string
  cards?: any[]
}

function getInput<T extends boolean>(name: string, required: T): T extends true ? string : string | null {
  if (process.env.GITHUB_ACTIONS === 'true') {
    return core.getInput(name, { required })
  }

  const value = process.env[name.replace(/ /g, '_').toUpperCase()]
  if (required && !value) {
    throw new Error(`Input required and not supplied: ${name}`)
  }

  return (value || null) as T extends true ? string : string | null
}

try {
  const webhookUrl = getInput('webhook_url', true)
  const message = getInput('message', false)
  const cardJson = getInput('card_json', false)

  const payload: GoogleChatMessage = {}

  if (message) {
    payload.text = message
  }

  if (cardJson) {
    try {
      payload.cards = JSON.parse(cardJson)
    } catch (error) {
      core.warning(`Failed to parse card JSON: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  core.info('Sending message to Google Chat...')

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.status} ${response.statusText}`)
  }

  const responseData = await response.json()
  core.info(`Message sent successfully: ${JSON.stringify(responseData)}`)
} catch (error) {
  core.setFailed(`Action failed: ${error instanceof Error ? error.message : String(error)}`)
}
