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

app.controller('baseCtrl', function($scope, $rootScope, $state, $ionicPopup, $rootScope){
    $rootScope.online = "否";

    $rootScope.infoNeedUpdateTime = 0;

    $rootScope.user = {
        username: window.localStorage['username'] || '',
        password: ''
    }

    $rootScope.newUser = {
        username: '',
        password: '',
        sex: '',
        nickname: '',
        cid: ''
    }

    $rootScope.latestLocation = {
        lng: null,
        lat: null
    }

    $rootScope.curMeet = null;

    $rootScope.initSocket = function(){
        $rootScope.socket = io.connect($rootScope.serverRoot, {
//                    'reconnect': true,
//                    'reconnectionDelay': 1000,
//                    'reconnectionDelayMax': 5000
        });
        $rootScope.socket.on('connect', function() {
            $rootScope.online = '是';
            $rootScope.socket.emit('online', {username: window.localStorage['username']});
            console.log("con");
        });
        $rootScope.socket.on('disconnect', function() {
            $rootScope.online = '否';
            console.log("dis");
        });
        $rootScope.socket.on('infoNeedUpdate', function() {
            $rootScope.infoNeedUpdateTime++;
            $scope.$apply();
            console.log($rootScope.infoNeedUpdateTime);
        });
        $rootScope.socket.on('targetUpdated', function(data) {
            if ($rootScope.meetTargetUpdated[data.meetId])
            {
                $rootScope.meetTargetUpdated[data.meetId]++;
            }
            else
            {
                $rootScope.meetTargetUpdated[data.meetId] = 1;
            }
            console.log($rootScope.meetTargetUpdated[data.meetId]);
            $scope.$apply();
        });
    }

    $rootScope.showPopup = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: '注意',
            template: msg
        });
        alertPopup.then(function(res) {
        });
    };

    $rootScope.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.tempDirectory + name;
        return trueOrigin;
    }

    $rootScope.ppError = function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        if (status == 0)
        {
            $rootScope.showPopup('网络不给力哦!'+ "(" + status + ")");
        }
        else
        {
            $rootScope.showPopup(data.result + "(" + status + ")");
        }
    }

    $rootScope.searchMode;

    $rootScope.serverRoot = "http://192.168.1.6:3000/";
    //$rootScope.serverRoot = "http://10.0.1.5:3000/";
    $rootScope.imagePath = $rootScope.serverRoot + 'images/';
    $rootScope.sysImagePath = $rootScope.serverRoot + 'images/system/';

    $rootScope.curOptions = [];
    $rootScope.curOptionName = "";

    $rootScope.curChatFriendUsername;

    $rootScope.myLocation = {
        lng: 0,
        lat: 0
    }

    $rootScope.myInfo = {
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

    $rootScope.meetCondition = {
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

    $rootScope.meets = [];

    $rootScope.meetTargetUpdated = {};

    $rootScope.friends = [];

    $rootScope.targets = [];

    $rootScope.mapLocs = [
    ];

    $rootScope.sex = [
        "男",
        "女"
    ];

    $rootScope.hair = [
        "竖起",
        "躺下",
        "辫子/盘发",
        "短发(齐肩,不过肩)",
        "长发(过肩)",
        "戴帽子"
    ];

    $rootScope.glasses = [
        "带",
        "不带"
    ];

    $rootScope.clothesType = [
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

    $rootScope.clothesColor = [
        "红/紫/粉",
        "黄",
        "蓝/绿",
        "白",
        "黑",
        "灰",
        "无法分辨主要颜色"
    ];

    $rootScope.clothesStyle = [
        "纯色",
        "线条/格子/色块",
        "图案(抽象,卡通,画等)"
    ];
});

app.controller('loginCtrl', function($scope, $rootScope, $state, $http, $ionicPopup, $cordovaDevice) {

    $scope.goRegister = function(){
        $rootScope.newUser = {
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
            $rootScope.showPopup('用户名和密码都不能为空!');
            return;
        }
        $http.post(
                $rootScope.serverRoot + 'login',
            {
                username: user.username,
                password: user.password,
                cid: 't1'//$cordovaDevice.getUUID()
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $rootScope.user.username = data.result;
                window.localStorage['username'] = data.result;
                $state.go("tab.meet");
                $rootScope.initSocket();
            }).
            error($rootScope.ppError);
    }
});

app.controller('registerCtrl', function($scope, $rootScope, $state, $http, $ionicPopup, $cordovaDevice) {
    $scope.register = function(newUser){
        newUser.cid = 't2';//$cordovaDevice.getUUID();
        if (!(newUser.username && newUser.password && newUser.sex && newUser.nickname && newUser.cid))
        {
            $rootScope.showPopup('用户名, 密码, 性别, 昵称都不能为空!');
            return;
        }
        $http.post(
                $rootScope.serverRoot + 'register',
            {
                newUser: newUser
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $rootScope.user.username = data.result;
                window.localStorage['username'] = data.result;
                $state.go("tab.meet");
                $rootScope.initSocket();
            }).
            error($rootScope.ppError);
    }
});

app.controller('meetDetailCtrl', function($scope, $rootScope, $state) {
});

app.controller('conditionSpecialCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicHistory, $http) {
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
                $rootScope.serverRoot + 'createMeet',
            {
                creater_username: $rootScope.user.username,
                target_username: targetUsername,
                status: status,
                meetId: $rootScope.curMeet ? $rootScope.curMeet._id : null,
                mapLoc: $rootScope.meetCondition.mapLoc,
                specialInfo: $rootScope.meetCondition.specialInfo,
                personLoc: window.localStorage['latestLocation'] ? JSON.parse(window.localStorage['latestLocation']) : null
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                if(data.ppNote == '互发')
                {
                    $rootScope.friends.unshift(data.result);

                    $rootScope.showPopup('恭喜你!互发成功,已加入好友列表,赶紧行动吧!');
                }
                else{

                    var newItem = data.result;

                    var logo = null;
                    if (newItem.creater.username == $scope.user.username)
                    {
                        if (newItem.status == '待确认')
                        {
                            logo = $rootScope.sysImagePath + "tbd.jpg";
                        }
                        else
                        {
                            logo = $rootScope.imagePath + "normal/" + newItem.target.specialPic;
                        }
                    }
                    else
                    {
                        logo = $rootScope.sysImagePath + "x.jpg";
                    }

                    newItem.logo = logo;

                    var updateMeet = false;
                    for (var i = 0; i < $rootScope.meets.length; i++) {
                        if ($rootScope.meets[i]._id === newItem._id)
                        {
                            $rootScope.meets[i] = newItem;
                            updateMeet = true;
                            break;
                        }
                    }
                    if (!updateMeet)
                    {
                        $rootScope.meets.unshift(newItem);
                    }
                }
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true,
                    historyRoot: true
                });
                $state.go('tab.meet');
                $scope.modal.hide();
            }).
            error($rootScope.ppError);
    }

    $scope.yes = function(targetUsername){
        if ($rootScope.searchMode == '回复')
        {
            if (targetUsername == 'fake')
            {
                $http.put(
                        $rootScope.serverRoot + 'fakeSelect',
                    {
                        username: $rootScope.user.username
                    }
                )
                    .success(function(data, status, headers, config){
                        // this callback will be called asynchronously
                        // when the response is available
                        $http.put(
                                $rootScope.serverRoot + 'replyReduce',
                            {
                                username: $rootScope.user.username,
                                meetId: $rootScope.curMeet._id
                            }
                        )
                            .success(function(data, status, headers, config){
                                // this callback will be called asynchronously
                                // when the response is available
                                $rootScope.showPopup('请仔细选择图片!, 还剩回复次数:' + data.result);
                            }).
                            error($rootScope.ppError);
                    }).
                    error($rootScope.ppError);
            }
            else {
                if ($rootScope.curMeet.creater.username == targetUsername) {
                    $http.post(
                            $rootScope.serverRoot + 'replySuccess',
                        {
                            creater_username: targetUsername,
                            target_username: $rootScope.user.username,
                            meetId: $rootScope.curMeet._id
                        }
                    )
                        .success(function(data, status, headers, config){
                            // this callback will be called asynchronously
                            // when the response is available
                            $rootScope.friends.unshift(data.result);
                            //移除成功的meet
                            for (var i = 0; i < $rootScope.meets.length; i++) {
                                if ($rootScope.meets[i]._id === data.meetId) {
                                    $rootScope.meets.splice(i, 1);
                                    break;
                                }
                            }
                            $rootScope.showPopup('恭喜你!已加入好友列表,赶紧行动吧!');
                        }).
                        error($rootScope.ppError);

                }
                else {
                    $http.put(
                            $rootScope.serverRoot + 'replyReduce',
                        {
                            meetId: $rootScope.curMeet._id
                        }
                    )
                        .success(function(data, status, headers, config){
                            // this callback will be called asynchronously
                            // when the response is available
                            $rootScope.showPopup('没猜对哦!, 还剩回复次数:' + data.result);
                        }).
                        error($rootScope.ppError);
                }
            }
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });
            $state.go('tab.meet');
            $scope.modal.hide();

        }
        //searchMode == '新建' || '确认'
        else
        {
            if ($rootScope.searchMode == '确认')
            {
                delete $rootScope.meetTargetUpdated[$rootScope.curMeet._id];
            }
            if (targetUsername == 'fake')
            {
                $http.put(
                        $rootScope.serverRoot + 'fakeSelect',
                    {
                        username: $rootScope.user.username
                    }
                )
                    .success(function(data, status, headers, config){
                        // this callback will be called asynchronously
                        // when the response is available
                        $rootScope.showPopup('请仔细选择图片!');
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true,
                            historyRoot: true
                        });
                        $state.go('tab.meet');
                        $scope.modal.hide();
                    }).
                    error($rootScope.ppError);
            }
            else
            {
                $scope.uploadMeet('待回复');
            }
        }
    }

    $scope.no = function(){
        if ($rootScope.searchMode == '回复' || $rootScope.searchMode == '确认')
        {
            if ($rootScope.searchMode == '确认')
            {
                delete $rootScope.meetTargetUpdated[$rootScope.curMeet._id];
            }
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

app.controller('meetConditionCtrl', function($scope, $rootScope, $state, $ionicModal, $http, $ionicPopup, $timeout) {
    $scope.bLng = null;
    $scope.bLat = null;

    $scope.searchTargets = function(){
        if (!(
            $rootScope.meetCondition.specialInfo.sex
            && $rootScope.meetCondition.specialInfo.clothesColor
            && $rootScope.meetCondition.specialInfo.clothesStyle
            && $rootScope.meetCondition.specialInfo.clothesType
            && $rootScope.meetCondition.specialInfo.glasses
            && $rootScope.meetCondition.specialInfo.hair
            && $rootScope.meetCondition.mapLoc
            )){
            $rootScope.showPopup('请把条件填写完整!');
            return;
        }
        if (!($rootScope.latestLocation.lng && $rootScope.latestLocation.lat))
        {
            $rootScope.showPopup('未能获取您的当前位置,请调整位置后重试');
            return;
        }
        $http.post(
                $rootScope.serverRoot + 'searchTargets',
            {
                username: $rootScope.user.username,
                meetCondition: $rootScope.meetCondition,
                meetId: $rootScope.curMeet ? $rootScope.curMeet._id : null,
                searchMode: $rootScope.searchMode,
                sendLoc: {
                    lng: $rootScope.latestLocation.lng,
                    lat: $rootScope.latestLocation.lat
                }
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $rootScope.targets = data.result;
                $state.go('tab.meet.condition.specialPic');
            }).
            error($rootScope.ppError);
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

        $http.jsonp("http://api.map.baidu.com/place/v2/search?callback=JSON_CALLBACK&" + data).
            success(function(data, status, headers, config) {
                //查询结果
                $rootScope.curOptions = data.results;

            }).
            error($rootScope.ppError);
    }

    $scope.clickInfoItem = function(item){
        if ($rootScope.searchMode == '确认')
        {
            return;
        }
        if (item == '地点')
        {
            $rootScope.curOptions = [];
            if (!($rootScope.latestLocation.lng && $rootScope.latestLocation.lat))
            {
                $rootScope.showPopup('未能获取您的当前位置,请调整位置后重试');
                return;
            }
            $http.jsonp("http://api.map.baidu.com/geoconv/v1/?callback=JSON_CALLBACK&ak=MgBALVVeCd8THVBi6gPdvsvG&coords=" + $rootScope.latestLocation.lng + "," + $rootScope.latestLocation.lat).
                success(function(data, status, headers, config) {
                    //转换为百度坐标
                    $scope.bLng = data.result[0].x;
                    $scope.bLat = data.result[0].y;
                    $rootScope.curOptionName = item;

                    $scope.modal.show();
                }).
                error($rootScope.ppError);
            return;
        }

        switch(item) {
            case "性别":
                $rootScope.curOptions = $rootScope.sex;
                break;
            case "发型":
                $rootScope.curOptions = $rootScope.hair;
                break;
            case "眼镜":
                $rootScope.curOptions = $rootScope.glasses;
                break;
            case "衣服类型":
                $rootScope.curOptions = $rootScope.clothesType;
                break;
            case "衣服颜色":
                $rootScope.curOptions = $rootScope.clothesColor;
                break;
            case "衣服花纹":
                $rootScope.curOptions = $rootScope.clothesStyle;
                break;
            default:
        }
        $rootScope.curOptionName = item;
        $scope.modal.show();
    }

    $scope.clickItem = function(item){
        switch($rootScope.curOptionName) {
            case "地点":
                $rootScope.meetCondition.mapLoc = item;
                break;
            case "性别":
                $rootScope.meetCondition.specialInfo.sex = item;
                break;
            case "发型":
                $rootScope.meetCondition.specialInfo.hair = item;
                break;
            case "眼镜":
                $rootScope.meetCondition.specialInfo.glasses = item;
                break;
            case "衣服类型":
                $rootScope.meetCondition.specialInfo.clothesType = item;
                break;
            case "衣服颜色":
                $rootScope.meetCondition.specialInfo.clothesColor = item;
                break;
            case "衣服花纹":
                $rootScope.meetCondition.specialInfo.clothesStyle = item;
                break;
            default:

        }
        $scope.modal.hide();
    }
});

app.controller('meetCtrl', function($scope, $rootScope, $state, $ionicModal, $http) {
    $http.get($rootScope.serverRoot + "getMeets?username=" + $rootScope.user.username).
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
                if (item.creater.username == $rootScope.user.username)
                {
                    if (item.status == '待确认')
                    {
                        logo = $rootScope.sysImagePath + "tbd.jpg";
                    }
                    else
                    {
                        logo = $rootScope.imagePath + "normal/" + item.target.specialPic;
                    }
                }
                else
                {
                    logo = $rootScope.sysImagePath + "x.jpg";
                }

                newItem.logo = logo;

                return newItem;
            });
            $rootScope.meets = tmpArray;
        }).
        error($rootScope.ppError);

    $scope.doRefresh = function() {
        $http.get($rootScope.serverRoot + "getMeets?username=" + $rootScope.user.username).
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
                    if (item.creater.username == $rootScope.user.username)
                    {
                        if (item.status == '待确认')
                        {
                            logo = $rootScope.sysImagePath + "tbd.jpg";
                        }
                        else
                        {
                            logo = $rootScope.imagePath + "normal/" + item.target.specialPic;
                        }
                    }
                    else
                    {
                        logo = $rootScope.sysImagePath + "x.jpg";
                    }

                    newItem.logo = logo;

                    return newItem;
                });
                $rootScope.meets = tmpArray;
            }).
            error($rootScope.ppError).
            finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
                //$scope.$apply();
            });
    };



    $scope.createMeet = function(){
        $rootScope.curMeet = null;
        $http.get($rootScope.serverRoot + "existInfo?username=" + $rootScope.user.username).
            success(function(data, status, headers, config) {
                if (data.result == 'yes')
                {
                    $rootScope.searchMode = '发起';
                    $rootScope.meetCondition = {
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
                }
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                if (status == 0)
                {
                    $rootScope.showPopup('网络不给力哦!'+ "(" + status + ")");
                }
                else
                {
                    if (data.result == '请先完善特征信息!')
                    {
                        $scope.enterInfo();
                    }
                    else
                    {
                        $rootScope.showPopup(data.result + "(" + status + ")");
                    }
                }
            });
    }

    $scope.enterInfo = function(){
        $http.get($rootScope.serverRoot + "getInfo?username=" + $rootScope.user.username).
            success(function(data, status, headers, config) {
                $rootScope.myInfo = data.result;
                if ($rootScope.myInfo.specialPic)
                {
                    $rootScope.myInfo.specialPicDisplay = $rootScope.serverRoot + "images/normal/" + $rootScope.myInfo.specialPic;
                }

                $state.go('tab.meet.info');
            }).
            error($rootScope.ppError);
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
            ppCopyObj(meet, $rootScope.meetCondition);
            $rootScope.curMeet = meet;
            $rootScope.searchMode = '确认';

            $state.go('tab.meet.condition');
        }
        else if (meet.status == '待回复')
        {
            if (meet.target.username == $rootScope.user.username)
            {
                $rootScope.searchMode = '回复';
                $rootScope.meetCondition = {
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
                $rootScope.curMeet = meet;
                $state.go('tab.meet.condition');
            }
            else if (meet.creater.username == $rootScope.user.username)
            {
                $rootScope.curMeet = meet;
                $scope.modal.show();
            }
        }
    }
});

app.controller('contactCtrl', function($scope, $rootScope, $state, $http) {
    $http.get($rootScope.serverRoot + "getFriends?username=" + $rootScope.user.username).
        success(function(data, status, headers, config) {
            $rootScope.friends = data.result;
        }).
        error($rootScope.ppError);

    $scope.clickChat = function(friendUsername){
        $rootScope.curChatFriendUsername = friendUsername;
        $state.go('tab.contact.chat');
    }

    $scope.doRefresh = function() {
        $http.get($rootScope.serverRoot + "getFriends?username=" + $rootScope.user.username).
            success(function(data, status, headers, config) {
                $rootScope.friends = data.result;
            }).
            error($rootScope.ppError)
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete')
            });
    };

});

app.controller('meetInfoCtrl', function($scope, $rootScope, $state, $ionicModal, $cordovaCamera, $http, $cordovaFile) {
    $scope.myGoBack = function() {
        if (!(
            $rootScope.myInfo.specialInfo.sex
            && $rootScope.myInfo.specialInfo.clothesColor
            && $rootScope.myInfo.specialInfo.clothesStyle
            && $rootScope.myInfo.specialInfo.clothesType
            && $rootScope.myInfo.specialInfo.glasses
            && $rootScope.myInfo.specialInfo.hair
            && $rootScope.myInfo.specialPic
            )){
            $rootScope.showPopup('请填写完整!');
            return;
        }
        $http.post(
                $rootScope.serverRoot + 'updateInfo',
            {
                username: $rootScope.user.username,
                myInfo: $rootScope.myInfo,
                latestLocation: window.localStorage['latestLocation'] ? JSON.parse(window.localStorage['latestLocation']) : null
            }
        )
            .success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $rootScope.infoNeedUpdateTime = 0;
                $state.go('tab.meet');
            }).
            error($rootScope.ppError);
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
                $rootScope.curOptions = $rootScope.hair;
                break;
            case "眼镜":
                $rootScope.curOptions = $rootScope.glasses;
                break;
            case "衣服类型":
                $rootScope.curOptions = $rootScope.clothesType;
                break;
            case "衣服颜色":
                $rootScope.curOptions = $rootScope.clothesColor;
                break;
            case "衣服花纹":
                $rootScope.curOptions = $rootScope.clothesStyle;
                break;
            default:
        }
        $rootScope.curOptionName = item;
        $scope.modal.show();
    }

    $scope.clickItem = function(item){
        switch($rootScope.curOptionName) {
            case "发型":
                $rootScope.myInfo.specialInfo.hair = item;
                break;
            case "眼镜":
                $rootScope.myInfo.specialInfo.glasses = item;
                break;
            case "衣服类型":
                $rootScope.myInfo.specialInfo.clothesType = item;
                break;
            case "衣服颜色":
                $rootScope.myInfo.specialInfo.clothesColor = item;
                break;
            case "衣服花纹":
                $rootScope.myInfo.specialInfo.clothesStyle = item;
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
                $rootScope.myInfo.specialPicDisplay = fileURL;

                var options = {
                    fileKey: "avatar",
                    fileName: "image.png",
                    chunkedMode: false,
                    mimeType: "image/png"
                };

                $cordovaFile.uploadFile($rootScope.serverRoot + 'uploadSpecialPic', fileURL, options).then(function(result) {
                    $rootScope.myInfo.specialPic = (JSON.parse(result.response))["result"];
                    //$scope.showPopup("SUCCESS: " + (JSON.parse(result.response))["result"]);
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
            $rootScope.myInfo.specialPic = 'a.jpg';
//            var options = {
//                fileKey: "avatar",
//                fileName: "image.png",
//                chunkedMode: false,
//                mimeType: "image/png"
//            };
//            $cordovaFile.uploadFile($rootScope.serverRoot + 'uploadSpecialPic', "/Users/pennsong/Desktop/a.jpg", options).then(function(result) {
//                $rootScope.myInfo.specialPic = (JSON.parse(result.response))["result"];
//                $scope.showPopup("SUCCESS: " + result.response);
//            }, function(err) {
//                console.log("ERROR: " + JSON.stringify(err));
//            }, function (progress) {
//                // constant progress updates
//            });
        }
    }
});

app.controller('profileCtrl', function($scope, $rootScope, $state, $ionicHistory, $http, $timeout, $ionicLoading) {

    $scope.getCurMapPosition = function()
    {
        //console.log($rootScope.latestLocation);
        $http.jsonp("http://api.map.baidu.com/geoconv/v1/?callback=JSON_CALLBACK&ak=MgBALVVeCd8THVBi6gPdvsvG&coords=" + $rootScope.latestLocation.lng + "," + $rootScope.latestLocation.lat).
            success(function(data, status, headers, config) {
                //转换为百度坐标
                $scope.bLng = data.result[0].x;
                $scope.bLat = data.result[0].y;
                var tmpDateTime = new Date();
                $scope.mapUpdateTime = tmpDateTime.toLocaleDateString() + " " + tmpDateTime.toLocaleTimeString();

            }).
            error($rootScope.ppError);
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

//        $rootScope.latestLocation.lng = position.coords.longitude;
//        $rootScope.latestLocation.lat = position.coords.latitude;
        console.log($rootScope.latestLocation);
        $rootScope.latestLocation = {
            lng: position.coords.longitude,
            lat: position.coords.latitude
        }
        window.localStorage['latestLocation'] = JSON.stringify($rootScope.latestLocation);
        $http.put(
                $rootScope.serverRoot + 'updateLocation',
            {
                username: $rootScope.user.username,
                latestLocation: $rootScope.latestLocation
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

app.controller('chatCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, $ionicScrollDelegate, $http) {
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

        $rootScope.friends[$rootScope.curChatFriendUsername].messages.push({
            from: $rootScope.user.username,
            text: $rootScope.curChatFriendUsername,
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
