import Grid from "@material-ui/core/Grid/Grid";
import JobCard from "./JobCard";
import React, {Component} from "react";
import './JobGrid.css';
import shortSha from './shortSha'

export default class JobGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {
      branches: [],
      commits: new Map(),
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
      data.forEach(branch => {
        if(!this.state.commits.has(branch.commit.sha)) {
          this.fetchCommit(branch.commit.sha);
        }
      })
    }).catch(resp => {console.error('Failed to fetch branches', resp)})
  };

  fetchCommit(sha) {
    console.debug(`Fetching commit ${shortSha(sha)}`);
    this.props.client.repos.getCommit({
      owner: this.props.owner,
      repo: this.props.repo,
      sha: sha
    })
        .then(({data}) => {
          console.debug(`Fetched commit ${shortSha(sha)}`, data);
          this.setState({commits: new Map(this.state.commits).set(sha, data)});
          this.fetchStatus(sha)
        }).catch(err => console.error(err))
  }

  fetchStatus(sha) {
    this.props.client.repos.getCombinedStatusForRef({
      owner: this.props.owner,
      repo: this.props.repo,
      ref: sha
    })
        .then(({data}) => {
          console.debug(`Fetched status for ${shortSha(sha)}`, data);
          let newCommit = Object.assign({}, this.state.commits.get(sha), {state: data.state, statuses: data.statuses});
          this.setState({commits: new Map(this.state.commits).set(sha, newCommit)})
        }).catch(err => console.error(err))
  }

  render() {
    return (
        <Grid container spacing={16} className="job-grid">
          {this.state.branches.map(branch => {
            return (
                <Grid item xs={4} key={branch.name}>
                  <JobCard branch={branch} commit={this.state.commits.get(branch.commit.sha)}/>
                </Grid>
            )
          })}
        </Grid>
    )
  }
}