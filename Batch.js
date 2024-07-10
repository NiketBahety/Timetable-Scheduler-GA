export default class Batch {
  constructor(name, subjects, strength) {
    this.name = name;
    this.subjects = subjects;
    this.strength = strength;
    this.timetable = new Map();
  }
}
