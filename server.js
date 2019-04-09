var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();
var exphbs = require("express-handlebars");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

//general

app.get("/savedArticles", function (req, res) {
  db.Article.find({ saved: true })
    .then(function (data) {
      res.render("savedArticles", { savedData: data });
    });
});

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/saveArticle/:id", function (req, res) {
  var id = req.params.id;
  db.Article.findOneAndUpdate({ _id: id }, { saved: true })
    .then(function () { })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/savedDelete/:id", function (req, res) {
  var id = req.params.id;
  db.Article.deleteOne({ _id: id })
    .then(function () { })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/comments/:id", function (req, res) {
  var id = req.params.id;
  db.Comment.find({ article: id })
    .then(function (data) {
      res.json(data);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/addComment/:id", function (req, res) {
  var id = req.params.id;
  var comment = {};
  comment.body = req.body.body;
  comment.article = id;
  db.Comment.create(comment)
    .then(function (data) { });
});

app.get("/commentDelete/:id", function (req, res) {
  var id = req.params.id;
  db.Comment.deleteOne({ _id: id })
    .then(function () { })
    .catch(function (err) {
      res.json(err);
    });
})

//Gaming

app.get("/gaming", function (req, res) {
  db.Article.find({ category: "gaming", saved: false })
    .then(function (data) {
      res.render("gaming", { gamingArts: data });
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/gamingScrape", function (req, res) {
  axios.get("https://www.n4g.com").then(function (response) {
    var $ = cheerio.load(response.data);
    var tempArray = [];
    $(".f-items .f-item").each(function (i, element) {
      var result = {};
      if ($(element).find("h2").text().length > 62) {
        result.title = $(element).find("h2").text().slice(0, 60) + " ...";
      } else {
        result.title = $(element).find("h2").text()
      }
      result.link = "https://www.n4g.com"+$(element).find("a").attr("href");
      var temp = $(element).find(".si-img").attr("style");
      if (temp !== undefined) {
        var temp2 = temp.split("(")[1];
        var temp3 = temp2.split(")")[0];
        result.image = temp3;
      }
      else {
        result.image = "http://www.userlogos.org/files/logos/letspretend/n4g.png"
      }
      result.category = "gaming";
      tempArray.push(result);
    });
    for (let i = 0; i < tempArray.length; i++) {
      db.Article.create(tempArray[i])
        .then(function (dbArticle) {
        })
        .catch(function (err) {
          console.log(err);
        });
    };
    db.Article.find({ category: "gaming", saved: false })
      .then(function (data) {
        res.render("gaming", { gamingArts: data });
      })
      .catch(function (err) {
        res.json(err);
      });
  });
});

app.get("/gamingDelete", function (req, res) {
  db.Article.deleteMany({ category: "gaming", saved: false })
    .then(function (data) { })
    .catch(function (err) {
      res.json(err);
    });
});

//KC News

app.get("/kc", function (req, res) {
  db.Article.find({ category: "kc", saved: false })
    .then(function (data) {
      res.render("kc", { kcArts: data });
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/kcScrape", function (req, res) {
  axios.get("https://www.kansascity.com").then(function (response) {
    var $ = cheerio.load(response.data);
    var tempArray = [];
    $(".main-stage article").each(function (i, element) {
      var result = {};
      if ($(element).find("h3").children().text().length > 62) {
        result.title = $(element).find("h3").children().text().slice(0, 60) + " ...";
      } else {
        result.title = $(element).find("h3").children().text()
      }
      result.link = "https:"+$(element).find("a").attr("href");
      result.image = $(element).find("img").attr("src");
      result.category = "kc";
      tempArray.push(result);
    });
    for (let i = 0; i < tempArray.length; i++) {
      db.Article.create(tempArray[i])
        .then(function (dbArticle) {
        })
        .catch(function (err) {
          console.log(err);
        });
    };
    db.Article.find({ category: "kc", saved: false })
      .then(function (data) {
        res.render("kc", { kc: data });
      })
      .catch(function (err) {
        res.json(err);
      });
  });
});

app.get("/kcDelete", function (req, res) {
  db.Article.deleteMany({ category: "kc", saved: false })
    .then(function (data) { })
    .catch(function (err) {
      res.json(err);
    });
});

//Sports

app.get("/sports", function (req, res) {
  db.Article.find({ category: "sports", saved: false })
    .then(function (data) {
      res.render("sports", { sportsArts: data });
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/sportsScrape", function (req, res) {
  axios.get("https://www.espn.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    var tempArray = [];
    $(".headlineStack__list li").each(function (i, element) {
      var result = {};
      if ($(element).children().text().length > 66) {
        result.title = $(element).children().text().slice(0, 66) + " ...";
      } else {
        result.title = $(element).children().text()
      }
      result.link = "https://www.espn.com" + $(element).find("a").attr("href");
      result.image = "https://s.yimg.com/ny/api/res/1.2/H0KfThyLaCGPmp5t33fDJA--~A/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9NTU5O2g9NDIw/http://media.zenfs.com/en-us/homerun/deadline.com/85df3de72a53041a0c4faafeaab9d0f8";
      result.category = "sports";
      tempArray.push(result);
    });
    for (let i = 0; i < tempArray.length; i++) {
      for (let j = 0; j < tempArray.length; j++) {
        if (tempArray[i].link === tempArray[j].link) {
          tempArray.splice(j, 1);
        };
      };
    };
    axios.get("https://www.bleacherreport.com/").then(function (response) {
      var $ = cheerio.load(response.data);
      $(".featuredArticles ol li").each(function (i, element) {
        var result = {};
        if ($(element).find("h3").text().length > 66) {
          result.title = $(element).find("h3").text().slice(0, 66) + " ...";
        } else {
          result.title = $(element).find("h3").text()
        }
        result.link = $(element).find("a").attr("href");
        result.image = $(element).find("img").attr("src");
        result.category = "sports";
        tempArray.push(result);
      });
      function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        };
      };
      shuffleArray(tempArray);
      for (let i = 0; i < tempArray.length; i++) {
        db.Article.create(tempArray[i])
          .then(function (dbArticle) {
          })
          .catch(function (err) {
            console.log(err);
          });
      };
      db.Article.find({ category: "sports", saved: false })
        .then(function (data) {
          res.render("sports", { sportsArts: data });
        })
        .catch(function (err) {
          res.json(err);
        });
    });
  });
});


app.get("/sportsDelete", function (req, res) {
  db.Article.deleteMany({ category: "sports", saved: false })
    .then(function (data) { })
    .catch(function (err) {
      res.json(err);
    });
});

//Tech News

app.get("/tech", function (req, res) {
  db.Article.find({ category: "tech", saved: false })
    .then(function (data) {
      res.render("tech", { techArts: data });
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/techScrape", function (req, res) {
  axios.get("https://www.theverge.com/tech").then(function (response) {
    var $ = cheerio.load(response.data);
    var tempArray = [];
    $(".c-compact-river .c-compact-river__entry").each(function (i, element) {
      var result = {};
      if ($(element).find("h2").children().text().length > 62) {
        result.title = $(element).find("h2").children().text().slice(0, 60) + " ...";
      } else {
        result.title = $(element).find("h2").children().text()
      }
      result.link = $(element).find("a").attr("href");
      result.image = "https://assets.fontsinuse.com/static/use-media-items/16/15689/full-1000x924/56702b75/The_Verge_logo.png?resolution=0";
      result.category = "tech";
      tempArray.push(result);
    });
    for (let i = 0; i < tempArray.length; i++) {
      db.Article.create(tempArray[i])
        .then(function (dbArticle) {
        })
        .catch(function (err) {
          console.log(err);
        });
    };
    db.Article.find({ category: "tech", saved: false })
      .then(function (data) {
        res.render("tech", { techArts: data });
      })
      .catch(function (err) {
        res.json(err);
      });
  });
});

app.get("/techDelete", function (req, res) {
  db.Article.deleteMany({ category: "tech", saved: false })
    .then(function (data) { })
    .catch(function (err) {
      res.json(err);
    });
});

//US News

app.get("/us", function (req, res) {
  db.Article.find({ category: "us", saved: false })
    .then(function (data) {
      res.render("us", { usArts: data });
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/usScrape", function (req, res) {
  axios.get("https://www.usatoday.com/news").then(function (response) {
    var $ = cheerio.load(response.data);
    var tempArray = [];
    $(".headline-page li").each(function (i, element) {
      var result = {};
      if ($(element).find("p").text().length > 62) {
        result.title = $(element).find("p").text().slice(0, 60) + " ...";
      } else {
        result.title = $(element).find("p").text()
      }
      result.link = "https://www.usatoday.com" + $(element).find("a").attr("href");
      result.image = $(element).find("img").attr("src");
      result.category = "us";
      tempArray.push(result);
    });
    for (let i = 0; i < tempArray.length; i++) {
      db.Article.create(tempArray[i])
        .then(function (dbArticle) {
        })
        .catch(function (err) {
          console.log(err);
        });
    };
    db.Article.find({ category: "us", saved: false })
      .then(function (data) {
        res.render("us", { usArts: data });
      })
      .catch(function (err) {
        res.json(err);
      });
  });
});

app.get("/usDelete", function (req, res) {
  db.Article.deleteMany({ category: "us", saved: false })
    .then(function (data) { })
    .catch(function (err) {
      res.json(err);
    });
});

//World News

app.get("/world", function (req, res) {
  db.Article.find({ category: "world", saved: false })
    .then(function (data) {
      res.render("world", { worldArts: data });
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/worldScrape", function (req, res) {
  axios.get("https://www.reuters.com/news/archive/worldNews").then(function (response) {
    var $ = cheerio.load(response.data);
    var tempArray = [];
    $(".news-headline-list article").each(function (i, element) {
      var result = {};
      if ($(element).find("h3").text().length > 66) {
        result.title = $(element).find("h3").text().slice(0, 66) + " ...";
      } else {
        result.title = $(element).find("h3").text()
      }
      result.link = "https://www.reuters.com" + $(element).find("a").attr("href");
      result.image = $(element).find("img").attr("org-src");
      result.category = "world";
      tempArray.push(result);
    });
    for (let i = 0; i < tempArray.length; i++) {
      db.Article.create(tempArray[i])
        .then(function (dbArticle) {
        })
        .catch(function (err) {
          console.log(err);
        });
    };
    db.Article.find({ category: "world", saved: false })
      .then(function (data) {
        res.render("world", { worldArts: data });
      })
      .catch(function (err) {
        res.json(err);
      });
  });
});

app.get("/worldDelete", function (req, res) {
  db.Article.deleteMany({ category: "world", saved: false })
    .then(function (data) { })
    .catch(function (err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
