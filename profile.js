function addSkill(type) {

    const skill = prompt("Enter the skill you want to add:");

    if (!skill || skill.trim() === "") {
        return;
    }

    const container =
        type === "teach"
            ? document.getElementById("teachSkills")
            : document.getElementById("wantSkills");

    const skillElement = document.createElement("span");

    skillElement.className = "skill";

    skillElement.innerHTML = `
        ${skill.trim()}
        <button onclick="deleteSkill(this)">×</button>
    `;

    container.appendChild(skillElement);
}


function deleteSkill(button) {

    button.parentElement.remove();

    showMessage("Skill deleted successfully!");
}


function editProfile() {

    document.getElementById("profileModal").style.display = "flex";
}


function closeModal() {

    document.getElementById("profileModal").style.display = "none";
}


function saveProfile() {

    const name =
        document.getElementById("editName").value;

    const email =
        document.getElementById("editEmail").value;

    const bio =
        document.getElementById("editBio").value;


    if (name.trim() === "" || email.trim() === "") {

        alert("Please fill all required fields.");

        return;
    }


    document.getElementById("profileName").innerText = name;

    document.getElementById("profileEmail").innerText = email;

    document.getElementById("bio").innerText = bio;


    document.getElementById("profileAvatar").innerText =
        name.charAt(0).toUpperCase();


    closeModal();

    showMessage("Profile updated successfully! ✓");
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

    document.body.appendChild(box);


    setTimeout(() => {

        box.remove();

    }, 3000);
}