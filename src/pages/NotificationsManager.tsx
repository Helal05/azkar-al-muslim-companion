
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Bell, ChevronLeft, Check, Settings, Volume, X, ChevronRight, Clock, Plus, Minus
} from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  NotificationType, 
  SoundOption, 
  TimeOption, 
  availableSounds,
  morningAzkarTimeOptions,
  duhaPrayerTimeOptions,
  lastThirdTimeOptions,
  testNotification,
  formatTimeOption,
  calculateLastThirdOfNight,
} from "../data/notificationData";

// Interface for notification settings
interface NotificationSettings {
  enabled: boolean;
  timeOptionId: string;
  soundId: string;
  iqamaEnabled?: boolean;
  iqamaMinutes?: number;
  additionalReminder?: boolean;
  additionalReminderMinutes?: number;
}

const NotificationsManager = () => {
  const navigate = useNavigate();
  const { notificationType } = useParams<{ notificationType: string }>();
  const { settings, updateNotificationSettings } = useAppSettings();
  const { t } = useTranslation(settings.language);
  const { toast } = useToast();
  
  // Determine page title and notification type
  const getPageInfo = () => {
    switch (notificationType) {
      case 'fajr':
        return {
          title: settings.language === 'ar' ? 'صلاة الفجر' : 'Fajr Prayer',
          type: NotificationType.PRAYER,
          relatedTo: 'Fajr'
        };
      case 'sunrise':
        return {
          title: settings.language === 'ar' ? 'الشروق' : 'Sunrise',
          type: NotificationType.PRAYER,
          relatedTo: 'Sunrise'
        };
      case 'dhuhr':
        return {
          title: settings.language === 'ar' ? 'صلاة الظهر' : 'Dhuhr Prayer',
          type: NotificationType.PRAYER,
          relatedTo: 'Dhuhr'
        };
      case 'asr':
        return {
          title: settings.language === 'ar' ? 'صلاة العصر' : 'Asr Prayer',
          type: NotificationType.PRAYER,
          relatedTo: 'Asr'
        };
      case 'maghrib':
        return {
          title: settings.language === 'ar' ? 'صلاة المغرب' : 'Maghrib Prayer',
          type: NotificationType.PRAYER,
          relatedTo: 'Maghrib'
        };
      case 'isha':
        return {
          title: settings.language === 'ar' ? 'صلاة العشاء' : 'Isha Prayer',
          type: NotificationType.PRAYER,
          relatedTo: 'Isha'
        };
      case 'last-third':
        return {
          title: settings.language === 'ar' ? 'الثلث الأخير' : 'Last Third of Night',
          type: NotificationType.TAHAJJUD,
        };
      case 'morning-azkar':
        return {
          title: settings.language === 'ar' ? 'أذكار الصباح' : 'Morning Azkar',
          type: NotificationType.AZKAR_MORNING,
        };
      case 'evening-azkar':
        return {
          title: settings.language === 'ar' ? 'أذكار المساء' : 'Evening Azkar',
          type: NotificationType.AZKAR_EVENING,
        };
      case 'duha-prayer':
        return {
          title: settings.language === 'ar' ? 'صلاة الضحى' : 'Duha Prayer',
          type: NotificationType.DUHA_PRAYER,
        };
      case 'friday-sunnah':
        return {
          title: settings.language === 'ar' ? 'سنن يوم الجمعة' : 'Friday Sunnah',
          type: NotificationType.FRIDAY_SUNNAH,
        };
      case 'white-days-fasting':
        return {
          title: settings.language === 'ar' ? 'تذكير صيام الأيام البيض' : 'White Days Fasting Reminder',
          type: NotificationType.WHITE_DAYS_FASTING,
        };
      default:
        return {
          title: settings.language === 'ar' ? 'التنبيهات' : 'Notifications',
          type: NotificationType.PRAYER,
        };
    }
  };
  
  const pageInfo = getPageInfo();
  
  // Notification states
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    timeOptionId: "",
    soundId: "default",
    iqamaEnabled: false,
    iqamaMinutes: 10,
    additionalReminder: false,
    additionalReminderMinutes: 15
  });
  
  const [soundOptionsVisible, setSoundOptionsVisible] = useState(false);
  const [timeOptionsVisible, setTimeOptionsVisible] = useState(false);
  
  // Time options based on notification type
  const getTimeOptions = (): TimeOption[] => {
    switch (pageInfo.type) {
      case NotificationType.AZKAR_MORNING:
        return morningAzkarTimeOptions;
      case NotificationType.DUHA_PRAYER:
        return duhaPrayerTimeOptions;
      case NotificationType.TAHAJJUD:
        return lastThirdTimeOptions;
      default:
        return [];
    }
  };
  
  // On initial load, load notification settings from context
  useEffect(() => {
    // Load settings from context or localStorage based on notification type
    const loadedSettings = {
      enabled: true,
      timeOptionId: getTimeOptions().length > 0 ? getTimeOptions()[0].id : "",
      soundId: "default",
      iqamaEnabled: false,
      iqamaMinutes: 10,
      additionalReminder: false,
      additionalReminderMinutes: 15
    };
    
    setNotificationSettings(loadedSettings);
  }, [notificationType]);
  
  // Save notification settings
  const saveNotificationSettings = () => {
    // In a real app, you would save to context or localStorage
    updateNotificationSettings({ 
      enabled: notificationSettings.enabled,
      prayerReminders: notificationSettings.enabled,
      adhanSound: notificationSettings.soundId !== "no-sound" 
    });
    
    toast({
      title: settings.language === "ar" 
        ? "تم حفظ الإعدادات" 
        : "Settings Saved",
      description: settings.language === "ar"
        ? "تم تحديث إعدادات التنبيه بنجاح"
        : "Notification settings updated successfully"
    });
    
    navigate(-1);
  };
  
  // Handle sound selection
  const selectSound = (soundId: string) => {
    setNotificationSettings({
      ...notificationSettings,
      soundId
    });
    setSoundOptionsVisible(false);
  };
  
  // Handle time option selection
  const selectTimeOption = (optionId: string) => {
    setNotificationSettings({
      ...notificationSettings,
      timeOptionId: optionId
    });
    setTimeOptionsVisible(false);
  };
  
  // Handle notification toggle
  const toggleNotification = (enabled: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      enabled
    });
    
    if (enabled && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };
  
  // Handle Iqama toggle
  const toggleIqama = (enabled: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      iqamaEnabled: enabled
    });
  };
  
  // Handle additional reminder toggle
  const toggleAdditionalReminder = (enabled: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      additionalReminder: enabled
    });
  };
  
  // Update Iqama minutes
  const updateIqamaMinutes = (increase: boolean) => {
    let newValue = notificationSettings.iqamaMinutes || 10;
    if (increase) {
      newValue = Math.min(30, newValue + 1);
    } else {
      newValue = Math.max(1, newValue - 1);
    }
    
    setNotificationSettings({
      ...notificationSettings,
      iqamaMinutes: newValue
    });
  };
  
  // Update additional reminder minutes
  const updateAdditionalMinutes = (increase: boolean) => {
    let newValue = notificationSettings.additionalReminderMinutes || 15;
    if (increase) {
      newValue = Math.min(60, newValue + 5);
    } else {
      newValue = Math.max(5, newValue - 5);
    }
    
    setNotificationSettings({
      ...notificationSettings,
      additionalReminderMinutes: newValue
    });
  };
  
  // Test notification
  const handleTestNotification = async () => {
    const title = settings.language === "ar" ? "تنبيه تجريبي" : "Test Notification";
    const body = settings.language === "ar" 
      ? `هذا تنبيه تجريبي لـ ${pageInfo.title}`
      : `This is a test notification for ${pageInfo.title}`;
      
    const success = await testNotification(title, body, notificationSettings.soundId);
    
    if (!success) {
      toast({
        title: settings.language === "ar" ? "خطأ" : "Error",
        description: settings.language === "ar" 
          ? "لم نتمكن من تشغيل التنبيه. يرجى التحقق من إعدادات التنبيهات في متصفحك"
          : "Could not play notification. Please check your browser notification settings",
        variant: "destructive"
      });
    }
  };
  
  // Get selected sound name
  const getSelectedSoundName = () => {
    const sound = availableSounds.find(s => s.id === notificationSettings.soundId);
    return sound ? (settings.language === 'ar' ? sound.name.ar : sound.name.en) : '';
  };
  
  // Get selected time option name
  const getSelectedTimeOptionName = () => {
    const option = getTimeOptions().find(o => o.id === notificationSettings.timeOptionId);
    if (!option) return '';
    
    return settings.language === 'ar' ? option.title.ar : option.title.en;
  };
  
  // Get selected time option formatted time
  const getSelectedTimeFormatted = () => {
    const option = getTimeOptions().find(o => o.id === notificationSettings.timeOptionId);
    if (!option) return '';
    
    return formatTimeOption(option, settings.location.latitude, settings.location.longitude, settings.language);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold">{pageInfo.title}</h2>
        <div className="w-5"></div>
      </div>
      
      <div className="p-4">
        {/* Main Switch */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-arabic">{pageInfo.title}</span>
              <span className="text-sm text-gray-400 font-arabic">
                {settings.language === 'ar' ? 'تفعيل/إيقاف التنبيه' : 'Enable/Disable notification'}
              </span>
            </div>
            <Switch 
              checked={notificationSettings.enabled}
              onCheckedChange={toggleNotification}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </div>
        
        {notificationSettings.enabled && (
          <>
            {/* Time Selection - For azkar, duha prayer, last third */}
            {getTimeOptions().length > 0 && (
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                <div className="mb-2">
                  <span className="text-lg font-arabic">
                    {settings.language === 'ar' ? 'اختر وقت التنبيه' : 'Choose notification time'}
                  </span>
                </div>
                
                {/* Selected Time Option */}
                <div 
                  className="bg-slate-700/70 rounded-lg p-3 flex items-center justify-between"
                  onClick={() => setTimeOptionsVisible(true)}
                >
                  <div className="font-arabic">
                    <div>{getSelectedTimeOptionName()}</div>
                    <div className="text-sm text-gray-400">
                      {getSelectedTimeFormatted()}
                    </div>
                  </div>
                  {getTimeOptions().length > 0 && (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                {/* Time Options */}
                {timeOptionsVisible && (
                  <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
                    <div className="bg-slate-800 p-4 flex items-center justify-between shadow-md">
                      <button onClick={() => setTimeOptionsVisible(false)} className="p-2">
                        <X className="w-5 h-5 text-gray-300" />
                      </button>
                      <h3 className="text-lg font-arabic">
                        {settings.language === 'ar' ? 'اختر وقت التنبيه' : 'Choose notification time'}
                      </h3>
                      <div className="w-5"></div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4">
                      {getTimeOptions().map(option => (
                        <div 
                          key={option.id}
                          className={`mb-2 p-4 rounded-lg flex items-center justify-between ${
                            option.id === notificationSettings.timeOptionId 
                              ? 'bg-green-800/40 border border-green-700/50' 
                              : 'bg-slate-700/50'
                          }`}
                          onClick={() => selectTimeOption(option.id)}
                        >
                          <div className="font-arabic">
                            <div>{settings.language === 'ar' ? option.title.ar : option.title.en}</div>
                            <div className="text-sm text-gray-400">
                              {formatTimeOption(option, settings.location.latitude, settings.location.longitude, settings.language)}
                            </div>
                          </div>
                          {option.id === notificationSettings.timeOptionId && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Sound Selection */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
              <div className="mb-2">
                <span className="text-lg font-arabic">
                  {settings.language === 'ar' ? 'اختر صوت المنبه' : 'Choose notification sound'}
                </span>
              </div>
              
              {/* Selected Sound */}
              <div 
                className="bg-slate-700/70 rounded-lg p-3 flex items-center justify-between"
                onClick={() => setSoundOptionsVisible(true)}
              >
                <div className="flex items-center">
                  <Volume className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="font-arabic">{getSelectedSoundName()}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* Sound Options */}
              {soundOptionsVisible && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
                  <div className="bg-slate-800 p-4 flex items-center justify-between shadow-md">
                    <button onClick={() => setSoundOptionsVisible(false)} className="p-2">
                      <X className="w-5 h-5 text-gray-300" />
                    </button>
                    <h3 className="text-lg font-arabic">
                      {settings.language === 'ar' ? 'اختر الصوت' : 'Choose sound'}
                    </h3>
                    <div className="w-5"></div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    {availableSounds.map(sound => (
                      <div 
                        key={sound.id}
                        className={`mb-2 p-4 rounded-lg flex items-center justify-between ${
                          sound.id === notificationSettings.soundId 
                            ? 'bg-blue-800/40 border border-blue-700/50' 
                            : 'bg-slate-700/50'
                        }`}
                        onClick={() => selectSound(sound.id)}
                      >
                        <div className="font-arabic">
                          {settings.language === 'ar' ? sound.name.ar : sound.name.en}
                        </div>
                        {sound.id === notificationSettings.soundId && (
                          <Check className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* For Prayer notifications - Iqama Option */}
            {pageInfo.type === NotificationType.PRAYER && pageInfo.relatedTo !== 'Sunrise' && (
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-arabic">
                      {settings.language === 'ar' ? 'منبه الإقامة' : 'Iqama Reminder'}
                    </span>
                    <span className="text-sm text-gray-400 font-arabic">
                      {settings.language === 'ar' ? 'ستستلم تنبيه قبل الإقامة بدقائق' : 'You will receive a reminder before Iqama'}
                    </span>
                  </div>
                  <Switch 
                    checked={notificationSettings.iqamaEnabled || false}
                    onCheckedChange={toggleIqama}
                    className="data-[state=checked]:bg-amber-600"
                  />
                </div>
                
                {notificationSettings.iqamaEnabled && (
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="mb-2 text-center">
                      <span className="text-sm text-gray-300 font-arabic">
                        {settings.language === 'ar' ? 'دقائق قبل الإقامة' : 'Minutes before Iqama'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={() => updateIqamaMinutes(false)}
                        className="bg-slate-600 rounded-lg p-2"
                        disabled={notificationSettings.iqamaMinutes === 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="px-6 text-xl font-bold">{notificationSettings.iqamaMinutes}</div>
                      <button 
                        onClick={() => updateIqamaMinutes(true)}
                        className="bg-slate-600 rounded-lg p-2"
                        disabled={notificationSettings.iqamaMinutes === 30}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Additional Reminder */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-lg font-arabic">
                    {settings.language === 'ar' ? 'تنبيه إضافي قبل الوقت' : 'Additional Reminder Before Time'}
                  </span>
                  <span className="text-sm text-gray-400 font-arabic">
                    {settings.language === 'ar' 
                      ? 'ستستلم تنبيه قبل الوقت وعند الوقت' 
                      : 'You will receive notifications before and at the time'}
                  </span>
                </div>
                <Switch 
                  checked={notificationSettings.additionalReminder || false}
                  onCheckedChange={toggleAdditionalReminder}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
              
              {notificationSettings.additionalReminder && (
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="mb-2 text-center">
                    <span className="text-sm text-gray-300 font-arabic">
                      {settings.language === 'ar' ? 'دقائق قبل الوقت' : 'Minutes before time'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <button 
                      onClick={() => updateAdditionalMinutes(false)}
                      className="bg-slate-600 rounded-lg p-2"
                      disabled={notificationSettings.additionalReminderMinutes <= 5}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="px-6 text-xl font-bold">{notificationSettings.additionalReminderMinutes}</div>
                    <button 
                      onClick={() => updateAdditionalMinutes(true)}
                      className="bg-slate-600 rounded-lg p-2"
                      disabled={notificationSettings.additionalReminderMinutes >= 60}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Last Third of Night Info */}
            {pageInfo.type === NotificationType.TAHAJJUD && (
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                <div className="mb-2">
                  <span className="text-lg font-arabic">
                    {settings.language === 'ar' ? 'الثلث الأخير (قيام الليل)' : 'Last Third (Night Prayer)'}
                  </span>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-gray-200 text-sm font-arabic leading-relaxed">
                  {settings.language === 'ar' ? (
                    <>
                      <p className="mb-4">
                        اتفق العلماء على أن كل الليل وقت للتهجد وأن أفضله الثلث الأخير لأنه وقت الغفلة ونزول الرحمة واستجابة الدعاء. ومن فضل الثلث الأخير من الليل أن الله سبحانه وتعالى أمر نبيه محمدا - صلى الله عليه وسلم - لقيام وصلاة الليل فقال: (ومن الليل فتهجد به نافلة لك عسى أن يبعثك ربك مقاما محمودا) وقال تعالى: (إن المتقين في جنات وعيون آخذين ما آتاهم ربهم إنهم كانوا قبل ذلك محسنين كانوا قليلا من الليل ما يهجعون وبالأسحار هم يستغفرون).
                      </p>
                      <p>
                        وقت السحر يبدأ في آخر الليل والثلث الأخير من الليل، وهو أن تقسم الليل من غروب الشمس إلى طلوع الفجر أثلاثاً، فتحذف ثلثين الأولين منه، وما بقي فهو الثلث، فإذا قدرنا أن ما بين غروب الشمس الى طلوع الفجر تسع ساعات، فإذا مضى ست ساعات من الليل دخل الثلث الآخر من الليل.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-4">
                        Scholars agree that the entire night is a time for tahajjud, but the best is the last third because it is a time of heedlessness, descent of mercy, and answering of supplications. Among the virtues of the last third of the night is that Allah commanded His Prophet Muhammad (PBUH) to perform night prayer saying: "And during part of the night, pray Tahajjud beyond what is incumbent on you; maybe your Lord will raise you to a position of great glory." And Allah said: "Indeed, the righteous will be among gardens and springs, accepting what their Lord has given them. Indeed, they were before that doers of good. They used to sleep but little of the night, and in the hours before dawn they would ask forgiveness."
                      </p>
                      <p>
                        The time of dawn begins at the end of the night and the last third of the night, which is to divide the night from sunset to dawn into three parts, then discard the first two-thirds of it, and what remains is the last third. If we estimate that the time between sunset and dawn is nine hours, then after six hours of the night have passed, the last third of the night begins.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Test Notification */}
            <div className="mt-6">
              <button
                onClick={handleTestNotification}
                className="w-full bg-amber-700/70 hover:bg-amber-700 transition-colors text-white font-arabic py-3 px-4 rounded-lg"
              >
                {settings.language === 'ar' ? 'جرب التنبيه' : 'Test Notification'}
              </button>
              <p className="mt-2 text-center text-sm text-gray-400 font-arabic">
                {settings.language === 'ar' 
                  ? 'سيصلك تنبيه تجريبي بعد ثوان يمكنك سماع الصوت ومشاهدة شكل التنبيه. لن تسمع المنبه إذا كان الجهاز على الصامت.'
                  : 'You will receive a test notification in a few seconds to hear the sound and see the notification style. You won\'t hear the alert if your device is on silent.'}
              </p>
            </div>
          </>
        )}
        
        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={saveNotificationSettings}
            className="w-full bg-green-700 hover:bg-green-600 transition-colors text-white font-arabic py-3 px-4 rounded-lg"
          >
            {settings.language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsManager;
