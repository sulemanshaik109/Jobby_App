import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'
import Profile from '../Profile'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locations = [
  {
    locationId: 'HYDERABAD',
    location: 'Hyderabad',
  },
  {
    locationId: 'BANGALORE',
    location: 'Bangalore',
  },
  {
    locationId: 'CHENNAI',
    location: 'Chennai',
  },
  {
    locationId: 'DELHI',
    location: 'Delhi',
  },
  {
    locationId: 'MUMBAI',
    location: 'Mumbai',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    activeSalaryRangeId: '',
    selectedEmploymentTypes: [],
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    selectedLocations: [],
  }

  componentDidMount() {
    this.getJobsList()
  }

  getJobsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {
      selectedEmploymentTypes,
      searchInput,
      activeSalaryRangeId,
    } = this.state
    let employmentType = ''
    if (selectedEmploymentTypes.length > 0) {
      employmentType = selectedEmploymentTypes.join(',')
    }
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickSearchIcon = () => {
    this.getJobsList()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  changeEmploymentType = activeEmploymentTypeId => {
    const {selectedEmploymentTypes} = this.state
    if (selectedEmploymentTypes.includes(activeEmploymentTypeId)) {
      const updatedList = selectedEmploymentTypes.filter(
        each => each !== activeEmploymentTypeId,
      )
      this.setState({selectedEmploymentTypes: updatedList}, this.getJobsList)
    } else {
      this.setState(
        prevState => ({
          selectedEmploymentTypes: [
            ...prevState.selectedEmploymentTypes,
            activeEmploymentTypeId,
          ],
        }),
        this.getJobsList,
      )
    }
  }

  changeSalaryRange = activeSalaryRangeId => {
    this.setState({activeSalaryRangeId}, this.getJobsList)
  }

  changeLocation = activeLocation => {
    const {selectedLocations} = this.state
    if (selectedLocations.includes(activeLocation)) {
      const updatedList = selectedLocations.filter(
        each => each !== activeLocation,
      )
      this.setState({selectedLocations: updatedList})
    } else {
      this.setState(prevState => ({
        selectedLocations: [...prevState.selectedLocations, activeLocation],
      }))
    }
  }

  onRetry = () => {
    this.getJobsList()
  }

  renderJobsListView = () => {
    const {jobsList, searchInput, selectedLocations} = this.state
    const updatedJobsList = jobsList.filter(each =>
      each.location.includes(selectedLocations),
    )
    const shouldShowJobsList = updatedJobsList.length > 0

    return (
      <>
        <ul className="jobs-list">
          <div className="search-desktop-input-container">
            <input
              value={searchInput}
              type="search"
              className="search-input"
              placeholder="Search"
              onChange={this.onChangeSearchInput}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-btn"
              onClick={this.onClickSearchIcon}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          {shouldShowJobsList ? (
            <>
              {updatedJobsList.map(jobDetails => (
                <JobCard key={jobDetails.id} jobDetails={jobDetails} />
              ))}
            </>
          ) : (
            <div className="no-jobs-view">
              <img
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                className="no-jobs-img"
                alt="no jobs"
              />
              <h1 className="no-jobs-heading">No Jobs Found</h1>
              <p className="no-jobs-description">
                We could not find any jobs. Try other filters.
              </p>
            </div>
          )}
        </ul>
      </>
    )
  }

  renderFailureView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-msg">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-retry-btn"
        type="button"
        onClick={this.onRetry}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsList = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-section">
          <div className="profile-and-filters-section">
            <div className="search-input-container">
              <input
                value={searchInput}
                type="search"
                className="search-input"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onClickSearchIcon}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <Profile />
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeEmploymentType={this.changeEmploymentType}
              changeSalaryRange={this.changeSalaryRange}
              locations={locations}
              changeLocation={this.changeLocation}
            />
          </div>
          {this.renderJobsList()}
        </div>
      </>
    )
  }
}

export default Jobs
