# Documentation for coding challenge

## Task 1 - Identify and fix the issue with getCatsInfo API

- Fix: The problem was that that the `getCatsInfo` worker was trying to call invokeTokenService with data.value.key as the argument, but data.key was the correct argument. This was causing the worker to hang after a few requests. Also, added a bunch of console logs and error handling to `generateNewWorker.js` to allow for a better debugging experience.

2. File changed:
    - `src/workers/getCatsInfo.js`
    - `src/utils/generateNewWorker.js`

## Task 2 - Add correlationId header to all the requests and response
- Fix Added middleware to add correlationId to all requests and responses.
- File changed:
    - `src/middleware/correlationId.js`
    - `src/index.js`

## Task 3 - Terminate the idle worker and recreate when needed
- Fix: Added a timeout to terminate the worker after 5 minutes of inactivity.
- File changed:
    - `src/workers/index.js`
    - `src/index.js`