// FUNCTIONS
/*
  filter: returns a subset of the input data that contains only the items for which the predicate returns true
  @data: an array of any arbitrary data
  @predicate: a function that takes a single datapoint as an argument. Returns either true or false.
  @return: a new array that contains all of the values in data
           for which the predicate function returns true
*/
function filter(data, predicate){
    let result = [];
    for (const item of data){
        if (predicate(item)){
            result.push(item);
        }
    }
    return result;
}

/*
  findLast: finds the last value in an array that meets the condition specified in the predicate
  @data: an array of any arbitrary data
  @predicate: a function that takes a single datapoint as an argument. Returns either true or false.
  @return: a single data point from data
*/
function findLast(data, predicate){
    return filter(data, predicate).pop();
}

/*
  map: creates a new array based on the input array where the value at each position in the array is the result of the callback function.
  @data: an array of any arbitrary data
  @callback: a function that takes a single datapoint as an argument. Returns a new value based on the input value
  @return: a new array of the callback function results
*/
function map(data, callback){
    let result = [];
    for (let item of data){
        result.push(callback(item));
    }
    return result;
}

/*
  pairIf: creates a new array based on the input arrays where the value at each position is an
          array that contains the 2 values that pair according to the predicate function.
  @data1: an array of any arbitrary data
  @data2: an array of any arbitrary data
  @predicate: a function that takes a single datapoint from each input array as an argument. Returns true or false
  @return: the newly created array of pairs
*/
function pairIf(data1, data2, predicate){
    let result = [];

    for (let item1 of data1){
        for (let item2 of data2){
            if (predicate(item1, item2)){
                result.push([item1, item2]);
            }
        }
    }

    return result;
}

/*
  reduce: creates an accumulated result based on the reducer function. The value returned is returned
          is the return value of the reducer function for the final iteration.
  @data: an array of any arbitrary data
  @reducer: a function that takes a single datapoint from each input array as an
            argument and the result of the reducer function from the previous iteration.
            Returns the result to be passed to the next iteration
  @initialValue: the starting point for the reduction.
  @return: the value from the final call to the reducer function.
*/
function reduce(data1, reducer, initialValue){
    let result = initialValue;

    for (let item of data1){
        result = reducer(item, result);
    }

    return result;
}


// OUTPUT
// number of invalid transactions
let numInvalidTransactions = filter(transactions, trx =>
    (trx.amount === 0 || trx.amount === null || trx.amount === undefined) ||
    (trx.product !== "FIG_JAM" && trx.product !== "FIG_JELLY" && trx.product !== "SPICY_FIG_JAM" && trx.product !== "ORANGE_FIG_JELLY")
    ).length;
console.log(`Number of invalid transactions: ${numInvalidTransactions}`);

// number of duplicate customers
let numDuplicateCustomers = pairIf(customers, customers, (cust1, cust2) =>
    cust1.emailAddress === cust2.emailAddress && cust1.id !== cust2.id).length / 2;
console.log(`Number of duplicate customers: ${numDuplicateCustomers}`);

// most recent transaction over $200
let mostRecentOver200 = findLast(transactions, trx => trx.amount > 200).amount;
console.log(`Most recent transaction over $200: $${mostRecentOver200}`);

// number of small, medium, large transactions
let transactionsBySize = reduce(transactions, (trx, acc) => {
    if (trx.amount < 25) {
        acc.small++;
    } else if (trx.amount >= 25 && trx.amount < 75) {
        acc.medium++;
    } else {
        acc.large++;
    }
    return acc;},
    {"small": 0, "medium": 0, "large": 0});
console.log(`Number of small transactions: ${transactionsBySize.small}`);
console.log(`Number of medium transactions: ${transactionsBySize.medium}`);
console.log(`Number of large transactions: ${transactionsBySize.large}`);

// customers with transactions over $200
let over200 = filter(transactions, trx => trx.amount > 200);
let custPairs = pairIf(over200, customers, (trx, cust) => trx.customerId === cust.id);
let uniqueCustOver200 = reduce(custPairs, (pairs, acc) => {
    if (!acc.includes(pairs[1])) {
        acc.push(pairs[1]);
    }
    return acc;
}, []);
let custNameOver200 = map(uniqueCustOver200, cust => `${cust.firstName} ${cust.lastName}`);

console.log("Customers with transactions over $200:")
console.log(uniqueCustOver200);
console.log("Names of customers with transactions over $200")
console.log(custNameOver200);