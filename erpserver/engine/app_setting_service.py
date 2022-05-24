from store.models import AppSettings


class AppSettingService:

    @classmethod
    def get_app_setting_value(cls, app_key):
        app_obj = AppSettings.objects.filter(app_key=app_key).all()
        if app_obj.exists():
            return app_obj[0].app_value
        else:
            return None
