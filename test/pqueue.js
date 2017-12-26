
const expect = require('chai').expect;
const ProbabilityQueue = require('../index');

describe('ProbabilityQueue', () => {
  describe('constructor', () => {
    it('Should throw error if invalid weightField provided', () => {
      expect(() => new ProbabilityQueue(null)).to.throw(Error);
      expect(() => new ProbabilityQueue(true)).to.throw(Error);
      expect(() => new ProbabilityQueue(1)).to.throw(Error);
    });

    it('Should throw error if invalid idField provided', () => {
      expect(() => new ProbabilityQueue('w', false)).to.throw(Error);
      expect(() => new ProbabilityQueue('s', 1)).to.throw(Error);
      expect(() => new ProbabilityQueue(e => e.weight(), null)).to.throw(Error);
    });

    it('Should initialize members', () => {
      let pq = new ProbabilityQueue('score');
      expect(pq.elements).to.be.instanceOf(Array);
      expect(pq.elements).to.be.empty;
      expect(pq.sum).to.be.equal(0);
    });
  });

  describe('insert', () => {
    it('Should only accept insertion of elements with non negative weight', () => {
      let pq = new ProbabilityQueue('score');
      expect(() => pq.insert({score: 10})).not.to.throw(Error);
      expect(() => pq.insert({score: 0})).not.to.throw(Error);
      expect(() => pq.insert({score: -1})).to.throw(Error);
    });

    it('Should update weight sum with one of new element', () => {
      let pq = new ProbabilityQueue('score');
      pq.insert({score: 87});
      expect(pq.sum).to.be.equal(87);
      pq.insert({score: 879});
      expect(pq.sum).to.be.equal(87 + 879);
      pq.insert({score: 16});
      expect(pq.sum).to.be.equal(87 + 879 + 16);
    });
  });

  describe('remove', () => {
    let e1 = {id: 2937, score: 10};
    let e2 = {id: 1723, score: 8};
    let e3 = {id: 4837, score: 17};

    it('Should remove given element by reference if no idField provided', () => {
      let pq = new ProbabilityQueue('score');
      pq.insert(e1);
      pq.insert(e2);
      pq.insert(e3);
      expect(pq.elements).to.be.deep.equal([e1,e2,e3]);
      pq.remove(e2);
      expect(pq.elements).to.be.deep.equal([e1,e3]);
      pq.remove(e1);
      expect(pq.elements).to.be.deep.equal([e3]);
    });

    it('Should remove element by id if idField specified', () => {
      let pq = new ProbabilityQueue('score', 'id');
      pq.insert(e1);
      pq.insert(e2);
      pq.insert(e3);
      expect(pq.elements).to.be.deep.equal([e1,e2,e3]);
      pq.remove(e1.id);
      expect(pq.elements).to.be.deep.equal([e2,e3]);
      pq.remove(e3.id);
      expect(pq.elements).to.be.deep.equal([e2]);
    });

    it('Should update sum after removing element', () => {
      let pq = new ProbabilityQueue('score');
      pq.insert(e1);
      pq.insert(e2);
      pq.insert(e3);
      expect(pq.sum).to.be.equal(e1.score + e2.score + e3.score);
      pq.remove(e2);
      expect(pq.sum).to.be.equal(e1.score + e3.score);
      pq.remove(e3);
      expect(pq.sum).to.be.equal(e1.score);
    })
  });

  describe('pick', () => {
    let e1 = {id: 0, score: 30};
    let e2 = {id: 1, score: 10};
    let e3 = {id: 2, score: 20};
    
    it('Should return elements with distribution proportional to their weight', () => {
      let pq = new ProbabilityQueue('score');
      pq.insert(e1);
      pq.insert(e2);
      pq.insert(e3);
      let count = [0,0,0];
      for(let i=0; i<1000; ++i) {
        const e = pq.pick();
        count[e.id] += 1;
      }
      expect(count[0]).to.be.closeTo(500, 50); // 50%
      expect(count[1]).to.be.closeTo(167, 50); // 16.7% 
      expect(count[2]).to.be.closeTo(333, 50); // 33.3% 
    })
  });
});