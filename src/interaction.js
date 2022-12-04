/**
 * Discord interactions manager
 */
import { InteractionResponseType, InteractionType } from "discord-interactions";

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    super(jsonBody, init);
  }
}

const toDiscord = (body) => {
  return new JsonResponse(body);
};

class Interaction {

  create = (type, func) => {
    switch (type) {
      case InteractionType.PING:
        return this.pong();
      case InteractionType.APPLICATION_COMMAND:
        return func();
    }
  };

  pong() {
    return toDiscord({
      type: InteractionResponseType.PONG,
    });
  }

  reply(content) {
    return toDiscord({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: content,
      },
    });
  }

  error(message, code) {
    return toDiscord({ error: message }, { status: code });
  }

}

export default new Interaction();
