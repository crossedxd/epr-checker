var uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var lowers = "abcdefghijklmnopqrstuvwxyz";
var numerics = "1234567890";
var others = "#$%+.'’ ";
var allowedChars = uppers + lowers + numerics + others;

document.getElementById("input").oninput = function() {
  let input = document.getElementById("input").value;
  let words = scrubText(input).split(" ");
  let stats = "";
  let possibleNumbers = findPossibleNumbers(words);
  if (possibleNumbers.length > 0) {
    stats += "Possible numbers:</br>";
    possibleNumbers.forEach(function(number) {
      stats += number + "</br>";
    });
    stats += "</br>";
  }
  let possibleAcronyms = findPossibleAcronyms(words);
  if (possibleAcronyms.length > 0) {
    stats += "Possible acronyms:</br>";
    possibleAcronyms.forEach(function(acronym) {
      stats += acronym + "</br>";
    });
    stats += "</br>";
  }
  document.getElementById("stats").innerHTML = stats;
  let abbrevs = "";
  let possibleAbbreviations = findPossibleAbbreviations(words);
  if (possibleAbbreviations.length > 0) {
    abbrevs += "Possible abbreviation conflicts:</br>";
    possibleAbbreviations.forEach(function(abbreviation) {
      abbrevs += abbreviation + "</br>";
    });
  }
  document.getElementById("abbrevs").innerHTML = abbrevs;
};

String.prototype.includes = function (str) {
  return this.indexOf(str) !== -1;
};

function scrubText(text) {
  let scrubbedText = "";
  for (let i = 0; i < text.length; i++) {
    let c = text.charAt(i);
    if (allowedChars.includes(c)) {
      scrubbedText += c;
    } else {
      scrubbedText += " ";
    }
  }
  return scrubbedText;
}

function findPossibleNumbers(words) {
  let possibleNumbers = {};
  words.forEach(function(word) {
    for (let i = 0; i < word.length; i++) {
      if (numerics.includes(word.charAt(i))) {
        possibleNumbers[word] = true;
        break;
      }
    }
  });
  return Object.keys(possibleNumbers).sort();
}

function findPossibleAcronyms(words) {
  let possibleAcronyms = {};
  words.forEach(function(word) {
    if (word.length > 1) {
      if (word == word.toUpperCase() && findPossibleNumbers([word]).length == 0) {
        possibleAcronyms[word] = true;
      }
    }
  });
  return Object.keys(possibleAcronyms).sort();
}

function findPossibleAbbreviations(words) {
  let possibleAbbreviations = {};
  words.forEach(function(word_a) {
    let expr = word_a.toLowerCase()
      .split("")
      .filter(function(c) { return lowers.includes(c); });
    if (expr.length > 0) {
      expr = expr.join(".*") + ".*";
      words.forEach(function(word_b) {
        if (word_a != word_b && word_a.charAt(0) == word_b.charAt(0)) {
          if (word_b.search(expr) != -1) {
            possibleAbbreviations[word_a + " -> " + word_b] = true;
          }
        }
      });
    }
  });
  return Object.keys(possibleAbbreviations).sort();
}
