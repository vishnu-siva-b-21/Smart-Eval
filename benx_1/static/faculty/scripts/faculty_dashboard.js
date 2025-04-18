// content  password button validation
document.addEventListener('DOMContentLoaded', function() {
    const viewPasswordBtn = document.querySelector('.view-password-btn');
    const passwordText = document.querySelector('.password-input');

    viewPasswordBtn.addEventListener('click', function() {
        if (passwordText.type === 'password') {
            passwordText.type = 'text';
            if (window.innerWidth < 768) {            
            viewPasswordBtn.innerText = "Hide"}
            else{
              viewPasswordBtn.innerText = "Hide Password"
            }
        } else {
            passwordText.type = 'password';
            if (window.innerWidth < 768) {            
              viewPasswordBtn.innerText = "View"}
              else{
                viewPasswordBtn.innerText = "View Password"
              }
        }
    }); 
});


  function updateButtonNames() {
    var viewButton = document.querySelector('.view-button');
    var changeButton = document.querySelector('.change-button');
    if (window.innerWidth < 768) { // Adjust the width breakpoint as needed
      if (viewButton.innerText.split(" ")[0].toLowerCase() == "view"){
      viewButton.innerText = 'View';
      }
      else{
        viewButton.innerText = 'Hide';
      }
      changeButton.innerText = 'Change';
    } else {
      viewButton.innerText = 'View Password';
      changeButton.innerText = 'Change Password';
    }
  }

  // Call the function on page load and resize
  window.onload = updateButtonNames;
  window.onresize = updateButtonNames;


  
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



document.getElementById('confirmButton').addEventListener('click', function() {
  // Displaying SweetAlert confirmation popup with multiple input fields
  Swal.fire({
    title: 'Change Your Password',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Current Password" type="password">' +
      '<div id="swal-input1-validation" style="color: red;"></div>' + // Error message placeholder
      '<input id="swal-input2" class="swal2-input" placeholder="New Password" type="password">' +
      '<div id="swal-input2-validation" style="color: red;"></div>' + // Error message placeholder
      '<input id="swal-input3" class="swal2-input" placeholder="Confirm New Password" type="password">' +
      '<div id="swal-input3-validation" style="color: red;"></div>', // Error message placeholder
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    icon: 'info',
    reverseButtons: true,
    inputAttributes: {
      maxlength: 20, // Example: Maximum length of passwords
      pattern: ".{8,}", // Example: Password should be at least 8 characters long
    },
    preConfirm: () => {
      const currentPassword = document.getElementById('swal-input1').value;
      const newPassword = document.getElementById('swal-input2').value;
      const confirmNewPassword = document.getElementById('swal-input3').value;
      
      // Clear previous validation messages and styles
      document.getElementById('swal-input1-validation').textContent = '';
      document.getElementById('swal-input1').style.borderColor = '';
      document.getElementById('swal-input2-validation').textContent = '';
      document.getElementById('swal-input2').style.borderColor = '';
      document.getElementById('swal-input3-validation').textContent = '';
      document.getElementById('swal-input3').style.borderColor = '';

      // Custom password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      let isValid = true;
      if (!currentPassword) {
        document.getElementById('swal-input1-validation').textContent = 'Current Password is required!';
        document.getElementById('swal-input1').style.borderColor = 'red';
        isValid = false;
      }
      if (!newPassword) {
        document.getElementById('swal-input2-validation').textContent = 'New Password is required!';
        document.getElementById('swal-input2').style.borderColor = 'red';
        isValid = false;
      }
      if (!confirmNewPassword) {
        document.getElementById('swal-input3-validation').textContent = 'Confirm New Password is required!';
        document.getElementById('swal-input3').style.borderColor = 'red';
        isValid = false;
      }
      if (isValid) {
        if (newPassword !== confirmNewPassword) {
          document.getElementById('swal-input3-validation').textContent = 'New passwords do not match!';
          document.getElementById('swal-input3').style.borderColor = 'red';
          isValid = false;
        }
        if (!passwordRegex.test(newPassword)) {
          document.getElementById('swal-input2-validation').textContent = 'Invalid Password Format';
          document.getElementById('swal-input2').style.borderColor = 'red';
          isValid = false;
        }
      }
      return isValid ? [currentPassword, newPassword] : false;
    },
    willOpen: () => {
      // Clear all previous validation messages and styles when the dialog is opened
      document.getElementById('swal-input1-validation').textContent = '';
      document.getElementById('swal-input1').style.borderColor = '';
      document.getElementById('swal-input2-validation').textContent = '';
      document.getElementById('swal-input2').style.borderColor = '';
      document.getElementById('swal-input3-validation').textContent = '';
      document.getElementById('swal-input3').style.borderColor = '';
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const [currentPassword, newPassword] = result.value;
      
      // Perform AJAX request to send data to backend
      const data = {
        currentPassword: currentPassword,
        newPassword: newPassword
      };

      fetch('/faculty/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error('Unauthorized. Please login again.');
        } else if (response.status === 403) {
          throw new Error('Forbidden. Current password is incorrect.');
        } else {
          throw new Error('Failed to change password. Please try again later.');
        }
      })
      .then(data => {
        Swal.fire({
          text: data.message,
          icon: 'success',
        });
      })
      .catch((error) => {
        Swal.fire({
          text: error.message || 'Failed to change password',
          icon: 'error',
        });
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Operation cancelled',
        'error'
      );
    }
  });
});


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





//logout script

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

