import sys, json

def read_input():
  lines = sys.stdin.readlines()
  output = ""
  for line in lines:
    output += line
  return json.loads(output)


def send_output_as_json(obj):
  sys.stdout.write(json.dumps(obj))
  sys.stdout.flush()
  return


def send_output_as_text(data):
  sys.stdout.write(data)
  sys.stdout.flush()
  return
