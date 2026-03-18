// wrapper function
// req és res mindig átmegy ezen

//higher order fn --> async fn-t kap parameternek
//express middleware-t ad vissza
//Promise = pending/rejected/fulfilled
//ha Promise.resolve = ok --> atadja a fn-nek
//ha hiba van --> catch-el kapjuk el, nextnek tovabbadjuk
//next = hibakezelesre is nagyon jo
//catch-nek error a next-ben megy at
//next = middleware --> chain-elni logikakat

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
