// Tab content 

let tabs = document.querySelectorAll(".tabs h3");
let tabContents = document.querySelectorAll(".tab-content div");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tabContents.forEach((content) => {
      content.classList.remove("active");
    });
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    tabContents[index].classList.add("active");
    tabs[index].classList.add("active");
  });
});



// validation script


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("studentForm");

  // Field elements
  const registerNumber = document.getElementById("registerNumber");
  const password = document.getElementById("stu_password");

  // Error messages
  const registerNumberError = document.getElementById("registerNumberError");
  const passwordError = document.getElementById("stu_passwordError");

  // Validation patterns
  const registerNumberPattern = /^\d{8}$/;

  // Function to reset form styles
  function resetFormStyles() {
      registerNumber.classList.remove("invalid");
      password.classList.remove("invalid");
      registerNumberError.textContent = "";
      passwordError.textContent = "";
  }

  // Function to set invalid styles and error messages
  function setInvalid(element, errorMessage) {
      element.classList.add("invalid");
      const errorField = element.id === "registerNumber" ? registerNumberError : passwordError;
      errorField.textContent = errorMessage;
  }

  // Validation functions
  function validateRegisterNumber() {
      if (!registerNumber.value.trim()) {
          setInvalid(registerNumber, "Register Number is required");
          return false;
      } else if (!registerNumberPattern.test(registerNumber.value)) {
          setInvalid(registerNumber, "Register Number should be 8 digits");
          return false;
      }
      return true;
  }

  function validatePassword() {
      if (!password.value.trim()) {
          setInvalid(password, "Password is required");
          return false;}
      return true;
  }

  // Form submit event
  form.addEventListener("submit", function (e) {
      e.preventDefault();

      resetFormStyles();

      const isRegisterNumberValid = validateRegisterNumber();
      const isPasswordValid = validatePassword();

      if (isRegisterNumberValid && isPasswordValid) {
          // Form is valid, submit it
          form.submit();
      }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("teacherForm");

  // Field elements
  const email = document.getElementById("email");
  const password = document.getElementById("fal_password");

  // Error messages
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("fal_passwordError");

  // Validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to reset form styles
  function resetFormStyles() {
      email.classList.remove("invalid");
      password.classList.remove("invalid");
      emailError.textContent = "";
      passwordError.textContent = "";
  }

  // Function to set invalid styles and error messages
  function setInvalid(element, errorMessage) {
      element.classList.add("invalid");
      const errorField = element.id === "email" ? emailError : passwordError;
      errorField.textContent = errorMessage;
  }

  // Validation functions
  function validateEmail() {
      if (!email.value.trim()) {
          setInvalid(email, "Email is required");
          return false;
      } else if (!emailPattern.test(email.value)) {
          setInvalid(email, "Invalid email format");
          return false;
      }
      return true;
  }

  function validatePassword() {
      if (!password.value.trim()) {
          setInvalid(password, "Password is required");
          return false;
      }
      return true;
  }

  // Form submit event
  form.addEventListener("submit", function (e) {
      e.preventDefault();

      resetFormStyles();

      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();

      if (isEmailValid && isPasswordValid) {
          // Form is valid, submit it
          form.submit();
      }
  });
});


function setInvalid(element, message) {
  element.style.borderColor = "red";
  const errorSpan = element.nextElementSibling;
  errorSpan.textContent = message;
  errorSpan.style.color = "red";
}

function resetFormStyles(formId) {
  const form = document.getElementById(formId);
  const formElements = form.elements;

  for (let i = 0; i < formElements.length; i++) {
    if (formElements[i].type !== "submit") {
      formElements[i].style.borderColor = "green";
      const errorSpan = formElements[i].nextElementSibling;
      errorSpan.textContent = "";
    }
  }
}



const passwordInput = document.getElementById('fal_password');
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
});


const stuPasswordInput = document.getElementById('stu_password');
const toggleStuPassword = document.getElementById('toggleStuPassword');

toggleStuPassword.addEventListener('click', function() {
    const type = stuPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    stuPasswordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
});




function validateInput(event) {
    const input = event.target;
    const inputValue = input.value;

    // Remove any non-digit characters
    const sanitizedValue = inputValue.replace(/\D/g, '');

    // Update the input value
    input.value = sanitizedValue;
}

