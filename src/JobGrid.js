import Grid from "@material-ui/core/Grid/Grid";
import JobCard from "./JobCard";
import React from "react";
import './JobGrid.css';

export default function JobGrid(props) {
  return (
      <Grid container spacing={16} className="job-grid">
        {props.branches.map(branch => {
          return (
              <Grid item xs={4} key={branch.name}>
                <JobCard branch={branch} client={props.client} owner={props.owner} repo={props.repo}/>
              </Grid>
          )
        })}
      </Grid>
  )
}