var daysBetweenShops = 7; /* will be asked of from user */
var startDate = new Date();
var firstShop = 3; /* will be asked of from user */
var currentListDate = new Date(addDays(startDate, firstShop)); /*Add to DOM */
var nextListDate = new Date (addDays(currentListDate,daysBetweenShops));
var followingListDate = new Date(addDays(nextListDate,daysBetweenShops));

//Use this fnx with new Date(addDays) to get a new date object X days later)
function addDays (dateObj, daysToAdd) {
  dateInMilli = dateObj.valueOf();
  daysToAddInMilli = daysToAdd * 24 * 60  * 60 * 1000 /* hrs per day * mins per hr * secs per min * millisec per sec */;
  return dateInMilli + daysToAddInMilli;
}


console.log(currentListDate);
console.log(nextListDate);
console.log(followingListDate);



