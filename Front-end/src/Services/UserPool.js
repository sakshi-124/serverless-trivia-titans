import { CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_1Xcd4lxHQ',
    ClientId: "6hn9vmanqlt905sa1n0skc8ql6"
};

const cognitoUserPool = new CognitoUserPool(poolData);
let currentSession = null;

export const getUserPool = () => {
    return cognitoUserPool;
}

export const createSession = async (accessToken, idToken) => {
    const AccessToken = await new CognitoAccessToken({
        AccessToken: accessToken,
    });
    const IdToken = await new CognitoIdToken({ IdToken: idToken });

    const RefreshToken = await new CognitoRefreshToken({
        RefreshToken: idToken,
    });

    const sessionData = {
        IdToken,
        AccessToken,
        RefreshToken,
    };

    const userSession = await new CognitoUserSession(sessionData);
    const payload = userSession.getIdToken().decodePayload();

    const userData = {
        Username: payload['cognito:username'], // get this from token/another method
        Pool: cognitoUserPool,
    };

    const cognitoUser = new CognitoUser(userData);
    await cognitoUser.setSignInUserSession(userSession);

    await cognitoUser.getSession((err, session) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(session);
            currentSession = session;
        }
    });
}

export const getCurrentSession = () => {
    return currentSession;
}

export const logout = () => {
    const cognitoUser = cognitoUserPool.getCurrentUser();
    if (cognitoUser) {
        cognitoUser.signOut();
        return true;
    } else {
        return false;
    }
}

export const updateUserAttributes = async (name, picture) => {
    const cognitoUser = await getUserPool().getCurrentUser();
    if (!cognitoUser) {
        await refreshToken();
    }
    if (cognitoUser) {
        await cognitoUser.getSession(async (err, session) => {
            if (err) {
                console.error('Error getting user session:', err);
                // Handle error
            } else {

                const attributeList = [];

                if (name) {
                    const attribute = {
                        Name: 'name',
                        Value: name
                    };
                    attributeList.push(new CognitoUserAttribute(attribute));
                }

                if (picture) {
                    const attribute = {
                        Name: 'picture',
                        Value: picture
                    };
                    attributeList.push(new CognitoUserAttribute(attribute));
                }

                if (attributeList.length === 0) {
                    console.log('No attributes to update.');
                    return;
                }
                await cognitoUser.updateAttributes(attributeList, (err, result) => {
                    if (err) {
                        console.error('Error updating user attributes:', err);
                        // Handle error
                    } else {
                        console.log('User attributes updated successfully:', result);
                        if (name)
                            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), name: name }));
                        if (picture)
                            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), picture: picture }));
                        // Perform further actions after successful attribute update
                    }
                });
            }
        });
    } else {
        console.error('No valid user session found.');
        return;
    }
}

export const refreshToken = async () => {
    const idToken = localStorage.getItem('idToken');
    const token = localStorage.getItem('token');
    const userData = {
        Username: JSON.parse(localStorage.getItem('user')).email,
        Pool: cognitoUserPool
    };
    const cognitoUser = await new CognitoUser(userData);
    const AccessToken = await new CognitoAccessToken({
        AccessToken: token,
    });
    const IdToken = await new CognitoIdToken({ IdToken: idToken });

    const RefreshToken = await new CognitoRefreshToken({
        RefreshToken: idToken,
    });

    const sessionData = {
        IdToken,
        AccessToken,
        RefreshToken,
    };

    const session = new CognitoUserSession(sessionData);

    cognitoUser.refreshSession(session.getRefreshToken(), (err, session) => {
        if (err) {
            console.error('Error refreshing session:', err);
            localStorage.clear();
            // Handle error
        } else {
            console.log('New session:', session);
            // Perform further actions with the refreshed session
        }
    });
};
