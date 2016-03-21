var nameSearchDataGB, nameSearchDataGamesDB;
var keySearchDataGB, keySearchDataGamesDB;
var galleryAPI;
var INFODEF = ":info3:";
var PLOTDEF = ":plot4:";
var INSTALLDEF = ":install:";
var SCREENSDEF = ":screens4:";
var TRAILERDEF = ":trailer3:";

var nodeAddress = "http://127.0.0.1:3000";
        
$(document).ready(function() {
    galleryAPI = $("#gallery").unitegallery();
    
    $("#gameSearchForm").click(function(event) {
        event.preventDefault();
                                       
        if ($("#gameName").val() != "") {
            console.log($("#gameName").val());
            SearchGBGameByName($("#gameName").val());
            SearchGamesDBGameByName($("#gameName").val());
        }
    });
            
    $("#nameResultsGB").change(function(event) {
        event.preventDefault();
                
        //search giant bomb
        if ($(this).val() != "") {
            console.log("Searching GB: " + $(this).val());
            var gbidToSearch = nameSearchDataGB.results[$(this).prop("selectedIndex")].id;
            console.log("GiantBomb ID: " + gbidToSearch);
            SearchGBGameByID(gbidToSearch);
        }
    });
            
    $("#nameResultsGamesDB").change(function(event) {
        event.preventDefault();
                
        //search GamesDB
        if ($(this).val() != "") {
            console.log("Searching GamesDB: " + $(this).val());
            var idToSearch = nameSearchDataGamesDB.Game[$(this).prop("selectedIndex")].id[0];
            console.log("GamesDB ID: " + idToSearch);
            SearchGamesDBGameByID(idToSearch);
        }
    });
    
    galleryAPI.on("item_change", function(num, data) {
       //do stuff when the user selects a new gallery item 
    });
});
    
/*GiantBomb Section*/
function SearchGBGameByName(gameNameToSearch) {
    //lets request a game from the node.js server
    $.ajax({
        url: nodeAddress + "/searchGame/?game=" + gameNameToSearch,
        type: "get",
        dataType: "jsonp",
        success: function(data) {
            //store for later reference
            nameSearchDataGB = data;
            //clear the option list
            $("#nameResultsGB").empty();
            //re-add
            for (var x = 0; x < nameSearchDataGB.results.length; x++) {
                //console.log(nameSearchDataGB.results[x].name);
                $("#nameResultsGB").append("<option value=\"" + nameSearchDataGB.results[x].name + "\">" + nameSearchDataGB.results[x].name + "</option>");
            }

            $("#nameResultsGB").trigger("change");
        },
        error: function(xhr, status, error) {
            console.log(status + "; " + error);
        }
    });
}

function SearchGBGameByID(idToSearch) {
    //lets request a game's info from the node.js server
    $.ajax({
       url: nodeAddress + "/searchKey/?key=" + idToSearch,
        type: "get",
        dataType: "jsonp",
        success: function(data) {
            //console.log(keySearchData)
            //store
            keySearchDataGB = data.results;
            //set the title
            $("#gameTitleDesc").text(keySearchDataGB.name);
            //set the info area
            FormatInfo();
            //set the screens
            ShowScreensInGallery();
            FormatScreens();
        },
        error: function(xhr, status, error) {
            console.log("Error searching GiantBomb by key");
        }
    });
}

/*Games Database Section*/
function SearchGamesDBGameByName(gameNameToSearch) {
    //lets request a game from the node.js server
    $.ajax({
        url:  nodeAddress + "/searchGameGamesDB/?game=" + gameNameToSearch,
        type: "get",
        dataType: "jsonp",
        success: function(data) {
            //console.log(data.Data);
            //store for later reference
            nameSearchDataGamesDB = data.Data;
            //clear the option list
            $("#nameResultsGamesDB").empty();

            //re-add
            for (var x = 0; x < nameSearchDataGamesDB.Game.length; x++) {
                //console.log(nameSearchDataGamesDB.Game[x].GameTitle[0]);
                $("#nameResultsGamesDB").append("<option value=\"" + nameSearchDataGamesDB.Game[x].GameTitle[0] + "\">" + nameSearchDataGamesDB.Game[x].GameTitle[0] + "</option>");
            }

            $("#nameResultsGamesDB").trigger("change");
        },
        error: function(xhr, status, error) {
            console.log(status + "; " + error);
        }
    });
}

function SearchGamesDBGameByID(idToSearch) {
    //lets request a game's info from the node.js server
    $.ajax({
       url: nodeAddress + "/searhGamesDBByKey/?key=" + idToSearch,
        type: "get",
        dataType: "jsonp",
        success: function(data) {
            console.log(data);
            //store for later reference
            keySearchDataGamesDB = data.Data;
            //set the plot area
            FormatPlot();
            //set the trailers area
            FormatVideo();
        },
        error: function(xhr, status, error) {
            console.log("Error searching GamesDB by key");
        }
    });
}

/*Information Formatting*/
function FormatInfo() {
    console.log(keySearchDataGB);
    $("#infoDesc").text("");
    $("#infoDesc").append(INFODEF + "<br />" +
                        "Title: " + keySearchDataGB.name + "<br />" +
                        "Genre: " + DealWithGenres() + "<br />" +
                        "Developer: " + keySearchDataGB.developers[0].name + "<br />" +
                        "Publisher: " + keySearchDataGB.publishers[0].name + "<br />" + 
                        "Release Date: " + DealWithDate());
}

function DealWithGenres() {
    var genresString = "";
    for (var i = 0; i < keySearchDataGB.genres.length; i++) {
        genresString += keySearchDataGB.genres[i].name + ", ";
    }

    genresString = genresString.substring(0, genresString.length - 2);
    return genresString;
}

function DealWithDate() {
    var dateVar = new Date(keySearchDataGB.original_release_date);
    return (dateVar.getMonth() + 1) + "/" + dateVar.getDate() + "/" + dateVar.getFullYear();
}

function FormatPlot() {
    var plotString;
    if (keySearchDataGamesDB.Game[0].Overview) {
        plotString = keySearchDataGamesDB.Game[0].Overview[0];//.replace(/(<([^>]+)>)/ig,"");
    }

    $("#plotDesc").text("");
    $("#plotDesc").append(PLOTDEF + "<br />" + plotString);
}

function FormatInstall() {

}

function ShowScreensInGallery() {
    console.log("changing gallery imgs");
    $(".image1").attr("src", keySearchDataGB.images[0].super_url).attr("data-image", keySearchDataGB.images[0].super_url);
    $(".image2").attr("src", keySearchDataGB.images[1].super_url).attr("data-image", keySearchDataGB.images[1].super_url);
    console.log($(".image1"));
}

function FormatScreens() {
    $("#screensDesc").text("");
    $("#screensDesc").append(SCREENSDEF + "<br />" +
                            "[i][size=3][b](Click image to enlarge)[/b][/size][/i]");
    
    if (keySearchDataGB.images.length > 1) {
        $("#screensDesc").append("[img]" + keySearchDataGB.images[0].super_url + "[/img] <br />" +
                                 "[img]" + keySearchDataGB.images[1].super_url + "[/img]");
    } else {
        $("#screensDesc").append("[img]" + keySearchDataGB.images[0].medium_url + "[/img]");
    }
}

function FormatVideo() {
    if (keySearchDataGamesDB.Game[0].Youtube) {
        $("#trailerDesc").text("");
        $("#trailerDesc").append(TRAILERDEF + "<br />" +
                                "[youtube]" + keySearchDataGamesDB.Game[0].Youtube + "[/youtube]");
    }
}