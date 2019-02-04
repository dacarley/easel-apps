const _ = require("lodash");
const fs = require("fs");
const inquirer = require("inquirer");
const request = require("request-promise-native");
const appFinder = require("./appFinder");

const editPropsInstructions = app => `
    "editProps.cache.txt" is missing for this app.
    Visit http://easel.inventables.com/apps/${app.meta.appNumber}}/edit, open Chrome's "inspector" tool, and clear the Network tab.
    Then, "save" your app.  The first entry in the Network tab will be POST to your app's number.
    Copy the Request Headers and Form Data sections from that request into a file named "editProps.cache.txt" in the app's folder.
`;

const failedToUpdateMessage = response => `
    Failed to update the app's source.
    You may need to refresh the 'editProps.cache.txt' for this app.

    response.statusCode = ${response.statusCode}
    response.body = ${response.body}
`;

execute();

async function execute() {
    try {
        const apps = appFinder.getApps();

        const choices = _.map(apps, (app) => {
            return {
                name: app.name,
                value: app
            };
        });

        const { app } = await inquirer.prompt([
            {
                name: "app",
                type: "list",
                message: "Which app do you want to deploy?",
                choices
            }
        ]);

        if (_.isEmpty(app.editProps)) {
            throw new Error(editPropsInstructions(app));
        }

        const url = `http://easel.inventables.com/apps/${app.meta.appNumber}`;
        const jar = request.jar();
        const cookie = request.cookie(getCookie(app));
        jar.setCookie(cookie, url);

        const params = {
            url,
            jar,
            simple: false,
            resolveWithFullResponse: true,
            followRedirect: false,
            formData: {
                utf8: "✓",
                _method: "patch",
                authenticity_token: app.editProps.authenticity_token,
                "app[name]": app.meta.name,
                "app[description]": app.meta.description,
                "app[executor]": fs
                    .readFileSync(app.bundleFilePath)
                    .toString()
            }
        };

        const response = await request.post(params);

        if (response.statusCode !== 302) {
            throw new Error(failedToUpdateMessage(response));
        }

        console.log("Deployed successfully");
    } catch (err) {
        console.log(err.stack);
    }
}

function getCookie(app) {
    const cookiesText = app.editProps.Cookie;

    const cookies = cookiesText.split("; ");

    const cookiesByName = _(cookies)
        .keyBy(cookie => cookie.split("=", 1)[0])
        .value();

    return cookiesByName._easel_session;
}
