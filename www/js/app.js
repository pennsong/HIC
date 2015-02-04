// Ionic Starter App

function ppCopyObj(source, destination) {
    for (var property in destination) {
        if (typeof destination[property] === "object") {
            ppCopyObj(source[property], destination[property]);
        } else {
            destination[property] = source[property];
        }
    }
};
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('ionicApp', ['ionic', 'ngCordova'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
                //StatusBar.styleLightContent();
            }

            //实时获取地理位置

        });
    })

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
    $ionicConfigProvider.tabs.position('bottom')

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'registerCtrl'
        })
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tab.html'
        })
        .state('tab.meet', {
            url: '/meet',
            views: {
                'meet': {
                    templateUrl: 'templates/tab-meet.html',
                    controller: 'meetCtrl'
                }
            }
        })
        .state('tab.contact', {
            url: '/contact',
            views: {
                'contact': {
                    templateUrl: 'templates/tab-contact.html',
                    controller: 'contactCtrl'
                }
            }
        })
        .state('tab.meet.info', {
            url: '/info',
            views: {
                'meet@tab': {
                    templateUrl: 'templates/meet-info.html',
                    controller: 'meetInfoCtrl'
                }
            }
        })
        .state('tab.profile', {
            url: '/profile',
            views: {
                'profile': {
                    templateUrl: 'templates/tab-profile.html',
                    controller: 'profileCtrl'
                }
            }
        })
        .state('tab.contact.chat', {
            url: '/chat/{meetId}',
            views: {
                'contact@tab': {
                    templateUrl: 'templates/contact-chat.html',
                    controller: 'chatCtrl'
                }
            }
        })
        .state('tab.meet.condition', {
            url: '/condition',
            views: {
                'meet@tab': {
                    templateUrl: 'templates/meet-condition.html',
                    controller: 'meetConditionCtrl'
                }
            }
        })
        .state('tab.meet.condition.specialPic', {
            url: '/specialPic',
            views: {
                'meet@tab': {
                    templateUrl: 'templates/condition-specialPic.html',
                    controller: 'conditionSpecialCtrl'
                }
            }
        }).state('tab.meet.detail', {
            url: '/detail/{meetId}',
            views: {
                'meet@tab': {
                    templateUrl: 'templates/meetDetail.html',
                    controller: 'meetDetailCtrl'
                }
            }
        });

});

// All this does is allow the message
// to be sent when you tap return
app.directive('input', function($timeout){
    return {
        restrict: 'E',
        scope: {
            'returnClose': '=',
            'onReturn': '&',
            'onFocus': '&',
            'onBlur': '&'
        },
        link: function(scope, element, attr){
            element.bind('focus', function(e){
                if(scope.onFocus){
                    $timeout(function(){
                        scope.onFocus();
                    });
                }
            });
            element.bind('blur', function(e){
                if(scope.onBlur){
                    $timeout(function(){
                        scope.onBlur();
                    });
                }
            });
            element.bind('keydown', function(e){
                if(e.which == 13){
                    if(scope.returnClose) element[0].blur();
                    if(scope.onReturn){
                        $timeout(function(){
                            scope.onReturn();
                        });
                    }
                }
            });
        }
    }
});

app.controller('baseCtrl', function($scope, $state){
    $scope.user = {
        username: window.localStorage['username'] || '',
        password: ''
    }

    $scope.newUser = {
        username: '',
        password: '',
        sex: '',
        nickname: '',
        cid: ''
    }

    $scope.searchMode;

    $scope.serverRoot = "http://192.168.1.6:3000/";
    $scope.imagePath = $scope.serverRoot + 'images/';
    $scope.sysImagePath = $scope.serverRoot + 'images/system/';

    $scope.curOptions = [];
    $scope.curOptionName = "";

    $scope.curChatFriendUsername;

    $scope.myLocation = {
        lng: 0,
        lat: 0
    }

    $scope.myInfo = {
        "specialInfo" : {
            "sex" : null,
            "clothesColor" : null,
            "clothesStyle" : null,
            "clothesType" : null,
            "glasses" : null,
            "hair" : null
        },
        specialPic: null
    }

    $scope.meetCondition = {
        mapLoc: {
            uid: '',
            name: '',
            address: ''
        },
        specialInfo: {
            sex : '',
            clothesColor : '',
            clothesStyle : '',
            clothesType : '',
            glasses : '',
            hair : ''
        }
    };

    $scope.meets = [];

    $scope.friends = [];

    $scope.targets = [];

    $scope.mapLocs = [
        {
            "uid":"82cf55ea33c0f0eefbdc856b",
            "name":"北京银行ATM1",
            "address":"北京市东城区东长安街天安门内"
        },
        {
            "uid":"82cf55ea33c0f0eefbdc856b",
            "name":"北京银行ATM2",
            "address":"北京市东城区东长安街天安门内"
        },
        {
            "uid":"82cf55ea33c0f0eefbdc856b",
            "name":"北京银行ATM3",
            "address":"北京市东城区东长安街天安门内"
        },
        {
            "uid":"82cf55ea33c0f0eefbdc856b",
            "name":"北京银行ATM4",
            "address":"北京市东城区东长安街天安门内"
        },
        {
            "uid":"82cf55ea33c0f0eefbdc856b",
            "name":"北京银行ATM5",
            "address":"北京市东城区东长安街天安门内"
        }
    ];

    $scope.sex = [
        "男",
        "女"
    ];

    $scope.hair = [
        "竖起",
        "躺下",
        "辫子/盘发",
        "短发(齐肩,不过肩)",
        "长发(过肩)",
        "戴帽子"
    ];

    $scope.glasses = [
        "带",
        "不带"
    ];

    $scope.clothesType = [
        "风衣/大衣",
        "西装/夹克/套装",
        "运动外套/卫衣",
        "T恤长袖",
        "T恤短袖",
        "马甲/背心",
        "长袖衬衫",
        "短袖衬衫",
        "毛衣/羊毛绒/线衫/针织"
    ];

    $scope.clothesColor = [
        "红/紫/粉",
        "黄",
        "蓝/绿",
        "白",
        "黑",
        "灰",
        "无法分辨主要颜色"
    ];

    $scope.clothesStyle = [
        "纯色",
        "线条/格子/色块",
        "图案(抽象,卡通,画等)"
    ];
});

app.controller('loginCtrl', function($scope, $state, $http, $ionicPopup, $cordovaDevice) {

    $scope.showPopup = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: '注意',
            template: msg
        });
        alertPopup.then(function(res) {
        });
    };

    $scope.goRegister = function(){
        $scope.$parent.newUser = {
            username: '',
            password: '',
            sex: '',
            nickname: '',
            cid: ''
        }

        $state.go("register");
    }

    $scope.login = function(user){
        if (!user.username || !user.password)
        {
            $scope.showPopup('用户名和密码都不能为空!');
            return;
        }
        $http.post(
                $scope.$parent.serverRoot + 'login',
            {
                username: user.username,
                password: user.password,
                cid: 't1'//$cordovaDevice.getUUID()
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.$parent.user.username = data.result;
                window.localStorage['username'] = data.result;
                $state.go("tab.meet")
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.showPopup(data.result + "(" + status + ")");
                return;
            }
        );
    }
});

app.controller('registerCtrl', function($scope, $state, $http, $ionicPopup, $cordovaDevice) {
    $scope.showPopup = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: '注意',
            template: msg
        });
        alertPopup.then(function(res) {
        });
    };

    $scope.register = function(newUser){
        newUser.cid = 't2';//$cordovaDevice.getUUID();
        if (!(newUser.username && newUser.password && newUser.sex && newUser.nickname && newUser.cid))
        {
            $scope.showPopup('用户名, 密码, 性别, 昵称都不能为空!');
            return;
        }
        $http.post(
                $scope.$parent.serverRoot + 'register',
            {
                newUser: newUser
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.$parent.user.username = data.result;
                window.localStorage['username'] = data.result;
                $state.go("tab.meet")
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                if (status == 0)
                {
                    $scope.showPopup('网络不给力哦!'+ "(" + status + ")");
                }
                else
                {
                    $scope.showPopup(data.result + "(" + status + ")");
                }
            }
        );
    }
});

app.controller('meetDetailCtrl', function($scope, $state) {
});

app.controller('conditionSpecialCtrl', function($scope, $state, $ionicModal, $ionicHistory, $http) {
    $ionicModal.fromTemplateUrl(
        'templates/bigSpecialPic.html',
        function($ionicModal) {
            $scope.modal = $ionicModal;
        },
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        }
    );

    $scope.getBigPic = function(targetUsername, targetSpecialPic){
        $scope.targetUsername = targetUsername;
        $scope.targetSpecialPic = targetSpecialPic;
        $scope.modal.show();
    }

    $scope.yes = function(targetUsername){
        $http.post(
                $scope.$parent.serverRoot + 'createMeet',
            {
                creater_username: $scope.$parent.user.username,
                target_username: targetUsername,
                status: '待回复',
                meetCondition: $scope.$parent.meetCondition
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                var item = data.result;

                var newItem = {
                    _id : item._id,
                    creater: item.creater,
                    target: item.target,
                    mapLoc : item.mapLoc,
                    status : item.status,
                    createTime: "t:" + item._id,
                    specialInfo: item.specialInfo
                };

                var logo = null;
                if (item.creater.username == $scope.user.username)
                {
                    if (item.status == '待确认')
                    {
                        logo = $scope.$parent.sysImagePath + "tbd.jpg";
                    }
                    else
                    {
                        logo = $scope.$parent.imagePath + "small/" + item.target.specialPic;
                    }
                }
                else
                {
                    logo = $scope.$parent.sysImagePath + "x.jpg";
                }

                newItem.logo = logo;

                $scope.$parent.meets.unshift(newItem);
                $state.go("tab.meet")
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("err:" + status);
            }
        );


        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: true
        });
        $state.go('tab.meet');
        $scope.modal.hide();
    }

    $scope.no = function(){
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: true
        });
        $state.go('tab.meet');
        $scope.modal.hide();
    }

});

app.controller('meetConditionCtrl', function($scope, $state, $ionicModal, $http, $ionicPopup) {
    $scope.showPopup = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: '注意',
            template: msg
        });
        alertPopup.then(function(res) {
        });
    };

    $scope.searchTargets = function(){
        if (!(
            $scope.$parent.meetCondition.specialInfo.sex
            && $scope.$parent.meetCondition.specialInfo.clothesColor
            && $scope.$parent.meetCondition.specialInfo.clothesStyle
            && $scope.$parent.meetCondition.specialInfo.clothesType
            && $scope.$parent.meetCondition.specialInfo.glasses
            && $scope.$parent.meetCondition.specialInfo.hair
            && $scope.$parent.meetCondition.mapLoc
            )){
            $scope.showPopup('请把条件填写完整!');
            return;
        }


        $http.post(
                $scope.$parent.serverRoot + 'searchTargets',
            {
                meetCondition: $scope.$parent.meetCondition
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.$parent.targets = data.result;
                $state.go('tab.meet.condition.specialPic');
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("err:" + status);
            }
        );
    }

    $ionicModal.fromTemplateUrl(
        'templates/option.html',
        function($ionicModal) {
            $scope.modal = $ionicModal;
        },
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        }
    );

    $scope.clickInfoItem = function(item){
        if ($scope.$parent.searchMode == '确认')
        {
            return;
        }
        switch(item) {
            case "地点":
                $scope.$parent.curOptions = $scope.$parent.mapLocs;
                break;
            case "性别":
                $scope.$parent.curOptions = $scope.$parent.sex;
                break;
            case "发型":
                $scope.$parent.curOptions = $scope.$parent.hair;
                break;
            case "眼镜":
                $scope.$parent.curOptions = $scope.$parent.glasses;
                break;
            case "衣服类型":
                $scope.$parent.curOptions = $scope.$parent.clothesType;
                break;
            case "衣服颜色":
                $scope.$parent.curOptions = $scope.$parent.clothesColor;
                break;
            case "衣服花纹":
                $scope.$parent.curOptions = $scope.$parent.clothesStyle;
                break;
            default:
        }
        $scope.$parent.curOptionName = item;
        $scope.modal.show();
    }

    $scope.clickItem = function(item){
        switch($scope.$parent.curOptionName) {
            case "地点":
                $scope.$parent.meetCondition.mapLoc = item;
                break;
            case "性别":
                $scope.$parent.meetCondition.specialInfo.sex = item;
                break;
            case "发型":
                $scope.$parent.meetCondition.specialInfo.hair = item;
                break;
            case "眼镜":
                $scope.$parent.meetCondition.specialInfo.glasses = item;
                break;
            case "衣服类型":
                $scope.$parent.meetCondition.specialInfo.clothesType = item;
                break;
            case "衣服颜色":
                $scope.$parent.meetCondition.specialInfo.clothesColor = item;
                break;
            case "衣服花纹":
                $scope.$parent.meetCondition.specialInfo.clothesStyle = item;
                break;
            default:

        }
        $scope.modal.hide();
    }
});

app.controller('meetCtrl', function($scope, $state, $ionicModal, $http) {

    $http.get($scope.$parent.serverRoot + "getMeets?username=" + $scope.$parent.user.username).
        success(function(data, status, headers, config) {
            tmpArray = data.result.map(function(item){
                var newItem = {
                    _id : item._id,
                    creater: item.creater,
                    target : item.target,
                    mapLoc : item.mapLoc,
                    status : item.status,
                    createTime: "t:" + item._id,
                    specialInfo: item.specialInfo
                };

                var logo = null;
                if (item.creater.username == $scope.$parent.user.username)
                {
                    if (item.status == '待确认')
                    {
                        logo = $scope.$parent.sysImagePath + "tbd.jpg";
                    }
                    else
                    {
                        logo = $scope.$parent.imagePath + "small/" + item.target.specialPic;
                    }
                }
                else
                {
                    logo = $scope.$parent.sysImagePath + "x.jpg";
                }

                newItem.logo = logo;

                return newItem;
            });
            $scope.$parent.meets = tmpArray;
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('err:' + status);
        }
    );

    $scope.createMeet = function(){
        $scope.$parent.searchMode = '发起';
        $scope.$parent.meetCondition = {
            mapLoc: {
                uid: '',
                name: '',
                address: ''
            },
            specialInfo: {
                sex : '',
                clothesColor : '',
                clothesStyle : '',
                clothesType : '',
                glasses : '',
                hair : ''
            }
        };
        $state.go('tab.meet.condition');
    }

    $scope.enterInfo = function(){
        $http.get($scope.$parent.serverRoot + "getSpecialInfo?username=" + $scope.$parent.user.username).
            success(function(data, status, headers, config) {
                $scope.$parent.myInfo = data.result;
                $state.go('tab.meet.info');
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert('err:' + status);
            }
        );
    }

    $ionicModal.fromTemplateUrl(
        'templates/meetDetail.html',
        function($ionicModal) {
            $scope.modal = $ionicModal;
        },
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        }
    );

    $scope.curMeet = null;

    $scope.clickMeet = function(meet){
        if (meet.status=='待确认')
        {
            ppCopyObj(meet, $scope.$parent.meetCondition);
            console.log( $scope.$parent.meetCondition);
            $scope.$parent.searchMode = '确认';

            $state.go('tab.meet.condition');
        }
        else if (meet.status == '待回复')
        {
            if (meet.target.username == $scope.$parent.user.username)
            {
                $scope.$parent.searchMode = '回复';
                $scope.$parent.meetCondition = {
                    mapLoc: {
                        uid: '',
                        name: '',
                        address: ''
                    },
                    specialInfo: {
                        sex : '',
                        clothesColor : '',
                        clothesStyle : '',
                        clothesType : '',
                        glasses : '',
                        hair : ''
                    }
                };
                $scope.$parent.meet = meet;
                $state.go('tab.meet.condition');
            }
            else if (meet.creater.username == $scope.$parent.user.username)
            {
                $scope.$parent.curMeet = meet;
                $scope.modal.show();
            }
        }
    }
});

app.controller('contactCtrl', function($scope, $state, $http) {
    $http.get($scope.$parent.serverRoot + "getFriends?username=" + $scope.$parent.user.username).
        success(function(data, status, headers, config) {
            $scope.$parent.friends = data.result;
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('err:' + status);
        }
    );

    $scope.clickChat = function(friendUsername){
        $scope.$parent.curChatFriendUsername = friendUsername;
        $state.go('tab.contact.chat');
    }
});

app.controller('meetInfoCtrl', function($scope, $state, $ionicModal, $cordovaCamera, $http, $ionicPopup) {
    $scope.showPopup = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: '注意',
            template: msg
        });
        alertPopup.then(function(res) {
        });
    };

    $scope.myGoBack = function() {
        if (!(
            $scope.$parent.myInfo.specialInfo.sex
            && $scope.$parent.myInfo.specialInfo.clothesColor
            && $scope.$parent.myInfo.specialInfo.clothesStyle
            && $scope.$parent.myInfo.specialInfo.clothesType
            && $scope.$parent.myInfo.specialInfo.glasses
            && $scope.$parent.myInfo.specialInfo.hair
            && $scope.$parent.myInfo.specialPic
            )){
            $scope.showPopup('请填写完整!');
            return;
        }
        $http.put(
                $scope.$parent.serverRoot + 'updateInfo',
            {
                username: $scope.$parent.user.username,
                myInfo: $scope.$parent.myInfo
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $state.go('tab.meet');
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("err:" + status);
            }
        );
    };

    $ionicModal.fromTemplateUrl(
        'templates/option.html',
        function($ionicModal) {
            $scope.modal = $ionicModal;
        },
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        }
    );

    $scope.clickInfoItem = function(item){
        switch(item) {
            case "发型":
                $scope.$parent.curOptions = $scope.$parent.hair;
                break;
            case "眼镜":
                $scope.$parent.curOptions = $scope.$parent.glasses;
                break;
            case "衣服类型":
                $scope.$parent.curOptions = $scope.$parent.clothesType;
                break;
            case "衣服颜色":
                $scope.$parent.curOptions = $scope.$parent.clothesColor;
                break;
            case "衣服花纹":
                $scope.$parent.curOptions = $scope.$parent.clothesStyle;
                break;
            default:
        }
        $scope.$parent.curOptionName = item;
        $scope.modal.show();
    }

    $scope.clickItem = function(item){
        switch($scope.$parent.curOptionName) {
            case "发型":
                $scope.$parent.myInfo.specialInfo.hair = item;
                break;
            case "眼镜":
                $scope.$parent.myInfo.specialInfo.glasses = item;
                break;
            case "衣服类型":
                $scope.$parent.myInfo.specialInfo.clothesType = item;
                break;
            case "衣服颜色":
                $scope.$parent.myInfo.specialInfo.clothesColor = item;
                break;
            case "衣服花纹":
                $scope.$parent.myInfo.specialInfo.clothesStyle = item;
                break;
            default:

        }
        $scope.modal.hide();
    }

    $scope.takePhoto = function(){
        try{
            var options = {
                quality: 30,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 200,
                targetHeight: 200,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
//            var image = document.getElementById('myImage');
//            image.src = "data:image/jpeg;base64," + imageData;
                $scope.$parent.myInfo.specialPic = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // error
                alert(err);
            });
        }
        catch (e) {
            alert(e);
        }
    }
});

app.controller('profileCtrl', function($scope, $state, $ionicHistory, $interval) {
    $scope.mapLocs = [];

    $scope.logout = function(){
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: true
        });
        $state.go('login');
    }

    $scope.his = function(){
        //console.log($ionicHistory.viewHistory());
        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        $scope.mapLocs.unshift(d + ',test');
    }

    // onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
    function onSuccess(position) {
//                var element = document.getElementById('geolocation');
//                element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
//                    'Longitude: ' + position.coords.longitude     + '<br />' +
//                    '<hr />'      + element.innerHTML;
        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        window.localStorage['locationVal'] = (d + ":" + position.coords.latitude + "," + position.coords.longitude);
        $scope.mapLocs.unshift(window.localStorage['locationVal']);
    }

// onError Callback receives a PositionError object
//
    function onError(error) {
        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        window.localStorage['locationValErr'] = (d + 'code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }

// Options: throw an error if no update is received every 30 seconds.
//
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 3000, enableHighAccuracy: true });

});

app.controller('chatCtrl', function($scope, $state, $stateParams, $timeout, $ionicScrollDelegate, $http) {
    $scope.inputMessage;
    $scope.showTime = true;

    var alternate,
        isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {
        if (!$scope.inputMessage)
        {
            return;
        }

        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        $scope.$parent.friends[$scope.$parent.curChatFriendUsername].messages.push({
            from: $scope.$parent.user.username,
            text: $scope.$parent.curChatFriendUsername,
            content: $scope.inputMessage,
            time: d
        });

        $scope.inputMessage = '';
        //$ionicScrollDelegate.scrollBottom(true, true);
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true, true);
        }, 300);

    };

    $scope.inputUp = function() {
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true, true);
        }, 300);

    };

    $scope.inputDown = function() {
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function() {
        // cordova.plugins.Keyboard.close();
    };

    $scope.toggleTime = function() {
        $scope.showTime = !$scope.showTime;
    };

});
