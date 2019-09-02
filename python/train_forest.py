from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from random import randint
import numpy as np
import pickle
from sklearn.model_selection import train_test_split

import nodeWrapper
import dataLoader

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

def get_training_data():
  data = nodeWrapper.read_input()
  # Get data formatted correctly
  open_images = dataLoader.convert_all_to_np(data['open'])
  closed_images = dataLoader.convert_all_to_np(data['closed'])
  # Generate labels
  open_targets = np.zeros([len(open_images)])
  closed_targets = np.ones([len(closed_images)])
  # Combine datasets
  images = np.array(open_images + closed_images)
  targets = np.concatenate((open_targets, closed_targets), axis=None)
  # Split into train and validation sets
  return train_test_split(images, targets, random_state=randint(0, 1000))

def main():
  # Get Training Data
  nodeWrapper.send_output_as_json({'status': 'Getting Training Data'})
  trainX, validX, trainY, validY = get_training_data()
  # Train a Forest
  nodeWrapper.send_output_as_json({'status': 'Training Forest'})
  forest = trainForest(trainX, trainY)
  # Save the Forest
  nodeWrapper.send_output_as_json({'status': 'Saving Forest'})
  saveForest(forest)
  # Send back the accuracy of the trained Forest
  nodeWrapper.send_output_as_json({
    "accuracy": evaluateForest(forest, validX, validY)
  })

if __name__ == '__main__':
  main()