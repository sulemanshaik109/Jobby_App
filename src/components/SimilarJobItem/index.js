import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobItem = props => {
  const {similarJobDetails} = props
  const {
    title,
    companyLogoUrl,
    employmentType,
    rating,
    jobDescription,
    location,
  } = similarJobDetails

  return (
    <li className="similar-job-item">
      <div className="job-details-logo-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="sub-heading">Description</h1>
      <p className="job-details-description">{jobDescription}</p>
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
    </li>
  )
}

export default SimilarJobItem
