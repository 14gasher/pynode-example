from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from random import randint
import numpy as np
import cv2
import pickle
from base64 import b64decode
from sklearn.model_selection import train_test_split

import nodeWrapper

def saveForest(forest):
  with open('models/rf.pck', 'wb') as fp:
    pickle.dump(forest,fp)

def trainForest(train_data, train_targets):
  rf = RandomForestClassifier(n_estimators=50,random_state=randint(0, 1000))
  trained_rf = rf.fit(train_data, train_targets)
  return trained_rf

def evaluateForest(rf, valid_data, valid_targets):
  predictions = rf.predict(valid_data)
  return accuracy_score(valid_targets, predictions)

def convert_to_np(data_uri):
  header, encoded = data_uri.split(",", 1)
  extension = header.split(";", 1)[0]
  extension = extension.split("/", 1)[1]
  path = "tmp/img." + extension
  data = b64decode(encoded)
  with open(path, "wb") as f:
    f.write(data)
  img = cv2.imread(path) / float(255)
  return img.reshape(img.size) # flatten the array

def get_training_data():
  data = nodeWrapper.read_input()
  # Get data formatted correctly
  open_images = [convert_to_np(img) for img in data['open']]
  closed_images = [convert_to_np(img) for img in data['closed']]
  # Generate labels
  open_targets = np.zeros([len(open_images)])
  closed_targets = np.ones([len(closed_images)])
  # Combine datasets
  images = np.array(open_images + closed_images)
  targets = np.concatenate((open_targets, closed_targets), axis=None)
  # Split into train and validation sets
  return train_test_split(images, targets, random_state=randint(0, 1000))

def main():
  trainX, validX, trainY, validY = get_training_data()
  forest = trainForest(trainX, trainY)
  saveForest(forest)

  nodeWrapper.send_output_as_json({
    "accuracy": evaluateForest(forest, validX, validY)
  })

if __name__ == '__main__':
  main()