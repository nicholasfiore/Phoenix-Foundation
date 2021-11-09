// Grab the HTML elements from the page
const reviewsArrows = document.querySelectorAll('.review-arrow');
const review = document.querySelector('#review');

// Set up the variables and get the initial review
let reviews;
fetch('/api/reviews')
.then(data => data.json())
.then(content => {
    reviews = content;
    updateReview();
});
let reviewIndex = 0;

// Each arrow will have the same event listener when it is clicked
reviewsArrows.forEach((arrow) => {
    arrow.addEventListener('click', () => {
        // Move the index in the appropriate direction and take care of going out of the bounds
        reviewIndex += (arrow.children[0].id === 'left-arrow') ? -1 : 1;
        if (reviewIndex >= reviews.length) {
            reviewIndex = 0;
        } else if (reviewIndex < 0) {
            reviewIndex = reviews.length - 1;
        }
        updateReview();
    });
});

function updateReview() {
    // Get the new review to show
    review.children[0].textContent = reviews[reviewIndex].reviewText;
    // Edit the HTML to show the new review
    review.children[1].innerHTML = `<i>&mdash; ${reviews[reviewIndex].name}; ${reviews[reviewIndex].country.replace(/\$/g, ' ')}</i>`;
}