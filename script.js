function findPartner() {

    const skill = document.querySelector(".search-box input").value;

    if (skill.trim() === "") {
        alert("Please enter a skill you want to learn.");
        return;
    }

    alert("Finding skill partners for: " + skill);
}