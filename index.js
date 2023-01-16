
// question component
// const question_component = (question, category) => `
//       <div class="card my-4">
//         <div class="card-body">
//           <h5 class="card-title mb-4 fw-medium">
//             ${question}
//           </h5>
//           <input
//             type="range"
//             class="form-range question-range"
//             min="0"
//             max="10"
//             step="1"
//             value="0"
//             data-category="${category}"
//           />
//           <div class="row">
//             <div class="col">Not really</div>
//             <div class="col text-center">Sometimes</div>
//             <div class="col text-end">Often</div>
//           </div>
//         </div>
//       </div>`;

const question_component = (question, category, index) => {
    let radiobuttons = Array(10).fill(1).map((_, i) => `<input type="radio" class="btn-check" name="question${index}" autocomplete="off" value="${i}" id="c${index}-${i}" data-category="${category}"><label class="btn btn-outline-secondary btn-sm" for="c${index}-${i}">${i+1}</label>`).join('');

    return `<div class="card my-4">
        <div class="card-body">
          <div class="card-title mb-4 fw-medium">
            ${question}
          </div>
          <div class="d-flex justify-content-between">
            ${radiobuttons}
            </div>
          <div class="row fs-small mt-1">
            <div class="col">Not me at all</div>
            <div class="col text-end">100% me</div>
          </div>
        </div>
      </div>`
    };

const progress_component = (width, text) => `
<div class="progress my-2" style="height: 1.5rem;">
    <div
        class="progress-bar bg-babyblue text-nowrap"
        role="progressbar"
        style="width: ${width}%"
    ></div>
    <div class="justify-content-left align-self-center ps-4 d-flex position-absolute w-100 fs-6 fw-medium">${text}</div>
</div>`;


// identify which version of the quiz to use based on hash
let version = window.location.hash.substring(1);
if(version != 'adult' && version != 'youth') {
    version = 'adult';
}

// loop through questions and write to screen
let html_questions = SURVEY[version].map((q, i) => {
    return question_component(q.question, q.category, i);
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
        let catqs = document.querySelectorAll(`[data-category="${category}"]:checked`);

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
    // let html_scores = `<table class="mt-5">` + Object.keys(scores).map((category) => `
    // <tr><th class="pe-3">${category}</th><td>${scores[category]}</td></tr>`).join('') + `</table>`;

    // write scores to screen
    let max_score = Object.keys(scores).reduce((max, category) => Math.max(max, scores[category]), 0);
    let html_scores = Object.keys(scores).map((category) => {
        let width = scores[category] / max_score * 100;
        return [width, progress_component(width, category + ': ' + scores[category])];
    });

    // sort by width
    html_scores.sort((a, b) => b[0] - a[0]);

    // remove width
    html_scores = html_scores.map((s) => s[1]).join('');

    document.getElementById('results').innerHTML = html_scores;
};

document.getElementById('btnSubmit').addEventListener('click', score_quiz);
