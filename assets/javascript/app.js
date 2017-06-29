
// Global variables
var myFirstSenator;
var mySecondSenator;
var myHouseRep;
var myGoogleResponse;
var myFirstOSResponse;
var repMap;
var canIdMap;
var myReps =[];

// Voter Global variables
var voterName = "";
var voterStreetNumber = "";
var voterStreetName = "";
var voterCity = "";
var voterState = "";
var voterZipCode = "";

//Firebase
var config = {
  apiKey: "AIzaSyCi-dzO9wATSlwXs5EJCzBMvKjGflTy850",
  authDomain: "voterapp-839b2.firebaseapp.com",
  databaseURL: "https://voterapp-839b2.firebaseio.com",
  projectId: "voterapp-839b2",
  storageBucket: "voterapp-839b2.appspot.com",
  messagingSenderId: "96769787339"
};
firebase.initializeApp(config);

var database = firebase.database();

var normalizeName = function(name) {
  return name.replace(/ [A-Z]\.? /, ' ')
}

$(document).ready(function() {
  // AJAX calls

  var getGeneralRepInfo = function(streetNum, streetName, city, state){
    var googleQueryURL = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDI1kvAcYil3IZ4Tkt2BiZ4NWUJHfOpYoo" +
      "&address="+ streetNum +"%20"+ streetName + "%20"+ city +"%20"+ state + "&roles=legislatorUpperBody&roles=legislatorLowerBody"

    $.ajax({
      url: "https://cors-anywhere.herokuapp.com/" + googleQueryURL,
      method: "GET"
    }).done(function(response) {
      myGoogleResponse=response;
      // Assigning rep responses to variables
      var senator1 = myGoogleResponse.officials[0];
      var senator2 = myGoogleResponse.officials[1];
      var houseRep = myGoogleResponse.officials[2];

      // Calling parseRepInfoFromGoogle() function for each representative and saving new objects in variables
      myFirstSenator = parseRepInfoFromGoogle(senator1);
      mySecondSenator = parseRepInfoFromGoogle(senator2);
      myHouseRep=parseRepInfoFromGoogle(houseRep);

      // Making list of reps
      var myReps = [myFirstSenator, mySecondSenator, myHouseRep];

      // AJAX call to get the candidate id of each rep, adds it as another property to each rep object
      var legQueryURL = "http://www.opensecrets.org/api/?method=getLegislators&id=" + state + "&output=json&apikey=a71e46d929b085eda4974bae83338ee6";
      $.ajax({
        url: legQueryURL,
        method: 'GET'
      }).done(function(res) {
        myFirstOSResponse= JSON.parse(res);
        repArray= myFirstOSResponse.response.legislator;
        repMap = repArray.map(function(rep) { return rep['@attributes'] });
        console.log(repMap);
        canIdMap = repMap.reduce(function(hash, rep) { hash[normalizeName(rep.firstlast)] = rep.cid; return hash }, {});
        for(var i = 0; i < myReps.length; i++) {
          var normName = normalizeName(myReps[i].name);
          if(canIdMap.hasOwnProperty(normName)) {
            myReps[i].cid = canIdMap[normName];
          }
        }
      });

    });
  };

  // Function to parse info from API response and create/return new Rep object
  // Only called INSIDE getGeneralRepInfo function
  var parseRepInfoFromGoogle=function(rep){
    var newRep = {
      name:rep.name,
      party:rep.party,
      imgSrc:rep.photoUrl,
      addrLine1:rep.address[0].line1,
      city: rep.address[0].city,
      state: rep.address[0].state,
      zip:rep.address[0].zip,
      fb: rep.channels[0].id,
      twitter:rep.channels[1].id,
      youTube:rep.channels[2].id,
      phone: rep.phones,
      website: rep.urls[0]
    };
    return newRep;
  };

  var getIndustryDonorsWithCanId=function(cid, rep){
    var industryDonorUrl = "http://www.opensecrets.org/api/?method=candIndustry&cid="+ cid +"&output=json&cycle=2016&apikey=a71e46d929b085eda4974bae83338ee6";

    $.ajax({
      url: industryDonorUrl,
      method: "GET"
    }).done(function(response) {
      industryDonorRes =  JSON.parse(response);
      var industry1 = industryDonorRes.response.industries.industry[0]["@attributes"].industry_name;
      var industry2 = industryDonorRes.response.industries.industry[1]["@attributes"].industry_name;
      var industry3 = industryDonorRes.response.industries.industry[1]["@attributes"].industry_name;
      var topIndustryDonors = [industry1, industry2, industry3];
      rep.topIndustryDonors = topIndustryDonors;
    });
  };

  var getDonorsWithCanId=function(cid, rep){
    var donorUrl ="http://www.opensecrets.org/api/?method=candContrib&cid=" +cid + "&output=json&cycle=2016&apikey=a71e46d929b085eda4974bae83338ee6";

    $.ajax({
      url: donorUrl,
      method: "GET"
    }).done(function(response) {
      donorRes =  JSON.parse(response);
      var donor1 =donorRes.response.contributors.contributor[0]["@attributes"].org_name;
      var donor2 =donorRes.response.contributors.contributor[1]["@attributes"].org_name;
      var donor3 =donorRes.response.contributors.contributor[2]["@attributes"].org_name;
      var topDonors = [donor1, donor2, donor3];
      rep.topDonors = topDonors;
    });
  };

  // Calling API function for an example
  getGeneralRepInfo("2631", "river dr", "denver", "co");
  //getIndustryDonorsWithCanId("N00006134");
  //getDonorsWithCanId("N00006134");

  $("#submitAddress").on("click", function(event) {


    event.preventDefault();


    $(".senator1Pic").append("<img src='assets/images/CO.png'>");
    $(".senator1Contact").html("<p> website </p>");
    $(".senator1Contact").append("<a href='#'class='fa fa-facebook'></a>");
    $(".senator1Contact").append("<p> twitter </p>");
    $(".senator1Contact").append("<p> youTube </p>");
    $(".senator1Contact").append("<p> phone </p>");
    $(".senator1Party").html("<p> party </p>");
    $(".senator1Last3").html("<p> last3 </p>");
    $(".senator1Top5").html("<p> top5 </p>");

    console.log("this event handler is working");
    console.log($("#name").val().trim());


    console.log('inside the onclick');
    voterName = $("#name").val().trim();
    if (!voterName) {
      alert('please enter your name');
      return
    }
    console.log(voterName);

    voterStreetNumber = $("#streetNumber").val().trim();
    if (!voterStreetNumber) {
      alert('please enter your street number');
      return
    }
    console.log(voterStreetNumber);

    voterStreetName = $("#streetName").val().trim();
    if (!voterStreetName) {
      alert('please enter your street name');
      return
    }
    console.log(voterStreetName);

    voterCity = $("#city").val().trim();
    if (!voterCity) {
      alert('please enter your city');
      return
    }
    console.log(voterCity);

    voterState = $("#state").val().trim();
    if (!voterState) {
      alert('please enter your state abbr');
      return
    }
    console.log(voterState);

    voterZipCode = $("#zipCode").val().trim();
    if (!zipCode) {
      alert('please enter your zip code');
      return
    }
    console.log(voterZipCode);

  });

  $("#clearAddress").on("click", function(event) {
    console.log('inside the clear onclick');
    event.preventDefault();
    document.getElementById("voterAddress").reset();

  });
});
