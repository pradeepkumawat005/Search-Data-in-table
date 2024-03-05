const UserInput = document.getElementById('userInput');
const checkboxContainer = document.getElementById('checkboxContainer');
const tableContainer = document.getElementById('tableContainer');
const paginationDiv = document.getElementById('pagination');

let result;
let currentPage = 1;
const rowsPerPage = 3;
let checkboxes = [];

async function getData() {
    const response = await fetch('https://dummyapi.online/api/users');
    result = await response.json();
    createCheckboxes();
    showData(result);
    setupPagination();
}
getData();

function createCheckboxes() {
    const keys = Object.keys(result[0]);

    const filteredKeys = keys.filter(key => key !== 'address');
    filteredKeys.forEach(key => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'filterKey';
        checkbox.id = key;
        checkbox.value = '';
        checkbox.checked = false;
        checkbox.addEventListener('change', () => {
            idBehalf(UserInput.value);
        });
        const label = document.createElement('label');
        label.htmlFor = key;
        label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        const br = document.createElement('br');
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(br);
        checkboxes.push(checkbox);
    });
}

function showData(data) {
    tableContainer.innerHTML = '';

    if (data.length === 0) {
        tableContainer.textContent = 'NO ITEMS IN THE TABLE';
        paginationDiv.innerHTML = '';
        return;
    }

    const table = document.createElement('table');
    table.border = '2';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const keys = Object.keys(data[0]).filter(key => key !== 'address');
    const headerRow = document.createElement('tr');
    keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, data.length);
    for (let i = startIndex; i < endIndex; i++) {
        const row = document.createElement('tr');
        keys.forEach(key => {
            const cell = document.createElement('td');
            if (key !== 'address') {
                cell.textContent = data[i][key];
                row.appendChild(cell);
            }
        });
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    setupPagination();
}

UserInput.addEventListener('keyup', (e) => {
    idBehalf(e.target.value);
});

function setupPagination() {
    const totalPages = Math.ceil(result.length / rowsPerPage);
    const maxVisiblePages = 2;

    let paginationHtml = '';

    for (let i = 1; i <= Math.min(totalPages, maxVisiblePages); i++) {
        paginationHtml += `<button class="${currentPage === i ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    if (totalPages > maxVisiblePages) {
        paginationHtml += `<span id="ellipsis" onclick="showInput()"><b>...</b></span>`;
        paginationHtml += `<button class="${currentPage === totalPages ? 'active' : ''}" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    paginationDiv.innerHTML = paginationHtml;
}



function showInput() {
    const ellipsisSpan = document.getElementById('ellipsis');
    ellipsisSpan.innerHTML = `<input type="number" id="pageNumInput" min="1" max="${Math.ceil(result.length / rowsPerPage)}" onkeydown="if(event.keyCode===13)goToPage(this.value)">`;
    const pageNumInput = document.getElementById('pageNumInput');
    pageNumInput.focus();
   
}

function goToPage(page) {
    currentPage = page;
    showData(result);
}

function idBehalf(input) { 
    const searchTerms = input.trim().toLowerCase().split(/\s+/);
    if (searchTerms.length === 0) {
        currentPage = 1;
        showData(result);
        return;
    }

    const checkedCheckboxes = checkboxes.filter(checkbox => checkbox.checked);

    let filteredArr = result.filter(item => {
        return searchTerms.every(term => {
            return Object.values(item).some(value => {
                if (typeof value === 'string' || typeof value === 'number') {
                    const stringValue = typeof value === 'number' ? value.toString() : value;
                    return stringValue.toLowerCase().includes(term);
                }
                return false;
            });
        });
    });

    if (checkedCheckboxes.length > 0) {
        filteredArr = filteredArr.filter(item => {
            return checkedCheckboxes.some(checkbox => {
                const key = checkbox.id.toLowerCase();
                const value = item[key];
                if (typeof value === 'string' || typeof value === 'number') {
                    const stringValue = typeof value === 'number' ? value.toString() : value;
                    return stringValue.toLowerCase().includes(input.toLowerCase());
                }
                return false;
            });
        });
    }

    if (filteredArr.length > 0) {
        currentPage = 1; 
    }
    showData(filteredArr);
}



// const UserInput = document.getElementById('userInput');
// const checkboxContainer = document.getElementById('checkboxContainer');
// const tableContainer = document.getElementById('tableContainer');
// const paginationDiv = document.getElementById('pagination');

// let result;
// let currentPage = 1;
// const rowsPerPage = 3;
// let checkboxes = [];

// async function getData() {
//     const response = await fetch('https://newsapi.org/v2/everything?q=tesla&from=2024-01-23&sortBy=publishedAt&apiKey=c580110e52bb4f9cbd14f559268d431f');
//     result = await response.json();
//     result=result.articles;
//     createCheckboxes();
//     showData(result);
//     setupPagination();
// }
// getData();

// function createCheckboxes() {
//     const keys = Object.keys(result[0]);

//     const filteredKeys = keys.filter(key => key !== 'address');
//     filteredKeys.forEach(key => {
//         const checkbox = document.createElement('input');
//         checkbox.type = 'checkbox';
//         checkbox.name = 'filterKey';
//         checkbox.id = key;
//         checkbox.value = '';
//         checkbox.checked = false;
//         checkbox.addEventListener('change', () => {
//             idBehalf(UserInput.value);
//         });
//         const label = document.createElement('label');
//         label.htmlFor = key;
//         label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
//         const br = document.createElement('br');
//         checkboxContainer.appendChild(checkbox);
//         checkboxContainer.appendChild(label);
//         checkboxContainer.appendChild(br);
//         checkboxes.push(checkbox);
//     });
// }

// function showData(data) {
//     tableContainer.innerHTML = '';

//     if (data.length === 0) {
//         tableContainer.textContent = 'NO ITEMS IN THE TABLE';
//         paginationDiv.innerHTML = '';
//         return;
//     }

//     const table = document.createElement('table');
//     table.border = '2';
//     const thead = document.createElement('thead');
//     const tbody = document.createElement('tbody');
//     const keys = Object.keys(data[0]).filter(key => key !== 'address');
//     const headerRow = document.createElement('tr');
//     keys.forEach(key => {
//         const th = document.createElement('th');
//         th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
//         headerRow.appendChild(th);
//     });
//     thead.appendChild(headerRow);
//     table.appendChild(thead);
//     const startIndex = (currentPage - 1) * rowsPerPage;
//     const endIndex = Math.min(startIndex + rowsPerPage, data.length);
//     for (let i = startIndex; i < endIndex; i++) {
//         const row = document.createElement('tr');
//         keys.forEach(key => {
//             const cell = document.createElement('td');
//             if (key !== 'address') {
//                 cell.textContent = data[i][key];
//                 row.appendChild(cell);
//             }
//             // if(key === 'image'){
//             //     let img = document.createElement('img');
//             //     img.src = UrlToImage; 
//             //     img.style.width = "100px";
//             //     cell.appendChild(img); 
//             // }
//         });
//         tbody.appendChild(row);
//     }
//     table.appendChild(tbody);
//     tableContainer.appendChild(table);
//     setupPagination();
// }

// UserInput.addEventListener('keyup', (e) => {
//     idBehalf(e.target.value);
// });

// function setupPagination() {
//     const totalPages = Math.ceil(result.length / rowsPerPage);
//     const maxVisiblePages = 2;

//     let paginationHtml = '';

//     for (let i = 1; i <= Math.min(totalPages, maxVisiblePages); i++) {
//         paginationHtml += `<button class="${currentPage === i ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
//     }

//     if (totalPages > maxVisiblePages) {
//         paginationHtml += `<span id="ellipsis" onclick="showInput()"><b>...</b></span>`;
//         paginationHtml += `<button class="${currentPage === totalPages ? 'active' : ''}" onclick="goToPage(${totalPages})">${totalPages}</button>`;
//     }

//     paginationDiv.innerHTML = paginationHtml;
// }



// function showInput() {
//     const ellipsisSpan = document.getElementById('ellipsis');
//     ellipsisSpan.innerHTML = `<input type="number" id="pageNumInput" min="1" max="${Math.ceil(result.length / rowsPerPage)}" onkeydown="if(event.keyCode===13)goToPage(this.value)">`;
//     const pageNumInput = document.getElementById('pageNumInput');
//     pageNumInput.focus();
   
// }

// function goToPage(page) {
//     currentPage = page;
//     showData(result);
// }

// function idBehalf(input) { 
//     const searchTerms = input.trim().toLowerCase().split(/\s+/);
//     if (searchTerms.length === 0) {
//         currentPage = 1;
//         showData(result);
//         return;
//     }

//     const checkedCheckboxes = checkboxes.filter(checkbox => checkbox.checked);

//     let filteredArr = result.filter(item => {
//         return searchTerms.every(term => {
//             return Object.values(item).some(value => {
//                 if (typeof value === 'string' || typeof value === 'number') {
//                     const stringValue = typeof value === 'number' ? value.toString() : value;
//                     return stringValue.toLowerCase().includes(term);
//                 }
//                 return false;
//             });
//         });
//     });

//     if (checkedCheckboxes.length > 0) {
//         filteredArr = filteredArr.filter(item => {
//             return checkedCheckboxes.some(checkbox => {
//                 const key = checkbox.id.toLowerCase();
//                 const value = item[key];
//                 if (typeof value === 'string' || typeof value === 'number') {
//                     const stringValue = typeof value === 'number' ? value.toString() : value;
//                     return stringValue.toLowerCase().includes(input.toLowerCase());
//                 }
//                 return false;
//             });
//         });
//     }

//     if (filteredArr.length > 0) {
//         currentPage = 1; 
//     }
//     showData(filteredArr);
// }
