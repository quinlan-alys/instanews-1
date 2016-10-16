"use strict";

//console.log('I\'m alive js');

$(document).ready(function() {
    //console.log('I\'m alive jquery');

    /*$('#sections').on('change', function (e) {
        //var optionSelected = $("option:selected", this);
        //var valueSelected = this.value;
        ////var textSelected = this.text;

        var optionSelected = $(this).find("option:selected");
        var valueSelected  = optionSelected.val();
        var textSelected   = optionSelected.text();
        console.log(optionSelected);
        console.log(valueSelected);
        console.log(textSelected);
    });*/

    var $loadingImage = $('.loadingImage');

    $loadingImage.hide();

    $("#sections-form").on("change", "select", function (e) {
        e.preventDefault();

        //var selectValue = $(e.target).val();
        //var selectText = $(e.target).find('option:selected').text(); //only time the find is required
        //var selectName = $(e.target).attr('name');

        //console.log(selectValue);
        //console.log(selectText);
        //console.log(selectName);

        var sectionName = $(e.target).val();
        var $newsItemsList = $(".newsItems");

        if (sectionName == "0") {
            //remove data on default value
            $newsItemsList.empty();
        } else {
            $loadingImage.show();

            //set up url to connect to nyt
            var url = "https://api.nytimes.com/svc/topstories/v2/" + sectionName + ".json";
            url += "?" + $.param({
                    "api-key": "e969eed331bd4fc8a6764edfb463db8b"
                });

            //begin ajax call
            $.ajax({
                url: url,
                method: "GET"
            }).done(function(result) {

                if (result.num_results === 0) {
                    //if no results
                    $newsItemsList.empty().append("<li>Sorry. No news items found.</li>");
                }  else {

                    var newsItemsList = result.results;
                    var newsItems = [];
                    var newsItem = {};

                    //extract news items from news listing json
                    $.each(newsItemsList, function (key) {
                        if (newsItemsList[key].multimedia.length !== 0) {
                            newsItem = {abstract: newsItemsList[key].abstract,
                                image: newsItemsList[key].multimedia[4].url,
                                url: newsItemsList[key].url,
                                urlTitle: newsItemsList[key].title};

                            newsItems.push(newsItem);
                        }
                    });

                    var newsItemsMarkup = '';

                    //get max 12 items from newsItems
                    for (var i = 0; i < 12; i++) {
                        //create span of abstract text
                        var newsAbstract = '<span class="newsItemTextFormatting">' + newsItems[i].abstract + '</span>';

                        //create news item div id number for adding image background
                        var newsItemID = "newsItem" + (i + 1);

                        //create news image div and add span of news abstract
                        var newsItemInnerMarkup = '<div class="newsImage" id="' + newsItemID + '">' + newsAbstract + '</div>';

                        //create a href to containing news url and child divs
                        var newsItemOuterMarkup = '<a href="' +
                            newsItems[i].url +
                            '" class="newsItem" target="_blank" title="' + newsItems[i].urlTitle + '">' +
                            newsItemInnerMarkup +
                            '</a>';

                        newsItemsMarkup += newsItemOuterMarkup;
                    }

                    //append block of markup to index.html
                    $newsItemsList.empty().append(newsItemsMarkup);

                    //change css for appended markup
                    for (var j = 0; j < 12; j++) {
                        var newsItemID2 = "#newsItem" + (j + 1).toString();

                        var newsImageURL = "url(" + newsItems[j].image + ")";

                        var $newsImage = $(newsItemID2).css("background-image", newsImageURL);

                        //console.log(newsImageURL);//

                        //console.log(newsItems[j].image);
                        //console.log($newsImage.css("background"));

                        //url("../images/product-categories/sale-category.jpg") no-repeat center center
                    }

                }
            }).fail(function(err) {
                throw err;

                //$newsItemsList.empty().append('<li>Sorry. No an error has occured.</li>');
            }).always(function() {
                $loadingImage.hide();
            });
        }
    });

});
