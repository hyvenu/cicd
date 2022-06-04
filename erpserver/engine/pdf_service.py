import os
from platform import python_version

# from pyreportjasper import PyReportJasper
from django.conf import settings
import requests
from requests.auth import HTTPBasicAuth


def get_pdf(report_name, file_name, parameters):
    # input_file = os.path.dirname(os.path.abspath(__file__)) + '/reports/rpt_files/'+file_name
    output = settings.BASE_DIR + str("/static/") + str('/reports/output_files/')+file_name #os.path.dirname(os.path.abspath(__file__)) + '/reports/output_files/' + file_name
    # con = {
    #     'driver': 'mysql',
    #     'username': 'root',
    #     'password': 'root',
    #     'host': 'localhost',
    #     'database': 'erp_db',
    #     'port': '3306'
    # }
    # jasper = PyReportJasper()
    # jasper.config(
    #     input_file,
    #     output,
    #     db_connection=con,
    #     output_formats=["pdf"],
    #     parameters=parameters,
    #     locale='en_US'
    # )
    # jasper.process_report()
    path = settings.JASPER_REPORT_SERVICE + report_name + parameters
    res = requests.get(path,
                       auth=HTTPBasicAuth(settings.JASPER_USER_NAME, settings.JASPER_PASSWORD))

    if res.status_code == 200:
        open(output, 'wb').write(res.content)

    return output
