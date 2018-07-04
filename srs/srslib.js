exports.addNextWords = function(number, wordList, srsList, srsMaxSize) { // add the next words (by order) to the srsList
  var cpt = 0;
  var i = 0;
  if(srsList.length + number > srsMaxSize){
    number = srsMaxSize - srsList.length
  }
  while(i < wordList.length && cpt < number){
    if (wordList[i].srs === 0){
      wordList[i].enterSrs();
      srsList.push(wordList[i]);
      cpt ++;
    }
    i++;
  }
}

exports.addRandomWord = function(wordList, srsList){ // add a random word to the srs list
  while(true){
   var rdm = Math.floor((Math.random() * 1000)); //generate a random beteween 0 and 999
   if(wordList[rdm].srs === 0){
     wordList[rdm].enterSrs();
     srsList.push(wordList[rdm]);
     break;
   }
 }
}

exports.countNotSrsWords = function(wordList){ //count the nb of words in the wordlist that haven't entered the SRS
  var counter = 0;
  for(let i = 0; i < wordList.length; i++){
    if(wordList[i].srs === 0){
      counter++;
    }
  }
  return counter;
}

exports.findWordIndexByName = function(wordList, name){
  var i = 0;
  while(i < wordList.length){
    if(wordList[i].word === name){
      break;
    }
    if(i === wordList.length-1 && wordList[i].word !== name){ //word is not in the list
      i = -1;
      break;
    }
    i++;
  }
  return i;
}

//La ca part en couille !
/*
exports.makeTest = function(wordList, srsList, word, input){
  var index = findWordIndexByName(WordList, word);
  wordList[index].readWord()
  if(input === word){
    wordList[index].succeedTest()
    if(wordList[index].testSuccess > ... && wordList[index].readNb > ...){

    }
  }
  if(input !== word){
    wordList[index].resetTest();
    wordList[index].lvDown();
  }



}*/
exports.findWordIdByUserId = function(word, user_id){ //return word_id with word and userid
	return new Promise((resolve, reject) => {
		var word_id = "";
		Srs.aggregate( [
		  { $match: { userId: user_id  } },
		  { $match: { word: word } } ], function (err, result) {
		    if (err) return reject(err);
		    if (result.length){
		      //word_id = result[0]._id;
		      //console.log("word _id: " + word_id);
					//return result[0]._id;
					return resolve(result[0]._id)
		    }
		  });
  	})
	}

  exports.getSrsSize = function(user_id) { //count the number of words in an user's SRS
  	return new Promise((resolve, reject) => {
  	  var srsSize = 0;
  	  Srs.aggregate( [
  	    { $match: { userId: user_id  } },
  	    { $group: { _id: null, count: { $sum: 1 }}}], function (err, result) {
  				if (err) return reject(err);
  	      if (result.length){
  	        srsSize = result[0].count;
  	        return resolve(srsSize);
  	      }
  	    });
  	  })
  	}
