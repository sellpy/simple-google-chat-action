const core = require('@actions/core')
const { formatter } = require('./formatter')

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

        for (const { card } of payload.cardsV2!) {
          if (card.sections) {
            for (const section of card.sections) {
              if (section.widgets) {
                for (const widget of section.widgets) {
                  if (widget.textParagraph) {
                    widget.textParagraph.text = formatter.formatMarkdown(widget.textParagraph.text)
                  }
                }
              }
            }
          }
        }
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
