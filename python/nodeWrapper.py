import sys, json

def read_input():
  lines = sys.stdin.readlines()
  return json.loads(lines[0])


def send_output_as_json(obj):
  print json.dumps(obj)
  return


def send_output_as_text(data):
  print data
  return
