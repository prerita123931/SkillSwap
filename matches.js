const searchInput = document.getElementById("searchInput");
const skillFilter = document.getElementById("skillFilter");
const availabilityFilter = document.getElementById("availabilityFilter");

const cards = document.querySelectorAll(".match-card");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");


function filterMatches() {

    const searchValue = searchInput.value.toLowerCase();
    const skillValue = skillFilter.value.toLowerCase();
    const availabilityValue =
        availabilityFilter.value.toLowerCase();

    let visibleCards = 0;


    cards.forEach(card => {

        const name =
            card.dataset.name.toLowerCase();

        const skills =
            card.dataset.skills.toLowerCase();

        const availability =
            card.dataset.availability.toLowerCase();


        const matchesSearch =
            name.includes(searchValue) ||
            skills.includes(searchValue);


        const matchesSkill =
            skillValue === "all" ||
            skills.includes(skillValue);


        const matchesAvailability =
            availabilityValue === "all" ||
            availability.includes(availabilityValue);


        if (
            matchesSearch &&
            matchesSkill &&
            matchesAvailability
        ) {

            card.style.display = "block";
            visibleCards++;

        } else {

            card.style.display = "none";

        }

    });


    resultCount.textContent =
        visibleCards + " matches found";


    if (visibleCards === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }
}


/* Search */

searchInput.addEventListener(
    "input",
    filterMatches
);


/* Skill Filter */

skillFilter.addEventListener(
    "change",
    filterMatches
);


/* Availability Filter */

availabilityFilter.addEventListener(
    "change",
    filterMatches
);


/* Connect */

function connectUser(name) {

    alert(
        "Connection request sent to " +
        name +
        "! 🤝"
    );

}