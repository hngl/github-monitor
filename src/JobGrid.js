import Grid from "@material-ui/core/Grid/Grid";
import JobCard from "./JobCard";
import React, {Component} from "react";
import './JobGrid.css';

export default class JobGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {
      branches: []
    };
  }

  componentDidMount() {
    this.fetchBranches();
  }

  fetchBranches = () => {
    console.debug('Fetching branches');
    this.props.client.repos.getBranches({
      owner: this.props.owner,
      repo: this.props.repo
    }).then(({data}) => {
      console.debug('Fetched branches', data);
      this.setState({branches: data});
    }).catch(resp => {console.error('Failed to fetch branches', resp)})
  };

  render() {
    return (
        <Grid container spacing={16} className="job-grid">
          {this.state.branches.map(branch => {
            return (
                <Grid item xs={4} key={branch.name}>
                  <JobCard branch={branch} client={this.props.client} owner={this.props.owner} repo={this.props.repo}/>
                </Grid>
            )
          })}
        </Grid>
    )
  }
}