import cv2
from base64 import b64decode


def convert_to_np(data_uri):
  header, encoded = data_uri.split(",", 1)
  # get the extension
  extension = header.split(";", 1)[0]
  extension = extension.split("/", 1)[1]
  # write to a temporary file
  path = "tmp/img." + extension
  data = b64decode(encoded)
  with open(path, "wb") as f:
    f.write(data)
  # read in the file through cv2
  img = cv2.imread(path) / float(255)
  # flatten the array for the random forest
  return img.reshape(img.size) 

def convert_all_to_np(data_uris):
  return [convert_to_np(uri) for uri in data_uris]