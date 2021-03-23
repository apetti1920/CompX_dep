const fs = require('fs');

process.on("message", (message: any) => {
    process.send(GetThemeFilesChildProcess(message.themesDir));
    process.exit()
});

function GetThemeFilesChildProcess(themesDir: string): string[] {
    const themes: string[] = [];
    fs.readdirSync(themesDir).forEach((file: string) => {
        if (file.split(".").pop() === "json") {
            themes.push(file.split(".")[0]);
        }
    });
    return themes;
}
