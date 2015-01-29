// Ionic Starter App
sexArray = [
    "男",
    "女"
];

hairArray = [
    "竖起",
    "躺下",
    "辫子/盘发",
    "短发(齐肩,不过肩)",
    "长发(过肩)",
    "戴帽子"
];

glassesArray = [
    "带",
    "不带"
];

clothesTypeArray = [
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

clothesColorArray = [
    "红/紫/粉",
    "黄",
    "蓝/绿",
    "白",
    "黑",
    "灰",
    "无法分辨主要颜色"
];

clothesStyleArray = [
    "纯色",
    "线条/格子/色块",
    "图案(抽象,卡通,画等)"
];
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
        });
    })

app.config(function($stateProvider, $urlRouterProvider){
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
        .state('tab.info', {
            url: '/info',
            views: {
                'info': {
                    templateUrl: 'templates/tab-info.html',
                    controller: 'infoCtrl'
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
        .state('tab.meet.create', {
            url: '/create',
            views: {
                'meet@tab': {
                    templateUrl: 'templates/meet-create.html',
                    controller: 'meetCreateCtrl'
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

app.controller('loginCtrl', function($scope, $state) {
    $scope.goRegister = function(){
        $state.go("register");
    }

    $scope.login = function(user){
        $state.go("tab.meet");
    }
});

app.controller('registerCtrl', function($scope, $state) {
    $scope.goLogin = function(){
        $state.go("login");
    }
});

app.controller('meetCreateCtrl', function($scope, $state, $ionicModal) {
    $scope.meet = {
        loc: null,
        sex: '',
        hair: '',
        glasses: '',
        clothesType: '',
        clothesColor: '',
        clothesStyle: '',
        fileName: ''
    }

    $scope.specialPics = [
        {
            userName: 'a',
            fileName: 'http://ionicframework.com/img/docs/siamese-dream.jpg'
        },
        {
            userName: 'b',
            fileName: 'http://ionicframework.com/img/docs/nevermind.jpg'
        },
        {
            userName: 'c',
            fileName: 'http://ionicframework.com/img/docs/siamese-dream.jpg'
        },
        {
            userName: 'd',
            fileName: 'http://ionicframework.com/img/docs/siamese-dream.jpg'
        },
        {
            userName: 'e',
            fileName: 'http://ionicframework.com/img/docs/siamese-dream.jpg'
        },
        {
            userName: 'f',
            fileName: 'http://ionicframework.com/img/docs/blue-album.jpg'
        },
        {
            userName: 'g',
            fileName: 'http://ionicframework.com/img/docs/siamese-dream.jpg'
        }
    ];

    $scope.loc = [
        {
            locId: "1",
            locName: "地点1"
        },
        {
            locId: "2",
            locName: "地点2"
        },
        {
            locId: "3",
            locName: "地点3"
        },
        {
            locId: "4",
            locName: "地点4"
        },
        {
            locId: "5",
            locName: "地点5"
        },
        {
            locId: "6",
            locName: "地点6"
        },
        {
            locId: "7",
            locName: "地点7"
        },
        {
            locId: "8",
            locName: "地点8"
        },
        {
            locId: "9",
            locName: "地点9"
        }
    ];

    $scope.sex = sexArray;
    $scope.hair = hairArray;
    $scope.glasses = glassesArray;
    $scope.clothesType = clothesTypeArray;
    $scope.clothesColor = clothesColorArray;
    $scope.clothesStyle = clothesStyleArray;

    $scope.curOptions = [];
    $scope.curOptionName = "";

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
            case "地点":
                $scope.curOptions = $scope.loc;
                break;
            case "性别":
                $scope.curOptions = $scope.sex;
                break;
            case "发型":
                $scope.curOptions = $scope.hair;
                break;
            case "眼镜":
                $scope.curOptions = $scope.glasses;
                break;
            case "衣服类型":
                $scope.curOptions = $scope.clothesType;
                break;
            case "衣服颜色":
                $scope.curOptions = $scope.clothesColor;
                break;
            case "衣服花纹":
                $scope.curOptions = $scope.clothesStyle;
                break;
            default:
        }
        $scope.curOptionName = item;
        $scope.modal.show();
    }

    $scope.clickItem = function(item){
        switch($scope.curOptionName) {
            case "地点":
                $scope.meet.loc = item;
                break;
            case "性别":
                $scope.meet.sex = item;
                break;
            case "发型":
                $scope.meet.hair = item;
                break;
            case "眼镜":
                $scope.meet.glasses = item;
                break;
            case "衣服类型":
                $scope.meet.clothesType = item;
                break;
            case "衣服颜色":
                $scope.meet.clothesColor = item;
                break;
            case "衣服花纹":
                $scope.meet.clothesStyle = item;
                break;
            default:

        }
        $scope.modal.hide();
    }
});

app.controller('meetCtrl', function($scope, $state) {
    $scope.meets = [
        {
            "_id" : 1,
            "creater" : "33",
            "location" : {
                "lng" : 121.45075426230972,
                "lat" : 31.266121101722263
            },
            "target" : "44",
            "status" : "待回复",
            "uid" : "1953152520a149b0d12dd65d",
            "locName" : "宜家(徐家汇)",
            "targetSex" : "男",
            "targetClothesColor" : "红/紫/粉",
            "targetClothesStyle" : "纯色",
            "targetClothesType" : "风衣/大衣",
            "targetGlasses" : "带",
            "targetHair" : "竖起",
            "targetPic" : "http://ionicframework.com/img/docs/blue-album.jpg",
            "createrPic" : "http://ionicframework.com/img/docs/siamese-dream.jpg",

            "type": "发出",
            "createTime": "2015-01-05 12:01",
            "endTime": "3分钟"
        },
        {
            "_id" : 2,
            "creater" : "44",
            "location" : {
                "lng" : 121.45075426230972,
                "lat" : 31.266121101722263
            },
            "target" : "33",
            "status" : "待回复",
            "uid" : "1953152520a149b0d12dd65d",
            "locName" : "宜家(徐家汇)",
            "targetSex" : "男",
            "targetClothesColor" : "红/紫/粉",
            "targetClothesStyle" : "纯色",
            "targetClothesType" : "风衣/大衣",
            "targetGlasses" : "带",
            "targetHair" : "竖起",
            "targetPic" : "http://ionicframework.com/img/docs/siamese-dream.jpg",
            "createrPic" : "http://ionicframework.com/img/docs/blue-album.jpg",

            "type": "接收",
            "createTime": "2015-01-05 12:01",
            "endTime": "3分钟"
        },
        {
            "_id" : 3,
            "creater" : "44",
            "location" : {
                "lng" : 121.45075426230972,
                "lat" : 31.266121101722263
            },
            "target" : "33",
            "status" : "待回复",
            "uid" : "1953152520a149b0d12dd65d",
            "locName" : "COSTA(张江高科)",
            "targetSex" : "男",
            "targetClothesColor" : "红/紫/粉",
            "targetClothesStyle" : "纯色",
            "targetClothesType" : "风衣/大衣",
            "targetGlasses" : "带",
            "targetHair" : "竖起",
            "targetPic" : "http://ionicframework.com/img/docs/nevermind.jpg",
            "createrPic" : "http://ionicframework.com/img/docs/nevermind.jpg",

            "type": "发出",
            "createTime": "2015-01-05 12:01",
            "endTime": "3分钟"
        }
    ];

});

app.controller('contactCtrl', function($scope, $state) {
    $scope.contacts = [
        {
            "_id" : 1,
            "creater" : "33",
            "location" : {
                "lng" : 121.45075426230972,
                "lat" : 31.266121101722263
            },
            "target" : "44",
            "status" : "待回复",
            "uid" : "1953152520a149b0d12dd65d",
            "locName" : "宜家(徐家汇)",
            "targetSex" : "男",
            "targetClothesColor" : "红/紫/粉",
            "targetClothesStyle" : "纯色",
            "targetClothesType" : "风衣/大衣",
            "targetGlasses" : "带",
            "targetHair" : "竖起",
            "targetPic" : "http://ionicframework.com/img/docs/blue-album.jpg",
            "createrPic" : "http://ionicframework.com/img/docs/siamese-dream.jpg",

            "type": "发出",
            "createTime": "2015-01-05 12:01",
            "endTime": "3分钟",

            "displayName": "帅哥",
            "latestWord": "你好!",
            "latestWordTime": "2015-01-05 12:05"
        },
        {
            "_id" : 2,
            "creater" : "44",
            "location" : {
                "lng" : 121.45075426230972,
                "lat" : 31.266121101722263
            },
            "target" : "33",
            "status" : "待回复",
            "uid" : "1953152520a149b0d12dd65d",
            "locName" : "宜家(徐家汇)",
            "targetSex" : "男",
            "targetClothesColor" : "红/紫/粉",
            "targetClothesStyle" : "纯色",
            "targetClothesType" : "风衣/大衣",
            "targetGlasses" : "带",
            "targetHair" : "竖起",
            "targetPic" : "http://ionicframework.com/img/docs/siamese-dream.jpg",
            "createrPic" : "http://ionicframework.com/img/docs/blue-album.jpg",

            "type": "接收",
            "createTime": "2015-01-05 12:01",
            "endTime": "3分钟",

            "displayName": "靓妹",
            "latestWord": "你好!",
            "latestWordTime": "2015-01-05 12:05"
        },
        {
            "_id" : 3,
            "creater" : "44",
            "location" : {
                "lng" : 121.45075426230972,
                "lat" : 31.266121101722263
            },
            "target" : "33",
            "status" : "待回复",
            "uid" : "1953152520a149b0d12dd65d",
            "locName" : "COSTA(张江高科)",
            "targetSex" : "男",
            "targetClothesColor" : "红/紫/粉",
            "targetClothesStyle" : "纯色",
            "targetClothesType" : "风衣/大衣",
            "targetGlasses" : "带",
            "targetHair" : "竖起",
            "targetPic" : "http://ionicframework.com/img/docs/nevermind.jpg",
            "createrPic" : "http://ionicframework.com/img/docs/nevermind.jpg",

            "type": "发出",
            "createTime": "2015-01-05 12:01",
            "endTime": "3分钟",

            "displayName": "挫男",
            "latestWord": "你好!",
            "latestWordTime": "2015-01-05 12:05"
        }
    ];

});

app.controller('infoCtrl', function($scope, $state, $ionicModal, $cordovaCamera) {
    $scope.myInfo = {
        hair: '',
        glasses: '',
        clothesType: '',
        clothesColor: '',
        clothesStyle: '',
        fileName: ''
    }

    $scope.hair = hairArray;
    $scope.glasses = glassesArray;
    $scope.clothesType = clothesTypeArray;
    $scope.clothesColor = clothesColorArray;
    $scope.clothesStyle = clothesStyleArray;

    $scope.curOptions = [];
    $scope.curOptionName = "";

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
                $scope.curOptions = $scope.hair;
                break;
            case "眼镜":
                $scope.curOptions = $scope.glasses;
                break;
            case "衣服类型":
                $scope.curOptions = $scope.clothesType;
                break;
            case "衣服颜色":
                $scope.curOptions = $scope.clothesColor;
                break;
            case "衣服花纹":
                $scope.curOptions = $scope.clothesStyle;
                break;
            default:
        }
        $scope.curOptionName = item;
        $scope.modal.show();
    }

    $scope.clickItem = function(item){
        switch($scope.curOptionName) {
            case "发型":
                $scope.myInfo.hair = item;
                break;
            case "眼镜":
                $scope.myInfo.glasses = item;
                break;
            case "衣服类型":
                $scope.myInfo.clothesType = item;
                break;
            case "衣服颜色":
                $scope.myInfo.clothesColor = item;
                break;
            case "衣服花纹":
                $scope.myInfo.clothesStyle = item;
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
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
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

app.controller('profileCtrl', function($scope, $state, $ionicHistory) {

    $scope.logout = function(){
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: true
        });
        $state.go('login');
    }

    $scope.his = function(){
        console.log($ionicHistory.viewHistory());
    }
});

app.controller('chatCtrl', function($scope, $state, $stateParams, $timeout, $ionicScrollDelegate, $ionicHistory) {
    $scope.meetId = $stateParams.meetId;

    $scope.showTime = true;

    var alternate,
        isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {
        alternate = !alternate;

        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        $scope.messages.push({
            userId: alternate ? '12345' : '54321',
            text: $scope.data.message,
            time: d
        });

        delete $scope.data.message;
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

    var d2 = new Date();
    d2 = d2.toLocaleTimeString().replace(/:\d+ /, ' ');
    $scope.data = {};
    $scope.myId = '12345';
    $scope.messages = [
        {
            userId: '12345',
            text: 'abc',
            time: d2
        },
        {
            userId: '54321',
            text: 'abc',
            time: d2
        }
    ];
});
