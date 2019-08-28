```
 ______   ___   _  ___  ____  _____ 
|  _ \ \ / / \ | |/ _ \|  _ \| ____|
| |_) \ V /|  \| | | | | | | |  _|  
|  __/ | | | |\  | |_| | |_| | |___ 
|_|    |_| |_| \_|\___/|____/|_____|
```
##### Looking at how python and node can play together

# Installation

1. Clone this repo
2. Install Node, Python, and yarn
3. Run `yarn` in this project directory
4. Run `yarn start`
5. In a browser, type in `localhost:3333/1/+/2`, and ensure the browser spits out `3`

# Introduction

This is a first look into how python and node can work together to create
an amazing developer and user experience.

Node has traditionally been used for web applications, and it excells in this domain.
It's single thread, non-blocking, event-driven design makes for incredibly fast
and responsive websites. Add to that front-end frameworks also in javascript,
and you have a developer's dream - One language, front and back end support.

Python on the other hand excells in the domain of data science. From machine learning
to statistical analysis, python's libraries have established themselves as the standard 
in the industry.

This brings us to the question of whether we can have both?

The answer is yes.

Read on or checkout this repo to see how it works.

# Node

The magic for this lies in a library standard in Node - `spawn` from `'child-process'`
This library allows us to generate a new process to prevent long executing code
from holding our Node app from choking up.

Checkout `/utilities/pythonWrapper.js` to see how I implemented this.

The key parts to this are as follows:

1. Create a new Python Process

```js
const { spawn } = require('child_process')
const python = spawn('python', ['my/path/to.py'])
```

2. Add a listeners to `stdout` and `stderr` events

```js
  let output
  python.stdout.on('data', (data) => {
    // Data is a buffer
    output = data.toString()
  })
  python.stderr.on('data', (data) => {
    // Again, data is a buffer.
    // This is where we catch python errors
  })
  python.stdout.on('end', () => {
    // Do whatever with all of the data you've
    // collected
  })
```

3. Feed the python process input. MUST BE A STRING!
```js
  python.stdin.write(myDataToSendAsJson)
  python.stdin.end() // Mark the input as complete
```

# Python 

The magic for this is in a standard python library `sys`.

Checkout `/python/nodeWrapper.py` to see how I implemented it.

The key parts of this are as follows:
1. Read and parse input
```py
import sys, json

def read_input():
  lines = sys.stdin.readlines()
  return json.loads(lines[0])
```
2. Send output
```py
def send_output_as_json(obj):
  print json.dumps(obj)
  return
```

# Next Steps

This is the first version of this repo.
Version 2 (coming soon), will take this first
look and extend it to start using machine learning methods.
