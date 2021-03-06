//general js

$(document).on("click", ".saveArticle", function () {
  var id = this.id;
  $(this).parents(".projCards").remove();
  $.get("/saveArticle/" + id).then(function (data) { });
});

$(document).on("click", ".deleteArticle", function () {
  var id = $(this).data().id;
  $(this).parent().parent().remove();
  $.get("/savedDelete/" + id).then(function (data) { });
});

$(document).on("click", "#searchButton", function () {
  var searchVar = $("#searchBar").val().trim();
  $.post("/startSearch", { search: searchVar });
  $("#searchBar").val("");
});

$(document).ready(function () {
  $("#searchBar").keypress(function (key) {
    if (key.keyCode == 13) {
      event.preventDefault();
      var searchVar = $("#searchBar").val().trim();
      $.post("/startSearch", { search: searchVar });
      $("#searchBar").val("");
      window.location.replace("/search");
    };
  });
});

//saved

$(document).on("click", ".comments", function () {
  $(".commentsDiv").empty();
  var id = $(this).data().id;
  $.get("/comments/" + id).then(function (data) {
    for (let i = 0; i < data.length; i++) {
      $(".commentsDiv").append("<div class='commentHolder'><span class='deleteComment' data-id=" + data[i]._id + ">&#10005;</span><h4>" + data[i].body + "</h4></div>");
    };
    $(".commentsDiv").append("<div class='inputDiv'><textarea class='form-control' name='commentInput' id='inputComment' aria-label='With textarea'></textarea></div></div>");
    $(".commentsDiv").append("<div class='commentButtons'><button class='btn btn-primary' data-id='" + id + "' id='saveComment'>Comment</button><button class='btn btn-danger' style='margin-left: 7px' id='closeComments'>Close</button></div>");
    $(".comDivHolder").css("display", "block");
  });
});

$(document).on("click", "#closeComments", function () {
  $(".commentsDiv").empty();
  $(".comDivHolder").css("display", "none");
});

$(document).on("click", "#saveComment", function () {
  var id = $(this).data().id;
  var comment = $("#inputComment").val().trim();
  $.post("/addComment/" + id, { body: comment });
  $(".commentsDiv").empty();
  $(".comDivHolder").css("display", "none");
});

$(document).on("click", ".deleteComment", function () {
  var id = $(this).data().id;
  $(this).parent().remove();
  $.get("/commentDelete/" + id).then(function (data) { });
});

//Denver News

$(document).on("click", "#denverScrape", function () {
  $.get("/denverScrape").then(function (data) {
    location.reload();
  });
});

$(document).on("click", "#denverEmpty", function () {
  $("#denverArticles").children().remove();
  $.get("/denverDelete").then(function (data) { });
});

//Gaming

$(document).on("click", "#gamingScrape", function () {
  $.get("/gamingScrape").then(function (data) {
    location.reload();
  });
});

$(document).on("click", "#gamingEmpty", function () {
  $("#gamingArticles").children().remove();
  $.get("/gamingDelete").then(function (data) { });
});

//KC News

$(document).on("click", "#kcScrape", function () {
  $.get("/kcScrape").then(function (data) {
    location.reload();
  });
});

$(document).on("click", "#kcEmpty", function () {
  $("#kcArticles").children().remove();
  $.get("/kcDelete").then(function (data) { });
});

//Seattle News

$(document).on("click", "#seattleScrape", function () {
  $.get("/seattleScrape").then(function (data) {
    location.reload();
  });
});

$(document).on("click", "#seattleEmpty", function () {
  $("#seattleArticles").children().remove();
  $.get("/seattleDelete").then(function (data) { });
});

//Sports

$(document).on("click", "#sportsScrape", function () {
  $.get("/sportsScrape").then(function (data) {
    location.reload();
  });
});

$(document).on("click", "#sportsEmpty", function () {
  $("#sportsArticles").children().remove();
  $.get("/sportsDelete").then(function (data) { });
});

//Tech News

$(document).on("click", "#techScrape", function () {
  $.get("/techScrape").then(function (data) {
    location.reload();
  });
});

$(document).on("click", "#techEmpty", function () {
  $("#techArticles").children().remove();
  $.get("/techDelete").then(function (data) { });
});

//US News

$(document).on("click", "#usScrape", function () {
  $.get("/usScrape").then(function (data) {
    location.reload();
  });
});

$(document).on("click", "#usEmpty", function () {
  $("#usArticles").children().remove();
  $.get("/usDelete").then(function (data) { });
});

//World News

$(document).on("click", "#worldScrape", function () {
  $.get("/worldScrape").then(function (data) {
    location.reload();
  });
});

$(document).on("click", "#worldEmpty", function () {
  $("#worldArticles").children().remove();
  $.get("/worldDelete").then(function (data) { });
});