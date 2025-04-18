// navbar script

const body = document.querySelector("body"),
modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
    sidebar.classList.toggle("close");
}



sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
})




// Logout sweet alert 


document.getElementById('confirmationButton').addEventListener('click', function (event) {
    // Prevent the default behavior (navigation) until confirmation
    event.preventDefault();
  
    // Show confirmation Sweet Alert
    Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, proceed to the linked page
        window.location.href = this.getAttribute('href');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If canceled, do nothing or handle accordingly
      }
    });
  });
  


  document.addEventListener('DOMContentLoaded', function () {
    var dashboardTop = document.querySelector('.dashboard .top');
    var logoImage = document.querySelector('.logo-image');

    dashboardTop.addEventListener('click', function () {
        // Toggle the 'hidden' class on the logo-image element
        logoImage.classList.toggle('hidden');
    });
});



document.addEventListener('DOMContentLoaded', function () {
  // Retrieve input values from local storage
  const selectedSection = localStorage.getItem("selectedSection");
  const selectedExamName = localStorage.getItem("selectedExamName");

  if (selectedSection && selectedExamName) {
      // If values exist, insert them into the table
      const examNameCell = document.querySelector('.exam-name');
      const sectionCell = document.querySelector('.section');

      examNameCell.textContent = selectedExamName;
      sectionCell.textContent = selectedSection;

      // Clear local storage
      localStorage.removeItem("selectedSection");
      localStorage.removeItem("selectedExamName");
  }
});


