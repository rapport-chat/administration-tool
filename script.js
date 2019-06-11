let url = "";
let appId = "";
let masterKey = "";

function updateValues() {
  url = document.getElementById("serverAddress").value;
  appId = document.getElementById("appId").value;
  masterKey = document.getElementById("masterKey").value;
}

function getAuthKey() {
  updateValues();
  let requestUrl = url + "/parse/classes/AuthenticationKey";
  console.log(requestUrl);
  $.ajax({
    url: requestUrl,
    contentType: "application/json",
    headers: {
      "X-Parse-Application-Id": appId
    }
  }).done(function(data) {
    if (data.results.length !== 0) {
      $("#authKey").text(data.results[0].code);
    } else {
      let reqData = JSON.stringify({ code: makeAuthKey(4) });
      $.ajax({
        url: requestUrl,
        contentType: "application/json",
        method: "POST",
        data: reqData,
        headers: {
          "X-Parse-Application-Id": appId
        },
        success: function(response) {
          $.ajax({
            url: requestUrl,
            contentType: "application/json",
            headers: {
              "X-Parse-Application-Id": appId
            }
          }).done(function(data) {
            $("#authKey").text(data.results[0].code);
          });
        }
      });
    }
  });
}

function listUsers() {
  updateValues();
  let requestUrl = url + "/parse/users";
  $.ajax({
    url: requestUrl,
    contentType: "application/json",
    headers: {
      "X-Parse-Application-Id": appId
    }
  }).done(function(data) {
    console.log(data);
    $.each(data, function() {
      $.each(this, function(k, v) {
          console.log(k,v);
          let tableRowString = "<tr><th>" + v.firstName + "</th>";
          tableRowString += '<th>' + v.lastName + '</th>';
          tableRowString += '<th>' + v.username + '</th>';
          tableRowString += '<th><span class="tag is-danger">Delete</span> '
          tableRowString += '<span class="tag is-primary">Reset Password</span></th></tr>'
        $("#usersTable tr:last").after(
          tableRowString
        );
      });
    });
  });
  $("#usersTable").removeClass('is-hidden');
}

function makeAuthKey(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
