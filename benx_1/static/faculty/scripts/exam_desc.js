//Navbar Script

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


// upload css script

function openFileUpload() {
  document.getElementById("csvFileInput").click();
}

// Add an event listener to handle file selection
document.getElementById("csvFileInput").addEventListener("change", handleFileSelect);

function handleFileSelect() {
  var csvFileInput = document.getElementById("csvFileInput");

  // Check if a file is selected
  if (csvFileInput.files.length > 0) {
    var selectedFile = csvFileInput.files[0];
    console.log("Selected file:", selectedFile);

    // Show SweetAlert confirmation for section input
    showSectionConfirmation(selectedFile);
  } 
}

// Function to show SweetAlert confirmation for section input
function showSectionConfirmation(selectedFile) {
  Swal.fire({
    title: 'Enter section:',
    input: 'text',
    inputPlaceholder: 'Enter valid Section eg(A1)',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    allowOutsideClick: false, // Prevent closing the alert by clicking outside
    inputValidator: (value) => {
      if (!value) {
        return 'Section is required';
      }

      // Adjusted regex for section format
      const regex = /^[A-Za-z]\d{1,2}$/;
      if (!regex.test(value)) {
        return 'Invalid section format (eg: A1)';
      }
    }
  }).then((sectionResult) => {
    if (sectionResult.isConfirmed) {
      // User entered a valid section, show confirmation for the entered value
      const sectionValue = sectionResult.value;

      Swal.fire({
        title: 'Confirmation',
        text: `You entered: ${sectionValue}. Do you want to proceed with the update?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, proceed',
        cancelButtonText: 'No, cancel'
      }).then((updateResult) => {
        if (updateResult.isConfirmed) {
          // User confirmed, proceed with your update logic
          console.log('Updating with file:', selectedFile, 'and section:', sectionValue);
          // Add your update logic here
        } else {
          console.log('Update canceled.');
        }
      });
    } else {
      console.log('Operation canceled');
    }
  });
}

  
// logout sweet alert


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
