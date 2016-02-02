// add scripts

$(document).on('ready', function() {

  $('.panel').hide();

  // console.log('sanity check!');
  addDataFromLocalStorageToDome();
  $('#newItem').on('submit', function(event){
    event.preventDefault();
    semanticName = $('input[name="semanticName"]').val();
    reorderFreqVal = $('input[name="reorderFreqVal"]').val();
    reorderFreqMag = $('input[name="reorderFreqMag"]:checked').val();
    reorderFreq = reorderFreqVal * reorderFreqMag;
    // console.log(semanticName);
    // console.log(reorderFreqVal);
    // console.log(reorderFreqMag);
    console.log(reorderFreq);
    var newSemItem = new SemanticItem(semanticName,reorderFreq);
    itemList.push(newSemItem);
    console.log(itemList);
    $('.panel').slideUp('slow');

    chooseList(reorderFreq, semanticName);

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
    var itemList =[];

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
  now = new Date();
  reorderDate = new Date(addDays(now, reorderFreq));
  console.log('Reorder Date: ' + reorderDate);
  var newTableRow = '<tr><td class="col-1"><button type="button" class="btn btn-success btn-xs"><span class="glyphicon glyphicon-ok"></span></td><td class="col-2">'+name+'</td><td class="col-3"><button type="button" class="btn btn-primary btn-xs">-></td></tr>';

  // console.log('Next List Date: ' + nextListDate);
  // console.log('Following List Date: ' + followingListDate);

  //add a new condition later so if less than currListDate give optoin to create new list
  if (reorderDate < nextListDate){
    // console.log('reorder date is less than next List Date');
      var test = getLocalStorage('curList');
      // test.push(newSemItem);
      console.log(test);
        localStorage.setItem('curList', JSON.stringify(itemList));
    $('.curList + table > tbody').append(newTableRow);
  }
  else if ((reorderDate >= nextListDate) && (reorderDate < followingListDate)){
        // console.log('reorder date is >= to next List Date and < following listDate');
            localStorage.setItem('nextList', JSON.stringify(itemList));
    $('.nextList + table > tbody').append(newTableRow);
  }
  else {
            // console.log('reorder date is > following listDate');
                localStorage.setItem('folList', JSON.stringify(itemList));
    $('.folList + table > tbody').append(newTableRow);
  }
}

function getLocalStorage (listKey) {
  // var localStorageArr = [];
  var currentStateOfLocalStorage = [];  
  if(!JSON.parse(localStorage.getItem(listKey))){
     return currentStateOfLocalStorage;   
  } else {
      currentStateOfLocalStorage = JSON.parse(localStorage.getItem(listKey));
      return currentStateOfLocalStorage;
  }

  // console.log(currentStateOfLocalStorage);
  // console.log(newSemItem);
  // currentStateOfLocalStorage.push(newSemItem);
  // console.log(currentStateOfLocalStorage);   
}

function addDataFromLocalStorageToDome () {
  $('.curList + table > tbody').empty();
  // $('.nextList + table > tbody').empty();
  // $('.folList + table > tbody').empty();
  var allListItmes = JSON.parse(localStorage.getItem('curList'));
  allListItmes.forEach(function(obj){
    $('.curList + table > tbody').append(newTableRow);  
  });
}

