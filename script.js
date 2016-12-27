// Main
function main() {
  // grab raw instr_alt elements from webreg DOM
  var elements = $('span[class^=instr_alt]');

  // populate list of valid professors based on DOM criteria (hacky!)
  var professors = [];

  // iterate through elements
  $(elements).each(function() {
    // only parse in actual professors (not headers, empty spaces, etc.)
    if ($(this)[0].childNodes.length === 2) {
      professors.push($(this));
    }
  });

  // iterate through professors
  $(professors).each(function() {
    // call helperTID with this DOM object
    helperTID($(this));
  });
}

// TID Helper
function helperTID(professor) {
  // format professor name for RMP query
  var professorName = $(professor)[0].childNodes[1].data.toLowerCase();
  professorName = professorName.replace(',', '').replace(/\s/g, '+');

  // check for our list of exceptions!
  if (professorName === 'raghavachary+sathyanaraya') {
    professorName = 'raghavachary+saty';
  }

  // format search url for RMP
  var searchURL = ('http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+southern+california&query=PROFNAMEHERE&facetSearch=true').replace('PROFNAMEHERE', professorName);

  // send message to bg.js with chrome.runtime API
  chrome.runtime.sendMessage(searchURL, function(res) {
    // get this professor's specific TID
    var tid = $(res).find('.listing:first').find('a:first').attr('href');

    // if defined, search for rating. otherwise, provide no rating :(
    if (typeof tid != 'undefined') {
      // send another message, this time with our TID
      var professorPageURL = ('http://www.ratemyprofessors.com') + tid;
      chrome.runtime.sendMessage(professorPageURL, function(res) {
        // scrape overall quality and difficulty (for now)
        var overall_quality = $(res).find('.grade:eq(0)')[0].childNodes[0].data;
        var difficulty = $(res).find('.grade:eq(2)')[0].childNodes[0].data;

        // create and insert new HTML into this professor's DOM
        var newHTML = $(professor).html() + '<p></p><p> Overall Quality: ' + overall_quality + '</p>' + '<p> Difficulty: ' + difficulty + '</p>';
        $(professor).html(newHTML);
      });
    }
  });
}

// call to main
main();
