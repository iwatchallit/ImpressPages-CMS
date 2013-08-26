/**
 * @package ImpressPages
 */

var Market = new function() {

    var imagesDownloaded; //true if images have been downloaded
    var imagesData; //downloaded images data
    var themesDownloaded; //true if images have been downloaded
    var themesData; //downloaded themes data

    this.processOrder = function(order) {
        $('body').trigger('ipMarketOrderStart');
        console.group('Market.processOrder()');
        console.log(order);

        if (typeof(order.images) != "undefined" && order.images.length) {
            console.log('downloadImages');
            imagesDownloaded = false;
            downloadImages(order.images);
        } else {
            imagesDownloaded = true;
        }

        if (typeof(order.themes) != "undefined" && order.themes.length) {
            themesDownloaded = false;
            downloadThemes(order.themes);
        } else {
            themesDownloaded = true;
        }

        console.groupEnd();
    };

    var checkComplete = function() {
        console.log('checkComplete ' + imagesDownloaded + ' ' + themesDownloaded);
        if (imagesDownloaded && themesDownloaded) {
            console.log('orderCompleteEvent2');
            console.log('body');
            console.log($('body'));
            $('body').trigger('ipMarketOrderComplete', [{images: imagesData, themes: themesData}]);
            console.log('body');
            console.log($('body'));

        }
    };

    var downloadImages = function(images) {

        if (images.length == 0) {
            $('body').trigger('ipMarketOrderImageDownload', {});
            imagesDownloaded = true;
            imagesData = {};
            checkComplete();
            return;
        }

        var toDownload = new Array();

        for (var i = 0; i < images.length; i++) {
            toDownload.push({
                url: images[i].downloadUrl,
                title: images[i].title
            });
        }

        $.ajax(ip.baseUrl, {
            'type': 'POST',
            'data': {'g': 'administrator', 'm': 'repository', 'a': 'addFromUrl', 'files': toDownload, 'securityToken': ip.securityToken},
            'dataType': 'json',
            'success': function (data) {
                $('body').trigger('ipMarketOrderImageDownload', data);
                imagesDownloaded = true;
                imagesData = data;
                checkComplete();
            },
            'error': function () {
                alert('Download failed.');
                $('body').trigger('ipMarketOrderImageDownload', {});
                imagesDownloaded = true;
                imagesData = {};
                checkComplete();
            }
        });

        $('#ipModuleRepositoryTabBuy .ipmLoading').removeClass('ipgHide');
    };


    var downloadThemes= function(themes) {

        if (themes.length == 0) {
            $('body').trigger('ipMarketOrderThemeDownload', {});
            themesDownloaded = true;
            themesData = {};
            checkComplete();
            return;
        }

        var toDownload = new Array();

        for (var i = 0; i < themes.length; i++) {
            toDownload.push({
                url: themes[i].downloadUrl,
                name: themes[i].name,
                signature: themes[i].signature
            });
        }

        $.ajax(ip.baseUrl, {
            'type': 'POST',
            'data': {'g': 'standard', 'm': 'design', 'ba': 'downloadThemes', 'themes': toDownload, 'securityToken': ip.securityToken, 'jsonrpc': '2.0'},
            'dataType': 'json',
            'success': function (response) {
                console.log('response:', response);
                if (!response || response.error || !response.result || !response.result.themes) {
                    alert('Unknown error. Please see logs.');
                    return;
                }

                themesDownloaded = true;
                themesData = response.result.themes;
                checkComplete();
            },
            'error': function () {
                alert('Unknown error. Please see logs.');
            }
        });
    };

};