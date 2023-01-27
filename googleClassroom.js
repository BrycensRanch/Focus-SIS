const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly',    'https://www.googleapis.com/auth/classroom.coursework.me',
'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
'https://www.googleapis.com/auth/classroom.coursework.students',
'https://www.googleapis.com/auth/classroom.coursework.students.readonly',];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function doWork(auth) {
  const classroom = google.classroom({version: 'v1', auth});
  const res = await classroom.courses.list({
    courseStates: ["ACTIVE"],
    pageSize: 0,
  });

  const courses = res.data.courses;
  if (!courses || courses.length === 0) {
    console.log('No courses found.');
    return;
  }
  for (const course of courses) { 
    // Do the magic
    const assignmentRes = await classroom.courses.courseWork.list({
        // Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
        courseId: course.id,
        // Optional sort ordering for results. A comma-separated list of fields with an optional sort direction keyword. Supported fields are `updateTime` and `dueDate`. Supported direction keywords are `asc` and `desc`. If not specified, `updateTime desc` is the default behavior. Examples: `dueDate asc,updateTime desc`, `updateTime,dueDate desc`
        orderBy: 'updateTime',
        // Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.
        pageSize: 0,
    }); 
  const assignments = assignmentRes.data.courseWork?.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.updateTime) - new Date(b.updateTime);
  })
  if (!assignments || assignments.length === 0) {
    console.log('No assignments found.');
    continue;
  }
  course.assignments = assignments
} 
  console.log('Courses:');
  courses.forEach((course) => {
    console.log(`${course.name} (${course.id}) has ${course.assignments?.length} assignments`);
  });
  await fs.writeFile('./googleClassroomCourses.json', JSON.stringify(courses, null, 2));
  return courses;
}

authorize().then(doWork).catch(console.error);