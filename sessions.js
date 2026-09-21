function scheduleSession() {

    const person = prompt("Enter the person you want to learn with:");

    if (!person || person.trim() === "") {
        return;
    }

    showMessage(
        `Session request sent to ${person.trim()}! 📅`
    );
}


function joinSession(sessionName) {

    showMessage(
        `You joined "${sessionName}" successfully! 🎓`
    );
}


function cancelSession(button) {

    const sessionItem = button.closest(".session-item");

    sessionItem.remove();

    showMessage(
        "Session cancelled successfully!"
    );
}


function showMessage(message) {

    const box = document.createElement("div");

    box.innerText = message;

    box.style.position = "fixed";
    box.style.bottom = "30px";
    box.style.right = "30px";

    box.style.background = "#7c3aed";
    box.style.color = "white";

    box.style.padding = "14px 20px";

    box.style.borderRadius = "10px";

    box.style.zIndex = "9999";

    box.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.2)";

    document.body.appendChild(box);

    setTimeout(() => {
        box.remove();
    }, 3000);
}