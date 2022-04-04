import './App.css';
import React, { useState, useEffect } from 'react';
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import axios from 'axios';

function sortGames(games) {
    return games.sort((game1, game2) => game1.date > game2.date ? -1 : 1);
}

function App() {
  const [didWin, setDidWin] = useState("checking");
  const [gameDate, setGameDate] = useState("");

  useEffect(() => {
      const dateOffset = (24*60*60*1000) * 7;
      const today = new Date();
      const oneWeekPast = new Date();
      oneWeekPast.setTime(today.getTime() - dateOffset);

      const start_date = oneWeekPast.toISOString().split("T")[0];
      const end_date = today.toISOString().split("T")[0];

      const apiEndpoint = `https://www.balldontlie.io/api/v1/games?start_date=${start_date}&end_date=${end_date}&team_ids[]=10`;

      console.info("Endpoint: ", apiEndpoint);

      axios.get(apiEndpoint)
          .then(res => {
              const games = sortGames(res.data.data);
              const latestGame = games[0];
              console.info("Latest game: ", latestGame);
              let didWin = false;
              if (latestGame.home_team.id === 10) {
                  didWin = latestGame.home_team_score > latestGame.visitor_team_score;
              } else {
                  didWin = latestGame.home_team_score < latestGame.visitor_team_score;
              }
              setDidWin(didWin ? "yes" : "no");
              setGameDate(latestGame.date.split("T")[0]);
          });
  }, [])
  return (
    <div className="App">
      <EmptyState>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg" id="title">
          Did the Warriors win?
        </Title>
        <EmptyStateBody>
            <div className="win-result">
                {
                    didWin === "checking" ? "Hang on, checking..." : (didWin === "yes" ? "Yes, they did!" : "No, they did not. :(")
                }
            </div>
            <div className="game-date">
                {
                    gameDate !== "" ? `(Game played on ${gameDate})` : ""
                }
            </div>
        </EmptyStateBody>
      </EmptyState>
    </div>
  );
}

export default App;
