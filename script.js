var myName = localStorage.getItem("Name");
var fullName = localStorage.getItem("Full Name");
var password = localStorage.getItem("Password");

var profileInfo = {
  username: null,
  fullName: null,
  initial:null,
  followerCount: null,
  followingCount:null,
}

// var myName = prompt("Enter Your Name");
var myNames;
var currentChatName;

if(myName != null) {
  document.getElementById("hole-Main-Search-Page").style.display = "none"
  document.getElementById("hole-Main-Search-Page").style.display = "none"
  document.getElementById("hole-Main-Search-Page").style.display = "none"
  const TextBox = document.getElementById("search-Bar");

  var allInfo = {
      Suburb: null,
      City: null
  }

  var names = [];

  var Chats = {}

  var allFriends = {}
  var followingCount = 0;
  var followerCount = 0;
  var following = []

  var finalName = myName.charAt(0).toUpperCase() + myName.slice(1)

  const firebaseConfig = {
      apiKey: "AIzaSyBgwJxe3OvwQZwCxVKIZv_hzSEqZyhfO54",
      authDomain: "textit-ca.firebaseapp.com",
      projectId: "textit-ca",
      storageBucket: "textit-ca.appspot.com",
      messagingSenderId: "999498965874",
      appId: "1:999498965874:web:3dbb2d2301185a2b8fb3eb",
      measurementId: "G-8775JKQZX1"
  };

  firebase.initializeApp(firebaseConfig);

  if(profileInfo.followingCount == null || profileInfo.fullName == null || profileInfo.username == null || profileInfo.followerCount == null) {
    firebase.database().ref("People/" + myName).on("value", function (snapshot) {
      profileInfo.username = snapshot.val().Name;
      profileInfo.fullName = snapshot.val().Fullname;
      profileInfo.followerCount = snapshot.val().Followers;
      profileInfo.followingCount = snapshot.val().Following;
    })
  } else {
    
  }

  function getInfo() {
    setTimeout(function() {
      profileInfo.initial = profileInfo.fullName.charAt(0).toUpperCase()
      document.getElementById("inital").textContent = profileInfo.initial
      document.getElementById("username").textContent = profileInfo.username
      document.getElementById("full-Name").textContent = profileInfo.fullName
      document.getElementById("follower-Count").textContent = profileInfo.followerCount
      document.getElementById("following-Count").textContent = profileInfo.followingCount
    },1000)
  }

  firebase.database().ref("People").once('value', function(snapshot) {
    snapshot.forEach(
      function(ChildSnapshot) {
        var username = ChildSnapshot.val().Name;
        if(username != myName) {
          var finalUsername = username.toLowerCase()
          names.push(finalUsername)
        } else {

        }
      }
    )
  });
  
  setTimeout(function() {
    console.log(names)
  }, 200)

  function createUser(center) {
    firebase.database().ref().child("People").orderByChild("Name").equalTo(finalName).on("value", function(snapshot) {
      if (snapshot.exists()) {
        console.log("User Created")
        firebase.database().ref("People/" + myName + "/FollowingThese").on("value", function (snapshot) {
          following = snapshot.val();
          if(following != null) {
            profileInfo.followingCount = snapshot.val().length;
          } else {

          }
          console.log(following)
        });
      } else {
        firebase.database().ref("People/"+ myName).set({
            "Name": myName,
            "Fullname": fullName,
            "Password": password,
            "Coordinates": center, 
            "City": allInfo.City,
            "Suburb": allInfo.Suburb,
            "Friends": allFriends,
            "Following": followingCount,
            "Followers": followerCount,
            "Chats": Chats,
            "FollowingThese": following
        });
      }
    });
  }

  var chatFolderName = myName + " " + "Messages/"

  var currentChatName = null;

  mapboxgl.accessToken = "pk.eyJ1IjoiYmVubnlib3kyMSIsImEiOiJja3I5cXNzZXoycXM1Mm5yemo2cHcxNWh6In0.fjDBXnp-JRlOPXTPRWxHPw";

  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true,
  });

  function successLocation(position) {
    console.log(position);
    successfulLookup([position.coords.longitude, position.coords.latitude])
  }

  function errorLocation() {
    errorMapSetUp([-75.7188982, 45.4055218]);
  }

  function successfulLookup(center) {
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${center[1]}+${center[0]}&key=207dd37d22b8482dbc8c536573596a6c&pretty=1&no_annotations=1`)
      .then(response => response.json())
      .then(result => {
          let allDetails = result.results[0].components;
          let {city, suburb} = allDetails;
          allInfo.Suburb = suburb;
          allInfo.City = city;
      })
      setTimeout(function(){
          setupMap(center)
          createUser(center)
      }, 1000)
  }

  function setupMap(center) {
      var map1 = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/navigation-night-v1",
          center: center,
          zoom: 13,
          maxZoom: 18,
          minZoom: 10
      });

      map1.dragRotate.disable();
      map1.touchZoomRotate.disableRotation();

      map1.on("load", function () {
          map1.loadImage(
            "White Place Marker.png",
            function (error, image) {
              if (error) throw error;
              map1.addImage("placemarker", image);
              map1.addSource("point", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates: [center[0], center[1]],
                      },
                      "properties": {
                          "name": "You",
                          properties: {

                          },
                          "marker-symbol": "placemarker"
                      }
                    },
                  ],
                },
              });
              map1.addLayer({
                id: "points",
                type: "symbol",
                source: "point",
                layout: {
                  "icon-image": "placemarker",
                  "icon-offset": [0, -10],
                  "icon-size": 0.5,
                  "icon-rotate": 0,
                  "text-field": "{name}",
                  "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                  "text-anchor": "top",
                  "text-offset": [0, 0.9],
                },
              });
            }
          );
        });
    // Styles:
    // mapbox://styles/mapbox/streets-v11
    // mapbox://styles/mapbox/outdoors-v11
    // mapbox://styles/mapbox/light-v10
    // mapbox://styles/mapbox/dark-v10
    // mapbox://styles/mapbox/satellite-v9
    // mapbox://styles/mapbox/satellite-streets-v11
    // mapbox://styles/mapbox/navigation-day-v1
    // mapbox://styles/mapbox/navigation-night-v1
  }

  function findUser(center, name) {
      var map2 = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/navigation-night-v1",
          center: center,
          zoom: 15,
          maxZoom: 18,
          minZoom: 13
      });

      map2.dragRotate.disable();
      map2.touchZoomRotate.disableRotation();

      var html = "";

      if(name == myName) {
          name = "You"
          document.getElementById("profiles").innerHTML = " "
      } else {
          document.getElementById("profiles").innerHTML = " "
          firebase.database().ref("People/" + name).on("value", function (snapshot) {
              html += "<div id='profile-Container'>";
              html += '<div id="profile-Name">';
              html += snapshot.val().Name;
              html += "</div>";
              html += '<button id="profile-Follow-Button">';
              html += "Follow"
              html += "</button>";
              html += '<div id="profile-City-Suburb">';
              html += snapshot.val().City + ", " + snapshot.val().Suburb;
              html += "</div>";
              html += "</div>";
          });
          document.getElementById("profiles").innerHTML += html;
      }

      document.getElementById("profile-Chat-Button").addEventListener("click", function() {
          // console.log("Chat With " + name)
          currentChatName = name;
          document.getElementById("private-Chat").style.animation = "showPrivateChat .6s forwards"
          document.getElementById("hole-Main-Search-Page").style.animation = "hideMainSearchPage .6s forwards"
          document.getElementById("private-Chat-Name").innerHTML = name
      })

      map2.on("load", function () {
          map2.loadImage(
            "White Place Marker.png",
            function (error, image) {
              if (error) throw error;
              map2.addImage("placemarker", image);
              map2.addSource("point", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates: [center[0], center[1]],
                      },
                      "properties": {
                          "name": name,
                          "marker-symbol": "placemarker"
                      }
                    },
                  ],
                },
              });
              map2.addLayer({
                id: "points",
                type: "symbol",
                source: "point",
                layout: {
                  "icon-image": "placemarker",
                  "icon-offset": [0, -10],
                  "icon-size": 0.5,
                  "icon-rotate": 0,
                  "text-field": "{name}",
                  "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                  "text-offset": [0, 0.9],
                  "text-anchor": "top",
                },
              });
            }
          );
        });
  }

  function errorMapSetUp(center) {
      var map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/navigation-night-v1",
          center: center,
          zoom: 5,
          maxZoom: 15
      });

      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
  }

  document.getElementById("search-Bar").addEventListener("keyup", function() {
    var textBoxString = document.getElementById("search-Bar").value;

    var finalName = textBoxString.toLowerCase()
    // console.log(names[0])

    if(textBoxString != "") {
      console.log(textBoxString)

      myNames = names.filter(name => name.includes(finalName));

      var html3 = "";
      
      // Output new array
      if(myNames.length != 0) {
        for(var i = 0; i < myNames.length; i++) {
          var currentMyName = myNames[i].charAt(0).toUpperCase() + myNames[i].slice(1);
          document.getElementById("profiles").innerHTML = " "
          
          firebase.database().ref("People/" + currentMyName).on("value", function (snapshot) {
            if(following == null) {
              html3 += "<div id='profile-Container'>";
              html3 += '<div id="profile-Name">';
              html3 += snapshot.val().Name;
              html3 += "</div>";
              html3 += '<button id="profile-Follow-Button" class="'+currentMyName+'" onclick="getUsersName('+i+');">';
              html3 += "Follow";
              html3 += "</button>";
              html3 += '<div id="profile-City-Suburb">';
              html3 += snapshot.val().City + ", " + snapshot.val().Suburb;
              html3 += "</div>";
              html3 += "</div>";
            } else {
              if (following.indexOf(currentMyName) > -1) {
                  html3 += "<div id='profile-Container'>";
                  html3 += '<div id="profile-Name">';
                  html3 += snapshot.val().Name;
                  html3 += "</div>";
                  html3 += '<button id="profile-Follow-Button" class="'+currentMyName+' following" onclick="getUsersName('+i+');">';
                  html3 += "Following";
                  html3 += "</button>";
                  html3 += '<div id="profile-City-Suburb">';
                  html3 += snapshot.val().City + ", " + snapshot.val().Suburb;
                  html3 += "</div>";
                  html3 += "</div>";
              } else {
                  html3 += "<div id='profile-Container'>";
                  html3 += '<div id="profile-Name">';
                  html3 += snapshot.val().Name;
                  html3 += "</div>";
                  html3 += '<button id="profile-Follow-Button" class="'+currentMyName+'" onclick="getUsersName('+i+');">';
                  html3 += "Follow";
                  html3 += "</button>";
                  html3 += '<div id="profile-City-Suburb">';
                  html3 += snapshot.val().City + ", " + snapshot.val().Suburb;
                  html3 += "</div>";
                  html3 += "</div>";
              }
            }
          });
          document.getElementById("profiles").innerHTML += html3;
          document.getElementById("error-No-User").style.display = "none"
          console.log(currentMyName)
        }
      } else {
        document.getElementById("profiles").innerHTML = " "
        document.getElementById("error-No-User").style.display = "flex"
      }
    } else {
      document.getElementById("profiles").innerHTML = " "
    }
  })

  function getUsersName(index) {
    var getThisUsersName = names[index].charAt(0).toUpperCase() + names[index].slice(1).toLowerCase();

    var button = document.querySelector("." + getThisUsersName)
    var buttonClassValue = button.classList.value;
    if(following == null) {
      button.classList.add("following")
      button.textContent = "Following"
      following = [getThisUsersName]
    } else {
      if (buttonClassValue == getThisUsersName) {
        button.classList.add("following")
        button.textContent = "Following"
        following.push(getThisUsersName)
      } else {
        button.classList.remove("following")
        button.textContent = "Follow"
        following = following.filter(e => e !== getThisUsersName);
      }
    }
    var newFollowingCount = profileInfo.followingCount += 1;
    console.log(newFollowingCount)
    firebase.database().ref("People/"+ myName).set({
      "FollowingThese":following,
      "Following": newFollowingCount
    });
    
    profileInfo.followingCount = newFollowingCount
  }

  document.getElementById("close-Private-Chat").addEventListener("click", function() {
    document.getElementById("hole-Main-Search-Page").style.animation = "showMainSearchPage .6s forwards"
    document.getElementById("private-Chat").style.animation = "closePrivateChat .6s forwards"
    const messageTextBox = document.getElementById("message-Text-Box").value = " "
    document.getElementById("messages").innerHTML = " ";
  })

  function getUserSearched() {
      var SearchedName = TextBox.value
      var fiexedSearchedName = SearchedName.charAt(0).toUpperCase() + SearchedName.slice(1).toLowerCase()
      // TextBox.value = "";

      firebase.database().ref().child("People").orderByChild("Name").equalTo(fiexedSearchedName).on("value", function(snapshot) {
          if (snapshot.exists()) {
              document.getElementById("error-No-User").style.display = "none"
              firebase.database().ref("People/" + fiexedSearchedName).on("value", function (snapshot) {
              findUser([snapshot.val().Coordinates[0], snapshot.val().Coordinates[1]], snapshot.val().Name);
              });
          } else  {
              document.getElementById("error-No-User").style.display = "flex"
              document.getElementById("profiles").innerHTML = " ";
          }
      });

      return false;
  }

  setInterval(function() {
      if(TextBox.value == "") {
          document.getElementById("error-No-User").style.display = "none"
          document.getElementById("profiles").innerHTML = " ";
      } else {

      }
  }, 100)

  var currentChatId = null;

  function sendChatMessage() {
      var messageTextBox = document.getElementById("message-Text-Box").value
      console.log(messageTextBox)
      var chatID = "James";
      console.log(currentChatName)
      // var d = new Date();

      // var h = (d.getHours()<10?'0':'') + d.getHours();
      // var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
      // var timeStamp = h+":"+m;

      firebase.database().ref(chatFolderName + chatID).push().set({
          "sender": myName,
          "message": messageTextBox
      });

      var sendChatMessageToReciver = currentChatName + " " + "Messages/"
      firebase.database().ref(sendChatMessageToReciver + myName).push().set({
          "sender": myName,
          "message": messageTextBox
      });
      //  + "/unseen"
      //  + "/seen"
      // const chatbox = document.getElementById("chatbox")
      // chatbox.scrollTo({ top: 9999999999999, behavior: 'auto' });
      messageTextBox = ""
      return false;
  }




document.getElementById("search-Page-Icon-Container").addEventListener("click", function() {
  document.getElementById("hole-Profile-Page").style.display = "none"
  document.getElementById("hole-Main-Search-Page").style.display = "flex"
  document.getElementById("hole-Chat-Page").style.display = "none"
  document.getElementById("selector-Circle").style.animation = "select-Search .5s forwards"
  document.getElementById("selector-Circle").style.left = "33px"
})

document.getElementById("chat-Page-Icon-Container").addEventListener("click", function() {
  document.getElementById("hole-Profile-Page").style.display = "none"
  document.getElementById("hole-Main-Search-Page").style.display = "none"
  document.getElementById("hole-Chat-Page").style.display = "flex"
  document.getElementById("selector-Circle").style.left = "133px"
  document.getElementById("chats-Holder").innerHTML += "";
  var html6 = ""
  

  // html6 += "<div id='chat-Hole-Container'>";
  // html6 += '<div id="chat-Name">';
  // html6 += snapshot.val().Name;
  // html6 += "</div>";
  // html6 += '<button id="profile-Chat-Button" onclick="findUsersName('+i+');">';
  // html6 += "Message";
  // html6 += "</button>";
  // html6 += '<div id="profile-City-Suburb">';
  // html6 += snapshot.val().City + ", " + snapshot.val().Suburb;
  // html6 += "</div>";
  // html6 += "</div>";


  document.getElementById("no-Chats").style.display = "none"
  document.getElementById("no-Chats-Info").style.display = "none"
  document.getElementById("chats-Holder").innerHTML += html6;
})

function findUsersName(index) {
  var getThisUsersName = myNames[index].charAt(0).toUpperCase() + myNames[index].slice(1).toLowerCase();
  firebase.database().ref(chatFolderName + "/" + getThisUsersName).on("child_added", function (snapshot) {
    var html1 = ""  
    if (snapshot.val().sender == myName) {
        html1 += "<div id='messages-Chat-Message'>";
        html1 += '<div id="messsage-Chat-Message-InnerHTML">';
        html1 += snapshot.val().message;
        // html += "<div id='time-Stamp'>";
        // html += snapshot.val().timeStamp
        // html += "</div>"
        html1 += "</div>";
        html1 += "</div>";
    } else {
        html1 += "<div id='other-Messages-Chat-Message'>";
        html1 += '<div id="other-Messsage-Chat-Message-InnerHTML">';
        html1 += snapshot.val().sender + ": " + snapshot.val().message;
        // html += "<div id='other-time-Stamp'>";
        // html += snapshot.val().timeStamp;
        // html += "</div>";
        html1 += "</div>";
        html1 += "</div>";
    }
    document.getElementById("messages").innerHTML += html1;
  })
}

document.getElementById("profile-Page-Icon-Container").addEventListener("click", function() {
  document.getElementById("hole-Profile-Page").style.display = "flex"
  document.getElementById("hole-Main-Search-Page").style.display = "none"
  document.getElementById("hole-Chat-Page").style.display = "none"
  document.getElementById("selector-Circle").style.left = "232.5px"
})

document.getElementById("hole-Main-Search-Page").style.display = "none"
document.getElementById("hole-Chat-Page").style.display = "none"




















  
  // pk.eyJ1IjoiYmVubnlib3kyMSIsImEiOiJja3I5cXNzZXoycXM1Mm5yemo2cHcxNWh6In0.fjDBXnp-JRlOPXTPRWxHPw
} else {
  window.location = "SignUp.html";
}
































// function getUsersName(index) {
//   names[index]
//   var getThisUsersChat = myNames[index].charAt(0).toUpperCase() + myNames[index].slice(1).toLowerCase();
//   document.getElementById("hole-Main-Search-Page").style.animation = "hideMainSearchPage .6s forwards"
//   document.getElementById("private-Chat").style.animation = "showPrivateChat .6s forwards"
//   document.getElementById("private-Chat-Name").innerHTML = getThisUsersChat
//   currentChatName = getThisUsersChat
//   sendNewChatMessage();
//   console.log("Reload Number")
// }

// function sendNewChatMessage() {
//   firebase.database().ref(chatFolderName + "/" + currentChatName).on("child_added", function (snapshot) {
//     var html1 = ""  
//     if (snapshot.val().sender == myName) {
//         html1 += "<div id='messages-Chat-Message'>";
//         html1 += '<div id="messsage-Chat-Message-InnerHTML">';
//         html1 += snapshot.val().message;
//         // html += "<div id='time-Stamp'>";
//         // html += snapshot.val().timeStamp
//         // html += "</div>"
//         html1 += "</div>";
//         html1 += "</div>";
//     } else {
//         html1 += "<div id='other-Messages-Chat-Message'>";
//         html1 += '<div id="other-Messsage-Chat-Message-InnerHTML">';
//         html1 += snapshot.val().sender + ": " + snapshot.val().message;
//         // html += "<div id='other-time-Stamp'>";
//         // html += snapshot.val().timeStamp;
//         // html += "</div>";
//         html1 += "</div>";
//         html1 += "</div>";
//     }
//     document.getElementById("messages").innerHTML += html1;
//   })
// }