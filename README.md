# secure-react-app
This is a group project for the Secure Programming course at Tampere Universities. The idea is to create a simple React application that follows OWASP guidelines in frontend and CI/CD.

## Contributing

Free versions of GitHub repositories do not allow protecting branches, so it is important to pay attention NOT to push straight into main or development branches.

Basic Git flow for the project when developer starts a new feature:

- Checkout development branch and pull latest commits

  `git checkout development`

  `git pull`

- Make a new branch from development branch (All feature branches should start with a "feature/" prefix)

  `git checkout -b feature/*`

- When feature is done push your code into remote  
   `git push -u origin [name of your local branch]`

  and open a new pull request from GitHub into development branch and ask someone to review it

- When someone has accepted the pull request developer can merge it into development branch
- When releases are made development branches are merged into main with pull requests
