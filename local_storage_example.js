// add scripts

$(document).on('ready', function() {
  // console.log('sanity check!');
  seedLocalStorage();
  addDataFromLocalStorageToDom();
  $('table').on('click', '#increment', function(){
    var button = this;
    // console.log(button);
    var itemName = $(button).attr('data-name');
    var newArray = [];
    var currentStateOfLocalStorage = JSON.parse(localStorage.getItem('items'));
    for(var i = 0; i < currentStateOfLocalStorage.length; i++){
      if(currentStateOfLocalStorage[i].name === itemName) {
        currentStateOfLocalStorage[i].quanity++;
      }
      newArray.push(currentStateOfLocalStorage[i]);
    }
    localStorage.setItem('items', JSON.stringify(newArray));
    addDataFromLocalStorageToDom();
  });

});

function seedLocalStorage() {
  var data = [
    {
      name: 't-shirt',
      amount: 20.89,
      quanity: 0
    },
    {
      name: 'pants',
      amount: 16.37,
      quanity: 0
    },
    {
      name: 'hat',
      amount: 12.99,
      quanity: 0
    }
  ];

  if(!JSON.parse(localStorage.getItem('items'))){
  // console.log(JSON.parse(localStorage.getItem('items')));
  localStorage.setItem('items', JSON.stringify(data));
  }
}

function addDataFromLocalStorageToDom() {
  $('#all-items').empty();
  var allItems = JSON.parse(localStorage.getItem('items'));
  allItems.forEach(function(obj){
    $('#all-items').append('<tr><td>'+obj.name+'</td><td>'+obj.amount+'</td><td>'+obj.quanity+'</td><td><button id="increment"  class="btn btn-sm btn-primary" data-name="'+obj.name+'">+</button></td></tr>');

  });

}