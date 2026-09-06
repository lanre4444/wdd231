const courses = [
    {
        code: "CSE 110",
        name: "Introduction to Programming",
        credits: 2,
        completed: true
    },
    {
        code: "CSE 111",
        name: "Programming with Functions",
        credits: 2,
        completed: true
    },
    {
        code: "CSE 210",
        name: "Programming with Classes",
        credits: 2,
        completed: false
    },
    {
        code: "WDD 130",
        name: "Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        code: "WDD 131",
        name: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        code: "WDD 231",
        name: "Web Frontend Development I",
        credits: 2,
        completed: false
    }
];

const courseContainer = document.querySelector("#course-container");
const totalCredits = document.querySelector("#total-credits");

function displayCourses(courseList) {
    courseContainer.innerHTML = "";

    courseList.forEach((course) => {
        const courseCard = document.createElement("div");

        courseCard.classList.add("course-card");

        if (course.completed) {
            courseCard.classList.add("completed");
        }

        courseCard.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <span>${course.credits} credits</span>
        `;

        courseContainer.appendChild(courseCard);
    });

    totalCredits.textContent = courseList.reduce(
        (total, course) => total + course.credits,
        0
    );
}

document.querySelector("#all-courses").addEventListener("click", () => {
    displayCourses(courses);
});

document.querySelector("#wdd-courses").addEventListener("click", () => {
    displayCourses(courses.filter((course) => course.code.startsWith("WDD")));
});

document.querySelector("#cse-courses").addEventListener("click", () => {
    displayCourses(courses.filter((course) => course.code.startsWith("CSE")));
});

displayCourses(courses);