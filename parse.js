/**
 * Function to move the variable to left most leaf of the data tree,
 * without changing the equation.
 * takes O(n) time.
 * @param {Object} data
 */
function rearrange(data) {
  if (typeof data === 'string') {
    return {
      hasVar: true,
      data
    };
  }

  if (typeof data === 'number') {
    return {
      hasVar: false,
      data
    };
  }

  const lhs = data.lhs;
  const rhs = data.rhs;

  const newRhs = rearrange(data.rhs);
  const newLhs = rearrange(data.lhs);

  if (newRhs.hasVar) {
    data.lhs = newRhs.data;
    data.rhs = lhs;

    return {
      hasVar: true,
      data
    };
  } else if (newLhs.hasVar) {
    data.lhs = newLhs.data;

    return {
      hasVar: true,
      data
    };
  } else {
    return {
      hasVar: false,
      data
    };
  }
}

/**
 * Function to inverse the math operators, takes O(1) time
 * @param {string} op
 */
function inverse(op) {
  const map = {
    add: 'subtract',
    subtract: 'add',
    multiply: 'divide',
    divide: 'multiple'
  };

  return map[op];
}

/**
 * Function to isolate variable on the left side of data tree,
 * takes O(log(n)) time.
 * @param {Object} data
 */
function isolateVar(data) {
  if (typeof data.lhs === 'string') return data;

  const lhs = data.lhs;
  const rhs = data.rhs;

  const newData = {
    op: data.op,
    lhs: lhs.lhs,
    rhs: {
      op: inverse(lhs.op),
      lhs: rhs,
      rhs: lhs.rhs
    }
  };
  return isolateVar(newData);
}

/**
 * Function to calculate the equation, takes O(n) time
 * @param {Object | number} val
 */
function solve(val) {
  if (typeof val === 'number') {
    return val;
  }

  const x = solve(val.lhs);
  const y = solve(val.rhs);

  switch (val.op) {
    case 'add':
      return x + y;
    case 'subtract':
      return x - y;
    case 'multiply':
      return x * y;
    case 'divide':
      return x / y;
  }
}

function main() {
  const data = {
    op: 'equal',
    rhs: {
      op: 'add',
      lhs: 1,
      rhs: {
        op: 'multiply',
        lhs: 'x',
        rhs: 10
      }
    },
    lhs: 21
  };

  console.log(printEqn(data));

  const rearrangedObj = rearrange(data); // O(n)
  console.log('rearrangedObj', rearrangedObj);
  console.log(printEqn(rearrangedObj.data));

  const isolatedVar = isolateVar(rearrangedObj.data); // O(log(n))
  console.log('isolatedVar', isolatedVar);
  console.log(printEqn(isolatedVar));

  const result = solve(isolatedVar.rhs); // O(n)
  console.log(isolatedVar.lhs + ' = ' + result);
}

const operatorMap = {
  add: '+',
  subtract: '-',
  multiply: '*',
  divide: '/',
  equal: '='
};

function printEqn(data) {
  if (typeof data !== 'object') {
    return data;
  }

  if (data.op === 'equal') {
    return `${printEqn(data.lhs)} ${operatorMap[data.op]} ${printEqn(data.rhs)}`;
  } else return `(${printEqn(data.lhs)} ${operatorMap[data.op]} ${printEqn(data.rhs)})`;
}

main(); // total time complexity = O(n) + O(log(n)) + O(n) = O(n)
