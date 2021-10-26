// Grab the HTML elements from the page
const reviewsArrows = document.querySelectorAll('.review-arrow');
const review = document.querySelector('#review');

// Set up the variables and get the initial review
let reviewIndex = 1;
let numReviews = 0;
let newReview;
getReview();

// Each arrow will have the same event listener when it is clicked
reviewsArrows.forEach((arrow) => {
    arrow.addEventListener('click', () => {
        // Move the index in the appropriate direction and take care of going out of the bounds
        reviewIndex += (arrow.children[0].id === 'left-arrow') ? -1 : 1;
        if (reviewIndex > numReviews) {
            reviewIndex = 1;
        } else if (reviewIndex <= 0) {
            reviewIndex = numReviews;
        }
        // Get the new review to show
        getReview();
    });
});

// Gets the requested review
function getReview() {
    // Make the API call and process the information
    fetch(`/api/reviews/${reviewIndex}`)
        .then((response) => response.json())
        .then((data) => {
            newReview = data;
            numReviews = newReview.numReviews;
            review.children[0].textContent = newReview.review;
            // Edit the HTML to show the new review
            review.children[1].innerHTML = `<i>&mdash; ${newReview.name}; ${newReview.country.replace(/\$/g, ' ')}</i>`;
        });
}