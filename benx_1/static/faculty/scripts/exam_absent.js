//Navbar script

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


// table sorted script


document.querySelectorAll('[data-sort-value-update]').forEach(el => el.onchange = e => {
  el.closest('td').dataset.sortValue = el.checked ? 1 : 0
})


function getCellIndex(t) { var a = t.parentNode, r = Array.from(a.parentNode.children).indexOf(a); let s = 0; for (let e = 0; e < a.cells.length; e++) { var l = a.cells[e].colSpan; if (s += l, 0 === r) { if (e === t.cellIndex) return s - 1 } else if (!isNaN(parseInt(t.dataset.sortCol))) return parseInt(t.dataset.sortCol) } return s - 1 } let is_sorting_process_on = !1, delay = 100; function tablesort(e) { if (is_sorting_process_on) return !1; is_sorting_process_on = !0; var t = e.currentTarget.closest("table"), a = getCellIndex(e.currentTarget), r = e.currentTarget.dataset.sort, s = t.querySelector("th[data-dir]"), s = (s && s !== e.currentTarget && delete s.dataset.dir, e.currentTarget.dataset.dir ? "asc" === e.currentTarget.dataset.dir ? "desc" : "asc" : e.currentTarget.dataset.sortDefault || "asc"), l = (e.currentTarget.dataset.dir = s, []), o = t.querySelectorAll("tbody tr"); let n, u, c, d, v; for (j = 0, jj = o.length; j < jj; j++)for (n = o[j], l.push({ tr: n, values: [] }), v = l[j], c = n.querySelectorAll("th, td"), i = 0, ii = c.length; i < ii; i++)u = c[i], d = u.dataset.sortValue || u.innerText, "int" === r ? d = parseInt(d) : "float" === r ? d = parseFloat(d) : "date" === r && (d = new Date(d)), v.values.push(d); l.sort("string" === r ? "asc" === s ? (e, t) => ("" + e.values[a]).localeCompare(t.values[a]) : (e, t) => -("" + e.values[a]).localeCompare(t.values[a]) : "asc" === s ? (e, t) => isNaN(e.values[a]) || isNaN(t.values[a]) ? isNaN(e.values[a]) ? isNaN(t.values[a]) ? 0 : -1 : 1 : e.values[a] < t.values[a] ? -1 : e.values[a] > t.values[a] ? 1 : 0 : (e, t) => isNaN(e.values[a]) || isNaN(t.values[a]) ? isNaN(e.values[a]) ? isNaN(t.values[a]) ? 0 : 1 : -1 : e.values[a] < t.values[a] ? 1 : e.values[a] > t.values[a] ? -1 : 0); const N = document.createDocumentFragment(); return l.forEach(e => N.appendChild(e.tr)), t.querySelector("tbody").replaceChildren(N), setTimeout(() => is_sorting_process_on = !1, delay), !0 } Node.prototype.tsortable = function () { this.querySelectorAll("thead th[data-sort], thead td[data-sort]").forEach(e => e.onclick = tablesort) };


document.querySelector('.table-sortable').tsortable()
document.querySelectorAll('.table-sortable').forEach(el => el.tsortable())

// Function to convert a table to CSV format
function convertToCSV(table) {
  // Retrieve the table rows
  const rows = table.querySelectorAll('tr');
  // Initialize CSV string
  let csv = '';
  // Loop through rows
  for (const row of rows) {
      // Retrieve cells in the row
      const cells = row.querySelectorAll('th, td');
      // Initialize row data
      let rowData = '';
      // Loop through cells
      for (const cell of cells) {
          // Append cell data to row data, add comma if not first cell
          rowData += (rowData ? ',' : '') + '"' + cell.innerText.replace(/"/g, '""') + '"';
      }
      // Append row data to CSV string, add newline
      csv += rowData + '\n';
  }
  return csv;
}

// Function to download CSV file
function downloadCSV(csv, filename) {
  const csvBlob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('href', URL.createObjectURL(csvBlob));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function to handle download button click
function handleDownloadButtonClick() {
  const filename = document.getElementById("exam_title").innerHTML
  const table = document.querySelector('.table-sortable');
  // Convert table to CSV format
  const csv = convertToCSV(table);
  // Download CSV file
  downloadCSV(csv, `${filename} absentees.csv`);
}

// Event listener for download button click
document.querySelector('.download').addEventListener('click', handleDownloadButtonClick);