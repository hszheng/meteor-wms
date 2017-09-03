// Forward compability
if (typeof UI === 'undefined' || typeof UI.registerHelper !== 'function') {
  UI = {
    registerHelper: function(name, f) {
      if (typeof Handlebars !== 'undefined') {
        return Handlebars.registerHelper(name, f);
      } else {
        throw new Error('No UI or Handlebars found');
      }
    }
  };
}

if (typeof UI !== 'undefined') {
    
  UI.registerHelper("$mapped", function(arr) {
    if(!Array.isArray(arr)){
      try {
        arr = arr.fetch()
      }
      catch (e){
        console.log("Error in $mapped: perhaps you aren't sending in a collection or array.")
        return [];
      }
    }
    
    var $length = arr.length;
    
    var mappedArray = arr.map(function(item,index) {
      item.$length = $length;
      item.$index = index;
      item.$first = index === 0;
      item.$last  = index === $length-1;
      return item;
    });
    
    return mappedArray || [];
  });
}