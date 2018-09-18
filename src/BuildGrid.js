import Grid from "@material-ui/core/Grid/Grid";
import BranchCard from "./BranchCard";
import React from "react";

export default function BuildGrid(props) {
  return (
      <Grid container spacing={16}>
        {props.branches.map(branch => {
          return (
              <Grid item xs={4} key={branch.name}>
                <BranchCard branch={branch} client={props.client} owner={props.owner} repo={props.repo}/>
              </Grid>
          )
        })}
      </Grid>
  )
}