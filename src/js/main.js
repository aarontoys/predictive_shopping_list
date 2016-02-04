// add scripts

$(document).on('ready', function() {

  $('.panel').hide();
  
  // console.log('sanity check!');
  // debugger    
  addDataFromLocalStorageToDom('curList');
  addDataFromLocalStorageToDom('nextList');
  addDataFromLocalStorageToDom('folList');
  $('#newItem').on('submit', function(event){
    event.preventDefault();
    // createNewSemItem();
    debugger
    var semanticName = $('input[name="semanticName"]').val();
    var reorderFreqVal = $('input[name="reorderFreqVal"]').val();
    var reorderFreqMag = $('input[name="reorderFreqMag"]:checked').val();
    var reorderFreq = reorderFreqVal * reorderFreqMag;   
    var newSemItem = new SemanticItem(semanticName,reorderFreq);

    // $('.panel').slideUp('slow');
    chooseList(reorderFreq, semanticName);
  });

  $('table').on('click', '.btn-success', function(event){
    event.preventDefault();
    classIs = hasClass($(this));
    removeFromList($(this), classIs);
    });

  $('table').on('click', '.move-right', function(event){
    event.preventDefault();
    // debugger
    moveRight($(this));

  });

});

var url ='';

$("#getUPC").on('click', function getUPC () {
  var upc = $('#upc').val();
  // url = 'https://api.indix.com/v2/catalogStandard/products?countryCode=US&upc='+upc+'&app_id=74a3097f&app_key=75f09b2953555d90fe34b5d3eba7a1fe';
  url = 'src/js/products.json';
  // console.log(upc);
  // console.log(url);


      var setting = {
      "url": url,
      "method": "GET",
      "header": {
        "Accept": "application/json"
      },
      "crossDomain": true
      // ,"dataType": "jsonp"
    };

 $.ajax(setting).done(function(data){
    $('.panel').slideDown();
    var brandName = data.result.products[0].brandName;
    var title = data.result.products[0].title;
    var imgURL = data.result.products[0].imageUrl;
    var upc = data.result.products[0].upcs;

    // console.log(imgURL);

    $('#prodTitle').text(title);
    $('#prodBrand').text("Brand: " + brandName);
    $('#prodImg').attr("src",imgURL);
  });

});

//Logic
  // var itemList =[];
  // var newSemItem ={};

  var daysBetweenShops = 3; /* will be asked of from user */
  var startDate = new Date(2016, 1, 1);
  var firstShop = 3; /* will be asked of from user */
  var currentListDate = new Date(addDays(startDate, firstShop)); /*Add to DOM */
  var nextListDate = new Date (addDays(currentListDate,daysBetweenShops));
  var followingListDate = new Date(addDays(nextListDate,daysBetweenShops));

  $('.curList').text(currentListDate.toDateString());
  $('.nextList').text(nextListDate.toDateString());
  $('.folList').text(followingListDate.toDateString());


//Use this fnx with new Date(addDays) to get a new date object X days later)
function addDays (dateObj, daysToAdd) {
  dateInMilli = dateObj.valueOf();
  daysToAddInMilli = daysToAdd * 24 * 60  * 60 * 1000 /* hrs per day * mins per hr * secs per min * millisec per sec */;
  return dateInMilli + daysToAddInMilli;
}


  // console.log(currentListDate);
  // console.log(nextListDate);
  // console.log(followingListDate);

  //create Semantic Item Constructor:

function SemanticItem (semanticName, reorderFreq, upc) {
  this.semanticName = semanticName;
  this.reorderFreq = reorderFreq;
  this.upc = upc || 049000000443;
}

function chooseList (reorderFreq, name) {
  var now = new Date();
  reorderDate = new Date(addDays(now, reorderFreq));
  // console.log('Reorder Date: ' + reorderDate);
  var newTableRow = '<tr><td class="col-1"><button type="button" class="btn btn-primary btn-xs move-left"><-</td><td class="col-2">'+name+'</td><td class="col-3"><button type="button" class="btn btn-primary btn-xs move-right">-></td></tr>';
  var newTableRowCurList = '<tr><td class="col-1"><button type="button" class="btn btn-success btn-xs"><span class="glyphicon glyphicon-ok"></span></td><td class="col-2">'+name+'</td><td class="col-3"><button type="button" class="btn btn-primary btn-xs move-right">-></td></tr>';

    // console.log('Next List Date: ' + nextListDate);
    // console.log('Following List Date: ' + followingListDate);
  var localStorageData = [];
  //add a new condition later so if less than currListDate give optoin to create new list
  if (reorderDate < nextListDate){
    // console.log('reorder date is less than next List Date');
    localStorData = getLocalStorage('curList');
      // test.push(newSemItem);
      // console.log(test);
    localStorData.push(newSemItem);
    localStorage.setItem('curList', JSON.stringify(localStorData));
    $('.curList + table > tbody').append(newTableRowCurList);
  }
  else if ((reorderDate >= nextListDate) && (reorderDate < followingListDate)){
    localStorData = getLocalStorage('nextList');
        // console.log('reorder date is >= to next List Date and < following listDate');
    localStorData.push(newSemItem);
    localStorage.setItem('nextList', JSON.stringify(localStorData));
    $('.nextList + table > tbody').append(newTableRow);
  }
  else {
            // console.log('reorder date is > following listDate');
    localStorData = getLocalStorage('folList');
    localStorData.push(newSemItem);
    localStorage.setItem('folList', JSON.stringify(localStorData));
    $('.folList + table > tbody').append(newTableRow);
  }
}

function getLocalStorage (listKey) {
  // var localStorageArr = [];
  var currentStateOfLocalStorage = [];  
  if(!JSON.parse(localStorage.getItem(listKey))){
      // console.log(newSemItem);
      // currentStateOfLocalStorage.push(newSemItem);
      return currentStateOfLocalStorage;
    
  } else {
      currentStateOfLocalStorage = JSON.parse(localStorage.getItem(listKey));
      // currentStateOfLocalStorage.push(newSemItem);
      return currentStateOfLocalStorage;
  }

  // console.log(currentStateOfLocalStorage);
  // console.log(currentStateOfLocalStorage);
  // currentStateOfLocalStorage.push(newSemItem);
  // console.log(currentStateOfLocalStorage);   
}

function addDataFromLocalStorageToDom (list) {
  $('.'+list+' tr:not(:first-child)').empty();
  if(!localStorage.getItem(list)){
    return;
  }
  var allListItmes = JSON.parse(localStorage.getItem(list));
  // console.log(allListItmes);
  if(list === 'curList'){
    allListItmes.forEach(function(obj){
      $('.'+list+'+ table > tbody').append('<tr><td class="col-1"><button type="button" class="btn btn-success btn-xs"><span class="glyphicon glyphicon-ok"></span></td><td class="col-2">'+obj.semanticName+'</td><td class="col-3"><button type="button" class="btn btn-primary btn-xs move-right">-></td></tr>');  
    });
  }
  else {
    allListItmes.forEach(function(obj){
      $('.'+list+'+ table > tbody').append('<tr><td class="col-1"><button type="button" class="btn btn-primary btn-xs move-left"><-</td><td class="col-2">'+obj.semanticName+'</td><td class="col-3"><button type="button" class="btn btn-primary btn-xs move-right">-></td></tr>');  
    });
  }
}

// function removeRow(str) {
//   console.log(localStorageArr);
//   // return !localStorageArr.semanticName;
// }

function removeFromList (el, list, direction) {
  
    // console.log($(el).parent().parent());
  var domEl;
  if(direction === 'left'){
    domEl = $(el).closest('td').next('td').text();
  } else {domEl = $(el).closest('td').prev('td').text();}

    $(el).parent().parent().remove();
    var removeFromLocalStorage = getLocalStorage(list);
    // var domEl = $(el).closest('td').next('td').text();
    // console.log(domEl);
    // console.log(removeFromLocalStorage);
    var filteredArr = removeFromLocalStorage.filter(function(elem){
      // console.log(el.semanticName);
      // console.log(domEl);
      // console.log(el.semanticName == domEl);
      return elem.semanticName !== domEl;
    });
    // console.log(filteredArr);
    localStorage.setItem(list, JSON.stringify(filteredArr));
}

function moveToList (el, list, direction) {
  // body...
  var domEl;
  if(direction === 'left'){
    domEl = $(el).closest('td').next('td').text();
  } else {domEl = $(el).closest('td').prev('td').text();}

  $(el).parent().parent().remove();
  var removeFromLocalStorage = getLocalStorage(list);
  
  var removedArr = removeFromLocalStorage.filter(function(elem){
    return elem.semanticName === domEl;
  });
  return removedArr[0];
    // console.log(filteredArr);
    // localStorage.setItem(list, JSON.stringify(filteredArr));
}

function hasClass (el) {
  if($(el).parent().parent().parent().parent().prev().hasClass('curList')){
    return 'curList';
  }
  else if($(el).parent().parent().parent().parent().prev().hasClass('nextList')){
    return 'nextList';
  }
  return 'folList';
}

// var semanticName = '';

// function createNewSemItem () {
//     var semanticName = $('input[name="semanticName"]').val();
//     var reorderFreqVal = $('input[name="reorderFreqVal"]').val();
//     var reorderFreqMag = $('input[name="reorderFreqMag"]:checked').val();
//     var reorderFreq = reorderFreqVal * reorderFreqMag;   
//     var newSemItem = new SemanticItem(semanticName,reorderFreq);

//     // $('.panel').slideUp('slow');
// }

function moveRight (el) {
    var direction = 'right';
    var curEl = $(el).parent().parent().parent().parent();
    tableIndex = $('table').index(curEl);
    classIs = hasClass(el);
    addToList(tableIndex, el, direction);
    removeFromList(el, classIs);
}

function addToList (tableIndex, el, direction) {
  // direction should equal right or left
  var localStorData = [];
  var objToMove = {};

  if(tableIndex === 0){
    localStorData = getLocalStorage('nextList');
      // test.push(newSemItem);
      // console.log(test);
      // console.log(classIs);
    objToMove =   moveToList($(el),classIs, direction);
    localStorData.push(objToMove);
    localStorage.setItem('nextList', JSON.stringify(localStorData));
    $('.nextList + table > tbody').append('<tr><td class="col-1"><button type="button" class="btn btn-primary btn-xs move-left"><-</td><td class="col-2">'+objToMove.semanticName+'</td><td class="col-3"><button type="button" class="btn btn-primary btn-xs move-right">-></td></tr>');
  }
  else if(tableIndex === 1) {
    localStorData = getLocalStorage('folList');
      // test.push(newSemItem);
      // console.log(test);
      // console.log(classIs);
    objToMove =   moveToList($(el),classIs, direction);
    localStorData.push(objToMove);
    localStorage.setItem('folList', JSON.stringify(localStorData));
    $('.folList + table > tbody').append('<tr><td class="col-1"><button type="button" class="btn btn-primary btn-xs move-left"><-</td><td class="col-2">'+objToMove.semanticName+'</td><td class="col-3"><button type="button" class="btn btn-primary btn-xs move-right">-></td></tr>');
  }

}