
import { _decorator, Component, Enum, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
declare var ExitApi;
declare var mraid;
declare var dapi;
declare var window;
declare var FbPlayableAd;

enum AdNetworks {
    GoogleAds,
    ironSource,
    UnityAds,
    AppLovin,
    Mintegral,
    FbAds
}

@ccclass('CTA')
export class CTA extends Component {

    @property({
        type: Enum(AdNetworks)    // call Enum
    })
    myNetwork: AdNetworks = AdNetworks.UnityAds;


    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);

        window.gameEnd && window.gameEnd();
    }

    onTouchStart() {
        // window.gameEnd && window.gameEnd();

        if (sys.os == sys.OS.ANDROID || sys.os == sys.OS.WINDOWS) {
            switch (this.myNetwork) {
                case AdNetworks.AppLovin:
                case AdNetworks.UnityAds:
                    mraid.open('https://play.google.com/store/apps/details?id=com.amb.monster.runner.building.trainer&hl=en-VN');
                    console.log('AppLovin & UnityAds');
                    break;
                case AdNetworks.GoogleAds:
                    ExitApi.exit('https://play.google.com/store/apps/details?id=com.amb.monster.runner.building.trainer&hl=en-VN');
                    console.log('GoogleAds');
                    break;
                case AdNetworks.Mintegral:
                    window.install && window.install('https://play.google.com/store/apps/details?id=com.amb.monster.runner.building.trainer&hl=en-VN');
                    console.log('Mintegral');
                    break;
                case AdNetworks.ironSource:
                    dapi.openStoreUrl('https://play.google.com/store/apps/details?id=com.amb.monster.runner.building.trainer&hl=en-VN');
                    console.log('ironSource');
                    break;
                case AdNetworks.FbAds:
                    FbPlayableAd.onCTAClick('https://play.google.com/store/apps/details?id=com.amb.monster.runner.building.trainer&hl=en-VN');
                    console.log('FacebookAds');
                    break;
                default:
                    mraid.open('https://play.google.com/store/apps/details?id=com.amb.monster.runner.building.trainer&hl=en-VN');
                    console.log('AppLovin & UnityAds');
                    break;
            }
        }
        else if (sys.os == sys.OS.IOS) {
            switch (this.myNetwork) {
                case AdNetworks.AppLovin:
                case AdNetworks.UnityAds:
                    mraid.open('https://apps.apple.com/us/app/monster-pocket-run-building/id1670523517');
                    console.log('AppLovin & UnityAds');
                    break;
                case AdNetworks.GoogleAds:
                    ExitApi.exit('https://apps.apple.com/us/app/monster-pocket-run-building/id1670523517');
                    console.log('GoogleAds');
                    break;
                case AdNetworks.Mintegral:
                    window.install && window.install('https://apps.apple.com/us/app/monster-pocket-run-building/id1670523517');
                    console.log('Mintegral');
                    break;
                case AdNetworks.ironSource:
                    dapi.openStoreUrl('https://apps.apple.com/us/app/monster-pocket-run-building/id1670523517');
                    console.log('ironSource');
                    break;
                case AdNetworks.FbAds:
                    FbPlayableAd.onCTAClick('https://apps.apple.com/us/app/monster-pocket-run-building/id1670523517');
                    console.log('FacebookAds');
                    break;
                default:
                    mraid.open('https://apps.apple.com/us/app/monster-pocket-run-building/id1670523517');
                    console.log('AppLovin & UnityAds');
                    break;
            }
        }
    }
}
