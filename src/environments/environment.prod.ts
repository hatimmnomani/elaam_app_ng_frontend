export const environment = {
  production: true,
  loginFlag: 'onelogin',
  serverUrl: 'https://prod-backend.aelaam53.com',
  redirectionURL: 'https://www.its52.com/Login.aspx?OneLogin=ELAAM',
  // Deprecated: the standalone quiz backend. Quiz access now comes from the NTMS API
  // at serverUrl (/api/quiz/**); nothing reads quizApiUrl anymore.
  quizApiUrl: "https://quiz-backend.elam53.com",
  quizFrontendUrl: "https://quiz.aelaam53.com"
};
