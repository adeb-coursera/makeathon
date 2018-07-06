import json
import pprint
import codecs
import csv
import sys
reload(sys)
sys.setdefaultencoding('utf8')

pp = pprint.PrettyPrinter(indent=4)

def main():
	unique_deptt = dict()

	with open('employees.json') as f:
		data = json.load(f)

	for item in data:
		if not unique_deptt.has_key(data[item][1]):
			unique_deptt[data[item][1]] = None

	deptts = unique_deptt.keys()
	pp.pprint(deptts)

	print(len(deptts))

main()