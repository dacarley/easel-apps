import _ from "lodash";
import fs from "fs";
import inquirer from "inquirer";
import request from "request-promise-native";
import appFinder from "./appFinder";

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

        const url = `http://easel.inventables.com/apps/${app.appNumber}`;

        if (_.isEmpty(app.editProps)) {
            console.error("'editProps.cache.txt' is missing for this app.");
            console.error(`Visit ${url}/edit, open Chrome's "inspector" tool, and clear the Network tab.`);
            console.error(`Then, "save" your app.  The first entry in the Network tab will be POST to your app's number.`);
            console.error(`Copy the Request Headers and Form Data sections from that request into a file named "editProps.cache.txt" in the app's folder.`);

            return;
        }

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
                "app[executor]": fs
                    .readFileSync(app.bundleFilePath)
                    .toString()
            }
        };

        const response = await request.post(params);

        if (response.statusCode !== 302) {
            console.log("Failed to update the app's source.");
            console.log("You may need to refresh the 'editProps.cache.txt' for this app.");
            console.log(_.pick(response, ["statusCode", "body"]));
            throw new Error("Unexpected status code");
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
