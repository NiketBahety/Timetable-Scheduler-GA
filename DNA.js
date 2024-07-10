function getRandomCombination(profs, batches, slots, rooms) {
  let ind1 = Math.floor(Math.random() * profs.length);
  let ind2 = Math.floor(Math.random() * batches.length);
  let ind3 = Math.floor(Math.random() * batches[ind2].subjects.length);
  let ind4 = Math.floor(Math.random() * slots.length);
  let ind5 = Math.floor(Math.random() * rooms.length);

  return [
    profs[ind1],
    batches[ind2],
    batches[ind2].subjects[ind3],
    slots[ind4],
    rooms[ind5],
  ];
}

export default class DNA {
  constructor(professors, batches, slots, subjectWiseTeachers, rooms) {
    this.profs = professors;
    this.batches = batches;
    this.subjectWiseTeachers = subjectWiseTeachers;
    this.slots = slots;
    this.rooms = rooms;
    this.genes = [];

    for (let batch of batches) {
      for (let sub of batch.subjects) {
        let name = sub[0];
        for (let i = 0; i < sub[1]; i++) {
          let profs = subjectWiseTeachers.get(name);
          let ind = Math.floor(Math.random() * profs.length);
          let ind2 = Math.floor(Math.random() * slots.length);
          let ind3 = Math.floor(Math.random() * rooms.length);

          this.genes.push([profs[ind], batch, sub, slots[ind2], rooms[ind3]]);
        }
      }
    }
  }

  get fitness() {
    let conflicts = 0;
    let profSlotMap = new Map();
    let batchSlotMap = new Map();
    let batchSubCount = new Map();
    let roomSlotMap = new Map();

    for (let gene of this.genes) {
      if (profSlotMap.get(gene[0].name + gene[3])) {
        conflicts++;
        // console.log(gene);
      } else {
        profSlotMap.set(gene[0].name + gene[3], true);
      }
      if (batchSlotMap.get(gene[1].name + gene[3])) {
        conflicts++;
      } else {
        batchSlotMap.set(gene[1].name + gene[3], true);
      }
      if (roomSlotMap.get(gene[4][0] + gene[3])) {
        conflicts++;
      } else {
        roomSlotMap.set(gene[4][0] + gene[3], true);
      }
      if (!gene[1].subjects.includes(gene[2])) conflicts++;
      if (!gene[0].subjects.includes(gene[2][0])) conflicts++;

      let cnt = batchSubCount.get(gene[1].name + gene[2][0]);
      if (cnt) {
        batchSubCount.set(gene[1].name + gene[2][0], cnt + 1);
      } else {
        batchSubCount.set(gene[1].name + gene[2][0], 1);
      }

      if (gene[4][1] < gene[1].strength) conflicts++;
    }

    for (let batch of this.batches) {
      for (let sub of batch.subjects) {
        conflicts += Math.abs(
          (batchSubCount.get(batch.name + sub[0])
            ? batchSubCount.get(batch.name + sub[0])
            : 0) - sub[1]
        );
      }
    }

    return 1 / (1 + conflicts);
  }

  mutate() {
    let d = new DNA(
      this.profs,
      this.batches,
      this.slots,
      this.subjectWiseTeachers,
      this.rooms
    );
    d.genes = this.genes;
    let ind = Math.floor(Math.random() * this.genes.length);
    d.genes[ind] = getRandomCombination(
      this.profs,
      this.batches,
      this.slots,
      this.rooms
    );
    return d;
  }

  crossover(otherDNA) {
    let ind = Math.floor(Math.random() * this.genes.length);
    let d = new DNA(
      this.profs,
      this.batches,
      this.slots,
      this.subjectWiseTeachers,
      this.rooms
    );

    for (let i = 0; i <= ind; i++) {
      d.genes[i] = this.genes[i];
    }
    for (let i = ind + 1; i < this.genes.length; i++) {
      d.genes[i] = otherDNA.genes[i];
    }
    return d;
  }
}
