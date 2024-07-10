import DNA from "./DNA.js";
import GeneticAlgorithm from "./GeneticAlgorithm.js";
import Professor from "./Professor.js";
import Batch from "./Batch.js";

let popSize = 1000;
let cp = 0.9;
let mp = 0.05;
let gens = 10000;

let initialPop = [];

// let profs = [
//   new Professor("P1", ["S1", "S2"]),
//   new Professor("P2", ["S3", "S4"]),
//   new Professor("P3", ["S5", "S6"]),
// ];

// let batches = [
//   new Batch("B1", [
//     ["S1", 3],
//     ["S2", 4],
//   ]),
//   new Batch("B2", [
//     ["S1", 3],
//     ["S3", 4],
//   ]),
//   new Batch("B3", [
//     ["S2", 3],
//     ["S6", 2],
//   ]),
// ];

let subjects = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];
let rooms = [
  ["R1", 20],
  ["R2", 30],
  ["R3", 40],
  ["R4", 50],
  ["R5", 60],
];

function getRandomSubjects(subjects, count) {
  let shuffled = subjects.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomCredit() {
  return Math.floor(Math.random() * 3) + 2;
}

let profs = [
  new Professor("P1", getRandomSubjects(subjects, 5)),
  new Professor("P2", getRandomSubjects(subjects, 5)),
  new Professor("P3", getRandomSubjects(subjects, 5)),
  new Professor("P4", getRandomSubjects(subjects, 5)),
  new Professor("P5", getRandomSubjects(subjects, 5)),
  new Professor("P6", getRandomSubjects(subjects, 5)),
  new Professor("P7", getRandomSubjects(subjects, 5)),
  new Professor("P8", getRandomSubjects(subjects, 5)),
  new Professor("P9", getRandomSubjects(subjects, 5)),
  new Professor("P10", getRandomSubjects(subjects, 5)),
];

let batches = [
  new Batch(
    "B1",
    getRandomSubjects(subjects, 5).map((subject) => [
      subject,
      getRandomCredit(),
    ]),
    20
  ),
  new Batch(
    "B2",
    getRandomSubjects(subjects, 5).map((subject) => [
      subject,
      getRandomCredit(),
    ]),
    25
  ),
  new Batch(
    "B3",
    getRandomSubjects(subjects, 5).map((subject) => [
      subject,
      getRandomCredit(),
    ]),
    35
  ),
  new Batch(
    "B4",
    getRandomSubjects(subjects, 5).map((subject) => [
      subject,
      getRandomCredit(),
    ]),
    45
  ),
  new Batch(
    "B5",
    getRandomSubjects(subjects, 5).map((subject) => [
      subject,
      getRandomCredit(),
    ]),
    50
  ),
];

if (localStorage.getItem("Profs"))
  profs = JSON.parse(localStorage.getItem("Profs"));
if (localStorage.getItem("Classes"))
  batches = JSON.parse(localStorage.getItem("Classes"));
if (localStorage.getItem("Rooms"))
  rooms = JSON.parse(localStorage.getItem("Rooms"));

let subjectWiseTeachers = new Map();

for (let prof of profs) {
  for (let sub of prof.subjects) {
    let temp = subjectWiseTeachers.get(sub);
    if (!temp) temp = [];
    temp.push(prof);
    subjectWiseTeachers.set(sub, temp);
  }
}

let days = ["MON", "TUE", "WED", "THU", "FRI"];

let slots = [];
for (let i = 9; i < 18; i++) {
  if (i != 13) {
    for (let day of days) slots.push(day + i);
  }
}

for (let i = 0; i < popSize; i++) {
  initialPop.push(new DNA(profs, batches, slots, subjectWiseTeachers, rooms));
}

let ga = new GeneticAlgorithm(cp, mp, initialPop, gens);

// console.log(ga);

let cur = 0;
let fittest;

if (localStorage.getItem("Profs")) profs = localStorage.getItem("Profs");

function step() {
  fittest = ga.getFittestIndividual();
  document.getElementById("gen").innerText = "Gen: " + cur;
  document.getElementById("fitness").innerText =
    "Best fitness: " + fittest.fitness;

  console.log(fittest.genes);

  if (fittest.fitness == 1) {
    createTable(fittest.genes);
    return;
  }

  ga.nextStep();
  cur++;

  if (cur < gens) requestAnimationFrame(step);
  else {
    createTable(fittest.genes);
  }
}

requestAnimationFrame(step);

function createTable(fittest) {
  const container = document.getElementById("container");

  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const times = Array.from({ length: 10 }, (_, i) => i + 9); // Time slots from 9 to 18

  // Create Professor Tables
  let professorTables = new Map();

  fittest.forEach((entry) => {
    let [professor, batch, subjectInfo, dayTime, room] = entry;
    let subject = subjectInfo[0];
    let day = dayTime.slice(0, 3);
    let time = parseInt(dayTime.slice(3));

    if (!professorTables.has(professor.name)) {
      let table = document.createElement("table");
      let caption = document.createElement("caption");
      caption.textContent = `Schedule for ${professor.name}`;
      table.appendChild(caption);

      let headerRow = document.createElement("tr");
      headerRow.appendChild(document.createElement("th"));
      times.forEach((timeSlot) => {
        let th = document.createElement("th");
        th.textContent = `${timeSlot}:00`;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      days.forEach((day) => {
        let row = document.createElement("tr");
        let dayCell = document.createElement("th");
        dayCell.textContent = day;
        row.appendChild(dayCell);
        times.forEach(() => {
          let cell = document.createElement("td");
          row.appendChild(cell);
        });
        table.appendChild(row);
      });

      professorTables.set(professor.name, table);
      container.appendChild(table);
    }

    let table = professorTables.get(professor.name);
    let dayRow = Array.from(table.rows).find(
      (row) => row.cells[0].textContent === day
    );
    let timeCell = dayRow.cells[times.indexOf(time) + 1];
    timeCell.textContent = `${subject} (${room[0]})`;
  });

  // Create Batch Tables
  let batchTables = new Map();

  fittest.forEach((entry) => {
    let [professor, batch, subjectInfo, dayTime, room] = entry;
    let subject = subjectInfo[0];
    let day = dayTime.slice(0, 3);
    let time = parseInt(dayTime.slice(3));
    let hours = subjectInfo[1];

    if (!batchTables.has(batch.name)) {
      let table = document.createElement("table");
      let caption = document.createElement("caption");
      caption.textContent = `Schedule for ${batch.name} (Strength: ${batch.strength})`;
      table.appendChild(caption);

      let headerRow = document.createElement("tr");
      headerRow.appendChild(document.createElement("th"));
      times.forEach((timeSlot) => {
        let th = document.createElement("th");
        th.textContent = `${timeSlot}:00`;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      days.forEach((day) => {
        let row = document.createElement("tr");
        let dayCell = document.createElement("th");
        dayCell.textContent = day;
        row.appendChild(dayCell);
        times.forEach(() => {
          let cell = document.createElement("td");
          row.appendChild(cell);
        });
        table.appendChild(row);
      });

      batchTables.set(batch.name, table);
      container.appendChild(table);
    }

    let table = batchTables.get(batch.name);
    let dayRow = Array.from(table.rows).find(
      (row) => row.cells[0].textContent === day
    );
    let timeCell = dayRow.cells[times.indexOf(time) + 1];
    timeCell.textContent = `${subject} (${hours}h) (${room[0]})`;
  });
}
// Call the function to create tables
