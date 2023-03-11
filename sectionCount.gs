// removes the counts after each heading name
function removeCountPerSection(){
  var docBody = DocumentApp.getActiveDocument().getBody();
  docBody.replaceText(' \\([0123456789]*\\)', "");
}

// counts the per-heading text count
function countPerSection() {                
  var body = DocumentApp.getActiveDocument().getBody();
  var para = body.getParagraphs();
  var levels = para.map(function(p) {
    return [DocumentApp.ParagraphHeading.TITLE, 
            DocumentApp.ParagraphHeading.SUBTITLE, 
            DocumentApp.ParagraphHeading.HEADING1,
            DocumentApp.ParagraphHeading.HEADING2,
            DocumentApp.ParagraphHeading.HEADING3,
            DocumentApp.ParagraphHeading.HEADING4,
            DocumentApp.ParagraphHeading.HEADING5,
            DocumentApp.ParagraphHeading.HEADING6,
            DocumentApp.ParagraphHeading.NORMAL].indexOf(p.getHeading());
  });
  var paraCounts = para.map(function (p) {
    // Using this regex instead of \W so that words aren't split on apostrophes
    // note that the Google Docs counter doesn't actually count em-dashes
    var wordArr = p.getText().split(/[\s+“”",.—!:\/]+/)
    console.log(wordArr.filter(isNotEmpty));
    return wordArr.filter(isNotEmpty).length;
  });

  // var counts = [];
  for (var i = 0; i < para.length; i++) {
    var count = 0;
    for (var j = i+1; j < para.length; j++) {
      if (levels[j] <= levels[i]) {
        break;
      }
      if (levels[j] == 8) {
        count += paraCounts[j];
      }
    }
    if (levels[i] < 8) {
      para[i].appendText(" (" + count + ")");
    }
  }
}

// used to remove empty strings from the array of words
function isNotEmpty(value) {
  return value != "";
}

// remove the counts from the heading, then add the new counts
function updateCounts(){
  removeCountPerSection();
  countPerSection();
}
