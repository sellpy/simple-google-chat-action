import * as core from '@actions/core'
import * as formatter from './formatter'

interface GoogleChatMessage {
  text?: string
  cardsV2?: any[]
}

async function run() {
  try {
    const webhookUrl = core.getInput('webhook_url', { required: true })
    const message = core.getInput('message', { required: false })
    const cardJson = core.getInput('card_json', { required: false })

    const payload: GoogleChatMessage = {}

    if (message) {
      payload.text = message
    }

    if (cardJson) {
      try {
        payload.cardsV2 = JSON.parse(cardJson)
        payload.cardsV2 = formatter.formatTextInCard(payload.cardsV2)
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
}

run()
