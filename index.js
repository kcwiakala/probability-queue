function weightGetter(field) {
  switch (typeof field) {
    case 'function':
      return field;
    case 'string':
      return element => element[field];
    default:
      throw new Error('weightField should be either function or a string');
  }
}

function idGetter(field) {
  switch(typeof field) {
    case 'function':
      return field;
    case 'string':
      return element => element[field];
    case 'undefined':
      return null;
    default:
      throw new Error('idField should be either function or a string');
  }
}

class ProbabilityQueue {
  constructor(weightField, idField) {
    this.weight = weightGetter(weightField);
    this.id = idGetter(idField);
    this.elements = [];
    this.sum = 0.0;
  }

  update() {
    this.sum = 0.0;
    for(let i=0; i<this.elements.length; ++i) {
      const weight = this.weight(this.elements[i]);
      if(weight < 0) {
        throw new Error('Element updated to negative weight');
      }      
      this.sum += weight;
    }
  }

  insert(element) {
    this.elements.push(element);
    const weight = this.weight(element);
    if(weight < 0) {
      throw new Error('Added element with negative weight');
    }
    this.sum += this.weight(element);
  }

  remove(eid) {
    let idx = -1;
    if(this.id) {
      idx = this.elements.findIndex(e => this.id(e) === eid);
    } else {
      idx = this.elements.indexOf(eid);
    }
    if(idx >= 0) {
      this.sum -= this.weight(this.elements[idx]);
      this.elements.splice(idx, 1);
    }
  }

  probability(element) {
    return this.weight(elem) / this.sum;
  }

  pick() {
    const r = Math.random() * this.sum;
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
