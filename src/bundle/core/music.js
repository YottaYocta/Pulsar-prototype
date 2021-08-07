
const noteMappings = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export class Melody {
  constructor(numMeasures) {
    this.measures = [];
    for (let i = 0; i < numMeasures; i++) {
      this.measures.push(new Measure());
    }
  }

  genMelodyInKey(key) {
    let index = noteMappings.indexOf(key);
    let count = 0;
    for (let i = 0; i < this.measures.length; i++) {
      this.measures[i].genRandomInKey(key);
    }
  }

  getData() {
    let data = [];
    for (let i = 0; i < this.measures.length; i++) {
      data.push(this.measures[i].getData());
    }
    return data;
  }
}

export class Measure {
  constructor() {
    this.notes = [];
  }

  getData() {
    let data = [];
    for (let i = 0; i < this.notes.length; i++) {
      let absolute = this.notes[i].getAbsolute();
      let noteString = noteMappings[absolute.degree] + absolute.octave;
      let noteData = {
        note: noteString,
        duration: absolute.duration,
      }
      data.push(noteData);
    }
    return data;
  }

  genRandomInKey(key) {
    this.notes = [];
    let tonic = noteMappings.indexOf(key);
    let values = [0, 3, 7];
    for (let i = 0; i < 4; i++) {
      let degree = values[Math.floor(Math.random() * values.length)];
      let octave = Math.floor(Math.random() * 4) + 2;
      let duration = "4n";
      let note = new Note(octave, degree, tonic, duration);
      this.notes.push(note);
    }
  }
}

export class Note {
  constructor(octave, degree, tonic, duration) {
    this.octave = octave;
    this.degree = degree; 
    this.tonic = tonic;
    this.duration = duration;
  }

  getAbsolute() {
    let noteValue = (this.degree + 12 * this.octave) - this.tonic;
    let absolute = {
      octave: Math.floor(noteValue / 12),
      degree: noteValue % 12,
      duration:  this.duration,
    };
    return absolute;
  }
}
