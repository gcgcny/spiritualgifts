
// question component
const question_component = (question, category) => `
      <div class="card my-4">
        <div class="card-body">
          <h5 class="card-title mb-4 fw-medium">
            ${question}
          </h5>
          <input
            type="range"
            class="form-range question-range"
            min="0"
            max="10"
            step="1"
            value="0"
            data-category="${category}"
          />
          <div class="row">
            <div class="col">Not really</div>
            <div class="col text-center">Sometimes</div>
            <div class="col text-end">Often</div>
          </div>
        </div>
      </div>`;

// identify which version of the quiz to use based on hash
let version = window.location.hash.substring(1);
if(version != 'adult' && version != 'youth') {
    version = 'adult';
}

// loop through questions and write to screen
let html_questions = SURVEY[version].map((q) => {
    return question_component(q.question, q.category);
}).join('');
document.getElementById('qcontainer').innerHTML = html_questions;


// score quiz
const score_quiz = () => {
    // get all the question types
    let categories = SURVEY[version].map((q) => q.category);

    // get unique categories
    categories = [...new Set(categories)];

    // create an object to store the scores
    let scores = {};

    // loop through the categories
    categories.forEach((category) => {
        // get all questions for the category
        let catqs = document.querySelectorAll(`[data-category="${category}"]`);

        console.log(catqs);

        // get the score for the category
        let score = 0;
        catqs.forEach((q) => {
            let value = parseInt(q.value);
            score += value;
        });

        // store the score
        scores[category] = score;
    });

    // write scores to screen
    let html_scores = `<table class="mt-5">` + Object.keys(scores).map((category) => `
    <tr><th class="pe-3">${category}</th><td>${scores[category]}</td></tr>`).join('') + `</table>`;
    document.getElementById('results').innerHTML = html_scores;
};

document.getElementById('btnSubmit').addEventListener('click', score_quiz);
