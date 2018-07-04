import csv
import json
import pprint
import codecs

'''
Important information to capture:
=> mail : (name, department, title, st, co, manager, directReports,)
'''

def main():
	mail_to_info = dict()
	mail_to_name = dict()
	name_to_mail = dict()
	pp = pprint.PrettyPrinter(indent=4)

	with codecs.open('allcoursera.csv', encoding="utf-8-sig") as csvfile:
		rowreader = csv.DictReader(csvfile)
		# first = next(rowreader)
		# print(first)
		for r in rowreader:
			print(r)
			# row = r.encode("utf-8")
			# mail_to_info[row['mail']] = (row['name'], row['department'], row['title'], row['st'], row['co'], row['manager'], row['directReports'])
			# mail_to_name[row['mail']] = row['name']
			# name_to_mail[row['name']] = row['mail']

	with open('employees.json', 'w') as file:
		json.dump(mail_to_info, file)

	pp.pprint(mail_to_info)

main()