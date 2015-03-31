(function() {
    'use strict';

    angular.module('stroop', ['ionic'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .factory('$localstorage', ['$window',
        function($window) {
            return {
                set: function(key, value) {
                    $window.localStorage[key] = value;
                },
                get: function(key, defaultValue) {
                    return $window.localStorage[key] || defaultValue;
                },
                setObject: function(key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function(key) {
                    return JSON.parse($window.localStorage[key] || '{}');
                }
            };
        }
    ])

    .controller('colorCont', ['$scope', '$ionicModal', '$localstorage', '$timeout', '$ionicPopup',
        function($scope, $ionicModal, $localstorage, $timeout, $ionicPopup) {

            $scope.totalTime = 20;
            $scope.text = "";
            $scope.isHome = true;
            $scope.color1 = "green";
            $scope.color2 = "blue";
            $scope.color3 = "orange";
            $scope.color4 = "red";
            $scope.gameEnded = false;
            $scope.scores = [];

            $scope.stopGame = function() {
                $scope.showStart = true;
                $scope.showGame = false;
                $scope.text = "";
                $scope.quiz = "";
                $scope.answer = "";
                $scope.isGoing = false;
                $scope.time = $scope.totalTime;
            };

            $scope.stepGame = function() {
                $scope.text = $scope.randomColor();
                $scope.quiz = $scope.randomColor();
                while ($scope.quiz == $scope.text) {
                    $scope.quiz = $scope.randomColor();
                }
                $scope.color1 = $scope.randomColor();
                $scope.color2 = $scope.randomColor();
                while ($scope.color2 == $scope.color1) {
                    $scope.color2 = $scope.randomColor();
                }
                $scope.color3 = $scope.randomColor();
                while ($scope.color3 == $scope.color1 || $scope.color3 == $scope.color2) {
                    $scope.color3 = $scope.randomColor();
                }
                $scope.color4 = $scope.randomColor();
                while ($scope.color4 == $scope.color3 || $scope.color4 == $scope.color2 || $scope.color4 == $scope.color1) {
                    $scope.color4 = $scope.randomColor();
                }
            };
            $scope.startGame = function() {
                $scope.isHome = false;
                $scope.showStart = false;
                $scope.showGame = true;
                $scope.right = 0;
                $scope.wrong = 0;
                $scope.answer = "";
                $scope.total = 0;
                $scope.isGoing = true;
                $scope.time = $scope.totalTime;
                $scope.stepGame();
                var timer = setInterval(function() {
                    $scope.$apply(function() {
                        $scope.time--;
                        console.log($scope.time);
                        if ($scope.time == 0) {
                            clearInterval(timer);
                            $scope.stopGame();
                            $scope.submitScore($scope.right - ($scope.wrong * 2));
                            $scope.isScore = true;
                            $scope.gameEnded = true;
                        } else if ($scope.time <= 0) {
                            clearInterval(timer);
                            $scope.stopGame();
                        }
                    });
                }, 1000);
            };

            $scope.randomColor = function() {
                var choice = ["green", "red", "blue", "orange"];
                return choice[Math.floor(Math.random() * 4)];
            };

            $scope.clicked = function(input) {
                if ($scope.isGoing === false) {
                    return;
                }
                $scope.answer = (input == $scope.quiz);
                if ($scope.answer === true) {
                    $scope.right++;
                    $scope.tempRight = true;
                    $timeout($scope.sr, 200, true);

                } else {
                    $scope.wrong++;
                    $scope.tempWrong = true;
                    $timeout($scope.sw, 200, true);
                }
                $scope.stepGame();
            };

            $scope.sr = function() {
                $scope.tempRight = false;
            };
            $scope.sw = function() {
                $scope.tempWrong = false;
            };

            $scope.goHome = function() {
                console.log("clicked");
                $scope.gameEnded = false;
                $scope.isGoing = false;
                $scope.isScore = false;
                $scope.isHome = true;
                $scope.time = 0;
            };

            $scope.showScores = function() {
                $scope.getTopScores();
                var alertPopup = $ionicPopup.alert({
                    title: 'Look how good you are!',
                    cssClass: 'css/style.css',
                    templateUrl: 'scores.html'
                });
                alertPopup.then(function(res) {
                });
            };
            $scope.showInfo = function() {
                var alertPopup = $ionicPopup.alert({

                    title: 'Don\'t touch this button!',
                    template: 'Developed by ToWiCode for Bcube. To Play: match the color of the text to the spelling of the color.'
                });
                alertPopup.then(function(res) {
                });
            };

            $scope.showEmail = function() {
                var alertPopup = $ionicPopup.alert({
                    title: 'Email',
                    template: 'You can reach me at Toddwickizer@gmail.com'
                });
                alertPopup.then(function(res) {
                });
            };

            $scope.getTopScores = function() {


                for (var i = 0; i < 10; i++) {
                    $scope.scores[i] = $localstorage.get('scores' + i, 9 - i);
                }

                var x = $scope.scores;
                return x;

            };

            $scope.submitScore = function(score) {
                var scores = [];

                for (var i = 0; i < 10; i++) {
                    scores[i] = $localstorage.get('scores' + i, 0);
                    var stor = scores[i];
                    var score = parseInt(score);
                    if (score > stor) {
                        $localstorage.set('scores' + i, score);
                        ///RECURSION MOTHERFUCKER
                        $scope.submitScore(stor);
                        return;
                    }
                }
            };

            $scope.resetScore = function() {
                for (var i = 0; i < 10; i++) {
                    var m = 0;
                    $scope.scores[i] = $localstorage.set('scores' + i, m);
                }
            };
        }
    ]);
}());