#!/usr/bin/env python
# encoding: utf-8

import xmltodict
import requests
import json
import logging
import sys

logging.basicConfig(level=logging.INFO,
    format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
    datefmt='%a, %d %b %Y %H:%M:%S',
    filename='/tmp/zabbix/send_dashboard.log',
    filemode='a'
)

url = "http://10.58.81.152:3000/zabbix/metric"

def get_data(filename):
    with open(filename) as fd:
        doc = xmltodict.parse(fd.read())
        fd.close()
    data = {
        "landscape": "cn",
        "host_name": doc["message"]["host"]["name"],
        "host_conn": doc["message"]["host"]["conn"],
        "trigger_name": doc["message"]["trigger"]["name"],
        "trigger_severity": doc["message"]["trigger"]["severity"],
        "trigger_status": doc["message"]["trigger"]["status"],
        "event_id": doc["message"]["event"]["id"],
        "event_time": doc["message"]["event"]["date"] + " " + doc["message"]["event"]["time"]
    }
    return data

def send_data(data):
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    r = requests.post(url, json=data, headers=headers)
    if r.status_code == 200:
        logging.info("the trigger {0} send success".format(data.trigger_name))
    else:
        logging.info("the trigger {0} send failed".format(data.trigger_name))

if __name__ == "__main__":
    trigger_filename = sys.argv[-1]
    try:
        metric = get_data(trigger_filename)
        send_data(metric)
    except:
        logging.error("{0} some error happend".format(trigger_filename))
