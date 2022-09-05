from django.db import transaction
import pandas as pd

from django.http import HttpResponse, JsonResponse
from .models import ReportEngineModel

# once i can import method from helper/db_service.py then uncomment below line
# from helper import db_service
from django.db import connection


class ReportServices:
    @classmethod
    def get_report(cls, data_id, from_dt, to_dt):
        init_df = list(ReportEngineModel.objects.filter(id=data_id).all().values(
            "id",
            "report_name",
            "sql_query",
            "is_active",
            "report_main_header",
            "report_sub_header",
            "numerical_columns",
        ))
        # sql_ary contains query to be executed.
        sql_qry1 = (init_df[0])['sql_query']
        # print("sql qry1", sql_qry1)
        if (from_dt == "NULL"):
            from_date = '"1900-01-01"'
        else:
            from_date = '"' + from_dt + '"'

        if(to_dt == "NULL"):
            to_date = '"2100-01-01"'
        else:
            to_date = '"' + to_dt + '"'
            
        # Below line applies value of from_date & to_date into string sql_qry.
        sql_qry = sql_qry1.format(from_date, to_date)
        print(sql_qry)
        # sql_qry = sql_qry1

        # The below line not possible as read_sql is only connectible with sqlite , sqlalchemy , not mysql.
        # init_df = pd.read_sql(sql_qry, connection)
        df = {}
        df['report_name'] = init_df[0]['report_name']
        df['report_main_header'] = init_df[0]['report_main_header']
        df['report_sub_header'] = init_df[0]['report_sub_header']
        str_numCols = str(init_df[0]['numerical_columns'])

        # If any character present then replace it with ' 'space.
        for chars in ',./?\&+':
            str_numCols = str_numCols.replace(chars, ' ')
        # Spliting words based on spaces.
        list_numCols = str_numCols.split()

        # print(list_numCols)
        df['numerical_columns'] = list_numCols
        if init_df[0]['is_active'] == True:
            df['sql_output'] = custom_sql(sql_qry)
        else:
            df['sql_output'] = 'Report is Not Active'

        return JsonResponse(df, safe=False)
        # must use sql query available in table , after which must be converted to Dataframes.
        # inter_df = pd.DataFrame(init_df)
        # if data_rep_type=='json':
        #     df = init_df
        #     return JsonResponse(df,safe=False)
        # if data_rep_type=='html':
        #     df = inter_df.to_html(header=False)
        #     print(df)
        #     return HttpResponse(df)
        # if data_rep_type=='csv':
        #     df = inter_df.to_csv()
        #     print(df)
        #     return HttpResponse(df)
    # @classmethod
    # def get_report_data(cls,id):
    #     report_data = ReportEngineModel.objects.get(id=id)
    #     return report_data


def custom_sql(query):
        cursor = connection.cursor()
        print(query)
        cursor.execute(query)
        final_list = {}
        columns = [col[0] for col in cursor.description]
        for col in columns:
            final_list[col] = []
        for row in cursor.fetchall():
            for i in range(len(row)):
                final_list[columns[i]].append(row[i])
        return final_list
