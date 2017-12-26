[![Build Status](https://travis-ci.org/kcwiakala/probability-queue.svg?branch=master)](https://travis-ci.org/kcwiakala/probability-queue)

Simple priority queue picking items based on weight driven probability.

# Installation

```shell
npm install --save probability-queue
```

# Usage

```javascript
const ProbabilityQueue = require('probability-queue');

let pq = new ProbabilityQueue('score');

pq.insert({name: 'Alice', score: 1});
pq.insert({name: 'Betty', score: 4});
pq.insert({name: 'Clara', score: 3});
pq.insert({name: 'Diana', score: 2});

let names = {
  'Alice': 0,
  'Betty': 0,
  'Clara': 0,
  'Diana': 0
};
for(let i=0; i<1000; ++i) {
  names[pq.pick().name] += 1;
}
console.log(names); 
```

Script above should produce output similar to:
```
{ Alice: 108, Betty: 402, Clara: 292, Diana: 198 }
```