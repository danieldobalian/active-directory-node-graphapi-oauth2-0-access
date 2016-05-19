    var app = angular.module("app", ['ngRoute']);
    
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            
            $routeProvider
            .when('/userList', {
                templateUrl: "templates/userList.html", 
                controller: 'UserController'
            })
            .when('/addUser', {
                templateUrl: "templates/addUser.html", 
                controller: 'addUserController'
            })
            .when('/wishrequest', {
                templateUrl: "templates/wishrequest.html", 
                controller: 'WishRequestController'
            })
            .otherwise({ redirectTo: '/' });
            $locationProvider.hashPrefix('!').html5Mode(true);
        }]);
    
    var api = {
        connect: "/api/connect",
        disconnect: "/api/disconnect",
        checkConnection: "/api/checkConnection",
        user: "/api/user/",
    };
    app.controller('IndexController', function ($rootScope, $scope, $http) {
        $rootScope.isConnect = false;
        $scope.checkConnection = function () {
            $http.get(api.checkConnection)
                .then(function (response) {
                $rootScope.isConnect = response.data;
            });
        };
        $scope.checkConnection();
        $scope.connect = function () {
            console.log('connect');
            $http.get(api.connect)
                .success(function (response) {
                $rootScope.isConnect = true;
            });
        };
        $scope.disconnect = function () {
            console.log('disconnect');
            $http.get(api.disconnect)
                .success(function (response) {
                $rootScope.isConnect = false;
            });
        };
    });
    
app.controller('UserController', function ($rootScope, $scope, $http, $filter) {
        $scope.users = [];
        $scope.form = {};
        $scope.isEdit = false;
        $http.get(api.user)
            .success(function (response) {
                console.log(response)
                $scope.users = response;
            });
        $scope.del = function (id) {
            $http.delete(api.user + id).then(function (response) {
                if (response.status === 200) {
                    $scope.users = $filter('filter')($scope.users, { id: '!' + id })
                    $rootScope.msgalert = 'success';
                    $rootScope.msg = 'Delete user successfully!';
                }
            }, function (err) {
                console.log(err)
                $rootScope.msgalert = 'danger';
                $rootScope.msg = err.statusText + ": " + err.data;
            });
        };
         $scope.edit = function (index) {
            $scope.isEdit = true;
            $scope.editIndex = index;
            $scope.form = {
                displayName: $scope.users[index].displayName,
                userPrincipalName: $scope.users[index].userPrincipalName
            };
        };
        $scope.submit = function (){
            $http.patch(api.user + $scope.users[$scope.editIndex].id, $scope.form)
                .then(function (response) {
                    if (response.status === 200) {
                        $rootScope.msgalert = 'success';
                        $rootScope.msg = 'Update user successfully!';
                        $http.get(api.user + $scope.users[$scope.editIndex].id).then(function (data) {
                            console.log(data.data)
                            $scope.users[$scope.editIndex] = data.data;
                            $scope.cancel();
                        })
                    }
                }, function (err) {
                    console.log(err)
                    $rootScope.msgalert = 'danger';
                    $rootScope.msg = err.statusText + ": " + err.data;
                });
        }
        $scope.cancel = function () {
            $scope.form = {};
            $scope.isEdit = false;
            delete $scope.editIndex;
        };
    });
    
    app.controller('addUserController', function ($rootScope, $scope, $http, $location) {
        $scope.form = {
            accountenabled:"true",
            forceChangePasswordNextSignIn:"true"
        };
        $scope.submit = function () {
            console.log($scope.form)
            $http.post(api.user, angular.copy($scope.form))
            .then(function (response) {
                if (response.status === 200) {
                    $rootScope.msgalert = 'success';
                    $rootScope.msg = 'Create user successfully!';
                    $location.path('/userList')
                } 
            }, function (err) {
                console.log(err)
                $rootScope.msgalert = 'danger';
                $rootScope.msg = err.statusText+": "+err.data;
            });
        };

    });

