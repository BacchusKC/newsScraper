db.scrapedData.find({}, function (error, found) {
    for (let i = 0; i < tempArray.length; i++) {
      for (let j = 0; j < tempArray.length; j++) {
        if (tempArray[i].title === tempArray[j].title) {
          tempArray.splice(j, 1);
        };
      };
    };
    for (let i = 0; i < found.length; i++) {
      for (let j = 0; j < tempArray.length; j++) {
        if (found.length > 0) {
          if (found[i].title === tempArray[j].title) {
            tempArray.splice(j, 1);
          };
        };
      };
    };
    for (let i = 0; i < tempArray.length; i++) {
      db.scrapedData.insert({
        "title": tempArray[i].title,
        "link": tempArray[i].link
      });
      console.log("Logged");
    };
  });