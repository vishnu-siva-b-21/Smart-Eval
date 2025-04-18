

  


 // Select the link element
 const loginLink = document.getElementById('loginLink');

 // Add a click event listener
 loginLink.addEventListener('click', function(event) {
   // Prevent the default action of the link
   event.preventDefault();

   // Show the SweetAlert confirmation dialog
   Swal.fire({
     title: 'Logout Confirmation',
     text: 'Are you sure you want to logout?',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonText: 'Yes, proceed',
     cancelButtonText: 'Cancel'
   }).then((result) => {
     // If the user confirms, navigate to the link
     if (result.isConfirmed) {
       window.location.href = loginLink.getAttribute('href');
     }
   });
 });