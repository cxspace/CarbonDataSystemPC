'use strict';

angular.module('carbonApp' , ['ui.router', 'ngResource','ngFileUpload'])


    //千万注意上传文件一定要区分win目录或者linux目录

.constant("baseURL","http://121.42.184.102:8080/CarbonServer/")

.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
    // route for the home page
        .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'HeaderController'
                },
                'content': {
                    templateUrl: 'views/home.html',
                    controller: 'IndexController'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            }
        })


        .state('app.aboutus', {
            url: 'aboutus',
            views: {
                'content@': {
                    templateUrl: 'views/aboutus.html',
                    controller: 'AboutController'
                }
            }
        })

        .state('app.register', {
            url: 'register',
            views: {
                'content@': {
                    templateUrl: 'views/register.html',
                    controller: 'RegisterController'
                }
            }
        })
    

        .state('app.login', {
            url: 'login',
            views: {
                'content@': {
                    templateUrl: 'views/login.html',
                    controller: 'LoginController'
                }
            }
        })
    
        .state('app.data-filling', {
            url: 'data-filling',
            views: {
                'content@': {
                    templateUrl: 'views/data-filling.html',
                    controller: 'DataFillingController'
                }
            }
        })

        .state('app.data-config', {
            url: 'data-config',
            views: {
                'content@': {
                    templateUrl: 'views/data-config.html',
                    controller: 'DataConfigController'
                }
            }
        })

        .state('app.fill-data', {
            url: 'fill-data',
            views: {
                'content@': {
                    templateUrl: 'views/fill-data.html',
                    controller: 'FillDataController'
                }
            }
        })

        .state('app.carbon-report', {
            url: 'carbon-report',
            views: {
                'content@': {
                    templateUrl: 'views/carbon-report.html',
                    controller: 'CarbonReportController'
                }
            }
        })


        .state('app.cooperation', {
            url: 'cooperation',
            views: {
                'content@': {
                    templateUrl: 'views/cooperation.html',
                    controller: 'CooperationController'
                }
            }
        });



        $urlRouterProvider.otherwise('/');

});