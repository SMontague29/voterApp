// Global variables
var myFirstSenator;
var mySecondSenator;
var myHouseRep;
var myGoogleResponse;
var myFirstOSResponse;
var repMap;
var canIdMap;
var myReps = [];

// Voter Global variables
var voterName = "";
var voterStreetNumber = "";
var voterStreetName = "";
var voterCity = "";
var voterState = "";
var voterZipCode = "";


/////////////////////////////////////////// Devon's Stuff ////////////////////////////////////////////////////////////////////

// Function to make the rep name from the Google API match the rep name in the Open Secret API
var normalizeName = function(name) {
  return name.replace(/ [A-Z]\.? /, ' ')
};

// Function that makes sure both asynch API calls after the initial one are finished returning data
var isAllDataLoadedForRep = function(rep) {
  return typeof(rep) === 'object' && rep.hasOwnProperty('topDonors') && rep.hasOwnProperty('topIndustryDonors')
};

// Function that makes sure all reps have all of their properties from all API calls
var isAllDataLoaded = function() {
  return [myFirstSenator, mySecondSenator, myHouseRep]
    .map(isAllDataLoadedForRep)
    .reduce(function(x, y) {
      return x && y
    });
};

// This is where all of the rendering of the info from the API call needs to happen. It won't try to render until all the AJAX calls are complete
var onAjaxLoadComplete = function() {
  if (isAllDataLoaded())
  {

    $(".senator1Name").append("<p class='name'>" + myFirstSenator.name + "</p>");
    $(".senator1Pic").append("<img class='repImage' src='" + myFirstSenator.imgSrc + "'>");
    $(".senator1Contact").append("<p> <a href='" + myFirstSenator.website + "' class='icons'> Access their Website </a> </p>")
    $(".senator1Contact").append("<a href='https://www.facebook.com/" + myFirstSenator.fb + "' class='icons'> <i class='fa fa-facebook-square' style='font-size:50px'></i></a>")
    $(".senator1Contact").append("<a href='https://www.twitter.com/" + myFirstSenator.twitter + "' class='icons'> <i class='fa fa-twitter' style='font-size:50px'></i><a href='#'>")
    $(".senator1Contact").append("<a href='https://www.youtube.com/" + myFirstSenator.youTube + "' class='icons' ><i class='fa fa-youtube' style='font-size:50px'></i><a href='#'>")
    $(".senator1Party").prepend("<p> P: </p>" + myFirstSenator.phone)
    $(".senator1Party").append("<p> Party <br> <li>" + myFirstSenator.party + " </p>")
    $(".senator1Last3").append("<p> Top Campaign Contributors <br> <li>" + myFirstSenator.topDonors + " </p>")
    $(".senator1Top5").append("<p> Industries Donating <br> <li>" + myFirstSenator.topIndustryDonors + "</p>")

    $(".senator2Name").append("<p class='name'>" + mySecondSenator.name + "</p>");
    $(".senator2Pic").append("<img class='repImage' src='" + mySecondSenator.imgSrc + "'>");
    $(".senator2Contact").append("<p> <a href='" + mySecondSenator.website + "' class='icons'> Access their Website </a> </p>")
    $(".senator2Contact").append("<a href='https://www.facebook.com/" + mySecondSenator.fb + "' class='icons' ><i class='fa fa-facebook-square' style='font-size:50px'></i></a>")
    $(".senator2Contact").append("<a href='https://www.twitter.com/" + mySecondSenator.twitter + "' class='icons'> <i class='fa fa-twitter' style='font-size:50px'></i><a href='#'>")
    $(".senator2Contact").append("<a href='https://www.youtube.com/" + mySecondSenator.youTube + "' class='icons' ><i class='fa fa-youtube' style='font-size:50px'></i><a href='#'>")
    $(".senator2Party").prepend("<p> P: </p>" + mySecondSenator.phone)
    $(".senator2Party").append("<p> Party <br> <li>" + mySecondSenator.party + " </p>")
    $(".senator2Last3").append("<p> Top Campaign Contributors <br> <li>" + mySecondSenator.topDonors + " </p>")
    $(".senator2Top5").append("<p> Industries Donating <br> <li>" + mySecondSenator.topIndustryDonors + "</p>")

    $(".repName").append("<p class='name'>" + myHouseRep.name + "</p>");
    $(".repPic").append("<img class='repImage' src='" + myHouseRep.imgSrc + "'>");
    $(".repContact").append("<p> <a href='" + myHouseRep.website + "' class='icons'> Access their Website </a> </p>")
    $(".repContact").append("<a href='https://www.facebook.com/" + myHouseRep.fb + "' class='icons' ><i class='fa fa-facebook-square' style='font-size:50px'></i></a>")
    $(".repContact").append("<a href='https://www.twitter.com/" + myHouseRep.twitter + "' class='icons'> <i class='fa fa-twitter' style='font-size:50px'></i><a href='#'>")
    $(".repContact").append("<a href='https://www.youtube.com/" + myHouseRep.youTube + "' class='icons' ><i class='fa fa-youtube' style='font-size:50px'></i><a href='#'>")
    $(".repParty").prepend("<p> P: </p>" + myHouseRep.phone)
    $(".repParty").append("<p> Party <br> <li>" + myHouseRep.party + " </p>")
    $(".repLast3").append("<p> Top Campaign Contributors <br> <li>" + myHouseRep.topDonors + " </p>")
    $(".repTop5").append("<p> Industries Donating <br> <li>" + myHouseRep.topIndustryDonors + "</p>")

  }
  ;
};

//Checks for Local Storage object and populates values for our API calls if it exists
var localStorageCheck = function() {

  if (localStorage.name != null) {
    voterName = localStorage.getItem("Name");
    voterStreetNumber = localStorage.getItem("Street Number");
    voterStreetName = localStorage.getItem("Street Name");
    voterCity = localStorage.getItem("City");
    voterState = localStorage.getItem("State");
    voterZipCode = localStorage.getItem("Zip");
  }
};

//If there is a Local Storage object, this function fills the form with the stored data
var formFill = function() {
  if (localStorage["Name"]) {
    $("#name").val(localStorage["Name"]);
  }
  if (localStorage["Street Number"]) {
    $("#streetNumber").val(localStorage["Street Number"]);
  }
  if (localStorage["Street Name"]) {
    $("#streetName").val(localStorage["Street Name"]);
  }
  if (localStorage["City"]) {
    $("#city").val(localStorage["City"]);
  }
  if (localStorage["State"]) {
    $("#state").val(localStorage["State"]);
  }
  if (localStorage["Zip"]) {
    $("#zipCode").val(localStorage["Zip"]);
  }
};

$(document).ready(function() {

  localStorageCheck();
  formFill();
  // AJAX calls

  // Function that makes an API call to Google, then an API to Open Secret to get the candidate ID needed for future API calls
  // Call this function after validating the submit stuff, pass in street number, name, city, zip

  var getGeneralRepInfo = function(streetNum, streetName, city, state) {
    var googleQueryURL = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDI1kvAcYil3IZ4Tkt2BiZ4NWUJHfOpYoo" +
      "&address=" + streetNum + "%20" + streetName + "%20" + city + "%20" + state + "&roles=legislatorUpperBody&roles=legislatorLowerBody"

    $.ajax({
      url: "https://cors-anywhere.herokuapp.com/" + googleQueryURL,
      method: "GET"
    }).done(function(response) {
      myGoogleResponse = response;
      // Assigning rep responses to variables
      var senator1 = myGoogleResponse.officials[0];
      var senator2 = myGoogleResponse.officials[1];
      var houseRep = myGoogleResponse.officials[2];

      // Calling parseRepInfoFromGoogle() function for each representative and saving new objects in variables
      myFirstSenator = parseRepInfoFromGoogle(senator1);
      mySecondSenator = parseRepInfoFromGoogle(senator2);
      myHouseRep = parseRepInfoFromGoogle(houseRep);

      console.log(myFirstSenator);
      console.log(mySecondSenator);
      console.log(myHouseRep);


      // Making list of reps
      var myReps = [myFirstSenator, mySecondSenator, myHouseRep];

      // AJAX call to get the candidate id of each rep, adds it as another property to each rep object
      var legQueryURL = "http://www.opensecrets.org/api/?method=getLegislators&id=" + state + "&output=json&apikey=a71e46d929b085eda4974bae83338ee6";
      $.ajax({
        url: legQueryURL,
        method: 'GET'
      }).done(function(res) {
        myFirstOSResponse = JSON.parse(res);
        repArray = myFirstOSResponse.response.legislator;
        repMap = repArray.map(function(rep) {
          return rep['@attributes']
        });
        // Had to convert names to same format to be able to do a match, got the results to just a map of rep name: cid, set cids as properties
        canIdMap = repMap.reduce(function(hash, rep) {
          hash[normalizeName(rep.firstlast)] = rep.cid;
          return hash
        }, {});
        for (var i = 0; i < myReps.length; i++) {
          var normName = normalizeName(myReps[i].name);
          if (canIdMap.hasOwnProperty(normName)) {
            myReps[i].cid = canIdMap[normName];
          }
        }
        // Calling the other two API functions and adding the results as properties
        for (var i = 0; i < myReps.length; i++) {
          getIndustryDonorsWithCanId(myReps[i].cid, myReps[i]);
          getDonorsWithCanId(myReps[i].cid, myReps[i]);
        }

      });

    });
  };

  // Function to parse info from API response and create/return new Rep object
  // Only called INSIDE getGeneralRepInfo function
  var parseRepInfoFromGoogle = function(rep) {
    var newRep = {
      name: rep.name,
      party: rep.party,
      imgSrc: rep.photoUrl,
      addrLine1: rep.address[0].line1,
      city: rep.address[0].city,
      state: rep.address[0].state,
      zip: rep.address[0].zip,
      fb: rep.channels[0].id,
      twitter: rep.channels[1].id,
      youTube: rep.channels[2].id,
      phone: rep.phones,
      website: rep.urls[0]
    };
    return newRep;
  };

  // Passes in a representative their candidate id so that the industry donor API call can be made and the values added as new properties
  var getIndustryDonorsWithCanId = function(cid, rep) {
    var industryDonorUrl = "http://www.opensecrets.org/api/?method=candIndustry&cid=" + cid + "&output=json&cycle=2016&apikey=a71e46d929b085eda4974bae83338ee6";

    $.ajax({
      url: industryDonorUrl,
      method: "GET"
    }).done(function(response) {
      industryDonorRes = JSON.parse(response);
      var industry1 = industryDonorRes.response.industries.industry[0]["@attributes"].industry_name;
      var industry2 = industryDonorRes.response.industries.industry[1]["@attributes"].industry_name;
      var industry3 = industryDonorRes.response.industries.industry[1]["@attributes"].industry_name;
      var topIndustryDonors = [industry1, industry2, industry3];
      rep.topIndustryDonors = topIndustryDonors;
      onAjaxLoadComplete();
    });
  };

  // Passes in a representative their candidate id so that the regular donor API call can be made and the values added as new properties
  var getDonorsWithCanId = function(cid, rep) {
    var donorUrl = "http://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&output=json&cycle=2016&apikey=a71e46d929b085eda4974bae83338ee6";

    $.ajax({
      url: donorUrl,
      method: "GET"
    }).done(function(response) {
      donorRes = JSON.parse(response);
      var donor1 = donorRes.response.contributors.contributor[0]["@attributes"].org_name;
      var donor2 = donorRes.response.contributors.contributor[1]["@attributes"].org_name;
      var donor3 = donorRes.response.contributors.contributor[2]["@attributes"].org_name;
      var topDonors = [donor1, donor2, donor3];
      rep.topDonors = topDonors;
      onAjaxLoadComplete();
    });
  };

  /////////////////////////////////////////// Devon's Stuff  ///////////////////////////////////////////////////////////////////////

  $("#submitAddress").on("click", function(event) {

    $.validate({
      form: '#voterAddress',
      onSuccess: function($form) {
        console.log("Form is valid!");

        voterName = $("#name").val().trim();
        console.log(voterName);

        voterStreetNumber = $("#streetNumber").val().trim();
        console.log(voterStreetNumber);

        voterStreetName = $("#streetName").val().trim();
        console.log(voterStreetName);

        voterCity = $("#city").val().trim();
        console.log(voterCity);

        voterState = $("#state").val().trim();
        console.log(voterState);

        voterZipCode = $("#zipCode").val().trim();
        console.log(voterZipCode);

      }
    });// end validate function
    event.preventDefault();

    voterName = $("#name").val().trim();
    voterStreetNumber = $("#streetNumber").val().trim();
    voterStreetName = $("#streetName").val().trim();
    voterCity = $("#city").val().trim();
    voterState = $("#state").val().trim();
    voterZipCode = $("#zipCode").val().trim();

// display results container on click of submit button--this js snippet will go somewhere else later when scott has done a merge
    $('#resultsContainer').css("display", "block");
    window.scrollBy(0, 2500);
    $('#myModal').css("display", "none");

    getGeneralRepInfo(voterStreetNumber, voterStreetName, voterCity, voterState);

    $(".senator1Name").empty();
    $(".senator1Pic").empty();
    $(".senator1Contact").empty();
    $(".senator1Contact").empty();
    $(".senator1Contact").empty();
    $(".senator1Contact").empty();
    $(".senator1Contact").empty();
    $(".senator1Party").empty();
    $(".senator1Last3").empty();
    $(".senator1Top5").empty();
    $(".senator2Name").empty();
    $(".senator2Pic").empty();
    $(".senator2Contact").empty();
    $(".senator2Contact").empty();
    $(".senator2Contact").empty();
    $(".senator2Contact").empty();
    $(".senator2Contact").empty();
    $(".senator2Party").empty();
    $(".senator2Last3").empty();
    $(".senator2Top5").empty();
    $(".repName").empty();
    $(".repPic").empty();
    $(".repContact").empty();
    $(".repContact").empty();
    $(".repContact").empty();
    $(".repContact").empty();
    $(".repContact").empty();
    $(".repParty").empty();
    $(".repLast3").empty();
    $(".repTop5").empty();

    localStorage.setItem("Name", voterName);
    localStorage.setItem("Street Number", voterStreetNumber);
    localStorage.setItem("Street Name", voterStreetName);
    localStorage.setItem("City", voterCity);
    localStorage.setItem("State", voterState);
    localStorage.setItem("Zip", voterZipCode);


  }); //end submit address on click

  $("#clearAddress").on("click", function(event) {
    console.log('inside the clear onclick');
    event.preventDefault();
    document.getElementById("voterAddress").reset();
  }); //end reset form on click

});





