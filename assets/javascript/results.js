$("#submitAddress").on("click", function(event) {
      


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


    event.preventDefault();

      $(".senator1Pic").append("<img class='repImage' src='assets/images/CO.png'>");
      $(".senator1Name").append();
      $(".senator1Contact").append("<p> <a href='www.github.com' class='icons'> www.placeholder.com </a> </p>")
      $(".senator1Contact").append("<a href='#' class='icons'> <i class='fa fa-facebook-square' style='font-size:24px'></i></a>")
      $(".senator1Contact").append("<a href='#' class='icons'> <i class='fa fa-twitter' style='font-size:24px'></i><a href='#'>")
      $(".senator1Contact").append("<a href='#' class='icons'> <i class='fa fa-youtube' style='font-size:24px'></i><a href='#'>")
      $(".senator1Contact").append("<a href='#' class='icons'> <i class='fa fa-phone-square' style='font-size:24px'></i><a href='#'>")
      $(".senator1Party").append("<p> party </p>")
      $(".senator1Last3").append("<p> last3 </p>")
      $(".senator1Top5").append("<p> top5 </p>")


      $(".senator2Pic").append("<img class='repImage' src='assets/images/CO.png'>");
      $(".senator2Name").append();
      $(".senator2Contact").append("<p> <a href='www.github.com' class='icons'> www.placeholder.com </a> </p>")
      $(".senator2Contact").append("<a href='#' class='icons' ><i class='fa fa-facebook-square' style='font-size:24px'></i></a>")
      $(".senator2Contact").append("<a href='#' class='icons' ><i class='fa fa-twitter' style='font-size:24px'></i><a href='#'>")
      $(".senator2Contact").append("<a href='#' class='icons' ><i class='fa fa-youtube' style='font-size:24px'></i><a href='#'>")
      $(".senator2Contact").append("<a href='#' class='icons' ><i class='fa fa-phone-square' style='font-size:24px'></i><a href='#'>")
      $(".senator2Party").append("<p> party </p>")
      $(".senator2Last3").append("<p> last3 </p>")
      $(".senator2Top5").append("<p> top5 </p>")


      $(".repPic").append("<img class='mainepImage' src='assets/images/CO.png'>");
      $(".repName").append();
      $(".repContact").append("<p> <a href='www.github.com' class='icons'> www.placeholder.com </a> </p>")
      $(".repContact").append("<a href='#' class='icons' ><i class='fa fa-facebook-square' style='font-size:24px'></i></a>")
      $(".repContact").append("<a href='#' class='icons' ><i class='fa fa-twitter' style='font-size:24px'></i><a href='#'>")
      $(".repContact").append("<a href='#' class='icons' ><i class='fa fa-youtube' style='font-size:24px'></i><a href='#'>")
      $(".repContact").append("<a href='#' class='icons' ><i class='fa fa-phone-square' style='font-size:24px'></i><a href='#'>")
      $(".repParty").append("<p> party </p>")
      $(".repLast3").append("<p> last3 </p>")
      $(".repTop5").append("<p> top5 </p>")




    console.log("this event handler is working");
    console.log($("#name").val().trim());

});

