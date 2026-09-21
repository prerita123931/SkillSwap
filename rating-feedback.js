const stars = document.querySelectorAll(".stars span");
const ratingText = document.getElementById("ratingText");

const ratingMessages = {
    1: "Poor experience",
    2: "Needs improvement",
    3: "Good experience",
    4: "Very good experience",
    5: "Excellent experience!"
};

let selectedRating = 0;


/* Star Rating */

stars.forEach(star => {

    star.addEventListener("click", function () {

        selectedRating = Number(this.dataset.rating);

        stars.forEach(s => {
            s.classList.remove("selected");
        });

        stars.forEach(s => {
            if (Number(s.dataset.rating) <= selectedRating) {
                s.classList.add("selected");
            }
        });

        ratingText.textContent = ratingMessages[selectedRating];
    });

});


/* Character Counter */

const feedback = document.getElementById("feedback");
const count = document.getElementById("count");

feedback.addEventListener("input", function () {
    count.textContent = this.value.length;
});


/* Submit Feedback */

function submitFeedback() {

    if (selectedRating === 0) {
        alert("Please select a rating first.");
        return;
    }

    if (feedback.value.trim() === "") {
        alert("Please write some feedback.");
        return;
    }

    alert(
        "Thank you for your feedback! ⭐\n\n" +
        "Your rating: " + selectedRating + "/5"
    );

    feedback.value = "";
    count.textContent = "0";

    stars.forEach(star => {
        star.classList.remove("selected");
    });

    selectedRating = 0;
    ratingText.textContent = "Select a rating";
}