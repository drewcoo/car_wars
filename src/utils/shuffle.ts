const shuffle = (arrayIn: any[]): any[] => {
  let result = arrayIn.slice(0)
  let currentIndex = result.length
  let temporaryValue: any, randomIndex: number

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = result[currentIndex]
    result[currentIndex] = result[randomIndex]
    result[randomIndex] = temporaryValue
  }

  return result
}

export default shuffle

/*
https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#2450976

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Used like so
let arr = [2, 11, 37, 42];
arr = shuffle(arr);
console.log(arr);
*/
