const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle"),
  sidebar = body.querySelector("nav"),
  sidebarToggle = body.querySelector(".sidebar-toggle");

console.log("create_ques.js");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
}

// sidebarToggle.addEventListener("click", () => {
//   sidebar.classList.toggle("close");
//   if (sidebar.classList.contains("close")) {
//     localStorage.setItem("status", "close");
//   } else {
//     localStorage.setItem("status", "open");
//   }
// });

// var dashboardTop = document.querySelector(".dashboard .top");
// var logoImage = document.querySelector(".logo-image");

// dashboardTop.addEventListener("click", function () {
//   // Toggle the 'hidden' class on the logo-image element
//   logoImage.classList.toggle("hidden");
// });

// Function to collect data from form and construct dictionary
function collectFormData() {
  const formData = {};

  // Extract exam title
  formData["exam_title"] = document
    .getElementById("exam_title")
    .textContent.trim();

  // Extract grammar correction toggle
  formData["grammar_correction"] =
    document.getElementById("grammar_toggle").checked;

  // Initialize an array to store all questions and answers
  formData["qp"] = [];

  // Extract fillups data
  const fillupQuestions = document.querySelectorAll(".fill_ques");
  const fillupAnswers = document.querySelectorAll(".fill_ans");
  for (let i = 0; i < fillupQuestions.length; i++) {
    const question = fillupQuestions[i].value.trim();
    const correct_answer = fillupAnswers[i].value.trim();
    if (question && correct_answer) {
      formData["qp"].push({ question, correct_answer, type: "fill_up" });
    }
  }

  // Extract short answer data
  const shortAnswerQuestions = document.querySelectorAll(".shortans_field");
  const shortAnswerAnswers = document.querySelectorAll(".shortans_ans");
  for (let i = 0; i < shortAnswerQuestions.length; i++) {
    const question = shortAnswerQuestions[i].value.trim();
    const correct_answer = shortAnswerAnswers[i].value.trim();
    if (question && correct_answer) {
      formData["qp"].push({ question, correct_answer, type: "short_ans" });
    }
  }

  return formData;
}

const form = document.getElementById("qpForm");
console.log(form);
// Form submit event
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = collectFormData();

  // Send data to backend via POST request
  fetch("/faculty/create_qp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      swal
        .fire({
          icon: "success",
          text: "qp created successfully",
          showConfirmButton: true, // Ensure the OK button is shown
        })
        .then(() => {
          window.location.href = "/faculty/faculty-dashboard"; // Redirect after OK is clicked
        });
    })
    .catch((error) => {
      swal
        .fire({
          icon: "error",
          text: "Encountred error please try again",
          showConfirmButton: true, // Ensure the OK button is shown
        })
        .then(() => {
          window.location.href = "/faculty/exam-desc"; // Redirect after OK is clicked
        });
    });
});
