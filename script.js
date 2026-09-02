const form = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const courseSelect = document.getElementById('course');
const genderInputs = document.querySelectorAll('input[name="gender"]');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const tableContainer = document.getElementById('tableContainer');

let students = JSON.parse(localStorage.getItem('students')) || [];

// Real-time validation functions
function validateName(name) {
    return name.trim().length > 0;
}

function validateAge(age) {
    return age && age > 0 && age <= 100;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function getSelectedGender() {
    return Array.from(genderInputs).find(input => input.checked)?.value;
}

function showError(input, message) {
    const errorId = input.id + 'Error';
    const errorElement = document.getElementById(errorId);
    input.classList.add('invalid');
    input.classList.remove('valid');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(input) {
    const errorId = input.id + 'Error';
    const errorElement = document.getElementById(errorId);
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorElement.classList.remove('show');
}

// Name validation
nameInput.addEventListener('input', (e) => {
    if (validateName(e.target.value)) {
        clearError(nameInput);
    } else {
        showError(nameInput, 'Name cannot be empty');
    }
    updateSubmitBtn();
});

// Age validation
ageInput.addEventListener('input', (e) => {
    if (validateAge(e.target.value)) {
        clearError(ageInput);
    } else {
        showError(ageInput, 'Please enter a valid age (1-100)');
    }
    updateSubmitBtn();
});

// Email validation
emailInput.addEventListener('input', (e) => {
    if (validateEmail(e.target.value)) {
        clearError(emailInput);
    } else {
        showError(emailInput, 'Please enter a valid email address');
    }
    updateSubmitBtn();
});

// Course validation
courseSelect.addEventListener('change', () => {
    updateSubmitBtn();
});

// Gender validation
genderInputs.forEach(input => {
    input.addEventListener('change', () => {
        updateSubmitBtn();
    });
});

// Update submit button state
function updateSubmitBtn() {
    const isNameValid = validateName(nameInput.value);
    const isAgeValid = validateAge(ageInput.value);
    const isEmailValid = validateEmail(emailInput.value);
    const isCourseValid = courseSelect.value !== '';
    const isGenderValid = getSelectedGender() !== undefined;

    submitBtn.disabled = !(isNameValid && isAgeValid && isEmailValid && isCourseValid && isGenderValid);
}

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const student = {
        id: Date.now(),
        name: nameInput.value,
        age: ageInput.value,
        gender: getSelectedGender(),
        course: courseSelect.value,
        email: emailInput.value
    };

    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));

    form.reset();
    nameInput.classList.remove('valid');
    ageInput.classList.remove('valid');
    emailInput.classList.remove('valid');
    courseSelect.classList.remove('valid');
    submitBtn.disabled = true;

    renderTable();
});

// Delete student
function deleteStudent(id) {
    students = students.filter(s => s.id !== id);
    localStorage.setItem('students', JSON.stringify(students));
    renderTable();
}

// Render table
function renderTable() {
    if (students.length === 0) {
        tableContainer.innerHTML = '<div class="empty-state"><p>No student records yet. Add one above!</p></div>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Course</th>
                    <th>Gender</th>
                    <th>Email</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    students.forEach(student => {
        html += `
            <tr>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.course}</td>
                <td>${student.gender}</td>
                <td>${student.email}</td>
                <td><button type="button" class="btn-delete" onclick="deleteStudent(${student.id})">Delete</button></td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    tableContainer.innerHTML = html;
}

// Initial render
renderTable();
