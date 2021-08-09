
export const noteMappings = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const chordTypes = {
  MAJOR7: 0,
  MINOR7: 1,
  DIMINISHED: 2,
  AUGMENTED: 3,
  DOMINANT: 4,
  MAJOR: 5,
  MINOR: 6
};

export const chordProgressions = {
  min1451: [
    {
      degree: 0,
      type: chordTypes.MINOR
    },
    {
      degree: 5,
      type: chordTypes.MINOR
    },
    {
      degree: 7,
      type: chordTypes.DOMINANT
    },
    {
      degree: 0,
      type: chordTypes.MINOR
    },
  ],
  min1165: [
    {
      degree: 0,
      type: chordTypes.MINOR7
    },
    {
      degree: 0,
      type: chordTypes.MINOR7
    },
    {
      degree: 8,
      type: chordTypes.DOMINANT
    },
    {
      degree: 7,
      type: chordTypes.DOMINANT
    }
  ],
  andalusian: [
    {
      degree: 0,
      type: chordTypes.MINOR
    },
    {
      degree: 10,
      type: chordTypes.MAJOR
    },
    {
      degree: 8,
      type: chordTypes.MAJOR
    },
    {
      degree: 7,
      type: chordTypes.DOMINANT
    }
  ],
  min1165: [
    {
      degree: 0,
      type: chordTypes.MINOR
    },
    {
      degree: 0,
      type: chordTypes.MINOR
    },
    {
      degree: 8,
      type: chordTypes.MINOR
    },
    {
      degree: 7,
      type: chordTypes.DOMINANT
    }
  ]
};

export class Melody {
  constructor(numMeasures) {
    this.measures = [];
    for (let i = 0; i < numMeasures; i++) {
      this.measures.push(new Measure());
    }
  }

  genMelodyInKey(key) {
    let index = noteMappings.indexOf(key);
    let chordProgression = genRandomChordProgression();
    let count = 0;
    let octaveCenter = 4;
    let octave = octaveCenter;
    for (let i = 0; i < this.measures.length; i++) {
      count = Math.floor(i / this.measures.length * chordProgression.length);
      let degree = (chordProgression[count].degree + index) % 12;
      octave = this.measures[i].genMeasure(degree, chordProgression[count], octave, octaveCenter);
    }
  }

  getData() {
    let data = [];
    for (let i = 0; i < this.measures.length; i++) {
      let measureData = this.measures[i].getData();
      for (let j = 0; j < measureData.length; j++) {
        measureData[j].start += i * 16;
        data.push(measureData[j]);
      }
    }
    return data;
  }

  getDuration() {
    let duration = 0;
    for (let i = 0; i < this.measures.length; i++) {
      duration += 16;
    }
    return duration;
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
      let noteString = (absolute.degree == null) ? null : noteMappings[absolute.degree] + absolute.octave;
      let noteData = {
        note: noteString,
        duration: absolute.duration,
        start: absolute.start,
      }
      data.push(noteData);
    }
    return data;
  }

  genMeasure(scaleDegree, chord, octave, octaveCenter) {
    let tonic = scaleDegree;
    let nOctave = octave;
    let values = genChordValues(chord);
    let duration = 3;
    let degree = Math.floor(Math.random() * values.length);
    let next = (Math.random() > 0.5) ? 1 : -1;
    let weights = {
      repeat: 1,
      rest: 0
    }
    for (let i = 0; i < 4; i++) {
      switch (i) {
        case 1: weights.rest = Math.random(); weights.repeat = Math.random(); break;
        case 3: weights.rest = Math.random() / 2; weights.repeat = Math.random(); break;
        default: weights.rest = 0; weights.repeat = 0; break;
      }
      let value;
      if (weights.rest > 0.9) {
        value = null;
      }
      else {
        if (weights.repeat < 0.8)
          degree += next;
        if (degree >= values.length) {
          degree %= values.length;
          nOctave++;
          let threshold = (Math.random() + 0.05) * (nOctave - octaveCenter); 
          next = (threshold > 0.05) ? -1 : 1;
        }
        else if (degree < 0) {
          degree = values.length + degree;
          nOctave--;
          let threshold = (Math.random() + 0.05) * (octaveCenter - nOctave); 
          next = (threshold > 0.05) ? 1 : -1;
        }
        value = values[degree];
      }
      weights.rest = 0;
      let note = new Note(nOctave, value, tonic, duration, i * 4);
      this.notes.push(note);
    }
    return nOctave;
    /**
    let weights = {
      up: 1,
      down: 1,
      repeat: 1,
      rest: 0
    }
    let totalWeightSum = weights.up + weights.down + weights.repeat;
    for (let i = 0; i < 4; i++) {
      totalWeightSum = weights.up + weights.down + weights.repeat;
      let randomWeightSum = Math.random() * totalWeightSum;
      if (i == 1) {
        weights.repeat *= 5;
        weights.rest = Math.random();
      }
      if (i == 2) {
        weights.repeat /= 5;
        weights.rest = Math.random();
      }
      let value = (weights.rest > 0.3) ? null : values[degree];
      let note = new Note(nOctave, value, tonic, duration, i * 4);
      this.notes.push(note);
      weights.rest = 0;
      if (randomWeightSum > weights.repeat + weights.down) {
        degree++; 
        weights.up /= 5; 
        weights.down *= 5;
        if (degree > values.length - 1) {
          degree %= values.length;
          nOctave++;
        }
      }
      else if (randomWeightSum > weights.repeat) {
        degree--; 
        weights.down /= 5;
        weights.up *= 5;
        if (degree < 0) {
          degree = values.length + degree;
          nOctave--;
        }
      }
      else {
        weights.repeat /= 2;
      }
    }
    **/
  }
}

export class Note {
  constructor(octave, degree, tonic, duration, start) {
    this.octave = octave;
    this.degree = degree; 
    this.tonic = tonic;
    this.duration = duration;
    this.start = start;
  }

  getAbsolute() {
    let noteValue = (this.degree == null) ? null : (this.degree + 12 * this.octave) + this.tonic;
    let absolute = {
      octave: Math.floor(noteValue / 12),
      degree: noteValue % 12,
      duration:  this.duration,
      start: this.start,
    };
    return absolute;
  }
}

export function parseSixteenthTime(count) {
  count = Math.floor(count);
  let measures = Math.floor(count / 16);
  count -= measures * 16;
  let quarters = Math.floor(count / 16);
  count -= quarters * 4;
  return measures + ":" + quarters + ":" + count;
}

export function genChordValues(chord) {
  let values;
  switch (chord.type) {
    case chordTypes.MAJOR7: values = [0, 4, 7, 11]; break;
    case chordTypes.MINOR7: values = [0, 3, 7, 10]; break;
    case chordTypes.DIMINISHED: values = [0, 3, 6, 9]; break;
    case chordTypes.AUGMENTED: values = [0, 4, 8, 10]; break;
    case chordTypes.DOMINANT: values = [0, 4, 7, 10]; break;
    case chordTypes.MAJOR: values = [0, 4, 7]; break;
    case chordTypes.MINOR: values = [0, 3, 7]; break;
  }
  return values;
}

export function genRandomChordProgression() {
  let progressions = Object.entries(chordProgressions);
  let [ name, progression ] = progressions[Math.floor(Math.random() * progressions.length)];
  console.log(`progression generated: ${name}`);
  return progression;
}

