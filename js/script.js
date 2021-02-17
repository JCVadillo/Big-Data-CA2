/*This the server*/

require('./db/db-connection.js')
const express = require('express')
const router = require('./routes')

const app = express()

//Heroku's enviorment port or local port 3000
const port = process.env.PORT || 3000
app.use(express.static('public'));
app.use(express.json())
app.use(router)

app.listen(port);


//Variable to fill up wit json data
Beers = [];

//AJAX DB function calls
function getAllBeers(option){
// Depending which page you select, the beers you will see
  if(option == 1){
    urlString = 'https://api.punkapi.com/v2/beers?page=1&per_page=80'
  }
  if(option == 2){
    urlString = 'https://api.punkapi.com/v2/beers?page=2&per_page=80'
  }
  if(option == 3){
    urlString = 'https://api.punkapi.com/v2/beers?page=3&per_page=80'
  }
  if(option == 4){
    urlString = 'https://api.punkapi.com/v2/beers?page=4&per_page=80'
  }
  if(option == 5){
    urlString = 'https://api.punkapi.com/v2/beers?page=5&per_page=80'
  }
  $.ajax({
    url: urlString,
    headers: {
        'Content-Type':'application/json'
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){
      Beers = data
      populateTable(Beers)
    },
    error: function(error_msg) {
      console.log(error_msg);
      var err = (error_msg.responseText)
    }
  });
}

//Function to get a specific beer by its ID
function getBeerById(){
  id = $("#beerId").val()
$('#beerId').val('').removeAttr('checked').removeAttr('selected');
 $.ajax({
    url: 'https://api.punkapi.com/v2/beers/' + id,
    headers: {
        'Content-Type':'application/json'
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){
      displayBeerModalById(data[0]);
    },
    error: function(error_msg) {
      console.log(error_msg);
      var err = (error_msg.responseText)
    }
  });
}

//Function to get a random beer, the "Beer Picker"
function getRandomBeer(){
  $.ajax({
    url: 'https://api.punkapi.com/v2/beers/random ',
    headers: {
        'Content-Type':'application/json'
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){
      displayBeerModalById(data[0]);
    },
    error: function(error_msg) {
      console.log(error_msg);
      var err = (error_msg.responseText)
    }
  });
}


$(".cancel").click(function(){
  $('.is-active').removeClass('is-active')
})

//Nav buttons to trigger the if statement in getallBeers function
$("#page1").click(function(){
  getAllBeers(1);
})
$("#page2").click(function(){
  getAllBeers(2);
})
$("#page3").click(function(){
  getAllBeers(3);
})
$("#page4").click(function(){
  getAllBeers(4);
})
$("#page5").click(function(){
  getAllBeers(5);
})

//Button to trigger the request of the id provide by the user
$("#getBeerId").click(function(){
  getBeerById();
})

//Button to trigger the request of the "Beer Picker"
$("#getRandomBeer").click(function(){
  getRandomBeer()
})

//EventListener to trigger the request of the id prived by the user
// by pressing the enter key
$("#beerId").keypress(function(event){
  if(event.which == 13){
  getBeerById();
  }
})

//Function to populate the default presentantion
function populateTable(data){
  $("#table-body").empty()
  for (i in data){
    num = parseInt(i)+1
    html = '<tr onclick="displayBeerModal('+ i +')">'
    html += "<td>" + data[i].id + "</td>"
    html += "<td>" + data[i].name + "</td>"
    html += "<td>" + data[i].tagline  + "</td>"
    html += "<td>" + data[i].first_brewed + "</td>"
    html += "<td>" + data[i].description + "</td>"
    html += "</tr>"
    $("#table-body").append(html);

  }
}

//Modal to display a perticular Beer SELECTED FORM THE TABLE
function displayBeerModal(num){
  $(".modal-card-title").html(Beers[num].name + " Beer" )
  $("#displayBeerId").html(Beers[num].id)
  $("#displayBeerName").html(Beers[num].name)
  $("#displayBeerTagline").html(Beers[num].tagline)
  $("#displayFirstBrewed").html(Beers[num].first_brewed)
  $("#displayBeerDescription").html(Beers[num].description)
  $("#displayBeerABV").html(Beers[num].abv + "%")
    addFoodPairing(Beers[num].food_pairing);
  $("#displayBrewersTips").html(Beers[num].brewers_tips)
  $("#displayBeerModal").addClass("is-active");
}

//Modal to display a beer SELECTEC BY ID OR THE BEER PICKER
function displayBeerModalById(beer){
  $(".modal-card-title").html(beer.name + " Beer")
  $("#displayBeerId").html(beer.id)
  $("#displayBeerName").html(beer.name)
  $("#displayBeerTagline").html(beer.tagline)
  $("#displayFirstBrewed").html(beer.first_brewed)
  $("#displayBeerDescription").html(beer.description)
  $("#displayBeerABV").html(beer.abv + "%")
    addFoodPairing(beer.food_pairing);
  $("#displayBrewersTips").html(beer.brewers_tips)
  $("#displayBeerModal").addClass("is-active");
}

//Food paring array json handler
function addFoodPairing(food){
  html = '<ul>'
  for(i in food){
    html += '<li>' + food[i] + '</li>'
  }
  html += '</ul>'
  $("#displayBeerFoodPairing").html(html);
}

//main
getAllBeers(1);
