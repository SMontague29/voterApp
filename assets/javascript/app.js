
// Global variables
var myFirstSenator;
var mySecondSenator;
var myHouseRep;
var myGoogleResponse;
var myFirstOSResponse;
var repMap;
var canIdMap;
var myReps =[];

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

$(document).ready(function() {
  // AJAX calls

  var getGeneralRepInfo = function(streetNum, streetName, city, state){
    var googleQueryURL = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDI1kvAcYil3IZ4Tkt2BiZ4NWUJHfOpYoo" +
      "&address="+ streetNum +"%20"+ streetName + "%20"+ city +"%20"+ state + "&roles=legislatorUpperBody&roles=legislatorLowerBody"

    $.ajax({
      url: googleQueryURL,
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
        repMap = myFirstOSResponse.map(function(rep) { return rep['@attributes'] });
        canIdMap = repMap.reduce(function(hash, rep) { hash[rep.firstlast] = rep.cid; return hash }, {});
        for(var i = 0; i < myReps.length; i++) {
          if(canIdMap.hasOwnProperty(myReps[i].name)) {
            myReps[i].cid = canIdMap(myReps[i].name)
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
});
