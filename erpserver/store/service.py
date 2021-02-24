from store.models import StoreUser, Store, SiteSettings


class StoreService:

    def get_store_by_user(self, user_id):
        store_list = list(StoreUser.objects.filter(user_id=user_id).values('store__store_name','store_id'))
        return store_list

    def get_store_by_name(self, store_name):
        store = Store.objects.filter(store_name=store_name).values(
            'id',
            'store_name',
        )
        return store

    def get_Site_Settings(self, setting_type):
        settings = SiteSettings.objects.filter(setting_Type=setting_type).values(
            'id',
            'setting_Type',
            'setting_Value'
        )
        return list(settings.values())

