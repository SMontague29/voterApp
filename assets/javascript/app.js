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
  if (isAllDataLoaded()) {
    // TODO: Do whatever you're going to do to render the data here.
  }
};

$(document).ready(function() {
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
      myReps[i].cid, myReps[i]
      // Assigning rep responses to variables
      var senator1 = myGoogleResponse.officials[0];
      var senator2 = myGoogleResponse.officials[1];
      var houseRep = myGoogleResponse.officials[2];

      // Calling parseRepInfoFromGoogle() function for each representative and saving new objects in variables
      myFirstSenator = parseRepInfoFromGoogle(senator1);
      mySecondSenator = parseRepInfoFromGoogle(senator2);
      myHouseRep = parseRepInfoFromGoogle(houseRep);

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


// display results container on click of submit button--this js snippet will go somewhere else later when scott has done a merge
$('#resultsContainer').css("display","block");
window.scrollBy(0, 2500);
$('#myModal').css("display","none");

    $(".senator1Pic").append("<img class='repImage' src='assets/images/CO.png'>");
    $(".senator1Contact").append("<p> <a href='www.github.com' class='icons'> www.placeholder.com </a> </p>")
    $(".senator1Contact").append("<a href='#' class='icons'> <i class='fa fa-facebook-square' style='font-size:50px'></i></a>")
    $(".senator1Contact").append("<a href='#' class='icons'> <i class='fa fa-twitter' style='font-size:50px'></i><a href='#'>")
    $(".senator1Contact").append("<a href='#' class='icons'> <i class='fa fa-youtube' style='font-size:50px'></i><a href='#'>")
    $(".senator1Contact").append("<a href='#' class='icons'> <i class='fa fa-phone-square' style='font-size:50px'></i><a href='#'>")
    $(".senator1Party").append("<p> party </p>")
    $(".senator1Last3").append("<p> last3 </p>")
    $(".senator1Top5").append("<p> top5 </p>")


    $(".senator2Pic").append("<img class='repImage' src='assets/images/CO.png'>");
    $(".senator2Contact").append("<p> <a href='www.github.com' class='icons'> www.placeholder.com </a> </p>")
    $(".senator2Contact").append("<a href='#' class='icons' ><i class='fa fa-facebook-square' style='font-size:50px'></i></a>")
    $(".senator2Contact").append("<a href='#' class='icons' ><i class='fa fa-twitter' style='font-size:50px'></i><a href='#'>")
    $(".senator2Contact").append("<a href='#' class='icons' ><i class='fa fa-youtube' style='font-size:50px'></i><a href='#'>")
    $(".senator2Contact").append("<a href='#' class='icons' ><i class='fa fa-phone-square' style='font-size:50px'></i><a href='#'>")
    $(".senator2Party").append("<p> party </p>")
    $(".senator2Last3").append("<p> last3 </p>")
    $(".senator2Top5").append("<p> top5 </p>")


    $(".repPic").append("<img class='repImage' src='assets/images/CO.png'>");
    $(".repContact").append("<p> <a href='www.github.com' class='icons'> www.placeholder.com </a> </p>")
    $(".repContact").append("<a href='#' class='icons' ><i class='fa fa-facebook-square' style='font-size:50px'></i></a>")
    $(".repContact").append("<a href='#' class='icons' ><i class='fa fa-twitter' style='font-size:50px'></i><a href='#'>")
    $(".repContact").append("<a href='#' class='icons' ><i class='fa fa-youtube' style='font-size:50px'></i><a href='#'>")
    $(".repContact").append("<a href='#' class='icons' ><i class='fa fa-phone-square' style='font-size:50px'></i><a href='#'>")
    $(".repParty").append("<p> party </p>")
    $(".repLast3").append("<p> last3 </p>")
    $(".repTop5").append("<p> top5 </p>")

  }); //end submit address on click

  $("#clearAddress").on("click", function(event) {
    console.log('inside the clear onclick');
    event.preventDefault();
    document.getElementById("voterAddress").reset();

  }); //end reset form on click

});





