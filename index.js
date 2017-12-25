'use strict';

function makeGetter(field, name) {
  switch (typeof field) {
    case 'function':
      return field;
    case 'string':
      return element => element[weightField];
    default:
      throw new Error(name + ' should be either function or a string');
  }  
}

class ProbabilityQueue {
  constructor(weightField, idField) {
    this.weight = makeGetter(weightField, 'weightField');
    this.id = makeGetter(idField, 'idField');
    this.elements = [];
    this.sum;
  }

  update() {
    this.sum = 0.0;
    for(let i=0; i<this.elements.length; ++i) {
      this.sum += this.weight(this.elements[i]);
    }
  }

  insert(element) {
    this.elements.push(element);
    this.update();
  }

  remove(element) {
    const id = this.id(element);
    const idx = this.elements.findIndex(e => this.id(e) === id);
    this.elements.splice(idx, 1);
    this.update();
  }

  probability(element) {
    return this.weight(elem) / this.sum;
  }

  pick() {
    const r = Math.rand() * this.sum;
    let begin = 0;
    for(let i=0; i < this.elements.length; ++i) {
      const w = this.weight(this.elements[i]);
      if((r >= begin) && (r < begin + w)) {
        return this.elements[i];
      }
      begin += w;
    }
    return null;
  }
};

module.exports = ProbabilityQueue;
