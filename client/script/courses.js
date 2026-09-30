if (!localStorage.getItem("token")) {
  window.location = "login.html";
}

const container = document.getElementById("courseContainer");

if (container) {
  loadCourses();
}

async function loadCourses() {
  const data = await getCourses();
  container.innerHTML = "";
  data.courses.forEach((course) => {
    container.innerHTML += `
        <div class="course-card">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p><strong>Instructor:</strong> ${course.instructor}</p>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <button onclick="enroll(${course.id})">
        Enroll
        </button>
        </div>
    `;
  });
}

async function enroll(id) {
  const data = await enrollCourse(id);
  alert(data.message);
}

const myCourses = document.getElementById("myCourses");

if (myCourses) {
  loadMyCourses();
}

async function loadMyCourses() {
  const data = await getMyCourses();
  myCourses.innerHTML = "";
  data.courses.forEach((course) => {
    myCourses.innerHTML += `
        <div class="course-card">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p>${course.instructor}</p>
        <p>${course.credits} Credits</p>
        <button onclick="drop(${course.id})">
        Drop Course
        </button>
        </div>
    `;
  });
}

async function drop(id) {
  const data = await dropCourse(id);
  alert(data.message);
  loadMyCourses();
}
