define(['./module', 'config'], function (module, config) {
    'use strict';

    /** Exit Modal Controller **/
    var ExitModalInstanceCtrl = function ($scope, $window, $modalInstance) {

        $scope.ok = function () {
            $window.location.href = "login.html";
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    module.controller('ApplicationController', ['$scope', '$rootScope', 'NOTIFY_EVENTS', '$timeout', '$window', '$modal', 'APP',  function($scope, $rootScope, NOTIFY_EVENTS, $timeout, $window, $modal, APP) {
        var ctrl = this;

        /** Init Variables **/

        $scope.notifyIsLoading = false;

        $scope.notify = false;

        $scope.bar_last = false;

        $scope.preloader = {};

        if(document.body.clientWidth >= 1200) {
            $scope.open = true;
        } else {
            $scope.open = false;
        }

        /** Methods **/

        $scope.listenerOuterClick = function () {
            $scope.notify = false;
            if(document.body.clientWidth < APP.closeWidth) {
                $scope.open = false;
            }
        }

        $scope.showLoading = function (msg) {
            if(!msg) {
                msg = "Carregando...";
            }

            $scope.preloader.message = msg;
            $scope.loading = true;

            $('body').css({'overflow':'hidden'});
            window.scrollTo(0,0);
            $('body').bind('touchmove', function(e){e.preventDefault()});
        };


        $scope.hideLoading = function () {
            $scope.loading = false;
            $('body').css({'overflow':'visible'});
            $('body').unbind('touchmove');
        };

        $scope.openLeftBar = function () {
            $scope.open = !$scope.open;
            $scope.notify = false;
        };

        $scope.openRightBar = function (tab) {

            if($scope.notifyIsLoading) {
                return false;
            }

            if(document.body.clientWidth < APP.closeWidth) {
                $scope.open = false;
                $rootScope.$broadcast(NOTIFY_EVENTS.close);
            }

            if($scope.bar_last || tab != 'last') {

                $rootScope.$broadcast(NOTIFY_EVENTS.open, {'tab': tab});

                if($scope.notify == false ) {
                    $scope.notify = true;
                } else {
                    if($scope.bar_last == tab) {
                        $scope.notify = false;
                    }

                }
                $scope.bar_user = false;
                $scope.bar_history = false;
                $scope.bar_dashboard = false;
                $scope.bar_cache = false;

                if(tab != 'last') {
                    $scope.bar_last = tab;
                }

                switch(tab) {
                    case 'user':
                        $scope.bar_user = true;
                        break;
                    case 'history':
                        $scope.bar_history = true;
                        break;
                    case 'dashboard':
                        $scope.bar_dashboard = true;
                        break;
                    case 'cache':
                        $scope.bar_cache = true;
                        break;
                    case 'last':
                        if($scope.bar_last) {
                            $scope.openRightBar($scope.bar_last);
                        } else {
                            $scope.bar_user = true;
                        }

                }
            }
        };

        $scope.exit = function () {
            var modalInstance = $modal.open({
                templateUrl: 'ExitModalContent.html',
                controller: ExitModalInstanceCtrl,
                resolve: {},
                windowClass: "modal exitDialog"
            });
        };

        /** Listeners **/

        var onResize = function (e) {
            if(document.body.clientWidth >= APP.closeWidth) {
                $scope.$apply(function () { $scope.open = true });
            } else {
                $scope.$apply(function () { $scope.open = false });
            }
        };

        angular.element($window).bind('resize', onResize);

        $rootScope.$on(NOTIFY_EVENTS.load, function (e, data) {
            if(data.value != undefined) {
                $scope.notifyIsLoading = data.value;
            }
        });

        $scope.$on('$routeChangeStart', function (next,current) {

            $scope.showLoading();
            $('.main-menu a').removeClass('active');

            if(current.params.module) {
                var value = current.params.module;
                $('.main-menu a#'+value).addClass('active');
            } else if (current.originalPath)  {
                if(current.originalPath == '/') {
                    $('.main-menu a.dashboard').addClass('active');
                }
            }
        });

        $scope.$on('$routeChangeSuccess', function () {
            $scope.hideLoading();
        });

        $scope.$on('$routeChangeError', function () {
            $scope.hideLoading();
        });
    }]);


    return module;
});