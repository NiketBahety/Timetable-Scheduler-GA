export default class Professor {
  constructor(name, subjects) {
    this.name = name;
    this.subjects = subjects;
    this.timetable = new Map();
  }
}
