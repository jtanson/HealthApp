var app = angular.module('patientChatApp', ['ngRoute', 'ngResource', 'angularUtils.directives.dirPagination']);


//to route views on single page
app.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/PatientList', {
            templateUrl: 'PatientList2.html',
            controller: 'patientList'
        })
      .when('/PatientDetails', {
            templateUrl: 'PatientDetails2.html',
            controller: 'patientDetails'
        })
      .when('/PatientVisits', {
            templateUrl: 'PatientVisits.html',
            controller: 'patientDetails'
        })
      .when('/ViewVisits', {
            templateUrl: 'ViewVisits.html',
            controller: 'patientVisits'
        })
      .when('/DoctorList', {
            templateUrl: 'DoctorList.html',
            controller: 'doctorInfo'
        })
      .when('/ViewDoctor', {
            templateUrl: 'ViewDoctor.html',
            controller: 'doctorInfo'
        })
      .when('/PatientChat', {
            templateUrl: 'PatientChat.html',
            controller: 'chatController'
        })
        .otherwise({ redirectTo: 'index.ejs' });
    }]);


//CRUD
//(for Patients)
app.factory('Patient', ['$resource', function($resource){
  return $resource('/actions/:id', null, {
    'update': { method:'PUT' },
    'remove': { method:'DELETE' },
    'add': { method:'POST' }
  });
}]);

//(for Doctor)
app.factory('Doctor', ['$resource', function($resource){
  return $resource('/actionsDoctor/:id', null, {
    'add': { method:'POST' }
  });
}]);

//(for Visit)
app.factory('Visit', ['$resource', function($resource){
  return $resource('/actionsVisit/:id', null, {
    'update': { method:'PUT' },
    'remove': { method:'DELETE' },
    'add': { method:'POST' }
  });
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

//to share doctor details between controllers
app.service('doctorProperties', function () {
  var doctorDetails = '';

  return {
    getDoctorDetails: function () {
      return doctorDetails;
    },
    setDoctorDetails: function (value) {
      doctorDetails = value;
    }
  };
});

//to share visit details between controllers
app.service('visitProperties', function () {
  var visitDetails = '';

  return {
    getVisitDetails: function () {
      return visitDetails;
    },
    setVisitDetails: function (value) {
      visitDetails = value;
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


//controller for displaying patients, deleting patients,
//storing patient name as chat username, and
//selecting patient to modify, to view or add visit
app.controller('patientList', function($scope, $http, $location, sharedProperties, patientProperties, Patient) {

  //retrieve patient list from json file
  // $http.get('../patient.json').
  $http.get('http://localhost:4040/list').
    //data successfully retrieved
    success(function(data, status, headers, config) {
      //assign JSON data to $scope view
      $scope.patients = data;
    }).
    error(function(data, status, headers, config) {
      //log error
    });


    $http.get('http://localhost:4040/listDoctors').
    //data successfully retrieved
    success(function(data, status, headers, config) {
      //assign JSON data to $scope view
      $scope.doctors = data;
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
    //console.log(patient._id.toString());
    patientProperties.setPatientDetails(patient);
    console.log('modifying patient: ' + patient.firstName + ' ' + patient.lastName);
    $location.path('PatientDetails');
  };

  //when view visit next to patient in patient list is clicked
  $scope.viewVisit = function (patient) {
    //copy selected patient information to form
    patientProperties.setPatientDetails(patient);
    console.log('view visit(s) for patient: ' + patient._id.toString() + ' ' + patient.firstName + ' ' + patient.lastName);
    $location.path('ViewVisits');
  };

  //when add visit next to patient in patient list is clicked
  $scope.addVisit = function (patient) {
    //copy selected patient information to form
    patientProperties.setPatientDetails(patient);
    console.log('add visit for patient: ' + patient._id.toString() + ' ' + patient.firstName + ' ' + patient.lastName);
    $location.path('PatientVisits');
  };
       
  //when delete next to patient in patient list is clicked
  $scope.delete = function(patient){
    Patient.remove({id: patient._id.toString()}, patient, function(){
      console.log('deleting: ' + patient._id.toString() + ' ' + patient.firstName);
      $location.url('/');
    });
  };

  //PAGINATION
  $scope.currentPage = 1;
  $scope.pageSize = 5;

  $scope.pageChangeHandler = function(num) {
      console.log('page changed to ' + num);
  };
  
});

app.controller('OtherController', function OtherController($scope) {
  $scope.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
});


//controller for the patient and visit form
app.controller('patientDetails', function($scope, $location, $http, patientProperties, Patient, visitProperties, Visit) {

    newDate.setTime(Date.now());
    dateString = newDate.toUTCString();

    //used in patient update
    $scope.patient = {};
    $scope.patient.selectedId = patientProperties.getPatientDetails()._id;
    $scope.patient.firstName = patientProperties.getPatientDetails().firstName;
    $scope.patient.lastName = patientProperties.getPatientDetails().lastName;
    $scope.patient.age = patientProperties.getPatientDetails().age;
    $scope.patient.doctor = patientProperties.getPatientDetails().doctor;
    $scope.patient.createdAt = patientProperties.getPatientDetails().createdAt;
    $scope.patient.lastMod = dateString;

    //used in visit update
    $scope.visit = {};
    $scope.visit.selectedId = visitProperties.getVisitDetails()._id;
    $scope.visit.complaint = visitProperties.getVisitDetails().complaint;
    $scope.visit.amount = visitProperties.getVisitDetails().amount;
    
    //populate list of registered doctors
    $http.get('http://localhost:4040/listDoctors').
    //data successfully retrieved
    success(function(data, status, headers, config) {
      //assign JSON data to $scope view
      $scope.doctors = data;
    }).
    error(function(data, status, headers, config) {
      //log error
    });

  $scope.save = function(patient) {

    newDate.setTime(Date.now());
    dateString = newDate.toUTCString();

    $scope.patient = patient;
    $scope.patient.createdAt = dateString;
    $scope.patient.lastMod = dateString;

    Patient.add($scope.patient, function(){
      console.log('adding new patient: ' + patient.firstName + ' ' + patient.lastName);
      $scope.patient = '';
      patientProperties.setPatientDetails($scope.patient);
      $location.url('PatientList');
    });

  };

  $scope.update = function(patient){

    Patient.update({id: $scope.patient.selectedId}, $scope.patient, function(){
      console.log('updated patient: ' + $scope.patient.selectedId + $scope.patient.lastMod);
      $scope.patient = '';
      patientProperties.setPatientDetails($scope.patient);
      $location.url('PatientList');
    });

  };

  $scope.saveVisit = function(visit) {

    $scope.visit = visit;
    $scope.visit.id = patientProperties.getPatientDetails()._id;

    Visit.add($scope.visit, function(){
      console.log('adding visit to patient: ' + $scope.visit.id + ' ' + $scope.visit.complaint);
      visitProperties.setVisitDetails('');
      patientProperties.setPatientDetails('');
      $location.url('PatientList');
    });

  };

  $scope.updateVisit = function(visit){

    Visit.update({id: $scope.visit.selectedId}, $scope.visit, function(){
      console.log('updated visit: ' + $scope.visit.selectedId + $scope.visit.complaint);
      visitProperties.setVisitDetails('');
      patientProperties.setPatientDetails('');
      $location.url('PatientList');
    });

  };

});


//VISIT CONTROLLER
app.controller('patientVisits', function($scope, $http, $location, patientProperties, visitProperties, Visit) {

    var selectedId = patientProperties.getPatientDetails()._id;

    $http.get('http://localhost:4040/listVisits/' + selectedId).
    // $http.get('http://localhost:4040/listVisits/:id', { params: { id: selectedId } }).
    //data successfully retrieved
    success(function(data, status, headers, config) {
      //assign JSON data to $scope view
      console.log('finding visits: ' + selectedId);
      $scope.visits = data;
      patientProperties.setPatientDetails(''); //clear selected patient
    }).
    error(function(data, status, headers, config) {
      //log error
    });

       
  $scope.deleteVisit = function(visit){
    Visit.remove({id: visit._id.toString()}, visit, function(){
      console.log('deleting: ' + visit._id.toString() + ' ' + visit.complaint);
      $location.url('PatientList');
    });
  };

  $scope.modifyVisit = function (visit) {
    //copy selected visit information to form
    visitProperties.setVisitDetails(visit);
    console.log('modifying visit: ' + visit._id.toString() + ' ' + visit.complaint);
    $location.path('PatientVisits');
  };

});


//DOCTOR CONTROLLER
app.controller('doctorInfo', function($scope, $window, $location, $http, Doctor, doctorProperties) {

    $scope.doctors = {};

    $scope.saveDoctor = function(doctor, user) {
      // console.log(user.email);
      $scope.doctor.email = user.email;
      $scope.doctor.firstName = doctor.firstName;
      $scope.doctor.lastName = doctor.lastName;

      Doctor.add($scope.doctor, function(){
        console.log('adding new: ' + $scope.doctor.email + ' ' + $scope.doctor.lastName);
        $window.location.href = '/success';
      });

    }

    $http.get('http://localhost:4040/listDoctors').
    //data successfully retrieved
    success(function(data, status, headers, config) {
      //assign JSON data to $scope view
      $scope.doctors = data;
    }).
    error(function(data, status, headers, config) {
      //log error
    });


  $scope.select = function (selected) {
    //copy selected patient information to form
    doctorProperties.setDoctorDetails(selected);
    console.log('view information for doctor: ' + selected);
    $location.path('ViewDoctor');
  };

});


//NOT USED ANYMORE
//was used for DoctorList page to select a doctor to view his patients
app.controller('selectDoctor', function($scope, $http, $location, doctorProperties, visitProperties, Visit) {

  var selectedDoctor = doctorProperties.getDoctorDetails();

  //$scope.select = function(doctor){

    $http.get('http://localhost:4040/listDoctorInfo/' + selectedDoctor).
    // $http.get('http://localhost:4040/listVisits/:id', { params: { id: selectedId } }).
    //data successfully retrieved
    success(function(data, status, headers, config) {
      //assign JSON data to $scope view
      console.log('finding information: ' + selectedDoctor);
      $scope.patients = data;
      //patientProperties.setPatientDetails(''); //clear selected patient
    }).
    error(function(data, status, headers, config) {
      //log error
    });
  //};

});
