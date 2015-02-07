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

app.controller('baseCtrl', function($scope, $state, $ionicPopup){
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

    $scope.latestLocation = {
        lng: null,
        lat: null
    }

    $scope.curMeet = null;

    $scope.showPopup = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: '注意',
            template: msg
        });
        alertPopup.then(function(res) {
        });
    };

    $scope.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.tempDirectory + name;
        return trueOrigin;
    }

    $scope.ppError = function(data, status, headers, config) {
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

    $scope.searchMode;

    $scope.serverRoot = "http://192.168.1.6:3000/";
    //$scope.serverRoot = "http://10.0.1.5:3000/";
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
        specialPic: null,
        specialPicDisplay: null
    }

    $scope.meetCondition = {
        meetId: null,
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
            $scope.$parent.showPopup('用户名和密码都不能为空!');
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
            error($scope.$parent.ppError);
    }
});

app.controller('registerCtrl', function($scope, $state, $http, $ionicPopup, $cordovaDevice) {
    $scope.register = function(newUser){
        newUser.cid = 't2';//$cordovaDevice.getUUID();
        if (!(newUser.username && newUser.password && newUser.sex && newUser.nickname && newUser.cid))
        {
            $scope.$parent.showPopup('用户名, 密码, 性别, 昵称都不能为空!');
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
            error($scope.$parent.ppError);
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

    $scope.uploadMeet = function(status){
        var targetUsername;
        if (status == '待回复')
        {
            targetUsername = $scope.targetUsername
        }
        $http.post(
                $scope.$parent.serverRoot + 'createMeet',
            {
                creater_username: $scope.$parent.user.username,
                target_username: targetUsername,
                status: status,
                meetId: $scope.$parent.meetCondition.meetId,
                mapLoc: $scope.$parent.meetCondition.mapLoc,
                specialInfo: $scope.$parent.meetCondition.specialInfo,
                personLoc: window.localStorage['latestLocation'] ? JSON.parse(window.localStorage['latestLocation']) : null
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                var newItem = data.result;

                var logo = null;
                if (newItem.creater.username == $scope.user.username)
                {
                    if (newItem.status == '待确认')
                    {
                        logo = $scope.$parent.sysImagePath + "tbd.jpg";
                    }
                    else
                    {
                        logo = $scope.$parent.imagePath + "normal/" + newItem.target.specialPic;
                    }
                }
                else
                {
                    logo = $scope.$parent.sysImagePath + "x.jpg";
                }

                newItem.logo = logo;

                var updateMeet = false;
                for (var i = 0; i < $scope.$parent.meets.length; i++) {
                    if ($scope.$parent.meets[i]._id === newItem._id)
                    {
                        $scope.$parent.meets[i] = newItem;
                        updateMeet = true;
                        break;
                    }
                }
                if (!updateMeet)
                {
                    $scope.$parent.meets.unshift(newItem);
                }
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true,
                    historyRoot: true
                });
                $state.go('tab.meet');
                $scope.modal.hide();
            }).
            error($scope.$parent.ppError);
    }

    $scope.yes = function(targetUsername){
        if (targetUsername == 'fake')
        {
            $scope.$parent.showPopup('请仔细选择图片!');
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });
            $state.go('tab.meet');
            $scope.modal.hide();
        }
        else
        {
            if ($scope.$parent.searchMode == '回复')
            {
                if ($scope.$parent.curMeet.creater.username == targetUsername)
                {
                    $http.post(
                            $scope.$parent.serverRoot + 'replySuccess',
                        {
                            creater_username: targetUsername,
                            target_username: $scope.$parent.user.username,
                            meetId: $scope.$parent.curMeet._id
                        }
                    )
                        .success(function(data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available
                            $scope.$parent.friends.unshift(data.result);
                            //移除成功的meet
                            for (var i = 0; i < $scope.$parent.meets.length; i++) {
                                if ($scope.$parent.meets[i]._id === data.meetId)
                                {
                                    $scope.$parent.meets.splice(i, 1);
                                    break;
                                }
                            }
                            $scope.$parent.showPopup('恭喜你!已加入好友列表,赶紧行动吧!');
                        }).
                        error($scope.$parent.ppError);

                }
                else
                {
                    $scope.$parent.showPopup('没猜对哦!');
                }
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true,
                    historyRoot: true
                });
                $state.go('tab.meet');
                $scope.modal.hide();

            }
            //searchMode = '回复' || '确认'
            else
            {
                $scope.uploadMeet('待回复');
            }
        }
    }

    $scope.no = function(){
        if ($scope.$parent.searchMode == '回复' || $scope.$parent.searchMode == '确认')
        {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });
            $state.go('tab.meet');
            $scope.modal.hide();
        }
        else{
            $scope.uploadMeet('待确认');
        }
    }

});

app.controller('meetConditionCtrl', function($scope, $state, $ionicModal, $http, $ionicPopup, $timeout) {
    $scope.bLng = null;
    $scope.bLat = null;

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
            $scope.$parent.showPopup('请把条件填写完整!');
            return;
        }
        console.log($scope.$parent.latestLocation);
        if (!($scope.$parent.latestLocation.lng && $scope.$parent.latestLocation.lat))
        {
            $scope.$parent.showPopup('未能获取您的当前位置,请调整位置后重试');
            return;
        }

        $http.post(
                $scope.$parent.serverRoot + 'searchTargets',
            {
                username: $scope.$parent.user.username,
                meetCondition: $scope.$parent.meetCondition,
                sendLoc: {
                    lng: $scope.$parent.latestLocation.lng,
                    lat: $scope.$parent.latestLocation.lat
                }
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.$parent.targets = data.result;
                $state.go('tab.meet.condition.specialPic');
            }).
            error($scope.$parent.ppError);
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

    $scope.changeKeyword = function(keyword){
        if ($scope.timer)
        {
            clearInterval($scope.timer);
        }
        $scope.timer = setInterval(function(){
            if ($scope.timer)
            {
                clearInterval($scope.timer);
            }
            $scope.searchLoc(keyword);
        }, 300);
    }

    $scope.searchLoc = function(keyword){
        var ak = "F9266a6c6607e33fb7c3d8da0637ce0b";
        var output = "json";
        var radius = "2000";
        var scope = "1";
        var data = "query=" + encodeURIComponent(keyword);
        data += "&ak=" + ak;
        data += "&output=" + output;
        data += "&radius=" + radius;
        data += "&scope=" + scope;
        data += "&location=" + $scope.bLat + "," + $scope.bLng;
        data += "&filter=sort_name:distance";

        $http.get("http://api.map.baidu.com/place/v2/search?" + data).
            success(function(data, status, headers, config) {
                //查询结果
                $scope.$parent.curOptions = data.results;

            }).
            error($scope.$parent.ppError);
    }

    $scope.clickInfoItem = function(item){
        if ($scope.$parent.searchMode == '确认')
        {
            return;
        }
        if (item == '地点')
        {
            $scope.$parent.curOptions = [];
            if (!($scope.$parent.latestLocation.lng && $scope.$parent.latestLocation.lat))
            {
                $scope.$parent.showPopup('未能获取您的当前位置,请调整位置后重试');
                return;
            }
            $http.get("http://api.map.baidu.com/geoconv/v1/?ak=MgBALVVeCd8THVBi6gPdvsvG&coords=" + $scope.$parent.latestLocation.lng + "," + $scope.$parent.latestLocation.lat).
                success(function(data, status, headers, config) {
                    //转换为百度坐标
                    $scope.bLng = data.result[0].x;
                    $scope.bLat = data.result[0].y;
                    $scope.$parent.curOptionName = item;

                    $scope.modal.show();
                }).
                error($scope.$parent.ppError);
            return;
        }

        switch(item) {
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
                    specialInfo: item.specialInfo,
                    createTime: new Date( parseInt( item._id.toString().substring(0,8), 16 ) * 1000).toISOString()
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
                        logo = $scope.$parent.imagePath + "normal/" + item.target.specialPic;
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
        error($scope.$parent.ppError);

    $scope.doRefresh = function() {
        $http.get($scope.$parent.serverRoot + "getMeets?username=" + $scope.$parent.user.username).
            success(function(data, status, headers, config) {
                tmpArray = data.result.map(function(item){
                    var newItem = {
                        _id : item._id,
                        creater: item.creater,
                        target : item.target,
                        mapLoc : item.mapLoc,
                        status : item.status,
                        specialInfo: item.specialInfo,
                        createTime: new Date( parseInt( item._id.toString().substring(0,8), 16 ) * 1000).toISOString()
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
                            logo = $scope.$parent.imagePath + "normal/" + item.target.specialPic;
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
            error($scope.$parent.ppError).
            finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
                //$scope.$apply();
            });
    };



    $scope.createMeet = function(){
        $http.get($scope.$parent.serverRoot + "existInfo?username=" + $scope.$parent.user.username).
            success(function(data, status, headers, config) {
                if (data.result == 'yes')
                {
                    $scope.$parent.searchMode = '发起';
                    $scope.$parent.meetCondition = {
                        meetId: null,
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
                else
                {
                    $scope.$parent.showPopup('请先完善特征信息!');
                    $scope.enterInfo();
                }
            }).
            error($scope.$parent.ppError);
    }

    $scope.enterInfo = function(){
        $http.get($scope.$parent.serverRoot + "getInfo?username=" + $scope.$parent.user.username).
            success(function(data, status, headers, config) {
                $scope.$parent.myInfo = data.result;
                if ($scope.$parent.myInfo.specialPic)
                {
                    $scope.$parent.myInfo.specialPicDisplay = $scope.$parent.serverRoot + "images/normal/" + $scope.$parent.myInfo.specialPic;
                }

                $state.go('tab.meet.info');
            }).
            error($scope.$parent.ppError);
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

    $scope.clickMeet = function(meet){
        if (meet.status=='待确认')
        {
            ppCopyObj(meet, $scope.$parent.meetCondition);
            $scope.$parent.meetCondition.meetId = meet._id;
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
                $scope.$parent.curMeet = meet;
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
        error($scope.$parent.ppError);

    $scope.clickChat = function(friendUsername){
        $scope.$parent.curChatFriendUsername = friendUsername;
        $state.go('tab.contact.chat');
    }

    $scope.doRefresh = function() {
        $http.get($scope.$parent.serverRoot + "getFriends?username=" + $scope.$parent.user.username).
            success(function(data, status, headers, config) {
                $scope.$parent.friends = data.result;
            }).
            error($scope.$parent.ppError)
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete')
            });
    };

});

app.controller('meetInfoCtrl', function($scope, $state, $ionicModal, $cordovaCamera, $http, $cordovaFile) {
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
            $scope.$parent.showPopup('请填写完整!');
            return;
        }
        $http.post(
                $scope.$parent.serverRoot + 'updateInfo',
            {
                username: $scope.$parent.user.username,
                myInfo: $scope.$parent.myInfo,
                latestLocation: window.localStorage['latestLocation'] ? JSON.parse(window.localStorage['latestLocation']) : null
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $state.go('tab.meet');
            }).
            error($scope.$parent.ppError);
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
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 200,
                targetHeight: 200,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true
            };

            $cordovaCamera.getPicture(options).then(function(fileURL) {
                $scope.$parent.myInfo.specialPicDisplay = fileURL;

                var options = {
                    fileKey: "avatar",
                    fileName: "image.png",
                    chunkedMode: false,
                    mimeType: "image/png"
                };

                $cordovaFile.uploadFile($scope.$parent.serverRoot + 'uploadSpecialPic', fileURL, options).then(function(result) {
                    $scope.$parent.myInfo.specialPic = (JSON.parse(result.response))["result"];
                    //$scope.showPopup("SUCCESS: " + result.response);
                }, function(err) {
                    $scope.showPopup("ERROR: " + JSON.stringify(err));
                }, function (progress) {
                    // constant progress updates
                });
            }, function(err) {
                // error
                $scope.showPopup(err);
            });
        }
        catch (err) {
            $scope.showPopup(err);
            $scope.$parent.myInfo.specialPic = 'a.jpg';
//            var options = {
//                fileKey: "avatar",
//                fileName: "image.png",
//                chunkedMode: false,
//                mimeType: "image/png"
//            };
//            $cordovaFile.uploadFile($scope.$parent.serverRoot + 'uploadSpecialPic', "/Users/pennsong/Desktop/a.jpg", options).then(function(result) {
//                $scope.$parent.myInfo.specialPic = (JSON.parse(result.response))["result"];
//                $scope.showPopup("SUCCESS: " + result.response);
//            }, function(err) {
//                console.log("ERROR: " + JSON.stringify(err));
//            }, function (progress) {
//                // constant progress updates
//            });
        }
    }
});

app.controller('profileCtrl', function($scope, $state, $ionicHistory, $http, $timeout, $ionicLoading) {

    $scope.getCurMapPosition = function()
    {
        console.log($scope.$parent.latestLocation);
        $http.get("http://api.map.baidu.com/geoconv/v1/?ak=MgBALVVeCd8THVBi6gPdvsvG&coords=" + $scope.$parent.latestLocation.lng + "," + $scope.$parent.latestLocation.lat).
            success(function(data, status, headers, config) {
                //转换为百度坐标
                $scope.bLng = data.result[0].x;
                $scope.bLat = data.result[0].y;
                var tmpDateTime = new Date();
                $scope.mapUpdateTime = tmpDateTime.toLocaleDateString() + " " + tmpDateTime.toLocaleTimeString();

            }).
            error($scope.$parent.ppError);
    }

    $scope.mapLocs = [];

    $scope.logout = function(){
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: true
        });

        $ionicLoading.show({
            template: '退出中...'
        });

        $state.go('login');
        $timeout(function() {
            window.location.reload();
            $ionicLoading.hide();
        }, 300);

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

        $scope.$parent.latestLocation.lng = position.coords.longitude;
        $scope.$parent.latestLocation.lat = position.coords.latitude;

//        $scope.$parent.latestLocation = {
//            lng: position.coords.longitude,
//            lat: position.coords.latitude
//        }
        window.localStorage['latestLocation'] = JSON.stringify($scope.$parent.latestLocation);
        $http.put(
                $scope.$parent.serverRoot + 'updateLocation',
            {
                username: $scope.$parent.user.username,
                latestLocation: $scope.$parent.latestLocation
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                console.log('update location succeed');
            });
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
