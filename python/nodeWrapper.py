import sys, json

def read_input():
  lines = sys.stdin.readlines()
  output = ""
  for line in lines:
    output += line
  return json.loads(output)


def send_output_as_json(obj):
  print(json.dumps(obj))
  return


def send_output_as_text(data):
  print(data)
  return
