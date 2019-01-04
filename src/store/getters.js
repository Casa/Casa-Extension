export const isLoggedIn = state => !!state.settings.token;
export const hasCompletedIntro = state => !!state.settings.intro;
export const authStatus = state => state.settings.status;
