# Local OpenAI API setup

This build adds a hidden-input Windows setup launcher and server-side environment loading. The chat uses the server-side key to connect one AI coach when configured.

1. Revoke the key pasted into chat at https://platform.openai.com/api-keys and create a replacement. Do not paste the replacement into chat.
2. Extract the complete Career-Compass-API-Setup.zip into a new folder. Open its career-compass folder.
3. Double-click Setup-API-Key.cmd. Paste the replacement into the hidden terminal prompt and press Enter. The setup stores it in .env beside serve.mjs. This is a local plaintext configuration file, excluded by .gitignore and outside the served dist directory. Do not share it or include it in manually created archives.
4. Read the authentication result. A successful /v1/models check confirms access to that endpoint only. A restricted key may deny listing models even if it has other permissions. This check does not validate generation permissions, available credits or a particular model.
5. Close the old app server and run Start-Career-Compass.cmd from this new folder.

An existing OPENAI_API_KEY environment variable takes precedence over .env. Remove or replace an outdated environment value if setup appears to use an old key. To retry the saved configuration, run check-api-key.mjs using Node. No resume or student content is sent by the authentication check.

Restarting the server loads the key and enables AI mode. Actual generation still depends on model access, available quota and a working connection. Online hosting is pending.

The setup launcher runs the included PowerShell script with a process-local execution policy setting; it does not change your machine's saved execution policy. Inspect the script before running it if desired.
