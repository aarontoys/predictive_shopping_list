// add scripts

$(document).on('ready', function() {

  $('.panel').hide();
  
  // console.log('sanity check!');
  // debugger 
  seedLocalStorage('curList');
  seedLocalStorage('nextList');
  seedLocalStorage('folList');   
  addDataFromLocalStorageToDom('curList');
  addDataFromLocalStorageToDom('nextList');
  addDataFromLocalStorageToDom('folList');
  addDataFromLocalStorageToDom('holdList');


  $('#newItem').on('submit', function(event){
    event.preventDefault();
    // createNewSemItem();
    // debugger
    var semanticName = $('input[name="semanticName"]').val();
    var reorderFreqVal = $('input[name="reorderFreqVal"]').val();
    var reorderFreqMag = $('input[name="reorderFreqMag"]:checked').val() || 1;
    var reorderFreq = reorderFreqVal * reorderFreqMag;   
    var newSemItem = new SemanticItem(semanticName,reorderFreq);
    var listDate = new Date($('input[name="listDate"]:checked').val());
    $('input[name="semanticName"]').val('');
    $('input[name="reorderFreqVal"]').val('');
    $('input[name="reorderFreqMag"]').attr('checked',false);

    $('.panel').slideUp('slow');
    $('#upc').val('');

    chooseList(listDate, newSemItem);
  });

  $('table').on('click', '.btn-success', function(event){
    event.preventDefault();
    classIs = hasClass($(this));
    // debugger
    removeFromList($(this), classIs);
    });

  $('table').on('click', '.move-right', function(event){
    event.preventDefault();
    // debugger
    moveRight($(this));
  });

  $('table').on('click', '.move-left', function(event){
    event.preventDefault();
    // debugger
    moveLeft($(this));
  });

});

var trCheck = '<tr><td class="col-1"><button type="button" class="btn btn-success btn-xs"><span class="glyphicon glyphicon-ok"></span></td><td class="col-2">';

var trRight = '<tr><td class="col-1"><button type="button" class="btn btn-primary btn-xs move-left"><-</td><td class="col-2">';

var trLeft = '</td><td class="col-3"><button type="button" class="btn btn-primary btn-xs move-right">-></td></tr>';

var url ='';

$("#getUPC").on('click', function getUPC () {
  // debugger
  
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
    // debugger
    $('.panel').slideDown();
    // console.log(data);

    //shouldn't need this in acutal API since it would return 1 product. Might have to account later for several variations of products, i.e. multiple results, being returned
    // debugger
    // var prodArr = data.result.products;
    // console.log(prodArr);
    var upc = $('#upc').val();
    var filteredProduct = data.result.products.filter(function(elem){
      return elem.upcs[0] === upc;
    });

    // console.log(filteredProduct);
    var brandName = filteredProduct[0].brandName;
    var title = filteredProduct[0].title;
    var imgURL = filteredProduct[0].imageUrl;
    // var upc = filteredProduct.upcs;
    // console.log(imgURL);

    $('#prodTitle').text(title);
    $('#prodBrand').text("Brand: " + brandName);
    $('#prodImg').attr("src",imgURL);

  });

    // console.log('Ajax Result: '+ajaxResult);
    // console.log('Ajax brandName: ' + ajaxResult.brandName);

     // console.log(filteredProduct);
    // var brandName = data.result.products[0].brandName;
    // var title = data.result.products[0].title;
    // var imgURL = data.result.products[0].imageUrl;
    // var upc = data.result.products[0].upcs[0];


});

//Logic
  // var itemList =[];
  // var newSemItem ={};

  var daysBetweenShops = 3; /* will be asked of from user */
  var startDate = new Date(2016, 1, 5);
  var firstShop = 3; /* will be asked of from user */
  var currentListDate = new Date(addDays(startDate, firstShop + 1)-1000); /*Add to DOM */
  var nextListDate = new Date (addDays(currentListDate,daysBetweenShops));
  var followingListDate = new Date(addDays(nextListDate,daysBetweenShops));
  var holdingListDate = new Date(addDays(followingListDate,daysBetweenShops));

  $('.curList').text(currentListDate.toDateString());
  $('.nextList').text(nextListDate.toDateString());
  $('.folList').text(followingListDate.toDateString());
  $('.holdList').text(holdingListDate.toDateString());

  $('input[type="radio"]').eq(0).next().html('&nbsp Current List: '+ currentListDate.toDateString());
  $('input[type="radio"]').eq(1).next().html('&nbsp Next List: '+ nextListDate.toDateString());
  $('input[type="radio"]').eq(2).next().html('&nbsp Following List: '+ followingListDate.toDateString());

  $('input[type="radio"]').eq(0).attr('value', currentListDate);
  $('input[type="radio"]').eq(1).attr('value', nextListDate);
  $('input[type="radio"]').eq(2).attr('value', followingListDate);


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

function chooseList (listDate, newSemItem) {
  var now = new Date();
  // reorderDate = new Date(addDays(now, reorderFreq));

  var localStorageData = [];
  //add a new condition later so if less than currListDate give optoin to create new list
  console.log(listDate.getTime());
  console.log(currentListDate.getTime());
  console.log(listDate === currentListDate);
  if (listDate.getTime() === currentListDate.getTime() || listDate.getTime() < nextListDate.getTime()){
    // console.log('reorder date is less than next List Date');
    localStorData = getLocalStorage('curList');
      // test.push(newSemItem);
      // console.log(test);
    localStorData.push(newSemItem);
    localStorage.setItem('curList', JSON.stringify(localStorData));
    $('.curList + table > tbody').append(trCheck+newSemItem.semanticName+trLeft);
    addToMultipleLists(listDate, newSemItem);
  }
  else if (listDate.getTime() === nextListDate.getTime() || listDate.getTime() < followingListDate.getTime()){
    localStorData = getLocalStorage('nextList');
        // console.log('reorder date is >= to next List Date and < following listDate');
    localStorData.push(newSemItem);
    localStorage.setItem('nextList', JSON.stringify(localStorData));
    $('.nextList + table > tbody').append(trRight+newSemItem.semanticName+trLeft);
    addToMultipleLists(listDate, newSemItem);
  }
  else if (listDate.getTime() === followingListDate.getTime() || listDate.getTime() < holdingListDate.getTime()) {
            // console.log('reorder date is > following listDate');
    localStorData = getLocalStorage('folList');
    localStorData.push(newSemItem);
    localStorage.setItem('folList', JSON.stringify(localStorData));
    $('.folList + table > tbody').append(trRight+newSemItem.semanticName+trLeft);
    addToMultipleLists(listDate, newSemItem);
  }
  else if(listDate.getTime() >= holdingListDate.getTime()) {
    localStorData = getLocalStorage('holdList');
    localStorData.push(newSemItem);
    localStorage.setItem('holdList', JSON.stringify(localStorData));
    $('.holdList + table > tbody').append(trRight+newSemItem.semanticName+trLeft);
  }
}

function addToMultipleLists (listDate, newSemItem) {
  // console.log(listDate);
  // console.log(newSemItem.reorderFreq);
  tempDate = new Date(addDays(listDate,newSemItem.reorderFreq));
  // console.log(tempDate);
  chooseList(tempDate, newSemItem);
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
      $('.'+list+'+ table > tbody').append(trCheck+obj.semanticName+trLeft);  
    });
  }
  else {
    allListItmes.forEach(function(obj){
      $('.'+list+'+ table > tbody').append(trRight+obj.semanticName+trLeft);  
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
  if(direction === 'right'){
    domEl = $(el).closest('td').prev('td').text();
  } else {domEl = $(el).closest('td').next('td').text();}

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
    removeFromList(el, classIs, direction);
}

function addToList (tableIndex, el, direction) {
  // direction should equal right or left
  var localStorData = [];
  var objToMove = {};
  if(direction === 'right'){
    if(tableIndex === 0){
      localStorData = getLocalStorage('nextList');
        // test.push(newSemItem);
        // console.log(test);
        // console.log(classIs);
      objToMove =   moveToList($(el),classIs, direction);
      localStorData.push(objToMove);
      localStorage.setItem('nextList', JSON.stringify(localStorData));
      $('.nextList + table > tbody').append(trRight+objToMove.semanticName+trLeft);
    }
    else if(tableIndex === 1) {
      localStorData = getLocalStorage('folList');
        // test.push(newSemItem);
        // console.log(test);
        // console.log(classIs);
      objToMove =   moveToList($(el),classIs, direction);
      localStorData.push(objToMove);
      localStorage.setItem('folList', JSON.stringify(localStorData));
      $('.folList + table > tbody').append(trRight+objToMove.semanticName+trLeft);
    }
  }
  else {
    if(tableIndex === 1) {
        localStorData = getLocalStorage('curList');
      // test.push(newSemItem);
      // console.log(test);
      // console.log(classIs);
    objToMove =   moveToList($(el),classIs, direction);
    localStorData.push(objToMove);
    localStorage.setItem('curList', JSON.stringify(localStorData));
    $('.curList + table > tbody').append(trCheck+objToMove.semanticName+trLeft);
  }
    else if(tableIndex === 2) {
    localStorData = getLocalStorage('nextList');
      // test.push(newSemItem);
      // console.log(test);
      // console.log(classIs);
    objToMove =   moveToList($(el),classIs, direction);
    localStorData.push(objToMove);
    localStorage.setItem('nextList', JSON.stringify(localStorData));
    $('.nextList + table > tbody').append(trRight+objToMove.semanticName+trLeft);
    }
  }
}


  function moveLeft (el) {
    var direction = 'left';
    var curEl = $(el).parent().parent().parent().parent();
    var tableIndex = $('table').index(curEl);
    classIs = hasClass(el);
    addToList(tableIndex, el, direction);
    removeFromList(el, classIs, direction);
  }

  function seedLocalStorage(list) {
    var data1 = [{"semanticName":"Milk","reorderFreq":1,"upc":49000000443},{"semanticName":"Bread","reorderFreq":1,"upc":49000000443},{"semanticName":"Cheese","reorderFreq":1,"upc":49000000443},{"semanticName":"Eggs","reorderFreq":1,"upc":49000000443}];
    var data3 = [{"semanticName":"Conditioner","reorderFreq":7,"upc":49000000443},{"semanticName":"Shampoo","reorderFreq":7,"upc":49000000443},{"semanticName":"Toilet Paper","reorderFreq":14,"upc":49000000443},{"semanticName":"Toothpaste","reorderFreq":14,"upc":49000000443}];
    var data2 = [{"semanticName":"Peanut Butter","reorderFreq":3,"upc":49000000443},{"semanticName":"Graham Cracker","reorderFreq":3,"upc":49000000443},{"semanticName":"Spaghetti","reorderFreq":3,"upc":49000000443},{"semanticName":"Napkins","reorderFreq":2,"upc":49000000443}];

    if(!JSON.parse(localStorage.getItem(list))){
    // console.log(JSON.parse(localStorage.getItem('items')));
    
      if (list === 'curList'){
        localStorage.setItem(list, JSON.stringify(data1));
      }
      else if (list === 'nextList'){
        localStorage.setItem(list, JSON.stringify(data2));
      }
      else {
        localStorage.setItem(list, JSON.stringify(data3));
      }
  }
}