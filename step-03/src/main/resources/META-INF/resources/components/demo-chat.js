import {css, LitElement} from 'lit';
import '@vaadin/icon';
import '@vaadin/button';
import '@vaadin/text-field';
import '@vaadin/text-area';
import '@vaadin/form-layout';
import '@vaadin/progress-bar';
import '@vaadin/checkbox';
import '@vaadin/horizontal-layout';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-sort-column.js';

export class DemoChat extends LitElement {

    _stripHtml(html)   {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    }

    connectedCallback() {
        const chatBot = document.getElementsByTagName("chat-bot")[0];

        const protocol = (window.location.protocol === 'https:') ? 'wss' : 'ws';
        let processing = 'batch'
        let socket = new WebSocket(protocol + '://' + window.location.host + '/chat/' + processing);
        let socketStreaming = new WebSocket(protocol + '://' + window.location.host + '/chat/' + 'stream');

        const streamingToogle = document.getElementById('streamingToggle');
        streamingToogle.addEventListener('change', function() {
            processing = streamingToogle.checked ? 'stream' : 'batch';
          });

        const that = this;

        const onMessage = function (event) {
            chatBot.hideLastLoading();
            // LLM response
            let lastMessage;
            if (chatBot.messages.length > 0) {
                lastMessage = chatBot.messages[chatBot.messages.length - 1];
            }
            if (lastMessage && lastMessage.sender.name === "Bot"  && ! lastMessage.loading) {
                if (! lastMessage.msg) {
                    lastMessage.msg = "";
                }
                lastMessage.msg += event.data;
                let bubbles = chatBot.shadowRoot.querySelectorAll("chat-bubble");
                let bubble = bubbles.item(bubbles.length - 1);
                if (lastMessage.message) {
                    bubble.innerHTML = that._stripHtml(lastMessage.message) + lastMessage.msg;
                } else {
                    bubble.innerHTML = lastMessage.msg;
                }
                chatBot.body.scrollTo({ top: chatBot.body.scrollHeight, behavior: 'smooth' })
            } else {
                chatBot.sendMessage(event.data, {
                    right: false,
                    sender: {
                        name: "Bot"
                    }
                });
            }
        }
        socket.onmessage = onMessage;
        socketStreaming.onmessage = onMessage;
        

        chatBot.addEventListener("sent", function (e) {
            if (e.detail.message.sender.name !== "Bot") {
                // User message
                const msg = that._stripHtml(e.detail.message.message);
                processing === "batch" ? socket.send(msg) : socketStreaming.send(msg);
                chatBot.sendMessage("", {
                    right: false,
                    loading: true
                });
            }
        });
    }


}

customElements.define('demo-chat', DemoChat);
