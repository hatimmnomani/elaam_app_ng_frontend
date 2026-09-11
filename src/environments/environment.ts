// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  loginFlag: 'simple',
  // serverUrl: 'https://qa-elaam-backend.demoapplication.net',
  // serverUrl: 'https://elaamapi.digitaltakeoff.in',
  serverUrl: 'https://prod-backend.aelaam53.com',
  redirectionURL: "https://www.its52.com/Login.aspx?OneLogin=ELAAM",
  // Deprecated: the standalone quiz backend. Quiz access now comes from the NTMS API
  // at serverUrl (/api/quiz/**); nothing reads quizApiUrl anymore.
  quizApiUrl: "https://qa-elaam.demoapplication.net/quiz-backend",
  quizFrontendUrl: "https://quiz.aelaam53.com"
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
