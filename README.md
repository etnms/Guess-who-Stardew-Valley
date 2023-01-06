# Guess who - Stardew Valley

## Description
The "Guess who - Stardew valley" app is a web app that allows you to play guess who with Stardew valley characters between friends.
This small project started after seeing a real-life "Guess who" with stardew valley characters made by a fan. It inspired me to create this small web app.

## Functionalities
- User sign up and login.
- Games id are stored in a psql database and last for a period of one hour.
- Socket.io to play games and see the direct interaction of the other players.

## Limitation
While you can have complete games of guess who with the webapp there's no predefined questions or possibilities to write down questions to play. Playing with someone would mean directly talking to them to have guesses. 

## Languages used and frameworks
- Typescript (using React)
- CSS 
- NodeJS (backend)
- PSQL (db)

### Future improvements
- Implementing a restart button to avoid creating a new game lobby for each new game
- Fixing some socket issues / improving socket mechanics