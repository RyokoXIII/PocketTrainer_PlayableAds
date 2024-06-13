"use strict";
window._custom = function () {
    function _importMap() {
        var script = document.createElement('script');
        script.type = "systemjs-importmap";
        script.text = getRes("src/import-map.json");
        document.body.appendChild(script);
    }
    _importMap();
    function getResPath(key, target, log) {
        for (var k in target) {
            if (k == key) {
                return k;
            }
            const index = key.indexOf(k);
            if (index != -1 && index + k.length == key.length) {
                return k;
            }
        }
        return null;
    }
    function getRes(key) {
        return window.__res[getResPath(key, window.__res)];
    }
    function getScript(key) {
        if (key.indexOf("bullet.wasm") != -1) {
            for (var k2 in window.__js) {
                if (k2.indexOf("bullet.cocos") != -1) {
                    key = k2;
                    break;
                }
            }
        }
        let _key = getResPath(key, window.__js);
        var res = window.__js[_key];
        if (res) {
            delete window.__js[_key];
        }
        return res;
    }
    function _initScript() {
        window["_createLocalJSElement"] = function _XMLLocalRequest() {
            let node = document.createElement("_my");
            node.src = "";
            node.addEventListener = function (type, func) {
                //type : load error
                this[type] = func;
                if (type == "load") {
                    setTimeout(() => {
                        console.log("load _script:", node.src);
                        let res = getScript(node.src);
                        if (!res) {
                            console.log("no find", node.src);
                            return;
                        }
                        _eval(res);
                        setTimeout(() => {
                            if (window.cc) {
                                _custom_cc();
                            }
                            func();
                        });
                    });
                }
            };
            return node;
        };
    }
    function _custom_cc() {
        if (window.xxxx__) {
            return;
        }
        window.xxxx__ = true;
        function base64ToBlob(base64, fileType) {
            let audioSrc = base64;
            let arr = audioSrc.split(',');
            let array = arr[0].match(/:(.*?);/);
            let mime = (array && array.length > 1 ? array[1] : type) || type;
            let bytes = window.atob(arr[1]);
            let ab = new ArrayBuffer(bytes.length);
            let ia = new Uint8Array(ab);
            for (let i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            return new Blob([ab], {
                type: mime
            });
        }
        if (cc.internal.VideoPlayerImplManager) {
            function downloadVideo(url, options, onComplete) {
                var video = document.createElement('video');
                var source = document.createElement('source');
                video.appendChild(source);
                onComplete(null, video);
            }
            cc.assetManager.downloader.register({
                '.mp4': downloadVideo,
                '.avi': downloadVideo,
                '.mov': downloadVideo,
                '.mpg': downloadVideo,
                '.mpeg': downloadVideo,
                '.rm': downloadVideo,
                '.rmvb': downloadVideo
            });
            const getImpl = cc.internal.VideoPlayerImplManager.getImpl;
            cc.internal.VideoPlayerImplManager.getImpl = function (comp) {
                const impl = getImpl.call(this, comp);
                const createVideoPlayer = impl.createVideoPlayer;
                impl.createVideoPlayer = function (url) {
                    var res = getRes(url);
                    if (res) {
                        res = base64ToBlob(res);
                        res = URL.createObjectURL(res);
                        return createVideoPlayer.call(this, res);
                    }
                    return createVideoPlayer.call(this, url);
                };
                return impl;
            };
        }
        function _initFont() {
            function loadFont(url, options, onComplete) {
                var fontFamilyName = url.replace(/[.\/ "'\\]*/g, "");
                var data = getRes(url);
                if (data == null) {
                    onComplete();
                    return;
                }
                ;
                var fontFace = new FontFace(fontFamilyName, `url(${data})`);
                document.fonts.add(fontFace);
                fontFace.load();
                fontFace.loaded.then(function () {
                    onComplete(null, fontFamilyName);
                }, function () {
                    console.error(`url${url}load fail`);
                    onComplete(null, fontFamilyName);
                });
            }
            ;
            cc.assetManager.downloader.register({
                '.font': loadFont,
                '.eot': loadFont,
                '.ttf': loadFont,
                '.woff': loadFont,
                '.svg': loadFont,
                '.ttc': loadFont,
            });
        }
        _initFont();
        function _initImage() {
            function downloadImage(url, options, onComplete) {
                var img = new Image();
                function loadCallback() {
                    img.removeEventListener('load', loadCallback);
                    img.removeEventListener('error', errorCallback);
                    if (onComplete) {
                        onComplete(null, img);
                    }
                }
                function errorCallback() {
                    img.removeEventListener('load', loadCallback);
                    img.removeEventListener('error', errorCallback);
                    if (onComplete) {
                        onComplete(new Error(getError(4930, url)));
                    }
                }
                img.addEventListener('load', loadCallback);
                img.addEventListener('error', errorCallback);
                img.src = getRes(url);
                return img;
            }
            // function downloadImage(url, options, onComplete) {
            //     var func = sys.hasFeature(sys.Feature.IMAGE_BITMAP) && legacyCC.assetManager.allowImageBitmap ? downloadBlob : downloadDomImage;
            //     func(url, options, onComplete);
            // };
            cc.assetManager.downloader.register({
                '.png': downloadImage,
                '.jpg': downloadImage,
                '.bmp': downloadImage,
                '.jpeg': downloadImage,
                '.gif': downloadImage,
                '.ico': downloadImage,
                '.tiff': downloadImage,
                '.webp': downloadImage,
                '.image': downloadImage,
            });
        }
        _initImage();
    }
    _initScript();
    function base64toArrayBuffer(base64) {
        // 将base64转为Unicode规则编码
        var bstr = atob(base64.substring(base64.indexOf(',') + 1)), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n); // 转换编码后才可以使用charCodeAt 找到Unicode编码
        }
        ;
        return u8arr.buffer;
    }
    function _initXMLHttp() {
        window["_XMLLocalRequest"] = function _XMLLocalRequest() {
            this.open = function (method, url, async, password) {
                this.url = url;
                this.status = 200;
            };
            this.overrideMimeType = function () {
            };
            this.setRequestHeader = function () {
            };
            this.send = function () {
                const res = getRes(this.url);
                let _response = null;
                switch (this.responseType) {
                    case "json":
                        _response = JSON.parse(res);
                        break;
                    case "text":
                        _response = res;
                        break;
                    case "arraybuffer":
                        _response = base64toArrayBuffer(res);
                        break;
                    default:
                        console.err("type error", url, this.responseType);
                        break;
                }
                this.response = _response;
                setTimeout(() => {
                    this.onload();
                });
            };
        };
    }
    _initXMLHttp();
    function _eval(res) {
        eval(res);
    }
    _eval(getScript("src/polyfills.bundle.js"));
    _eval(getScript("src/system.bundle.js"));
    System.import("./index.js").catch(function (err) {
        console.error(err);
    });
};
