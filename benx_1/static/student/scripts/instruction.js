
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('confirmationButton').addEventListener('click', function () {
        Swal.fire({
            title: 'Are you sure you want to start the exam?',
            text: 'Once started, you cannot go back and change your answers.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, start exam!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Proceed to start the exam
                window.location.href = '/student/question'; // Redirect to the exam page
            }
        });
    });
});

