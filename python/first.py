import nodeWrapper

def main():
  lines = nodeWrapper.read_input()
  output = sum(lines)
  nodeWrapper.send_output_as_text(output)
  return

if __name__ == '__main__':
  main()