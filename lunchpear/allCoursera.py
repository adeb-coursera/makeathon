import json
import pprint
import codecs
import csv
import sys
reload(sys)
sys.setdefaultencoding('utf8')
pp = pprint.PrettyPrinter(indent=4)


'''
Important information to capture:
=> mail : (name, department, title, st, co, manager, directReports,)
'''
def main():
	mail_to_info, mail_to_name, name_to_mail = dict(), dict(), dict()
	with codecs.open("allCoursera.csv", "r", encoding="utf-8-sig") as f:
		rowreader = csv.DictReader(f)
		for row in rowreader:
			mail_to_info[row['mail']] = (row['name'], row['department'], row['title'], row['st'], row['co'], row['manager'], row['directReports'])
			mail_to_name[row['mail']] = row['name']
			name_to_mail[row['name']] = row['mail']

	with open('employees.json', 'w') as file:
		json.dump(mail_to_info, file)

	with open('emp_mail_to_name.json', 'w') as file:
		json.dump(mail_to_name, file)

	with open('emp_name_to_mail.json', 'w') as file:
		json.dump(name_to_mail, file)

	pp.pprint(mail_to_info)

main()