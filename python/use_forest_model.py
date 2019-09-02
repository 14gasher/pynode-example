import pickle

import nodeWrapper
import dataLoader

def loadForest():
  with open('models/rf.pck', 'rb') as fp:
    return pickle.load(fp)

def getInput():
  data = nodeWrapper.read_input()
  return dataLoader.convert_all_to_np(data)

def main():
  rf = loadForest()
  inputs = getInput()
  nodeWrapper.send_output_as_json({
    "predictions": rf.predict(inputs).tolist(),
  })

if __name__ == "__main__":
  main()