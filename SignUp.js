var viewPassword = false;

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

function seePassword() {
    if(viewPassword == false) {
        document.getElementById("password-Textbox").type = "text"
        document.getElementById("password-Icon").setAttribute("src", "view password icon.png")
        viewPassword = true
    } else {
        document.getElementById("password-Textbox").type = "password"
        document.getElementById("password-Icon").setAttribute("src", "hide password icon.png")
        viewPassword = false
    }
    return false
}

function signUp() {
    var username = document.getElementById("username-Textbox").value;
    var password = document.getElementById("password-Textbox").value;
    var fullName = document.getElementById("full-Name-Textbox").value;

    if(username != "" && password != "" && fullName != "") {
        var finalName = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

        setTimeout(function() {
            firebase.database().ref().child("People").orderByChild("Name").equalTo(finalName).on("value", function(snapshot) {
                if (snapshot.exists()) {
                    document.getElementById('error1').style.display = "flex";
                    document.getElementById('error').style.display = "none";
                    if(screen.width < 499) {
                        document.getElementById("already-Have-Account").style.top = "340px"
                    } else {
                        document.getElementById("already-Have-Account").style.top = "310px"
                    }
                } else {
                    localStorage.setItem("Name", finalName);
                    localStorage.setItem("Full Name", fullName);
                    localStorage.setItem("Password", password);

                    if(screen.width < 499) {
                        document.getElementById("already-Have-Account").style.top = "340px"
                    } else {
                        document.getElementById("already-Have-Account").style.top = "310px"
                    }
                    document.getElementById('error').style.display = "none";
                    document.getElementById('error1').style.display = "none";

                    setTimeout(function() {
                        username = "";
                        fullName = "";
                        password = "";
                        window.location = "index.html"
                    },200)
                }
            });
        }, 200)

        // if(finalName.matches("^[a-zA-Z0-9]+$")) {
        //     console.log(finalName)
        // } else {
        //     console.log("Error in username")
        // }
        return false
    } else {
        document.getElementById('error').style.display = "flex";
        document.getElementById('error1').style.display = "none";
        if(screen.width < 499) {
            document.getElementById("already-Have-Account").style.top = "340px"
        } else {
            document.getElementById("already-Have-Account").style.top = "310px"
        }
        return false
    }
}