var app = angular.module('patientChatApp', ['ngRoute']);


//to route views on single page
app.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/PatientList', {
            templateUrl: 'PatientList.html',
            controller: 'patientController'
        })
      .when('/PatientDetails', {
            templateUrl: 'PatientDetails.html',
            controller: 'patientDetails'
        })
      .when('/PatientDB', {
            templateUrl: 'PatientDB.html',
            controller: 'patientDetails'
        })
      .when('/PatientChat', {
            templateUrl: 'PatientChat.html',
            controller: 'chatController'
        })
        .otherwise({ redirectTo: 'index.html' });
    }]);


//to extract socket object to be used in controller
app.factory('socket', function(){
  return io.connect('http://localhost:4040');
});


var newDate = new Date();

//to share username variable between controllers
app.service('sharedProperties', function () {
  var username = '';
  return {
    getProperty: function () {
      return username;
    },
    setProperty: function(value) {
      username = value;
    }
  };
});

//to share patient details between controllers
app.service('patientProperties', function () {
  var patientDetails = '';

  return {
    getPatientDetails: function () {
      return patientDetails;
    },
    setPatientDetails: function (value) {
      patientDetails = value;
    }
  };
});


//controller for chat messages
app.controller('chatController', function($scope, socket, sharedProperties){
  $scope.msgs = [];
  
  //called on submit
  $scope.sendMsg = function() {

    //get current timestamp on send
    newDate.setTime(Date.now());
    dateString = newDate.toUTCString();

    //cannot send empty message
    //if there is message then send
    if($scope.chat.msg) {
      //get the patient username, and send it with the chat message and date
      socket.emit('send msg', sharedProperties.getProperty(), $scope.chat.msg, dateString);
      //clear input field after send
      $scope.chat.msg = '';
    }
  };

  //print message with patient name, chat message and date
  socket.on('get msg', function(patient, data, dateString) {
    $scope.msgs.push(patient + ": " + data + " (" + dateString + ")");
    $scope.$digest();
  });

});


//controller for displaying patients, storing patient name as chat username, and selecting patient to be modified
app.controller('patientController', function($scope, $http, $location, sharedProperties, patientProperties) {

  //retrieve patient list from json file
  $http.get('../patient.json').
    //data successfully retrieved
    success(function(data, status, headers, config) {
      //assign JSON data to $scope view
      $scope.patients = data;
    }).
    error(function(data, status, headers, config) {
      //log error
    });

  //when chat button next to patient in patient list is clicked
  $scope.setUser = function (patient) {
    //store patient first name to username
    sharedProperties.setProperty(patient.firstName);
    console.log('selecting patient: ' + patient.firstName);
    $location.path('PatientChat');
  };

  //when modify button next to patient in patient list is clicked
  $scope.modify = function (patient) {
    //copy selected patient information to form
    patientProperties.setPatientDetails(patient);
    console.log('modifying patient: ' + patient.firstName + " " + patient.lastName);
    $location.path('PatientDetails');
  };
        
});


//controller for the patient form
app.controller('patientDetails', function($scope, $location, socket, patientProperties) {
  $scope.pats = [];
  $scope.patient = {};

    $scope.patient.firstName = patientProperties.getPatientDetails().firstName;
    $scope.patient.lastName = patientProperties.getPatientDetails().lastName;
    $scope.patient.phoneNo = patientProperties.getPatientDetails().phoneNo;
    $scope.patient.lastVisitDate = patientProperties.getPatientDetails().lastVisitDate;
    $scope.patient.Status = patientProperties.getPatientDetails().Status;

  //save patient to db
  $scope.saveDB = function(patient) {
    socket.emit('add patient', 
      patient.firstName, patient.lastName, patient.phoneNo, patient.lastVisitDate, patient.Status);
    $location.path('PatientList');
  };

  //retrieve data from db
  $scope.find = function() {
    socket.emit('get patient');
    $location.path('PatientDB');
  };
  socket.on('list patient', function(dbPatients) {
    //$scope.pats.push(JSON.stringify(dbPatients));
    $scope.pats.push(dbPatients);
    $scope.$digest();
  });

});