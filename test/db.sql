CREATE DATABASE IF NOT EXISTS dashboard
DEFAULT CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS dashboard.landscapes (
id INT(20) AUTO_INCREMENT PRIMARY KEY,
name CHAR(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS dashboard.zabbix_alerts (
id INT(20) AUTO_INCREMENT PRIMARY KEY,
landscape_name CHAR(20) NOT NULL,
host_name CHAR(30) NOT NULL,
host_conn CHAR(30) NOT NULL,
event_id INT(20) NOT NULL,
trigger_name VARCHAR(200) NOT NULL,
trigger_severity CHAR(15) NOT NULL,
trigger_status CHAR(15) NOT NULL,
create_time TIMESTAMP NOT NULL default '1970-01-01 00:00:01',
update_time TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
FOREIGN KEY (landscape_name) REFERENCES landscapes(name)
);
