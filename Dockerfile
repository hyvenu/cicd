FROM python:3

ENV PATH="/scripts:${PATH}"

COPY ./erpserver/Requirments.txt /Requirments.txt
COPY ./environment /environment

RUN pip install --upgrade pip
RUN pip install -r /Requirments.txt
RUN mkdir /erpserver

COPY ./scripts /scripts

RUN chmod +x /scripts/*
RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static
RUN adduser  user
RUN chown -R user:user /vol
RUN chown -R 777 /vol

USER root

CMD ["entrypoint.sh"]