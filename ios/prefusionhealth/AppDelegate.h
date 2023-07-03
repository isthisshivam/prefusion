// firebase @d9n6
#import <UserNotifications/UNUserNotificationCenter.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
//add UNUserNotificationCenterDelegate in line number 6 for push notification
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate,UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
