import React, { useState } from "react";
import { Radio, RadioGroup, FormControlLabel, Tabs, Tab } from "@mui/material";

const Leaderboard = () => {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState("global");
  const [selectedNestedLeaderboard, setSelectedNestedLeaderboard] =
    useState("nested1");

  const handleChange = (event, newValue) => {
    setSelectedLeaderboard(newValue);
  };

  const handleNestedChange = (event) => {
    setSelectedNestedLeaderboard(event.target.value);
  };

  return (
    <div
      style={{ backgroundColor: "#212121", color: "white", padding: "20px" }}
    >
      <Tabs value={selectedLeaderboard} onChange={handleChange}>
        <Tab
          sx={{ color: "white" }}
          label="Global Leaderboard"
          value="global"
        />
        <Tab
          sx={{ color: "white" }}
          label="Category Specific"
          value="category"
        />
        <Tab
          sx={{ color: "white" }}
          label="Leaderboards by Time Frame"
          value="timeframe"
        />
        <Tab
          sx={{ color: "white" }}
          label="Top Performing"
          value="topperforming"
        />
      </Tabs>

      {selectedLeaderboard === "global" && (
        <div>
          <RadioGroup
            value={selectedNestedLeaderboard}
            onChange={handleNestedChange}
            row
          >
            <FormControlLabel
              value="nested1"
              control={<Radio />}
              label="Players"
            />
            <FormControlLabel
              value="nested2"
              control={<Radio />}
              label="Teams"
            />
          </RadioGroup>

          {selectedNestedLeaderboard === "nested1" && (
            <iframe
              title="LookerEmbed"
              src="https://lookerstudio.google.com/embed/reporting/f9b0b2a5-04d2-4c75-8bc5-d3e0b108db08/page/02TYD"
              width="100%"
              height="800px"
            ></iframe>
          )}

          {selectedNestedLeaderboard === "nested2" && (
            <iframe
              title="LookerEmbed"
              src="https://lookerstudio.google.com/embed/reporting/e5fc80c7-ea1b-48c6-b486-6d4504f0a6ba/page/V2TYD"
              width="100%"
              height="800px"
            ></iframe>
          )}
        </div>
      )}

      {selectedLeaderboard === "category" && (
        <div>
          <RadioGroup
            value={selectedNestedLeaderboard}
            onChange={handleNestedChange}
            row
          >
            <FormControlLabel
              value="nested1"
              control={<Radio />}
              label="Leaderboard"
            />
            {/* <FormControlLabel value="nested2" control={<Radio />} label="Nested 2" /> */}
          </RadioGroup>

          {selectedNestedLeaderboard === "nested1" && (
            <iframe
              title="LookerEmbed"
              src="https://lookerstudio.google.com/embed/reporting/7ef4041f-daf3-4c53-b8a4-d7413f7ed552/page/ZbVYD"
              width="100%"
              height="800px"
            ></iframe>
          )}

          {/* {selectedNestedLeaderboard === "nested2" && (
            <iframe
              title="LookerEmbed"
              src="https://example.com/nested2-leaderboard"
              width="100%"
              height="800px"
            ></iframe>
          )} */}
        </div>
      )}

      {selectedLeaderboard === "timeframe" && (
        <div>
          <RadioGroup
            value={selectedNestedLeaderboard}
            onChange={handleNestedChange}
            row
          >
            <FormControlLabel
              value="nested1"
              control={<Radio />}
              label="Monthly"
            />
            <FormControlLabel
              value="nested2"
              control={<Radio />}
              label="Weekly"
            />
            <FormControlLabel
              value="nested3"
              control={<Radio />}
              label="All Time"
            />
            <FormControlLabel
              value="nested4"
              control={<Radio />}
              label="Daily"
            />
          </RadioGroup>

          {selectedNestedLeaderboard === "nested1" && (
            <iframe
              title="LookerEmbed"
              src="https://lookerstudio.google.com/embed/reporting/b19df468-2bad-4a20-873e-fffadc337b8e/page/KnTYD"
              width="100%"
              height="800px"
            ></iframe>
          )}

          {selectedNestedLeaderboard === "nested2" && (
            <iframe
              title="LookerEmbed"
              src="https://lookerstudio.google.com/embed/reporting/e874d68a-4def-4b58-832d-69e32e778815/page/wqTYD"
              width="100%"
              height="800px"
            ></iframe>
          )}
          {selectedNestedLeaderboard === "nested3" && (
            <iframe
              title="LookerEmbed"
              src="https://lookerstudio.google.com/embed/reporting/f5e4c0ed-766e-4311-9609-4dd586ea003c/page/9yQYD"
              width="100%"
              height="800px"
            ></iframe>
          )}
          {selectedNestedLeaderboard === "nested4" && (
            <iframe
              title="LookerEmbed"
              src="https://lookerstudio.google.com/embed/reporting/4bb58c8c-7ba1-426f-afe6-37f8d07d674d/page/VuTYD"
              width="100%"
              height="800px"
            ></iframe>
          )}
        </div>
      )}

      {selectedLeaderboard === "topperforming" && (
        <div>
          <RadioGroup
            value={selectedNestedLeaderboard}
            onChange={handleNestedChange}
            row
          >
            <FormControlLabel
              value="nested1"
              control={<Radio />}
              label="Players"
            />
            <FormControlLabel
              value="nested2"
              control={<Radio />}
              label="Teams"
            />
          </RadioGroup>

          {selectedNestedLeaderboard === "nested1" && (
            <iframe
              title="LookerEmbed"
              src="https://lookerstudio.google.com/embed/reporting/7b59bf7f-a494-42c0-a693-9ec5c3ffc815/page/zvTYD"
              width="100%"
              height="800px"
            ></iframe>
          )}

          {selectedNestedLeaderboard === "nested2" && (
            <iframe
              title="LookerEmbed"
              src="https://lookerstudio.google.com/embed/reporting/bf918873-23e7-4be9-80bd-d092068f4436/page/MxTYD"
              width="100%"
              height="800px"
            ></iframe>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
