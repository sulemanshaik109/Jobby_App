import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {RiShareBoxLine} from 'react-icons/ri'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const lifeAtCompany = {
        description: fetchedData.job_details.life_at_company.description,
        imageUrl: fetchedData.job_details.life_at_company.image_url,
      }
      const updatedskills = fetchedData.job_details.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))
      const updatedData = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        id: fetchedData.job_details.id,
        jobDescription: fetchedData.job_details.job_description,
        lifeAtCompany,
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
        skills: updatedskills,
        title: fetchedData.job_details.title,
      }
      const formattedSimilarJobs = fetchedData.similar_jobs.map(
        eachSimilarJob => this.getFormattedData(eachSimilarJob),
      )
      this.setState({
        jobDetails: updatedData,
        similarJobs: formattedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getJobDetails()
  }

  renderJobDetailsView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetails

    return (
      <>
        <div className="job-details-container">
          <div className="job-details-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-details-company-logo"
            />
            <div>
              <h1 className="job-details-title">{title}</h1>
              <div className="job-details-rating-container">
                <AiFillStar className="job-details-star-icon" />
                <p className="job-details-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-additional-details">
            <div className="job-details-location-and-employment-type">
              <div className="job-details-location-container">
                <MdLocationOn className="job-details-location-icon" />
                <p className="job-details-location">{location}</p>
              </div>
              <div className="job-details-location-container">
                <BsFillBriefcaseFill className="job-details-employment-icon" />
                <p className="job-details-location">{employmentType}</p>
              </div>
            </div>
            <p className="job-details-package">{packagePerAnnum}</p>
          </div>
          <hr className="job-details-separator" />
          <div className="description-header">
            <h1 className="sub-heading">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              Visit <RiShareBoxLine className="share-icon" />
            </a>
          </div>
          <p className="job-details-description">{jobDescription}</p>
          <h1 className="sub-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map(skill => (
              <li className="skill-item" key={skill.name}>
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="skill-img"
                />
                <p className="skill-name">{skill.name}</p>
              </li>
            ))}
          </ul>
          <div className="life-at-company-container">
            <div className="lac-content">
              <h1 className="sub-heading">Life at Company</h1>
              <p className="job-details-description">
                {lifeAtCompany.description}
              </p>
            </div>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(eachSimilarJob => (
            <SimilarJobItem
              key={eachSimilarJob.id}
              similarJobDetails={eachSimilarJob}
            />
          ))}
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

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-section">{this.renderJobItemDetails()}</div>
      </>
    )
  }
}

export default JobItemDetails
