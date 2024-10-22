# Ravelry Search (WIP)

A personal app that interacts with the Ravelry API to display various data in arrangements that aren't possible on the actual site.

Currently not hosted live, but if you want to try it yourself, you can do the following:

1. Visit https://www.ravelry.com/pro/developer and create a pro account/company if needed.
2. Create a new app using the "Basic Auth, personal" credentials.
3. Clone this repo to your computer.
4. Create a `.env` file in the root of the directory. Add the following (minus the brackets):

   ```
   VITE_RAVELRY_USERNAME=[the username from the Ravelry app you created]
   VITE_RAVELRY_PASSWORD=[the password from the Ravelry app you created (click "show key")]
   VITE_RAVELRY_ACCOUNT_NAME=[the username of your Ravelry account]
   ```

5. In the root of the repo, run `npm run dev` and open the localhost URL in your browser.

Note that the "Sorted Queue" page assumes my Ravelry tagging system is in use, so the crochet vs. knitting filter may be the only part of use to other accounts.
