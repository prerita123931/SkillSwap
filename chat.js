// ==========================================
// SEND MESSAGE
// ==========================================

function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();


    if (message === "") {
        return;
    }


    const messages =
        document.getElementById("messages");


    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "message sent";


    messageDiv.innerHTML = `

        <div>

            <div class="bubble">
                ${escapeHTML(message)}
            </div>

            <small>
                Just now ✓✓
            </small>

        </div>

    `;


    messages.appendChild(messageDiv);


    input.value = "";


    messages.scrollTop =
        messages.scrollHeight;
}



// ==========================================
// ENTER KEY
// ==========================================

function handleEnter(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

}



// ==========================================
// EMOJI
// ==========================================

function addEmoji() {

    const input =
        document.getElementById("messageInput");

    input.value += " 😊";

    input.focus();

}



// ==========================================
// OPEN CHAT
// ==========================================

function openChat(name) {

    document.getElementById(
        "chatUser"
    ).textContent = name;


    document
        .querySelectorAll(".conversation")
        .forEach(item => {

            item.classList.remove("active");

        });


    event.currentTarget.classList.add("active");

}



// ==========================================
// SCHEDULE SESSION
// ==========================================

function scheduleSession() {

    alert(
        "Session scheduling will open here.\n\n" +
        "Choose date, time and learning topic."
    );

}



// ==========================================
// SEARCH CONVERSATIONS
// ==========================================

const chatSearch =
    document.getElementById("chatSearch");


chatSearch.addEventListener(
    "input",
    function () {

        const search =
            this.value.toLowerCase();


        document
            .querySelectorAll(".conversation")
            .forEach(conversation => {

                const name =
                    conversation
                        .innerText
                        .toLowerCase();


                if (name.includes(search)) {

                    conversation.style.display =
                        "flex";

                } else {

                    conversation.style.display =
                        "none";

                }

            });

    }
);



// ==========================================
// SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}