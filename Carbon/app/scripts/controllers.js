'use strict';

angular.module('carbonApp')

.controller('HeaderController',function($scope){

    

})

.controller('IndexController', function($scope){
    
    
})

.controller('AboutController', function($scope,$http){

})


.controller('RegisterController',function($scope){
    
    
})


.controller('LoginController', function($scope){
    
    
})

.controller('DataFillingController', function($scope,$rootScope,$http,$state,baseURL,Upload){

    $scope.isUpload = false;

    $rootScope.selectMonth = "";
    $rootScope.selectYear = "";
    $rootScope.isUpdateData = false;

    $rootScope.Submit = {};

    $http({
        method:'GET',
        url:baseURL+'select_submit_year_month'
    }).then(

        function success(response){

            // console.log(response.data)

            for (var i = 0 ; i < response.data.length ; i++)
            {
                console.log(response.data[i].year+"="+response.data[i].month);
                //设置已提交的标志
                $rootScope.Submit["isSubmit"+response.data[i].year+""+response.data[i].month] = true;

            }


        },

        function error(response){


        });


       console.log($rootScope.Submit);


        $scope.uploadFile = function () {
            $scope.upload($scope.file);
        };

        $scope.upload = function (file) {

            $scope.isUpload = false;

            $scope.fileInfo = file;
            Upload.upload({
                //服务端接收
                url: baseURL+'uploadData',
                //上传的同时带的参数
                //上传的文件
                file: file
            }).progress(function (evt) {
                //进度条
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                console.log('progess:' + $scope.progressPercentage + '%' + evt.config.file.name);


                $scope.isUpload = true;
                if($scope.progressPercentage === 100){

                    window.location.reload()

                }

            }).success(function (data, status, headers, config) {



            }).error(function (data, status, headers, config) {
                //上传失败
                console.log('error status: ' + status);
            });
        };




    //更新数据

    $scope.doUpdateMonth = function (year , month) {

        $rootScope.selectYear = year;
        $rootScope.selectMonth = month;
        //更新数据的标志
        $rootScope.isUpdateData = true;

        console.log("begin"+$rootScope.isUpdateData);

        $state.go('app.fill-data',{},{reload:false});

    };

    $scope.doSelectMonth = function (year , month) {

        $rootScope.selectYear = year;
        $rootScope.selectMonth = month;


        console.log(
            year + " == " + month
        );

        $state.go('app.data-config',{},{reload:false});


    }

})


.controller('CarbonReportController',function($scope,$state,$http,baseURL){

    console.log("in");
    $scope.weights2014Array = [];
    $scope.weights2015Array = [];
    $scope.weights2016Array = [];
    $scope.weight2014Total = 0;
    $scope.weight2015Total = 0;
    $scope.weight2016Total = 0;

    //一次拟合结果
    $scope.weight2017TotalPrimary = 0;
    $scope.weight2018TotalPrimary = 0;
    $scope.weight2019TotalPrimary = 0;



    //二次拟合结果
    $scope.weight2017TotalQuadratic = 0;
    $scope.weight2018TotalQuadratic= 0;
    $scope.weight2019TotalQuadratic = 0;

    /**
     * 拿2014年的数据
     */



    $http({
            method: 'GET',
            url: baseURL + 'get_year_carbon_weight/' + 2014
     }).then(
            function success(response) {


                for (var i = 0; i < response.data.length; i++) {
                    $scope.weights2014Array[i] = response.data[i].weight;
                    $scope.weight2014Total += response.data[i].weight;
                }

                console.log($scope.weights2014Array);

                printData2014ToChart();

                $http({
                    method: 'GET',
                    url: baseURL + 'get_year_carbon_weight/' + 2015
                }).then(
                    function success(response) {


                        for (var i = 0; i < response.data.length; i++) {
                            $scope.weights2015Array[i] = response.data[i].weight;
                            $scope.weight2015Total += response.data[i].weight;
                        }

                        console.log($scope.weights2015Array);

                        printData2015ToChart();

                        $http({
                            method: 'GET',
                            url: baseURL + 'get_year_carbon_weight/' + 2016
                        }).then(
                            function success(response) {

                                for (var i = 0; i < response.data.length; i++) {
                                    $scope.weights2016Array[i] = response.data[i].weight;
                                    $scope.weight2016Total += response.data[i].weight;
                                }

                                console.log($scope.weights2016Array);

                                printData2016ToChart();
                                printSumDataForEachYear();

                                /**
                                 *  拿到一次回归参数
                                 */

                                $http({
                                    method: 'GET',
                                    url: baseURL + 'get_x_param'
                                }).then(
                                    function success(response) {

                                        console.log(response.data.param1);
                                        console.log(response.data.param2);

                                        $scope.weight2017TotalPrimary = (response.data.param1 + response.data.param2 * 4.0);
                                        $scope.weight2018TotalPrimary = (response.data.param1 + response.data.param2 * 5.0);
                                        $scope.weight2019TotalPrimary = (response.data.param1 + response.data.param2 * 6.0);

                                        if ($scope.weight2017TotalPrimary < 0){
                                            $scope.weight2017TotalPrimary = 0;
                                        }
                                        if ($scope.weight2018TotalPrimary < 0){
                                            $scope.weight2018TotalPrimary = 0;
                                        }
                                        if ($scope.weight2019TotalPrimary < 0){
                                            $scope.weight2019TotalPrimary = 0;
                                        }

                                        $scope.weight2017TotalQuadratic = response.data.param3 + response.data.param4 * 4.0 + response.data.param5 * 4.0 * 4.0
                                        $scope.weight2018TotalQuadratic = response.data.param3 + response.data.param4 * 5.0 + response.data.param5 * 5.0 * 5.0;
                                        $scope.weight2019TotalQuadratic = response.data.param3 + response.data.param4 * 6.0 + response.data.param5 * 6.0 * 6.0;

                                        if ($scope.weight2017TotalQuadratic < 0){
                                            $scope.weight2017TotalQuadratic = 0;
                                        }
                                        if ($scope.weight2018TotalQuadratic < 0){
                                            $scope.weight2018TotalQuadratic = 0;
                                        }
                                        if ($scope.weight2019TotalQuadratic < 0){
                                            $scope.weight2019TotalQuadratic = 0;
                                        }

                                        printCarbonWeightSumLine();

                                    },

                                    function error(response) {

                                    });


                            },

                            function error(response) {


                            });


                    },

                    function error(response) {


                    });

            },

            function error(response) {


            });





    //曲线图表达碳排放总量变化趋势
    function printCarbonWeightSumLine() {



        console.log($scope.weight2017Total+"-"+$scope.weight2018Total+"-"+$scope.weight2019Total);


        var config = {
            type: 'line',
            data: {
                labels: ["2014", "2015", "2016", "2017", "2018", "2019"],
                datasets: [{
                    label: "实际碳排量",
                    fill: false,
                    backgroundColor: window.chartColors.blue,
                    borderColor: window.chartColors.blue,
                    data: [
                        $scope.weight2014Total.toFixed(2),
                        $scope.weight2015Total.toFixed(2),
                        $scope.weight2016Total.toFixed(2)
                    ],
                }, {
                    label: "x 回归模型预测",
                    fill: false,
                    backgroundColor: window.chartColors.green,
                    borderColor: window.chartColors.green,
                    borderDash: [5, 5],
                    data: [
                        $scope.weight2014Total.toFixed(2),
                        $scope.weight2015Total.toFixed(2),
                        $scope.weight2016Total.toFixed(2),
                        $scope.weight2017TotalPrimary.toFixed(2),
                        $scope.weight2018TotalPrimary.toFixed(2),
                        $scope.weight2019TotalPrimary.toFixed(2)
                    ],
                },
                    {
                        label: "x 平方回归模型预测",
                        fill: false,
                        backgroundColor: window.chartColors.yellow,
                        borderColor: window.chartColors.yellow,
                        borderDash: [5, 5],
                        data: [
                            $scope.weight2014Total.toFixed(2),
                            $scope.weight2015Total.toFixed(2),
                            $scope.weight2016Total.toFixed(2),
                            $scope.weight2017TotalQuadratic.toFixed(2),
                            $scope.weight2018TotalQuadratic.toFixed(2),
                            $scope.weight2019TotalQuadratic.toFixed(2)
                        ],
                    }
                ]
            },
            options: {
                responsive: true,
                title:{
                    display:true,
                    text:'智能回归模型预测结果'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '年份'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '碳排量(吨)'
                        }
                    }]
                }
            }
        };

            var ctx = document.getElementById("EachYearSumLine").getContext("2d");
            window.myLine = new Chart(ctx, config);

    }



    //输出2014数据开始
       function printData2014ToChart() {

        var ctx = document.getElementById("carbonWeight2014").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {

                labels: ["一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月"],

                datasets: [{
                    label: '2014月度碳排量数据',
                    data: $scope.weights2014Array,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],

                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });


    }



//    输出2015数据结束

    function printData2015ToChart() {

        var ctx = document.getElementById("carbonWeight2015").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {

                labels: ["一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月"],

                datasets: [{
                    label: '2015月度碳排量数据',
                    data: $scope.weights2015Array,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],

                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

    }

    function printData2016ToChart() {

        var ctx = document.getElementById("carbonWeight2016").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {

                labels: ["一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月"],

                datasets: [{
                    label: '2016月度碳排量数据',
                    data: $scope.weights2016Array,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],

                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)',
                        'rgba(255,99,132,1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

    }

    function printSumDataForEachYear() {

        var randomScalingFactor = function() {
            return Math.round(Math.random() * 100);
        };

        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        $scope.weight2014Total.toFixed(2),
                        $scope.weight2015Total.toFixed(2),
                        $scope.weight2016Total.toFixed(2)
                    ],
                    backgroundColor: [
                        window.chartColors.red,
                        window.chartColors.orange,
                        window.chartColors.yellow
                    ],
                    label: '总碳排量数据'
                }],
                labels: [
                    "2014年总碳排量",
                    "2015年总碳排量",
                    "2016年总碳排量"
                ]
            },
            options: {
                responsive: true
            }
        };

        var ctx = document.getElementById("EachYearSum").getContext("2d");
        window.myPie = new Chart(ctx, config);


    }



})


.controller('DataConfigController',function($scope,$state){

    console.log("in dataconfig");

    $scope.startFillData = function () {

        $state.go('app.fill-data',{},{reload:false});

    }


})


.controller('FillDataController',function($scope,$rootScope,$http,baseURL){

    $rootScope.Submit={}; //a - 1 , b - 2 , c - 3...

    console.log("inFillData");

    $scope.isSubmitSuccess = false;
    $scope.carbonVolum = {};
    $scope.carbonVolum.weight = 0.0;


    console.log("infillData="+$rootScope.isUpdateData);


    $scope.submitData = function () {

        $scope.carbonVolum.year = $rootScope.selectYear;
        $scope.carbonVolum.month = $rootScope.selectMonth;

        console.log($scope.carbonVolum);

        if ($rootScope.isUpdateData == false) {

            console.log("after="+$rootScope.isUpdateData);


            $http({
                method: 'POST',
                url: baseURL + "insert_carbon_weight",
                data: $scope.carbonVolum,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                function success(response) {

                    console.log(response.data.isSuccess);
                    $scope.isSubmitSuccess = true;

                },
                function error(response) {

                }
            );
        }
        else {


            //后台更新数据

            $http({
                method: 'POST',
                url: baseURL + "update_carbon_weight",
                data: $scope.carbonVolum,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                function success(response) {

                    console.log(response.data.isSuccess);
                    $scope.isSubmitSuccess = true;

                },
                function error(response) {

                }
            );


            console.log("更新数据OK!!!")

        }

    }

})

.controller('CooperationController',function($scope){

});