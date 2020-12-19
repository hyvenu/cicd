from store.models import Store


class EcomService:

    def get_product_list(self,search_product_name,search_product_category):

        pass


    def get_locations(self):
        location_list = list(Store.objects.all().values('city_name','pin_code'))
        return location_list


